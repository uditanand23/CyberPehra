const path = require('path');
const fs = require('fs');
const { getCorsHeaders } = require('../../backend/config/security.js');
const { evaluateRecordVerificationStatus } = require('../../backend/ingestion/verifier.js');

let cachedIntelDataset = null;

function loadVerifiedIntelDataset() {
  if (cachedIntelDataset) return cachedIntelDataset;
  try {
    const datasetPath = path.join(__dirname, '../../backend/data/verified_intel_dataset.json');
    if (fs.existsSync(datasetPath)) {
      const raw = fs.readFileSync(datasetPath, 'utf8');
      cachedIntelDataset = JSON.parse(raw);
      return cachedIntelDataset;
    }
  } catch (err) {
    console.warn('[CyberPehra CTI API] Could not load verified_intel_dataset.json:', err.message);
  }
  return { meta: { version: '5.0' }, records: [] };
}

exports.handler = async (event) => {
  const origin = event.headers ? (event.headers.origin || event.headers.Origin) : '';
  const headers = getCorsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  const queryParams = event.queryStringParameters || {};
  const timeframe = (queryParams.timeframe || 'ALL').toUpperCase();
  const threatType = queryParams.threatType ? queryParams.threatType.trim() : null;
  const severity = queryParams.severity ? queryParams.severity.toUpperCase() : null;
  const indiaRelevance = queryParams.indiaRelevance ? queryParams.indiaRelevance.toLowerCase() : null;
  const sourceTier = queryParams.sourceTier ? Number(queryParams.sourceTier) : null;
  const search = queryParams.search ? queryParams.search.toLowerCase().trim() : null;
  const verificationStatus = queryParams.verificationStatus ? queryParams.verificationStatus.toLowerCase() : null;

  try {
    const rawDataset = loadVerifiedIntelDataset();
    let records = (rawDataset.records || []).map(rec => {
      const evalResult = evaluateRecordVerificationStatus(rec, false);
      return {
        ...rec,
        verificationStatus: evalResult.status,
        verificationReason: evalResult.reason
      };
    });

    // 1. Filter out rejected records (quality gate)
    records = records.filter(r => r.verificationStatus !== 'rejected');

    // 2. Filter by Verification Status if explicitly requested
    if (verificationStatus) {
      records = records.filter(r => r.verificationStatus === verificationStatus);
    }

    // 3. Filter by Threat Type / Category
    if (threatType && threatType !== 'ALL') {
      records = records.filter(r => 
        (r.threatType && r.threatType.toLowerCase() === threatType.toLowerCase()) ||
        (r.category && r.category.toLowerCase() === threatType.toLowerCase())
      );
    }

    // 4. Filter by Severity
    if (severity && severity !== 'ALL') {
      records = records.filter(r => r.severity === severity);
    }

    // 5. Filter by India Relevance
    if (indiaRelevance && indiaRelevance !== 'all') {
      if (indiaRelevance === 'india') {
        records = records.filter(r => r.indiaRelevance === 'india_specific' || r.indiaRelevance === 'india_relevant');
      } else {
        records = records.filter(r => r.indiaRelevance === indiaRelevance);
      }
    }

    // 6. Filter by Source Tier
    if (sourceTier && [1, 2, 3].includes(sourceTier)) {
      records = records.filter(r => Number(r.sourceTier) === sourceTier);
    }

    // 7. Client-Safe Search
    if (search) {
      records = records.filter(r => {
        const titleMatch = r.title && r.title.toLowerCase().includes(search);
        const summaryMatch = r.summary && r.summary.toLowerCase().includes(search);
        const publisherMatch = r.publisher && r.publisher.toLowerCase().includes(search);
        const threatTypeMatch = r.threatType && r.threatType.toLowerCase().includes(search);
        const affectedMatch = r.affectedPlatforms && r.affectedPlatforms.some(p => p.toLowerCase().includes(search));
        const iocMatch = r.indicators && JSON.stringify(r.indicators).toLowerCase().includes(search);
        return titleMatch || summaryMatch || publisherMatch || threatTypeMatch || affectedMatch || iocMatch;
      });
    }

    // Compute Metrics & Freshness
    const tier1Count = records.filter(r => r.sourceTier === 1).length;
    const indiaCount = records.filter(r => r.indiaRelevance === 'india_specific' || r.indiaRelevance === 'india_relevant').length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        sourceStatus: 'PREVIOUSLY_VERIFIED_LOCAL_STORE',
        isLiveFetch: false,
        cachedAt: new Date().toISOString(),
        freshness: {
          lastVerifiedAt: rawDataset.meta ? rawDataset.meta.lastVerifiedAt : new Date().toISOString(),
          statusText: 'Previously Verified (Cached Local Store)'
        },
        metadata: {
          totalRecords: records.length,
          tier1GovtCount: tier1Count,
          indiaRelevantCount: indiaCount,
          activeFilters: { timeframe, threatType, severity, indiaRelevance, sourceTier, search }
        },
        incidents: records
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to query verified threat intelligence dataset" })
    };
  }
};
