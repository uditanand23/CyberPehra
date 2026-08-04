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

  const apiKey = process.env.VT_API_KEY;
  if (!apiKey) {
    return buildJsonResponse(500, { error: "VirusTotal API key is not configured" });
  }

  try {
    if (payload.type === "file") {
      const hash = typeof payload.hash === "string" ? payload.hash.trim().toLowerCase() : "";
      if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
        return buildJsonResponse(400, { error: "Valid SHA-256 hash is required" });
      }

      const response = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
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
        hash,
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

    const url = typeof payload.url === "string" ? payload.url.trim() : "";
    if (!url) {
      return buildJsonResponse(400, { error: "URL is required" });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return buildJsonResponse(400, { error: "Invalid URL format" });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return buildJsonResponse(400, { error: "Only http and https URLs are supported" });
    }

    const encodedUrlId = buildVirusTotalUrlId(url);

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
      url,
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