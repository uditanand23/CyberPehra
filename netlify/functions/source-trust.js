const { getCorsHeaders } = require('../../backend/config/security.js');
const { CONTROLLED_SOURCE_REGISTRY } = require('../../backend/ingestion/sources.js');

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

  try {
    const sourcesList = Object.values(CONTROLLED_SOURCE_REGISTRY).map(src => ({
      sourceId: src.sourceId,
      publisher: src.publisher,
      authority: src.authority,
      country: src.country,
      sourceTier: src.tier,
      trustLevel: src.trustLevel,
      canonicalDomains: src.canonicalDomains,
      enabled: src.enabled
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        source: 'CONTROLLED_SOURCE_REGISTRY',
        totalSources: sourcesList.length,
        sources: sourcesList
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to load source trust directory" })
    };
  }
};
