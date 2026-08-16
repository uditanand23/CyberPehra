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

  const readinessState = {
    ok: true,
    status: 'ready',
    timestamp: new Date().toISOString(),
    dependencies: {
      critical: {
        staticFallbackDataset: 'ready',
        backendEngine: 'ready'
      },
      optional: {
        supabase: isSupabaseConfigured ? 'ready' : 'unconfigured_fallback',
        upstashRedis: isUpstashConfigured ? 'ready' : 'in_memory_fallback',
        virustotal: isVirusTotalConfigured ? 'ready' : 'unconfigured',
        safebrowsing: isSafeBrowsingConfigured ? 'ready' : 'unconfigured'
      }
    }
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(readinessState)
  };
};
