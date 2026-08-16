const { checkDistributedRateLimit, getClientIp } = require('../../backend/middleware/rateLimiter.js');

const MAX_BODY_SIZE = 1024 * 1024;

function buildJsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return buildJsonResponse(405, { error: "Method Not Allowed" });
  }

  // Rate Limit check for Google Safe Browsing (15 req / min per IP)
  const clientIp = getClientIp(event);
  const rateLimitStatus = await checkDistributedRateLimit(clientIp, 'safebrowsing', 15, 60000);
  if (rateLimitStatus.limited) {
    return buildJsonResponse(429, {
      error: "Google Safe Browsing lookup rate limit reached. Please try again later.",
      rateLimited: true,
      retryAfter: rateLimitStatus.retryAfter
    });
  }

  if (event.body && event.body.length > MAX_BODY_SIZE) {
    return buildJsonResponse(413, { error: "Request body too large" });
  }

  let payload = {};
  try {
    payload = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
  } catch (err) {
    return buildJsonResponse(400, { error: "Invalid JSON body" });
  }

  const targetUrl = typeof payload.url === "string" ? payload.url.trim() : "";
  if (!targetUrl) {
    return buildJsonResponse(400, { error: "URL is required" });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (err) {
    return buildJsonResponse(400, { error: "Invalid URL format" });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return buildJsonResponse(400, { error: "Only http and https URLs are supported" });
  }

  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  if (!apiKey) {
    return buildJsonResponse(503, {
      error: "Google Safe Browsing API key is not configured",
      unconfigured: true
    });
  }

  try {
    const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client: {
          clientId: "cyberpehra",
          clientVersion: "5.0.0"
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION"
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: targetUrl }]
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return buildJsonResponse(response.status, {
        error: data.error?.message || "Google Safe Browsing lookup failed",
        details: data
      });
    }

    const matches = data.matches || [];
    const clean = matches.length === 0;

    return buildJsonResponse(200, {
      ok: true,
      clean,
      matches,
      threatTypes: matches.map(m => m.threatType),
      url: targetUrl,
      domain: parsedUrl.hostname
    });
  } catch (err) {
    return buildJsonResponse(502, { error: err.message || "Unable to reach Google Safe Browsing API" });
  }
};
