/**
 * CYBERPEHRA TRUSTED PUBLIC SOURCES REGISTRY
 * Registry of official public RSS/JSON threat intelligence feeds in India.
 * Enforces strict origin trust levels and provenance URL retention.
 */

const TRUSTED_SOURCES = {
  CERT_IN: {
    sourceKey: 'CERT_IN',
    name: 'CERT-In (Indian Computer Emergency Response Team)',
    organizationType: 'GOVERNMENT_CERT',
    trustScore: 100,
    trustClassification: 'VERIFIED_OFFICIAL',
    feedUrl: 'https://www.cert-in.org.in/rss/advisories.xml',
    officialDomain: 'cert-in.org.in'
  },
  NCCC_I4C: {
    sourceKey: 'NCCC_I4C',
    name: 'I4C (Indian Cyber Crime Coordination Centre - MHA)',
    organizationType: 'GOVERNMENT_AGENCY',
    trustScore: 100,
    trustClassification: 'VERIFIED_OFFICIAL',
    feedUrl: 'https://cybercrime.gov.in/news/rss.xml',
    officialDomain: 'cybercrime.gov.in'
  },
  RBI_SAFETY: {
    sourceKey: 'RBI_SAFETY',
    name: 'Reserve Bank of India (RBI Security Advisories)',
    organizationType: 'REGULATOR',
    trustScore: 100,
    trustClassification: 'VERIFIED_OFFICIAL',
    feedUrl: 'https://www.rbi.org.in/rss/advisories.xml',
    officialDomain: 'rbi.org.in'
  },
  PIB_FACTCHECK: {
    sourceKey: 'PIB_FACTCHECK',
    name: 'PIB Fact Check & Cyber Alerts (Ministry of I&B)',
    organizationType: 'GOVERNMENT_MEDIA',
    trustScore: 95,
    trustClassification: 'VERIFIED_OFFICIAL',
    feedUrl: 'https://pib.gov.in/rss/factcheck.xml',
    officialDomain: 'pib.gov.in'
  },
  ACCREDITED_NEWS: {
    sourceKey: 'ACCREDITED_NEWS',
    name: 'Accredited Cyber Security News Bulletins',
    organizationType: 'MEDIA',
    trustScore: 80,
    trustClassification: 'HIGH_CONFIDENCE_NEWS',
    feedUrl: 'https://cyberpehra.in/feeds/news.json',
    officialDomain: 'cyberpehra.in'
  }
};

/**
 * Returns source metadata by sourceKey or domain lookup.
 */
function getSourceMetadata(sourceKeyOrDomain) {
  if (!sourceKeyOrDomain) return null;
  const key = String(sourceKeyOrDomain).toUpperCase().trim();
  if (TRUSTED_SOURCES[key]) return TRUSTED_SOURCES[key];

  for (const src of Object.values(TRUSTED_SOURCES)) {
    if (src.officialDomain && sourceKeyOrDomain.toLowerCase().includes(src.officialDomain)) {
      return src;
    }
  }

  return null;
}

module.exports = {
  TRUSTED_SOURCES,
  getSourceMetadata
};
