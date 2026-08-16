const { getCorsHeaders } = require('../../backend/config/security.js');
const { queryPublicDatabase } = require('../../backend/config/database.js');

const FALLBACK_STATE_TELEMETRY = [
  {
    state_code: 'IN-DL',
    state_name: 'Delhi NCR',
    financial_loss_cr: 142.80,
    reported_cases: 18450,
    nodal_helpline: '1930',
    nodal_email: 'cybercell-dl@nic.in'
  },
  {
    state_code: 'IN-MH',
    state_name: 'Maharashtra',
    financial_loss_cr: 285.40,
    reported_cases: 32100,
    nodal_helpline: '1930',
    nodal_email: 'cybercrime-mh@gov.in'
  },
  {
    state_code: 'IN-KA',
    state_name: 'Karnataka',
    financial_loss_cr: 198.20,
    reported_cases: 24300,
    nodal_helpline: '1930',
    nodal_email: 'cybercrime-ka@gov.in'
  }
];

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
    const result = await queryPublicDatabase('state_cyber_telemetry', FALLBACK_STATE_TELEMETRY);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        source: result.source,
        telemetry: result.data
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to load state telemetry data" })
    };
  }
};
