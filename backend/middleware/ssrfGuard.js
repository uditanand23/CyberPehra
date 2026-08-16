/**
 * CYBERPEHRA SSRF GUARD
 * Validates URLs and domain targets to block Server-Side Request Forgery (SSRF)
 * targeting loopback, private IPv4/IPv6 ranges, and AWS/Cloud metadata endpoints.
 */

// Private & Loopback IPv4 Ranges Regex (standard octet notation)
const PRIVATE_IPV4_REGEX = /^(?:127\.|10\.|172\.(?:1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|0\.|224\.|240\.)/;

// Blocked Internal & Cloud Metadata Hostnames
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '0:0:0:0:0:0:0:1',
  '::ffff:127.0.0.1',
  '169.254.169.254',
  'metadata.google.internal',
  'instance-data',
  '169.254.169.254.xip.io',
  'burpcollaborator.net'
]);

/**
 * Normalizes numerical IP representations (hex 0x7f000001, decimal 2130706433, octal 0177.0000.0000.0001)
 */
function isAlternativeIpFormat(hostname = '') {
  const clean = hostname.trim().toLowerCase();
  
  // Single decimal integer IP (e.g. 2130706433 for 127.0.0.1 or 2852039166 for 169.254.169.254)
  if (/^\d+$/.test(clean)) {
    const num = Number(clean);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) {
      const ip1 = (num >> 24) & 255;
      const ip2 = (num >> 16) & 255;
      const ip3 = (num >> 8) & 255;
      const ip4 = num & 255;
      const dotted = `${ip1}.${ip2}.${ip3}.${ip4}`;
      if (PRIVATE_IPV4_REGEX.test(dotted)) return true;
    }
  }

  // Hexadecimal notation (0x7f000001)
  if (/^0x[0-9a-f]+$/i.test(clean)) return true;

  // IPv6 mapped IPv4 or bracketed IPv6
  if (clean.includes('::ffff:') || clean === '[::1]' || clean.startsWith('[fe80:') || clean.startsWith('[fc00:') || clean.startsWith('[fd00:')) {
    return true;
  }

  // Octal dotted notation (0177.0.0.1)
  if (/^0[0-7]+\./.test(clean)) return true;

  return false;
}

/**
 * Validates whether a target URL is safe to fetch server-side.
 * @param {string} urlString 
 * @returns {{ valid: boolean, error?: string, parsedUrl?: URL }}
 */
export function isSafeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { valid: false, error: 'URL string is required' };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlString.trim());
  } catch (err) {
    return { valid: false, error: 'Malformed URL format' };
  }

  // Enforce HTTP / HTTPS protocol only
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return { valid: false, error: 'Only http and https protocols are allowed' };
  }

  // Clean brackets from IPv6 hostnames
  const rawHost = parsedUrl.hostname.toLowerCase();
  const hostname = rawHost.replace(/^\[|\]$/g, '');

  // Check blocked exact hostnames
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return { valid: false, error: 'SSRF Guard: Access to internal / loopback hostnames is prohibited' };
  }

  // Check alternative IP representations (hex, octal, decimal, IPv6-mapped)
  if (isAlternativeIpFormat(hostname)) {
    return { valid: false, error: 'SSRF Guard: Prohibited IP format or loopback representation detected' };
  }

  // Check IPv4 private address ranges
  if (PRIVATE_IPV4_REGEX.test(hostname)) {
    return { valid: false, error: 'SSRF Guard: Access to private IP address ranges is prohibited' };
  }

  return { valid: true, parsedUrl };
}

/**
 * Validates domain string for WHOIS / RDAP lookup queries.
 * @param {string} domain 
 * @returns {boolean}
 */
export function isValidDomainInput(domain) {
  if (!domain || typeof domain !== 'string') return false;
  const clean = domain.trim().toLowerCase();
  
  // Must match domain syntax and not be an IP address or localhost
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  if (!domainRegex.test(clean)) return false;

  if (BLOCKED_HOSTNAMES.has(clean) || clean.endsWith('.local') || clean.endsWith('.internal') || isAlternativeIpFormat(clean)) {
    return false;
  }

  return true;
}
