/**
 * CYBERPEHRA PRODUCTION CONFIGURATION VALIDATOR
 * Audits environment variables & endpoint configuration safely without exposing secret values.
 */

function isValidHttpsUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (err) {
    return false;
  }
}

/**
 * Validates production environment configuration.
 * Returns safe structured status objects without leaking secret contents.
 */
export function validateProductionConfig() {
  const vtKey = process.env.VT_API_KEY;
  const sbKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnon = process.env.SUPABASE_ANON_KEY;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  const result = {
    ok: true,
    timestamp: new Date().toISOString(),
    envVars: {
      VT_API_KEY: vtKey ? 'configured' : 'optional_missing',
      GOOGLE_SAFE_BROWSING_KEY: sbKey ? 'configured' : 'optional_missing',
      SUPABASE_URL: supabaseUrl ? (isValidHttpsUrl(supabaseUrl) ? 'configured' : 'invalid_format') : 'optional_missing',
      SUPABASE_ANON_KEY: supabaseAnon ? 'configured' : 'optional_missing',
      UPSTASH_REDIS_REST_URL: redisUrl ? (isValidHttpsUrl(redisUrl) ? 'configured' : 'invalid_format') : 'optional_missing',
      UPSTASH_REDIS_REST_TOKEN: redisToken ? 'configured' : 'optional_missing'
    },
    warnings: []
  };

  if (supabaseUrl && !isValidHttpsUrl(supabaseUrl)) {
    result.warnings.push('SUPABASE_URL is defined but malformed or invalid URL scheme.');
    result.ok = false;
  }

  if (redisUrl && !isValidHttpsUrl(redisUrl)) {
    result.warnings.push('UPSTASH_REDIS_REST_URL is defined but malformed or invalid URL scheme.');
    result.ok = false;
  }

  return result;
}
