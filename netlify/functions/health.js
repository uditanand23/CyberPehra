const { getCorsHeaders } = require('../../backend/config/security.js');
const { TRUSTED_SOURCES } = require('../../backend/ingestion/sources.js');

exports.handler = async (event) => {
  const origin = event.headers ? (event.headers.origin || event.headers.Origin) : '';
  const headers = getCorsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  const isUpstashConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  const isSupabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  const isVirusTotalConfigured = Boolean(process.env.VT_API_KEY);
  const isSafeBrowsingConfigured = Boolean(process.env.GOOGLE_SAFE_BROWSING_KEY);

  const sourcesStatus = Object.keys(TRUSTED_SOURCES).map(key => ({
    sourceKey: key,
    name: TRUSTED_SOURCES[key].name,
    officialDomain: TRUSTED_SOURCES[key].officialDomain,
    status: 'healthy'
  }));

  const systemStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '5.0.0-certified',
    services: {
      serverlessEngine: 'healthy',
      databaseFallback: 'healthy',
      supabase: isSupabaseConfigured ? 'healthy' : 'unconfigured_fallback',
      distributedRateLimiter: isUpstashConfigured ? 'healthy' : 'in_memory_fallback',
      virustotalScanner: isVirusTotalConfigured ? 'healthy' : 'unconfigured',
      safebrowsingScanner: isSafeBrowsingConfigured ? 'healthy' : 'unconfigured'
    },
    sources: sourcesStatus
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(systemStatus)
  };
};
