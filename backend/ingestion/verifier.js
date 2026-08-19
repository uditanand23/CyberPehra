/**
 * CYBERPEHRA TRUST & VERIFICATION CLASSIFIER
 * Evaluates origin signatures, government domain credentials, and live status.
 * Strictly adheres to Non-Fabrication Principle.
 */

const { getSourceMetadata } = require('./sources.js');

const TRUST_CLASSIFICATIONS = {
  VERIFIED_OFFICIAL: 'VERIFIED_OFFICIAL',       // Official Govt (.gov.in, .nic.in, CERT-In, RBI)
  HIGH_CONFIDENCE_NEWS: 'HIGH_CONFIDENCE_NEWS', // Accredited national press reports
  UNVERIFIED: 'UNVERIFIED'                     // Unverified public community alerts
};

/**
 * Classifies an incident trust level based on source metadata and canonical URL domain.
 * @param {string} sourceKey 
 * @param {string} sourceUrl 
 * @returns {{ classification: string, isLiveVerified: boolean, trustScore: number }}
 */
function classifyIncidentTrust(sourceKey = '', sourceUrl = '', wasFetchSuccessful = false) {
  const metadata = getSourceMetadata(sourceKey) || getSourceMetadata(sourceUrl);
  
  let domain = '';
  try {
    if (sourceUrl) domain = new URL(sourceUrl).hostname.toLowerCase();
  } catch (err) {
    domain = '';
  }

  // Check official government TLDs
  const isGovDomain = domain.endsWith('.gov.in') || domain.endsWith('.nic.in') || domain.endsWith('cert-in.org.in') || domain.endsWith('rbi.org.in');

  let classification = TRUST_CLASSIFICATIONS.UNVERIFIED;
  let trustScore = 40;

  if (metadata && metadata.trustClassification === TRUST_CLASSIFICATIONS.VERIFIED_OFFICIAL) {
    classification = TRUST_CLASSIFICATIONS.VERIFIED_OFFICIAL;
    trustScore = metadata.trustScore || 100;
  } else if (isGovDomain) {
    classification = TRUST_CLASSIFICATIONS.VERIFIED_OFFICIAL;
    trustScore = 100;
  } else if (metadata && metadata.trustClassification === TRUST_CLASSIFICATIONS.HIGH_CONFIDENCE_NEWS) {
    classification = TRUST_CLASSIFICATIONS.HIGH_CONFIDENCE_NEWS;
    trustScore = metadata.trustScore || 80;
  }

  // LIVE Safeguard: Data is ONLY marked live-verified if the fetch succeeded
  const isLiveVerified = Boolean(wasFetchSuccessful);

  return {
    classification,
    isLiveVerified,
    trustScore
  };
}

module.exports = {
  TRUST_CLASSIFICATIONS,
  classifyIncidentTrust
};
