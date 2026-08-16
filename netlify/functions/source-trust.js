const { getCorsHeaders } = require('../../backend/config/security.js');
const { TRUSTED_SOURCES } = require('../../backend/ingestion/sources.js');
const { queryPublicDatabase } = require('../../backend/config/database.js');

const STATIC_TRUSTED_SOURCES_LIST = Object.values(TRUSTED_SOURCES).map(src => ({
  sourceKey: src.sourceKey,
  name: src.name,
  organizationType: src.organizationType,
  trustScore: src.trustScore,
  trustClassification: src.trustClassification,
  officialDomain: src.officialDomain,
  feedUrl: src.feedUrl,
  status: 'ACTIVE',
  lastVerifiedAt: new Date().toISOString()
}));

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

  try {
    const dbResult = await queryPublicDatabase('trusted_intel_sources', STATIC_TRUSTED_SOURCES_LIST);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        source: dbResult.source,
        totalSources: dbResult.data.length,
        sources: dbResult.data
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to load source trust directory" })
    };
  }
};
