const { getCorsHeaders } = require('../../backend/config/security.js');

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

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      status: 'operational',
      timestamp: new Date().toISOString(),
      processUptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0)
    })
  };
};
