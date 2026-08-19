/**
 * CYBERPEHRA INCIDENT DEDUPLICATOR
 * Computes deterministic SHA-256 fingerprints to eliminate duplicate threat reports.
 */

const { createHash } = require('crypto');

function normalizeCanonicalUrl(urlStr = '') {
  let cleaned = String(urlStr).trim().toLowerCase();
  try {
    const u = new URL(cleaned);
    u.search = '';
    const host = u.hostname.replace(/^www\./, '');
    cleaned = `${host}${u.pathname}`;
  } catch (e) {
    cleaned = cleaned.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\?.*$/, '');
  }
  return cleaned.replace(/\/$/, '');
}

/**
 * Generates a SHA-256 fingerprint for a threat incident.
 * @param {string} canonicalUrl 
 * @param {string} title 
 * @param {string} sourceKey 
 * @returns {string} 64-character hex SHA-256 hash
 */
function generateIncidentFingerprint(canonicalUrl = '', title = '', sourceKey = '') {
  const normUrl = normalizeCanonicalUrl(canonicalUrl);
  const normTitle = String(title).trim().toLowerCase().replace(/\s+/g, ' ');
  const normSource = String(sourceKey).trim().toUpperCase();

  const payloadStr = `${normSource}:${normTitle}:${normUrl}`;
  return createHash('sha256').update(payloadStr).digest('hex');
}

/**
 * Filters out duplicate items from an array of incident objects using SHA-256 fingerprints.
 * @param {Array} incidents 
 * @returns {Array} Array of deduplicated incidents
 */
function deduplicateIncidents(incidents = []) {
  if (!Array.isArray(incidents)) return [];

  const seenFingerprints = new Set();
  const deduplicated = [];

  for (const item of incidents) {
    const fingerprint = item.fingerprint || generateIncidentFingerprint(item.sourceUrl, item.title, item.sourceKey);
    if (!seenFingerprints.has(fingerprint)) {
      seenFingerprints.add(fingerprint);
      deduplicated.push({
        ...item,
        fingerprint
      });
    }
  }

  return deduplicated;
}

module.exports = {
  normalizeCanonicalUrl,
  generateIncidentFingerprint,
  deduplicateIncidents
};
