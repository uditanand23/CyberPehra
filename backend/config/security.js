/**
 * CYBERPEHRA BACKEND SECURITY CONFIGURATION
 * Enforces Zero User Data Retention, CORS Policy, Rate Limits, and Security Headers.
 */

const SECURITY_CONFIG = {
  // CORS Configuration
  ALLOWED_ORIGINS: [
    'https://cyberpehra.in',
    'https://cyberpehra.netlify.app',
    'http://localhost:8888',
    'http://127.0.0.1:8888',
    'http://localhost:3000'
  ],

  // Common Standard JSON Headers
  JSON_HEADERS: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Max Request Body Sizes
  MAX_BODY_SIZE_BYTES: 1024 * 1024, // 1 MB limit

  // Rate Limiting (Per IP sliding window)
  RATE_LIMITS: {
    VIRUSTOTAL: { max: 4, windowMs: 60 * 1000 },       // 4 requests / 60 seconds (VT Free tier)
    SAFEBROWSING: { max: 15, windowMs: 60 * 1000 },    // 15 requests / 60 seconds
    WHOIS: { max: 10, windowMs: 60 * 1000 },           // 10 requests / 60 seconds
    PUBLIC_INTEL: { max: 30, windowMs: 60 * 1000 }     // 30 requests / 60 seconds
  }
};

/**
 * Returns CORS headers for Netlify Functions based on incoming Origin header
 */
function getCorsHeaders(requestOrigin) {
  const isAllowed = !requestOrigin || SECURITY_CONFIG.ALLOWED_ORIGINS.includes(requestOrigin);
  return {
    ...SECURITY_CONFIG.JSON_HEADERS,
    'Access-Control-Allow-Origin': isAllowed ? (requestOrigin || '*') : SECURITY_CONFIG.ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };
}

module.exports = {
  SECURITY_CONFIG,
  getCorsHeaders
};
