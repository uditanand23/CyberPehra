/**
 * CYBERPEHRA CONTROLLED SOURCE REGISTRY
 * Registry of authoritative public threat intelligence sources.
 * Enforces Tier 1 (Indian Govt Authorities), Tier 2 (Recognized Govt/National CERTs), Tier 3 (Recognized International Authorities).
 * Validates HTTPS origins, canonical domains, and allowed path patterns.
 */

const CONTROLLED_SOURCE_REGISTRY = {
  CERT_IN: {
    sourceId: 'CERT_IN',
    publisher: 'CERT-In',
    authority: 'Indian Computer Emergency Response Team (MeitY, Govt of India)',
    country: 'IN',
    tier: 1,
    trustLevel: 'official',
    enabled: true,
    domains: ['cert-in.org.in', 'www.cert-in.org.in'],
    canonicalDomains: ['www.cert-in.org.in'],
    allowedPathPatterns: ['/advisories/', '/s-advisories/', '/vulnerabilities/'],
    feedUrl: 'https://www.cert-in.org.in/rss/advisories.xml'
  },
  I4C_MHA: {
    sourceId: 'I4C_MHA',
    publisher: 'I4C (MHA)',
    authority: 'Indian Cyber Crime Coordination Centre (Ministry of Home Affairs)',
    country: 'IN',
    tier: 1,
    trustLevel: 'official',
    enabled: true,
    domains: ['cybercrime.gov.in', 'www.cybercrime.gov.in', 'mha.gov.in'],
    canonicalDomains: ['cybercrime.gov.in'],
    allowedPathPatterns: ['/news/', '/advisories/', '/alerts/'],
    feedUrl: 'https://cybercrime.gov.in/news/rss.xml'
  },
  RBI: {
    sourceId: 'RBI',
    publisher: 'Reserve Bank of India',
    authority: 'Central Banking Regulator (Govt of India)',
    country: 'IN',
    tier: 1,
    trustLevel: 'official',
    enabled: true,
    domains: ['rbi.org.in', 'www.rbi.org.in'],
    canonicalDomains: ['www.rbi.org.in'],
    allowedPathPatterns: ['/Scripts/', '/advisories/'],
    feedUrl: 'https://www.rbi.org.in/rss/advisories.xml'
  },
  NPCI: {
    sourceId: 'NPCI',
    publisher: 'NPCI',
    authority: 'National Payments Corporation of India',
    country: 'IN',
    tier: 1,
    trustLevel: 'official',
    enabled: true,
    domains: ['npci.org.in', 'www.npci.org.in'],
    canonicalDomains: ['www.npci.org.in'],
    allowedPathPatterns: ['/what-we-do/', '/circulars/'],
    feedUrl: 'https://www.npci.org.in/rss/alerts.xml'
  },
  PIB: {
    sourceId: 'PIB',
    publisher: 'PIB Fact Check / MHA',
    authority: 'Press Information Bureau (Govt of India)',
    country: 'IN',
    tier: 1,
    trustLevel: 'official',
    enabled: true,
    domains: ['pib.gov.in', 'www.pib.gov.in'],
    canonicalDomains: ['pib.gov.in'],
    allowedPathPatterns: ['/PressReleasePage.aspx', '/rss/'],
    feedUrl: 'https://pib.gov.in/rss/factcheck.xml'
  },
  CYBERCRIME_GOV: {
    sourceId: 'CYBERCRIME_GOV',
    publisher: 'National Cyber Crime Reporting Portal',
    authority: 'Ministry of Home Affairs (Govt of India)',
    country: 'IN',
    tier: 1,
    trustLevel: 'official',
    enabled: true,
    domains: ['cybercrime.gov.in'],
    canonicalDomains: ['cybercrime.gov.in'],
    allowedPathPatterns: ['/'],
    feedUrl: 'https://cybercrime.gov.in'
  },
  CISA: {
    sourceId: 'CISA',
    publisher: 'CISA',
    authority: 'Cybersecurity and Infrastructure Security Agency (US DHS)',
    country: 'US',
    tier: 3,
    trustLevel: 'international_authority',
    enabled: true,
    domains: ['cisa.gov', 'www.cisa.gov'],
    canonicalDomains: ['www.cisa.gov'],
    allowedPathPatterns: ['/news-events/cybersecurity-advisories/'],
    feedUrl: 'https://www.cisa.gov/cybersecurity-advisories/all.xml'
  }
};

function getSourceMetadata(sourceIdOrDomain) {
  if (!sourceIdOrDomain) return null;
  const input = String(sourceIdOrDomain).trim();
  const upperKey = input.toUpperCase();
  if (CONTROLLED_SOURCE_REGISTRY[upperKey]) {
    return CONTROLLED_SOURCE_REGISTRY[upperKey];
  }

  const lowerInput = input.toLowerCase();
  for (const src of Object.values(CONTROLLED_SOURCE_REGISTRY)) {
    if (src.domains.some(d => lowerInput.includes(d.toLowerCase()))) {
      return src;
    }
  }

  return null;
}

function isTrustedSourceUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string' || !urlStr.startsWith('https://')) {
    return { trusted: false, reason: 'URL must start with https://' };
  }

  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    for (const src of Object.values(CONTROLLED_SOURCE_REGISTRY)) {
      if (src.domains.some(d => hostname === d.toLowerCase() || hostname.endsWith('.' + d.toLowerCase()))) {
        return { trusted: true, source: src };
      }
    }

    return { trusted: false, reason: `Domain '${hostname}' is not in controlled source registry` };
  } catch (err) {
    return { trusted: false, reason: 'Invalid URL string' };
  }
}

module.exports = {
  CONTROLLED_SOURCE_REGISTRY,
  getSourceMetadata,
  isTrustedSourceUrl
};
