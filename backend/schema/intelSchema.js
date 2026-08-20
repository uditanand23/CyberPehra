/**
 * CYBERPEHRA CTI DATA MODEL & SCHEMA VALIDATOR
 * Enforces strict, evidence-first threat intelligence schema.
 * Rejects synthetic financial statistics, dynamic timestamp spoofing, missing provenance, and invalid URLs.
 */

const SEVERITY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const CONFIDENCE_LEVELS = ['VERIFIED', 'HIGH', 'MEDIUM', 'LOW'];
const VERIFICATION_STATUSES = ['verified', 'cached', 'unverified', 'rejected'];
const INDIA_RELEVANCE_LEVELS = ['india_specific', 'india_relevant', 'global_context'];
const SOURCE_TIERS = [1, 2, 3];

function validateCtiRecord(record) {
  const errors = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: ['Record must be a non-null object'] };
  }

  // 1. Mandatory Identifier & Metadata
  if (!record.id || typeof record.id !== 'string' || record.id.trim() === '') {
    errors.push('id is required and must be a non-empty string');
  }

  if (!record.title || typeof record.title !== 'string' || record.title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }

  if (!record.summary || typeof record.summary !== 'string' || record.summary.trim() === '') {
    errors.push('summary is required and must be a non-empty string');
  }

  // 2. Enum Validation
  if (!SEVERITY_LEVELS.includes(record.severity)) {
    errors.push(`invalid severity '${record.severity}'. Allowed: ${SEVERITY_LEVELS.join(', ')}`);
  }

  if (!CONFIDENCE_LEVELS.includes(record.confidence)) {
    errors.push(`invalid confidence '${record.confidence}'. Allowed: ${CONFIDENCE_LEVELS.join(', ')}`);
  }

  if (!VERIFICATION_STATUSES.includes(record.verificationStatus)) {
    errors.push(`invalid verificationStatus '${record.verificationStatus}'. Allowed: ${VERIFICATION_STATUSES.join(', ')}`);
  }

  if (!INDIA_RELEVANCE_LEVELS.includes(record.indiaRelevance)) {
    errors.push(`invalid indiaRelevance '${record.indiaRelevance}'. Allowed: ${INDIA_RELEVANCE_LEVELS.join(', ')}`);
  }

  if (!SOURCE_TIERS.includes(Number(record.sourceTier))) {
    errors.push(`invalid sourceTier '${record.sourceTier}'. Must be 1, 2, or 3`);
  }

  // 3. Provenance & Publisher Validation
  if (!record.publisher || typeof record.publisher !== 'string' || record.publisher.trim() === '') {
    errors.push('publisher is required');
  }

  if (!record.sourceId || typeof record.sourceId !== 'string' || record.sourceId.trim() === '') {
    errors.push('sourceId is required');
  }

  if (!record.sourceUrl || typeof record.sourceUrl !== 'string' || !record.sourceUrl.startsWith('https://')) {
    errors.push('sourceUrl must be a valid HTTPS URL');
  }

  // 4. Strict Timestamp Rules (No dynamic spoofing)
  if (!record.publishedAt || typeof record.publishedAt !== 'string') {
    errors.push('publishedAt ISO timestamp string is required');
  } else {
    const pubDate = new Date(record.publishedAt);
    if (isNaN(pubDate.getTime())) {
      errors.push('publishedAt must be a valid ISO Date string');
    }
  }

  // 5. Reject Synthetic Financial Loss Fields
  if (record.financialLossInr !== undefined || record.totalLossCrores !== undefined) {
    errors.push('synthetic financial loss fields (financialLossInr/totalLossCrores) are strictly forbidden');
  }

  // 6. Provenance Object Validation
  if (!record.provenance || typeof record.provenance !== 'object') {
    errors.push('provenance object is required containing who, what, when, where, and howVerified');
  } else {
    const p = record.provenance;
    if (!p.who || !p.what || !p.when || !p.where || !p.howVerified) {
      errors.push('provenance object must contain who, what, when, where, and howVerified fields');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  SEVERITY_LEVELS,
  CONFIDENCE_LEVELS,
  VERIFICATION_STATUSES,
  INDIA_RELEVANCE_LEVELS,
  SOURCE_TIERS,
  validateCtiRecord
};
