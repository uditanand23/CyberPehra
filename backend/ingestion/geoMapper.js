/**
 * CYBERPEHRA INDIAN GEOGRAPHIC MAPPER
 * Standardized mapping of incident locations to 36 Indian States/UTs (ISO 3166-2:IN)
 * and administrative districts.
 */

const INDIA_STATE_MAP = {
  'IN-AN': { code: 'IN-AN', name: 'Andaman and Nicobar Islands' },
  'IN-AP': { code: 'IN-AP', name: 'Andhra Pradesh' },
  'IN-AR': { code: 'IN-AR', name: 'Arunachal Pradesh' },
  'IN-AS': { code: 'IN-AS', name: 'Assam' },
  'IN-BR': { code: 'IN-BR', name: 'Bihar' },
  'IN-CH': { code: 'IN-CH', name: 'Chandigarh' },
  'IN-CG': { code: 'IN-CG', name: 'Chhattisgarh' },
  'IN-DN': { code: 'IN-DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  'IN-DL': { code: 'IN-DL', name: 'Delhi NCR' },
  'IN-GA': { code: 'IN-GA', name: 'Goa' },
  'IN-GJ': { code: 'IN-GJ', name: 'Gujarat' },
  'IN-HR': { code: 'IN-HR', name: 'Haryana' },
  'IN-HP': { code: 'IN-HP', name: 'Himachal Pradesh' },
  'IN-JK': { code: 'IN-JK', name: 'Jammu and Kashmir' },
  'IN-JH': { code: 'IN-JH', name: 'Jharkhand' },
  'IN-KA': { code: 'IN-KA', name: 'Karnataka' },
  'IN-KL': { code: 'IN-KL', name: 'Kerala' },
  'IN-LA': { code: 'IN-LA', name: 'Ladakh' },
  'IN-LD': { code: 'IN-LD', name: 'Lakshadweep' },
  'IN-MP': { code: 'IN-MP', name: 'Madhya Pradesh' },
  'IN-MH': { code: 'IN-MH', name: 'Maharashtra' },
  'IN-MN': { code: 'IN-MN', name: 'Manipur' },
  'IN-ML': { code: 'IN-ML', name: 'Meghalaya' },
  'IN-MZ': { code: 'IN-MZ', name: 'Mizoram' },
  'IN-NL': { code: 'IN-NL', name: 'Nagaland' },
  'IN-OR': { code: 'IN-OR', name: 'Odisha' },
  'IN-PY': { code: 'IN-PY', name: 'Puducherry' },
  'IN-PB': { code: 'IN-PB', name: 'Punjab' },
  'IN-RJ': { code: 'IN-RJ', name: 'Rajasthan' },
  'IN-SK': { code: 'IN-SK', name: 'Sikkim' },
  'IN-TN': { code: 'IN-TN', name: 'Tamil Nadu' },
  'IN-TS': { code: 'IN-TS', name: 'Telangana' },
  'IN-TR': { code: 'IN-TR', name: 'Tripura' },
  'IN-UP': { code: 'IN-UP', name: 'Uttar Pradesh' },
  'IN-UK': { code: 'IN-UK', name: 'Uttarakhand' },
  'IN-WB': { code: 'IN-WB', name: 'West Bengal' }
};

const KEYWORD_STATE_MAP = [
  { keywords: ['delhi', 'ncr', 'new delhi', 'noida', 'gurugram', 'faridabad'], code: 'IN-DL' },
  { keywords: ['maharashtra', 'mumbai', 'pune', 'nagpur', 'thane'], code: 'IN-MH' },
  { keywords: ['karnataka', 'bengaluru', 'bangalore', 'mysuru', 'mangalore'], code: 'IN-KA' },
  { keywords: ['bihar', 'patna', 'gaya', 'muzaffarpur', 'munger'], code: 'IN-BR' },
  { keywords: ['haryana', 'panchkula', 'ambala', 'hisar'], code: 'IN-HR' },
  { keywords: ['uttar pradesh', 'lucknow', 'kanpur', 'varanasi', 'agra', 'prayagraj'], code: 'IN-UP' },
  { keywords: ['tamil nadu', 'chennai', 'coimbatore', 'madurai'], code: 'IN-TN' },
  { keywords: ['telangana', 'hyderabad', 'secunderabad', 'warangal'], code: 'IN-TS' },
  { keywords: ['west bengal', 'kolkata', 'howrah', 'siliguri'], code: 'IN-WB' },
  { keywords: ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot'], code: 'IN-GJ' },
  { keywords: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'kota'], code: 'IN-RJ' }
];

/**
 * Extracts Indian state code and name from incident text metadata.
 * @param {string} text 
 * @returns {{ stateCode: string, stateName: string }}
 */
function mapLocationToState(text = '') {
  if (!text || typeof text !== 'string') {
    return { stateCode: 'IN-DL', stateName: 'Delhi NCR' }; // Default national hub fallback
  }

  const clean = text.toLowerCase();

  for (const entry of KEYWORD_STATE_MAP) {
    for (const kw of entry.keywords) {
      if (clean.includes(kw)) {
        const stateObj = INDIA_STATE_MAP[entry.code];
        return { stateCode: stateObj.code, stateName: stateObj.name };
      }
    }
  }

  return { stateCode: 'IN-DL', stateName: 'Delhi NCR' };
}

module.exports = {
  INDIA_STATE_MAP,
  mapLocationToState
};
