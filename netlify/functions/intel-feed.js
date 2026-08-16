const { getCorsHeaders } = require('../../backend/config/security.js');
const { queryPublicDatabase } = require('../../backend/config/database.js');

const FALLBACK_PUBLIC_SCAMS = [
  {
    slug: 'apk-malware-banking',
    title_en: 'Malicious Android APK Banking Trojan',
    title_hi: 'मैलिशियस एंड्रॉइड APK बैंकिंग ट्रोजन',
    category: 'APK_MALWARE',
    severity: 'CRITICAL',
    description_en: 'Scammers send APK files masquerading as official utility bill payment, PM-Kisan, or courier tracking updates over WhatsApp or SMS.',
    description_hi: 'धोखेबाज़ व्हाट्सएप या एसएमएस पर बिजली बिल, पीएम-किसान या कूरियर ट्रैकिंग अपडेट का झांसा देकर APK फाइलें भेजते हैं।',
    red_flags: ["Unsolicited .apk files received on WhatsApp or Telegram", "App requests Accessibility and SMS read permissions"],
    prevention_steps: ["Never install .apk files received via messaging apps", "Keep Google Play Protect enabled"]
  },
  {
    slug: 'digital-arrest-extortion',
    title_en: 'Fake Digital Arrest & Police Impersonation',
    title_hi: 'नकली डिजिटल अरेस्ट एवं पुलिस रंगदारी',
    category: 'EXTORTION',
    severity: 'CRITICAL',
    description_en: 'Cybercriminals impersonating CBI or Police initiate video calls claiming a parcel in your name contained illegal drugs.',
    description_hi: 'साइबर अपराधी सीबीआई या पुलिस बनकर वीडियो कॉल करते हैं और दावा करते हैं कि आपके नाम से भेजे गए पार्सल में ड्रग्स पाए गए हैं।',
    red_flags: ["Demands to stay on continuous video call under Digital Arrest", "Claims of illegal drugs found in courier package"],
    prevention_steps: ["Indian Law Enforcement NEVER executes Digital Arrests over Skype/WhatsApp", "Disconnect call immediately and report to 1930"]
  }
];

const FALLBACK_ADVISORIES = [
  {
    advisory_code: 'CIAD-2026-0412',
    title: 'CERT-In Advisory: Malicious Android Remote Access Trojans (RAT)',
    severity: 'HIGH',
    source: 'CERT-In',
    summary: 'Distribution of Android RAT malware impersonating banking updates.',
    action_required: 'Inspect app permissions and never download APKs outside official app stores.'
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
    const scamsResult = await queryPublicDatabase('public_scams', FALLBACK_PUBLIC_SCAMS);
    const advisoriesResult = await queryPublicDatabase('threat_advisories', FALLBACK_ADVISORIES);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        scamsSource: scamsResult.source,
        scams: scamsResult.data,
        advisoriesSource: advisoriesResult.source,
        advisories: advisoriesResult.data
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to load threat intelligence feed" })
    };
  }
};
