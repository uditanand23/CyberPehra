const { getCorsHeaders } = require('../../backend/config/security.js');
const { queryPublicDatabase } = require('../../backend/config/database.js');

const FALLBACK_EMERGENCY_DIRECTORY = [
  {
    category: 'BANK',
    entity_name: 'State Bank of India (SBI)',
    tollfree_number: '1800 11 2211',
    emergency_action_url: 'https://sbi.co.in/web/customer-care/fraud-reporting',
    reporting_instructions: 'Call 1930 immediately or block via SMS BLOCK to 567676'
  },
  {
    category: 'BANK',
    entity_name: 'HDFC Bank',
    tollfree_number: '1800 202 6161',
    emergency_action_url: 'https://www.hdfcbank.com/personal/useful-links/security',
    reporting_instructions: 'Report unauthorized transactions within 24 hours'
  },
  {
    category: 'UPI',
    entity_name: 'National Payments Corporation of India (NPCI / BHIM)',
    tollfree_number: '1800 120 1740',
    emergency_action_url: 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
    reporting_instructions: 'Log UPI transaction ID in BHIM app dispute section & report to 1930'
  },
  {
    category: 'GOV_AGENCY',
    entity_name: 'National Cyber Crime Reporting Portal (NCCC)',
    tollfree_number: '1930',
    emergency_action_url: 'https://cybercrime.gov.in',
    reporting_instructions: 'Official 24x7 Government Helpline for financial cyber fraud mitigation'
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
    const result = await queryPublicDatabase('emergency_directory', FALLBACK_EMERGENCY_DIRECTORY);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        source: result.source,
        directory: result.data
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to load emergency directory" })
    };
  }
};
