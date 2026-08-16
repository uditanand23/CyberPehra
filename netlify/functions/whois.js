const { getCorsHeaders } = require('../../backend/config/security.js');
const { isValidDomainInput } = require('../../backend/middleware/ssrfGuard.js');
const { parseAndValidateJsonBody, sanitizeString } = require('../../backend/middleware/validateInput.js');
const { checkRateLimit, getClientIp } = require('../../backend/middleware/rateLimiter.js');

exports.handler = async (event) => {
  const origin = event.headers ? (event.headers.origin || event.headers.Origin) : '';
  const headers = getCorsHeaders(origin);

  // Handle preflight OPTIONS request
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

  // Rate limit check
  const clientIp = getClientIp(event);
  const rateLimit = checkRateLimit(clientIp, 'whois', 10, 60000);
  if (rateLimit.limited) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: "WHOIS lookup rate limit reached. Please try again later.",
        retryAfter: rateLimit.retryAfter
      })
    };
  }

  // Input validation
  const validation = parseAndValidateJsonBody(event);
  if (!validation.valid) {
    return {
      statusCode: validation.statusCode,
      headers,
      body: JSON.stringify({ error: validation.error })
    };
  }

  const domain = sanitizeString(validation.payload.domain || '', 253);

  // SSRF & Domain Syntax Guard
  if (!isValidDomainInput(domain)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: "Invalid or prohibited domain. IP addresses, loopback, and internal hosts are not allowed."
      })
    };
  }

  try {
    // Official RDAP public endpoint
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: `RDAP WHOIS query returned HTTP status ${response.status}`,
          domain
        })
      };
    }

    const rdapData = await response.json().catch(() => ({}));
    
    // Extract key WHOIS indicators securely
    const eventsArr = rdapData.events || [];
    let registrationDate = null;
    let expirationDate = null;

    eventsArr.forEach(e => {
      if (e.eventAction === 'registration') registrationDate = e.eventDate;
      if (e.eventAction === 'expiration') expirationDate = e.eventDate;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        domain,
        handle: rdapData.handle || null,
        ldhName: rdapData.ldhName || domain,
        registrationDate,
        expirationDate,
        status: rdapData.status || [],
        port43: rdapData.port43 || null
      })
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: err.message || "Failed to reach public RDAP service" })
    };
  }
};
