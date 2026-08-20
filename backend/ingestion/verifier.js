/**
 * CYBERPEHRA TRUST & VERIFICATION ENGINE
 * Evaluates origin signatures, government domain credentials, and live status.
 * Enforces explicit verification statuses: 'verified', 'cached', 'unverified', 'rejected'.
 */

const { getSourceMetadata, isTrustedSourceUrl } = require('./sources.js');
const { validateCtiRecord } = require('../schema/intelSchema.js');

function evaluateRecordVerificationStatus(record, isLiveFetch = false) {
  if (!record) return { status: 'rejected', reason: 'Record is null or undefined' };

  // 1. Schema Validation
  const schemaCheck = validateCtiRecord(record);
  if (!schemaCheck.valid) {
    return { status: 'rejected', reason: `Schema validation failed: ${schemaCheck.errors.join('; ')}` };
  }

  // 2. HTTPS URL & Trusted Domain Check
  const urlCheck = isTrustedSourceUrl(record.sourceUrl);
  if (!urlCheck.trusted) {
    return { status: 'unverified', reason: urlCheck.reason };
  }

  // 3. Provenance Check
  if (!record.provenance || !record.provenance.who || !record.provenance.where) {
    return { status: 'unverified', reason: 'Incomplete provenance data' };
  }

  // 4. Live vs Cached Status
  if (isLiveFetch) {
    return { status: 'verified', reason: 'Live HTTPS fetch verified against Controlled Source Registry' };
  }

  return { status: 'cached', reason: 'Previously verified record loaded from secure local store' };
}

module.exports = {
  evaluateRecordVerificationStatus
};
