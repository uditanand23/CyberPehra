const { getCorsHeaders } = require('../../backend/config/security.js');
const { parseAndValidateJsonBody } = require('../../backend/middleware/validateInput.js');
const { checkDistributedRateLimit, getClientIp } = require('../../backend/middleware/rateLimiter.js');
const { ingestSourceFeed } = require('../../backend/ingestion/feedIngestor.js');

exports.handler = async (event) => {
  const origin = event.headers ? (event.headers.origin || event.headers.Origin) : '';
  const headers = getCorsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  // Rate Limiting
  const clientIp = getClientIp(event);
  const rateLimit = await checkDistributedRateLimit(clientIp, 'ingest_intel', 5, 60000);
  if (rateLimit.limited) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: "Ingestion endpoint rate limit reached",
        retryAfter: rateLimit.retryAfter
      })
    };
  }

  // Authentication check
  const secretKey = process.env.INGEST_SECRET_KEY;
  const providedKey = event.headers ? (event.headers['x-internal-key'] || event.headers['X-Internal-Key']) : null;
  if (!secretKey || !providedKey || providedKey !== secretKey) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Forbidden" }) };
  }

  const validation = parseAndValidateJsonBody(event);
  if (!validation.valid) {
    return {
      statusCode: validation.statusCode,
      headers,
      body: JSON.stringify({ error: validation.error })
    };
  }

  const sourceKey = (validation.payload.sourceKey || 'CERT_IN').toUpperCase();

  try {
    const ingestResult = await ingestSourceFeed(sourceKey);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        sourceKey,
        isLiveVerified: ingestResult.isLiveVerified,
        count: ingestResult.incidents.length,
        incidents: ingestResult.incidents
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Threat ingestion pipeline error" })
    };
  }
};
