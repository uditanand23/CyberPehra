/**
 * CYBERPEHRA TIME WINDOW AGGREGATOR
 * Handles 24H, 3D, 7D, 30D, and 90D time window filtering and incident metric aggregations.
 */

const TIMEFRAMES_MS = {
  '24H': 24 * 60 * 60 * 1000,
  '3D': 3 * 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
  '30D': 30 * 24 * 60 * 60 * 1000,
  '90D': 90 * 24 * 60 * 60 * 1000
};

/**
 * Filters an array of incident items based on a chosen timeframe ('24H' | '3D' | '7D' | '30D' | '90D').
 * @param {Array} incidents 
 * @param {string} timeframe 
 * @param {Date|number} relativeToTime 
 * @returns {Array} Filtered incidents
 */
function filterIncidentsByTimeframe(incidents = [], timeframe = '30D', relativeToTime = Date.now()) {
  if (!Array.isArray(incidents)) return [];

  const windowMs = TIMEFRAMES_MS[timeframe] || TIMEFRAMES_MS['30D'];
  const cutoffTime = new Date(relativeToTime).getTime() - windowMs;

  return incidents.filter(item => {
    const pubDate = new Date(item.publishedAt || item.published_at || item.lastVerifiedAt || item.last_verified_at).getTime();
    return !isNaN(pubDate) && pubDate >= cutoffTime;
  });
}

/**
 * Computes aggregated financial loss and incident totals per state and category.
 * @param {Array} incidents 
 * @returns {Object} State and category aggregations
 */
function aggregateIncidentMetrics(incidents = []) {
  if (!Array.isArray(incidents)) {
    return { totalIncidents: 0, totalLossCrores: 0, stateCounts: {}, categoryCounts: {} };
  }

  let totalLoss = 0;
  const stateCounts = {};
  const categoryCounts = {};

  for (const item of incidents) {
    const loss = Number(item.financial_loss_inr || item.financialLossInr || 0);
    totalLoss += loss;

    const state = item.stateCode || item.state_code || 'IN-DL';
    stateCounts[state] = (stateCounts[state] || 0) + 1;

    const cat = item.threatCategory || item.threat_category || 'GENERAL';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  return {
    totalIncidents: incidents.length,
    totalLossCrores: (totalLoss / 10000000).toFixed(2),
    stateCounts,
    categoryCounts
  };
}

module.exports = {
  TIMEFRAMES_MS,
  filterIncidentsByTimeframe,
  aggregateIncidentMetrics
};
