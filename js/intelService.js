/**
 * CYBERPEHRA CTI CLIENT SERVICE
 * Manages evidence-first Live Threat Intelligence querying, searching, filtering, and detail research view.
 * Handles online, cached, offline, and source-unavailable states cleanly without data fabrication.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes Cache
const cacheStore = new Map();
const inFlightRequests = new Map();

let activeIntelState = {
  incidents: [],
  filteredIncidents: [],
  activeTag: 'ALL',
  searchQuery: '',
  sourceStatus: 'CACHED', // 'LIVE' | 'CACHED' | 'UNVERIFIED' | 'UNAVAILABLE'
  lastVerifiedText: 'Previously Verified (Local Store)',
  metadata: {
    totalRecords: 0,
    tier1GovtCount: 0,
    indiaRelevantCount: 0
  }
};

function getCached(key) {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cacheStore.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  cacheStore.set(key, {
    timestamp: Date.now(),
    data
  });
}

/**
 * Fetches authoritative real government dataset (NCRB 2021-2023 + UIDAI 2023).
 */
export async function getAuthoritativeGovtDataset() {
  const cacheKey = 'authoritative_govt_dataset';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/india_state_real_data.json');
    if (response.ok) {
      const data = await response.json();
      setCache(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.warn('[CyberPehra CTI] Could not fetch authoritative government dataset.');
  }

  return null;
}

/**
 * Fetches time-filtered intelligence data from serverless backend or verified local store.
 */
export async function getTimeFilteredIntel(timeframe = 'ALL', options = {}) {
  const { threatType, severity, indiaRelevance, sourceTier, search, isRefresh = false } = options;
  const cacheKey = `cti_${timeframe}_${threatType || 'ALL'}_${severity || 'ALL'}_${indiaRelevance || 'ALL'}_${search || ''}`;

  if (!isRefresh) {
    const cached = getCached(cacheKey);
    if (cached) {
      activeIntelState.incidents = cached.incidents || [];
      activeIntelState.metadata = cached.metadata || {};
      activeIntelState.sourceStatus = cached.isLiveFetch ? 'LIVE' : 'CACHED';
      activeIntelState.lastVerifiedText = cached.freshness ? cached.freshness.statusText : 'Previously Verified (Cached)';
      applyClientFilters();
      return cached;
    }
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    const query = new URLSearchParams({ timeframe });
    if (threatType && threatType !== 'ALL') query.append('threatType', threatType);
    if (severity && severity !== 'ALL') query.append('severity', severity);
    if (indiaRelevance && indiaRelevance !== 'ALL') query.append('indiaRelevance', indiaRelevance);
    if (sourceTier) query.append('sourceTier', String(sourceTier));
    if (search) query.append('search', search);

    try {
      const response = await fetch(`/.netlify/functions/time-filtered-intel?${query.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setCache(cacheKey, result);

        activeIntelState.incidents = result.incidents || [];
        activeIntelState.metadata = result.metadata || {};
        activeIntelState.sourceStatus = result.isLiveFetch ? 'LIVE' : 'CACHED';
        activeIntelState.lastVerifiedText = result.freshness ? result.freshness.statusText : 'Previously Verified (Local Store)';
        applyClientFilters();
        return result;
      }
    } catch (err) {
      console.warn('[CyberPehra CTI] Netlify function fetch unavailable. Loading verified local backup dataset.');
    }

    // Direct fetch fallback from verified local dataset file
    try {
      const fallbackResponse = await fetch('/backend/data/verified_intel_dataset.json');
      if (fallbackResponse.ok) {
        const raw = await fallbackResponse.json();
        const records = raw.records || [];
        const fallbackResult = {
          ok: true,
          sourceStatus: 'PREVIOUSLY_VERIFIED_LOCAL_STORE',
          isLiveFetch: false,
          freshness: {
            statusText: 'Previously Verified (Local Verified File)'
          },
          metadata: {
            totalRecords: records.length,
            tier1GovtCount: records.filter(r => r.sourceTier === 1).length,
            indiaRelevantCount: records.filter(r => r.indiaRelevance === 'india_specific' || r.indiaRelevance === 'india_relevant').length
          },
          incidents: records
        };

        setCache(cacheKey, fallbackResult);
        activeIntelState.incidents = records;
        activeIntelState.metadata = fallbackResult.metadata;
        activeIntelState.sourceStatus = 'CACHED';
        activeIntelState.lastVerifiedText = 'Previously Verified (Local Dataset)';
        applyClientFilters();
        return fallbackResult;
      }
    } catch (e) {
      console.warn('[CyberPehra CTI] Local dataset fetch error.');
    }

    activeIntelState.incidents = [];
    activeIntelState.sourceStatus = 'UNAVAILABLE';
    activeIntelState.lastVerifiedText = 'Source Temporarily Unavailable';
    applyClientFilters();
    return { ok: false, incidents: [], sourceStatus: 'UNAVAILABLE' };
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

/**
 * Applies client-side tag filtering & search across active CTI records.
 */
export function applyClientFilters() {
  let list = [...activeIntelState.incidents];

  // 1. Tag Filtering
  const tag = activeIntelState.activeTag;
  if (tag && tag !== 'ALL') {
    if (tag === 'INDIA') {
      list = list.filter(r => r.indiaRelevance === 'india_specific' || r.indiaRelevance === 'india_relevant');
    } else if (tag === 'HIGH_SEVERITY') {
      list = list.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL');
    } else if (tag === 'GOVERNMENT') {
      list = list.filter(r => r.sourceTier === 1 || r.publisher.toLowerCase().includes('cert') || r.publisher.toLowerCase().includes('i4c') || r.publisher.toLowerCase().includes('rbi'));
    } else {
      list = list.filter(r => 
        (r.threatType && r.threatType.toLowerCase().includes(tag.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(tag.toLowerCase()))
      );
    }
  }

  // 2. Client Search Query
  const q = activeIntelState.searchQuery.toLowerCase().trim();
  if (q) {
    list = list.filter(r => {
      const titleMatch = r.title && r.title.toLowerCase().includes(q);
      const summaryMatch = r.summary && r.summary.toLowerCase().includes(q);
      const publisherMatch = r.publisher && r.publisher.toLowerCase().includes(q);
      const threatTypeMatch = r.threatType && r.threatType.toLowerCase().includes(q);
      const affectedMatch = r.affectedPlatforms && r.affectedPlatforms.some(p => p.toLowerCase().includes(q));
      const iocMatch = r.indicators && JSON.stringify(r.indicators).toLowerCase().includes(q);
      return titleMatch || summaryMatch || publisherMatch || threatTypeMatch || affectedMatch || iocMatch;
    });
  }

  activeIntelState.filteredIncidents = list;
}

export function filterIntelByTag(tag = 'ALL') {
  activeIntelState.activeTag = tag;
  applyClientFilters();
  if (typeof window.renderCyberIntelUI === 'function') {
    window.renderCyberIntelUI();
  }
}

export function searchIntelRecords(query = '') {
  activeIntelState.searchQuery = query;
  applyClientFilters();
  if (typeof window.renderCyberIntelUI === 'function') {
    window.renderCyberIntelUI();
  }
}

export function refreshIntelFeed() {
  return getTimeFilteredIntel('ALL', { isRefresh: true });
}

export function getActiveIntelState() {
  return activeIntelState;
}

/**
 * Fetches source trust directory metadata.
 */
export async function getSourceTrustDirectory() {
  const cacheKey = 'source_trust_directory';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/.netlify/functions/source-trust');
    if (response.ok) {
      const result = await response.json();
      setCache(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('[CyberPehra CTI] Source trust fetch failed.');
  }

  return {
    ok: true,
    source: 'LOCAL_REGISTRY_FALLBACK',
    sources: [
      { sourceId: 'CERT_IN', publisher: 'CERT-In', authority: 'MeitY (Govt of India)', sourceTier: 1, trustLevel: 'official', canonicalDomains: ['www.cert-in.org.in'] },
      { sourceId: 'I4C_MHA', publisher: 'I4C (MHA)', authority: 'Ministry of Home Affairs (Govt of India)', sourceTier: 1, trustLevel: 'official', canonicalDomains: ['cybercrime.gov.in'] },
      { sourceId: 'RBI', publisher: 'Reserve Bank of India', authority: 'Central Bank (Govt of India)', sourceTier: 1, trustLevel: 'official', canonicalDomains: ['www.rbi.org.in'] },
      { sourceId: 'NPCI', publisher: 'NPCI', authority: 'National Payments Corp of India', sourceTier: 1, trustLevel: 'official', canonicalDomains: ['www.npci.org.in'] },
      { sourceId: 'CISA', publisher: 'CISA', authority: 'US DHS', sourceTier: 3, trustLevel: 'international_authority', canonicalDomains: ['www.cisa.gov'] }
    ]
  };
}
