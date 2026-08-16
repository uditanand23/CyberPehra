const MAX_BODY_SIZE = 1024 * 1024;

const { checkDistributedRateLimit, getClientIp } = require('../../backend/middleware/rateLimiter.js');


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

function buildVirusTotalUrlId(url) {
  return Buffer.from(url)
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return buildJsonResponse(405, { error: "Method Not Allowed" });
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

  const isFileScan = payload.type === "file";
  let targetHash = "";
  let targetUrl = "";
  let parsedUrl = null;

  if (isFileScan) {
    targetHash = typeof payload.hash === "string" ? payload.hash.trim().toLowerCase() : "";
    if (!targetHash || !/^[a-f0-9]{64}$/i.test(targetHash)) {
      return buildJsonResponse(400, { error: "Valid SHA-256 hash is required" });
    }
  } else {
    targetUrl = typeof payload.url === "string" ? payload.url.trim() : "";
    if (!targetUrl) {
      return buildJsonResponse(400, { error: "URL is required" });
    }
    try {
      parsedUrl = new URL(targetUrl);
    } catch (err) {
      return buildJsonResponse(400, { error: "Invalid URL format" });
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return buildJsonResponse(400, { error: "Only http and https URLs are supported" });
    }
  }

  const apiKey = process.env.VT_API_KEY;
  if (!apiKey) {
    return buildJsonResponse(503, {
      error: "VirusTotal API key is not configured",
      unconfigured: true
    });
  }

  // Rate Limit check for VirusTotal free tier (4 req / min per IP)
  const clientIp = getClientIp(event);
  const rateLimitStatus = await checkDistributedRateLimit(clientIp, 'virustotal', 4, 60000);
  if (rateLimitStatus.limited) {
    return buildJsonResponse(429, {
      error: "VirusTotal API rate limit reached (4 req/min free tier)",
      rateLimited: true,
      retryAfter: rateLimitStatus.retryAfter
    });
  }

  try {
    if (isFileScan) {
      const response = await fetch(`https://www.virustotal.com/api/v3/files/${targetHash}`, {
        headers: {
          "x-apikey": apiKey
        }
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return buildJsonResponse(response.status, {
          error: data.error?.message || "VirusTotal file lookup failed",
          details: data
        });
      }

      const attributes = data?.data?.attributes || {};
      const stats = attributes.last_analysis_stats || {};

      return buildJsonResponse(200, {
        ok: true,
        type: "file",
        hash: targetHash,
        stats: {
          malicious: Number(stats.malicious || 0),
          suspicious: Number(stats.suspicious || 0),
          harmless: Number(stats.harmless || 0),
          undetected: Number(stats.undetected || 0)
        },
        last_analysis_date: attributes.last_analysis_date || null,
        report: data.data
      });
    }

    const encodedUrlId = buildVirusTotalUrlId(targetUrl);

    const reportResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${encodedUrlId}`, {
      headers: {
        "x-apikey": apiKey
      }
    });

    const reportData = await reportResponse.json().catch(() => ({}));

    if (!reportResponse.ok) {
      return buildJsonResponse(reportResponse.status, {
        error: reportData.error?.message || "VirusTotal report lookup failed",
        details: reportData
      });
    }

    const attributes = reportData?.data?.attributes || {};
    const stats = attributes.last_analysis_stats || {};

    return buildJsonResponse(200, {
      ok: true,
      type: "url",
      url: targetUrl,
      domain: parsedUrl.hostname,
      status: attributes.status || "completed",
      stats: {
        malicious: Number(stats.malicious || 0),
        suspicious: Number(stats.suspicious || 0),
        harmless: Number(stats.harmless || 0),
        undetected: Number(stats.undetected || 0)
      },
      last_analysis_date: attributes.last_analysis_date || null,
      report: reportData.data
    });
  } catch (err) {
    return buildJsonResponse(502, { error: err.message || "Unable to reach VirusTotal" });
  }
};