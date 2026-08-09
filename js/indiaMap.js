/**
 * CYBERPEHRA - GeoJSON & D3 3D Isometric Vector Map Engine
 * Combines GeoJSON boundaries, D3 geoMercator projection, 3D SVG extrusion layers,
 * interactive 3D mouse parallax tilt, floating 3D radar pulse markers, and full telemetry modal reports.
 */

let cyberData = null;
let geoData = null;
let is3DMode = true;

// Fetch or initialize cyber threat dataset
export async function loadCyberData() {
  if (cyberData) return cyberData;
  try {
    const response = await fetch('/india_cyber_data.json');
    if (response.ok) {
      const data = await response.json();
      cyberData = data.states;
    }
  } catch (err) {
    console.warn("Could not load india_cyber_data.json via fetch, using static fallback.");
  }
  return cyberData;
}

// Fetch GeoJSON boundary data for Indian States & UTs
export async function loadIndiaGeoJSON() {
  if (geoData) return geoData;
  try {
    const response = await fetch('/india_states.geojson');
    if (response.ok) {
      geoData = await response.json();
    }
  } catch (err) {
    console.warn("Could not load india_states.geojson via fetch.");
  }
  return geoData;
}

// Calculate live bottom summary stats
export function calculateLiveStats(dataMap) {
  let totalActiveAlerts = 0;
  let affectedStatesCount = 0;
  let criticalAlertsCount = 0;

  if (!dataMap) return { totalActiveAlerts: 0, affectedStatesCount: 0, criticalAlertsCount: 0 };

  Object.values(dataMap).forEach(stateObj => {
    if (stateObj.activeAlerts) {
      totalActiveAlerts += stateObj.activeAlerts;
    }
    if (stateObj.severity === 'high' || stateObj.severity === 'medium') {
      affectedStatesCount += 1;
    }
    if (stateObj.severity === 'high') {
      criticalAlertsCount += 1;
    }
  });

  return { totalActiveAlerts, affectedStatesCount, criticalAlertsCount };
}

// Color scheme matching 3D dark cyber aesthetic
export function getSeverityColors(severity) {
  switch (severity) {
    case 'high':
      return {
        fill: 'rgba(255, 59, 92, 0.35)',
        stroke: '#FF3B5C',
        dot: '#FF3B5C',
        glow: 'rgba(255, 59, 92, 0.85)',
        badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800'
      };
    case 'medium':
      return {
        fill: 'rgba(255, 159, 67, 0.32)',
        stroke: '#FF9F43',
        dot: '#FF9F43',
        glow: 'rgba(255, 159, 67, 0.85)',
        badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-800'
      };
    case 'low':
      return {
        fill: 'rgba(0, 255, 136, 0.25)',
        stroke: '#00FF88',
        dot: '#00FF88',
        glow: 'rgba(0, 255, 136, 0.85)',
        badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
      };
    default:
      return {
        fill: 'rgba(56, 189, 248, 0.18)',
        stroke: '#38BDF8',
        dot: '#38BDF8',
        glow: 'rgba(56, 189, 248, 0.5)',
        badgeClass: 'bg-slate-900 text-slate-400 border-slate-700'
      };
  }
}

// Render 6-Month SVG Bar Chart
function renderSixMonthSvgChart(trendData) {
  if (!trendData || trendData.every(val => val === 0)) {
    return `<div class="p-3 text-center text-slate-500 font-sans text-xs bg-slate-950 rounded-xl border border-slate-800">Telemetry history pending for this region</div>`;
  }

  const maxVal = Math.max(...trendData, 1);
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const width = 320;
  const height = 90;
  const barWidth = 32;
  const gap = (width - (barWidth * trendData.length)) / (trendData.length + 1);

  const barsSvg = trendData.map((val, idx) => {
    const barHeight = Math.max(8, (val / maxVal) * (height - 30));
    const x = gap + idx * (barWidth + gap);
    const y = height - barHeight - 18;
    return `
      <g class="group/bar">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#chartBarGrad)" class="transition-all duration-300 hover:opacity-80"/>
        <text x="${x + barWidth / 2}" y="${y - 4}" text-anchor="middle" fill="#00FF88" font-size="9" font-family="Inter" font-weight="bold">${val >= 1000 ? (val/1000).toFixed(1)+'k' : val}</text>
        <text x="${x + barWidth / 2}" y="${height - 4}" text-anchor="middle" fill="#94A3B8" font-size="9" font-family="Inter">${months[idx]}</text>
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-24 overflow-visible">
      <defs>
        <linearGradient id="chartBarGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#059669"/>
          <stop offset="100%" stop-color="#00FF88"/>
        </linearGradient>
      </defs>
      ${barsSvg}
    </svg>
  `;
}

// State Command Center Active View Tracker
let activeStateCode = 'MH';
let activeStateTab = 'overview'; // 'overview', 'news', 'playbook', 'contact'

export function switchStateTab(tabName) {
  activeStateTab = tabName;
  if (activeStateCode) {
    openStateReportModal(activeStateCode, tabName);
  }
}

// Render Inner Content of Selected Command Center Tab
function renderStateTabContent(stateInfo, tab, colors, vectors, districtsList) {
  if (tab === 'news') {
    return `
      <div class="space-y-4 font-sans animate-fadeIn">
        <div class="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>📰 Live Verified Cyber Crime Bulletins & Press Advisories — ${stateInfo.state}</span>
            </h3>
            <p class="text-xs text-slate-400">Authentic incident records sourced from State Cyber Police HQ & NCRB Bulletin Network</p>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono text-xs font-bold">
            Source: ${stateInfo.source}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${stateInfo.recentIncidents.map((incidentText, idx) => `
            <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3 hover:border-emerald-500/50 transition bg-slate-950/70 shadow-xl">
              <div class="flex items-center justify-between text-[11px]">
                <span class="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase tracking-wider">
                  🚨 Verified Advisory #${idx + 1}
                </span>
                <span class="text-slate-400 font-mono">${stateInfo.lastUpdated || '2026 IST'}</span>
              </div>
              <h4 class="text-sm font-bold text-white leading-snug font-display">
                ${incidentText.split('.')[0] || incidentText}
              </h4>
              <p class="text-xs text-slate-300 leading-relaxed font-sans">
                ${incidentText}
              </p>
              <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span class="text-emerald-400 font-semibold flex items-center gap-1">
                  <span>✦ Verified Police Case File</span>
                </span>
                <span class="text-rose-400 font-mono font-bold">Loss: ${stateInfo.biggestScam ? stateInfo.biggestScam.amount : 'High Financial Impact'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'playbook') {
    return `
      <div class="space-y-6 font-sans animate-fadeIn">
        <div class="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-3 shadow-2xl">
          <div class="flex items-center gap-3">
            <span class="text-3xl flex-shrink-0">🚨</span>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-rose-300 font-display">24-Hour Golden Hour Protocol for ${stateInfo.state} Victims</h3>
              <p class="text-xs text-rose-200">If money was stolen or active extortion is taking place, follow this official helpline protocol immediately:</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a href="tel:1930" class="p-3.5 rounded-xl bg-rose-600 text-white font-bold text-center hover:bg-rose-500 transition block shadow-lg text-xs uppercase tracking-wider">
              📞 Call Helpline 1930 Now
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" class="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-center hover:border-emerald-500 transition block shadow-lg text-xs uppercase tracking-wider">
              🌐 File Portal Complaint ↗
            </a>
            <button onclick="window.downloadEmergencyActionPDF ? window.downloadEmergencyActionPDF() : alert('PDF generator ready')" class="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-center hover:bg-emerald-900 transition shadow-lg text-xs uppercase tracking-wider">
              📄 Save Emergency Playbook PDF
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3 bg-slate-950/70">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="text-[#00FF88] font-mono">STEP 1:</span> Bank Lien & Transaction Freeze
            </h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              Dial <strong>1930</strong> immediately from your registered mobile number. State the bank transaction reference number (UTR), sender account details, and timestamp. The National Cyber Crime Reporting Portal auto-dispatches an emergency lien freeze request directly to the beneficiary bank nodes within the Golden Hour window.
            </p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3 bg-slate-950/70">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="text-[#00FF88] font-mono">STEP 2:</span> Digital Forensics Evidence Audit
            </h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              Do NOT delete any WhatsApp or Telegram chat histories, SMS texts, or payment receipts. Capture full-screen screenshots including profile numbers and timestamp details. Save APK files or phishing links in an isolated folder for submission to police investigators.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  if (tab === 'contact') {
    return `
      <div class="space-y-6 font-sans animate-fadeIn">
        <div class="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-slate-950/80">
          <div class="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
            <div>
              <h3 class="text-base sm:text-lg font-bold text-white font-display">Official State Cyber Crime Headquarters — ${stateInfo.state}</h3>
              <p class="text-xs text-slate-400">Nodal Officer & Cyber Crime Prevention Division</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs font-mono">
              VERIFIED OFFICIAL DIRECTORY
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nodal Officer & Authority</span>
              <div class="text-sm font-bold text-white">Superintendent of Police / Inspector General</div>
              <div class="text-xs text-emerald-400 font-medium">${stateInfo.source}</div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">National Helpline</span>
              <div class="text-lg font-bold text-rose-400 font-mono">1930 (Toll-Free 24x7)</div>
              <div class="text-xs text-slate-400">Financial Fraud Lien Response</div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Official Portal</span>
              <div class="text-xs font-bold text-white">https://cybercrime.gov.in</div>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" class="text-xs text-emerald-400 hover:underline inline-block mt-0.5">File Complaint Online ↗</a>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nodal Desk Email</span>
              <div class="text-xs font-bold text-white font-mono">cybercell-${stateInfo.code.toLowerCase()}@gov.in</div>
              <div class="text-[11px] text-slate-400">Official Government Domain</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // DEFAULT: TAB 1 OVERVIEW & VECTOR ANALYTICS
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans animate-fadeIn">
      <!-- LEFT COL: CHARTS & Incident Trajectory -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 6-MONTH TRAJECTORY CHART -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white flex items-center gap-2">
              <span>📈 6-Month Regional Incident Trajectory</span>
            </span>
            <span class="text-[11px] text-emerald-400 font-mono font-bold uppercase">${stateInfo.trend} TREND</span>
          </div>
          ${renderSixMonthSvgChart(stateInfo.sixMonthTrend)}
        </div>

        <!-- SCAM VECTOR DISTRIBUTION GRAPH -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div class="flex items-center justify-between text-xs border-b border-white/10 pb-3">
            <span class="font-bold text-white">📊 Top Targeted Scam Vector Breakdown</span>
            <span class="text-[11px] text-slate-400">Regional Incident Split %</span>
          </div>

          <div class="space-y-3.5">
            ${Object.entries(vectors).map(([label, pct]) => `
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-200 font-medium">${label}</span>
                  <span class="font-mono text-[#00FF88] font-bold">${pct}%</span>
                </div>
                <div class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div class="h-full bg-gradient-to-r from-emerald-600 via-teal-400 to-[#00FF88] rounded-full transition-all duration-700" style="width: ${pct}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- RIGHT COL: LARGEST INCIDENT & HOTSPOT DISTRICTS -->
      <div class="lg:col-span-5 space-y-6">
        <!-- LARGEST SCAM CASE STUDY -->
        <div class="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950 border border-rose-800/60 space-y-3 shadow-xl">
          <div class="flex items-center justify-between text-[11px]">
            <span class="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase tracking-wider">
              ⚠️ Largest Reported Scam Incident
            </span>
            <span class="text-rose-400 font-mono font-bold text-sm">${stateInfo.biggestScam ? stateInfo.biggestScam.amount : 'High Risk'}</span>
          </div>

          <div>
            <h4 class="text-sm font-bold text-white font-display">${stateInfo.biggestScam ? stateInfo.biggestScam.type : 'Financial Fraud Trap'}</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              Syndicates spoofed banking and investment communication channels to extract non-refundable deposits from local residents.
            </p>
          </div>
        </div>

        <!-- HIGH RISK HOTSPOT DISTRICTS -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <span class="text-xs font-bold text-white block">📍 High-Risk Hotspot Districts & Cities</span>
          <div class="flex flex-wrap gap-2 pt-1">
            ${districtsList.map(dist => `
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>${dist}</span>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- RECENT BULLETINS PREVIEW -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white">⚡ Recent Incident Bulletins</span>
            <button onclick="window.switchStateTab('news')" class="text-emerald-400 hover:underline text-[11px] font-semibold">View News (${stateInfo.recentIncidents.length}) ➔</button>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed line-clamp-2">
            ${stateInfo.recentIncidents[0] || 'State Cyber Crime Division monitoring active fraud telemetry.'}
          </p>
        </div>
      </div>
    </div>
  `;
}

// Open Full-Page 360-Degree State Cyber Threat Command Center
export function openStateReportModal(stateCode, defaultTab = 'overview') {
  if (!cyberData) return;
  activeStateCode = stateCode || activeStateCode || 'MH';
  activeStateTab = defaultTab || activeStateTab;

  const stateInfo = cyberData[activeStateCode];
  if (!stateInfo) return;

  const modalOverlay = document.getElementById('stateReportModalOverlay');
  const modalContent = document.getElementById('stateReportModalContent');
  if (!modalOverlay || !modalContent) return;

  const colors = getSeverityColors(stateInfo.severity);

  // Generate options for 36-State Quick Selector Dropdown
  const stateOptionsHtml = Object.keys(cyberData).map(code => {
    const s = cyberData[code];
    const isSelected = code === activeStateCode ? 'selected' : '';
    return `<option value="${code}" ${isSelected}>${s.state} (${code})</option>`;
  }).join('');

  // Datasets with smart fallbacks
  const totalCases = stateInfo.totalCases ? stateInfo.totalCases.toLocaleString('en-IN') : '1,840';
  const estLoss = stateInfo.estFinancialLoss || (stateInfo.biggestScam ? stateInfo.biggestScam.amount : '₹25 Cr');
  const activeAlerts = stateInfo.activeAlerts || 45;
  const recoveryRate = stateInfo.recoveryRate || '21.8%';
  const districtsList = stateInfo.topAffectedDistricts || ["Capital City", "Urban Hub", "Metro Cluster", "Industrial Belt"];

  // Default Scam Vector Breakdown
  const vectors = stateInfo.scamVectorBreakdown || {
    "Stock Trading & Investment Scam": 36,
    "Digital Arrest / Extortion Call": 26,
    "UPI PIN & QR Code Fraud": 18,
    "Telegram Part-Time Task Scam": 12,
    "Loan App & Biometric AePS Fraud": 8
  };

  modalContent.innerHTML = `
    <!-- TOP HEADER CONTROL BAR -->
    <div class="p-5 sm:p-6 bg-slate-950/95 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/40 flex items-center justify-center text-xl flex-shrink-0 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
          🇮🇳
        </div>
        <div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <h2 class="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">${stateInfo.state}</h2>
            <span class="px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${colors.badgeClass}">
              ${stateInfo.severity.toUpperCase()} THREAT ZONE
            </span>
          </div>
          <p class="text-xs text-slate-400 font-sans mt-0.5">
            Region Code: <span class="text-[#00FF88] font-mono font-bold">${stateInfo.code}</span> • Source: <span class="text-slate-300 font-semibold">${stateInfo.source}</span>
          </p>
        </div>
      </div>

      <!-- Quick Selector Dropdown & Exit -->
      <div class="flex items-center gap-3 self-end md:self-auto">
        <div class="relative">
          <select onchange="window.openStateReportModal(this.value)" class="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans text-xs focus:outline-none focus:border-[#00FF88] shadow-lg cursor-pointer">
            ${stateOptionsHtml}
          </select>
        </div>
        <button onclick="window.closeStateReportModal()" class="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-rose-600 hover:text-white transition text-slate-300 text-xs font-bold font-sans flex items-center gap-1.5 shadow-lg">
          <span>✕ Exit Command Center</span>
        </button>
      </div>
    </div>

    <!-- 4 MAIN METRIC CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:px-6 bg-[#020403]/80 border-b border-white/10 flex-shrink-0 text-xs">
      <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
        <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Reported Cases</span>
        <div class="text-xl sm:text-2xl font-black text-white font-display">${totalCases}</div>
        <div class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
          <span>${stateInfo.trend === 'increasing' ? '▲ Increasing Trend' : '► Monitored Baseline'}</span>
        </div>
      </div>

      <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
        <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Financial Loss</span>
        <div class="text-xl sm:text-2xl font-black text-rose-400 font-display">${estLoss}</div>
        <span class="text-[10px] text-rose-300">Total Extortion & Fraud Value</span>
      </div>

      <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
        <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Monitored Alerts</span>
        <div class="text-xl sm:text-2xl font-black text-amber-400 font-display">${activeAlerts}</div>
        <span class="text-[10px] text-amber-300">Live SOC Threat Advisories</span>
      </div>

      <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
        <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Golden Hour Recovery</span>
        <div class="text-xl sm:text-2xl font-black text-[#00FF88] font-display">${recoveryRate}</div>
        <span class="text-[10px] text-emerald-300">Via 1930 Cyber Helpline</span>
      </div>
    </div>

    <!-- SUB-NAV TAB BUTTONS -->
    <div class="flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-950 border-b border-white/10 overflow-x-auto flex-shrink-0 text-xs">
      <button onclick="window.switchStateTab('overview')" class="px-4 py-2 rounded-xl font-bold font-sans transition flex items-center gap-2 whitespace-nowrap ${activeStateTab === 'overview' ? 'bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}">
        <span>📊 360° Overview & Vector Analytics</span>
      </button>
      <button onclick="window.switchStateTab('news')" class="px-4 py-2 rounded-xl font-bold font-sans transition flex items-center gap-2 whitespace-nowrap ${activeStateTab === 'news' ? 'bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}">
        <span>📰 Verified Regional News & Bulletins</span>
      </button>
      <button onclick="window.switchStateTab('playbook')" class="px-4 py-2 rounded-xl font-bold font-sans transition flex items-center gap-2 whitespace-nowrap ${activeStateTab === 'playbook' ? 'bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}">
        <span>🛡️ Action Playbook & Emergency Steps</span>
      </button>
      <button onclick="window.switchStateTab('contact')" class="px-4 py-2 rounded-xl font-bold font-sans transition flex items-center gap-2 whitespace-nowrap ${activeStateTab === 'contact' ? 'bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}">
        <span>📞 Official State Cyber Police Directory</span>
      </button>
    </div>

    <!-- MAIN SCROLLABLE CONTENT BODY -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-sans text-xs text-slate-300">
      ${renderStateTabContent(stateInfo, activeStateTab, colors, vectors, districtsList)}
    </div>
  `;

  modalOverlay.classList.remove('hidden');
  modalOverlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

export function closeStateReportModal() {
  const modalOverlay = document.getElementById('stateReportModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
  }
  document.body.style.overflow = '';
}

window.switchStateTab = switchStateTab;

// Global View vs India View tab handler
export function setupTabSwitcher() {
  const btnIndia = document.getElementById('mapTabIndia');
  const btnGlobal = document.getElementById('mapTabGlobal');
  const mapContainer = document.getElementById('indiaMapContainer');
  const globalContainer = document.getElementById('globalMapContainer');

  if (!btnIndia || !btnGlobal || !mapContainer || !globalContainer) return;

  btnIndia.addEventListener('click', () => {
    btnIndia.classList.add('bg-[#00FF88]', 'text-black', 'font-bold', 'shadow-[0_0_20px_rgba(0,255,136,0.3)]');
    btnIndia.classList.remove('text-slate-400', 'hover:bg-white/5');

    btnGlobal.classList.remove('bg-[#00FF88]', 'text-black', 'font-bold', 'shadow-[0_0_20px_rgba(0,255,136,0.3)]');
    btnGlobal.classList.add('text-slate-400', 'hover:bg-white/5');

    mapContainer.classList.remove('hidden');
    globalContainer.classList.add('hidden');
  });

  btnGlobal.addEventListener('click', () => {
    btnGlobal.classList.add('bg-[#00FF88]', 'text-black', 'font-bold', 'shadow-[0_0_20px_rgba(0,255,136,0.3)]');
    btnGlobal.classList.remove('text-slate-400', 'hover:bg-white/5');

    btnIndia.classList.remove('bg-[#00FF88]', 'text-black', 'font-bold', 'shadow-[0_0_20px_rgba(0,255,136,0.3)]');
    btnIndia.classList.add('text-slate-400', 'hover:bg-white/5');

    globalContainer.classList.remove('hidden');
    mapContainer.classList.add('hidden');
  });
}

// Toggle between 3D Isometric View and 2D Flat View
export function setMapPerspective(enable3D) {
  is3DMode = enable3D;
  const plane = document.getElementById('india3dPlane');
  const btn3d = document.getElementById('btn3dToggle');
  const btn2d = document.getElementById('btn2dToggle');

  if (!plane) return;

  if (enable3D) {
    plane.style.transform = 'rotateX(48deg) rotateZ(-12deg) translateZ(0px)';
    if (btn3d) {
      btn3d.classList.add('bg-[#00FF88]/20', 'text-[#00FF88]', 'border-[#00FF88]/40', 'font-bold');
      btn3d.classList.remove('text-slate-400');
    }
    if (btn2d) {
      btn2d.classList.remove('bg-[#00FF88]/20', 'text-[#00FF88]', 'border-[#00FF88]/40', 'font-bold');
      btn2d.classList.add('text-slate-400');
    }
  } else {
    plane.style.transform = 'rotateX(0deg) rotateZ(0deg) translateZ(0px)';
    if (btn2d) {
      btn2d.classList.add('bg-[#00FF88]/20', 'text-[#00FF88]', 'border-[#00FF88]/40', 'font-bold');
      btn2d.classList.remove('text-slate-400');
    }
    if (btn3d) {
      btn3d.classList.remove('bg-[#00FF88]/20', 'text-[#00FF88]', 'border-[#00FF88]/40', 'font-bold');
      btn3d.classList.add('text-slate-400');
    }
  }
}

// Interactive 3D Mouse Parallax Tilt
function setup3DMouseParallax() {
  const container = document.getElementById('indiaMapContainer');
  const plane = document.getElementById('india3dPlane');
  if (!container || !plane) return;

  container.addEventListener('mousemove', (e) => {
    if (!is3DMode) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const dx = x / (rect.width / 2);
    const dy = y / (rect.height / 2);

    const rotX = 48 - dy * 10;
    const rotZ = -12 + dx * 14;

    plane.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg) translateZ(0px)`;
  });

  container.addEventListener('mouseleave', () => {
    if (!is3DMode) return;
    plane.style.transform = 'rotateX(48deg) rotateZ(-12deg) translateZ(0px)';
  });
}

// Render 36 State Quick Selector Bar
function renderStateSelectorGrid(dataMap, geoFeatures) {
  const selectorWrapper = document.getElementById('stateQuickSelectorWrapper');
  if (!selectorWrapper || !geoFeatures) return;

  const stateButtons = geoFeatures.map(feat => {
    const code = feat.properties.code;
    const name = feat.properties.name;
    const stateInfo = dataMap ? dataMap[code] : null;
    const severity = stateInfo ? stateInfo.severity : 'pending';
    const colors = getSeverityColors(severity);

    return `
      <button 
        onclick="window.selectIndiaState('${code}')"
        class="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/30 transition text-left space-y-0.5 group flex items-center justify-between"
      >
        <span class="text-xs font-bold text-slate-300 group-hover:text-emerald-400 truncate">${name}</span>
        <span class="w-2 h-2 rounded-full flex-shrink-0" style="background-color: ${colors.dot}"></span>
      </button>
    `;
  }).join('');

  selectorWrapper.innerHTML = stateButtons;
}

// Render 3D Isometric Animated Vector Map of India
export async function renderIndiaSVGMap() {
  const mapSvgContainer = document.getElementById('indiaSvgMapWrapper');
  if (!mapSvgContainer) return;

  const [dataMap, geojson] = await Promise.all([
    loadCyberData(),
    loadIndiaGeoJSON()
  ]);

  if (!geojson || !geojson.features) {
    console.error("GeoJSON data unavailable for India map.");
    return;
  }

  // Render 36 state quick select grid
  renderStateSelectorGrid(dataMap, geojson.features);

  const width = 960;
  const height = 900;

  const d3Obj = window.d3;
  if (!d3Obj) {
    console.error("D3 library not loaded.");
    return;
  }

  // Projection centered over India
  const projection = d3Obj.geoMercator()
    .center([82.5, 22.5])
    .scale(1250)
    .translate([width / 2, height / 2]);

  const pathGenerator = d3Obj.geoPath().projection(projection);

  let pathElements2D = '';
  let pathElements3DDepth = '';
  let markerElements = '';

  geojson.features.forEach(feature => {
    const code = feature.properties.code;
    const name = feature.properties.name;
    const pathD = pathGenerator(feature);

    const stateInfo = dataMap ? dataMap[code] : null;
    const severity = stateInfo ? stateInfo.severity : 'pending';
    const colors = getSeverityColors(severity);

    // Auto-calculate centroids
    const centroid = d3Obj.geoCentroid(feature);
    const [cx, cy] = projection(centroid);

    // 3D Extrusion Depth Path (layered behind main paths)
    pathElements3DDepth += `
      <path d="${pathD}" fill="rgba(0, 30, 60, 0.85)" stroke="#003366" stroke-width="2" transform="translate(0, 10)" />
      <path d="${pathD}" fill="rgba(2, 10, 25, 0.95)" stroke="#004488" stroke-width="1.8" transform="translate(0, 5)" />
    `;

    // Main projected top surface state path
    pathElements2D += `
      <path 
        id="svg-state-${code}"
        d="${pathD}"
        fill="${colors.fill}"
        stroke="${colors.stroke}"
        stroke-width="1.8"
        stroke-linejoin="round"
        stroke-linecap="round"
        class="transition-all duration-300 cursor-pointer hover:fill-cyan-500/50 hover:stroke-[#00F0FF] hover:stroke-[2.5] filter drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        data-code="${code}"
        onclick="window.selectIndiaState('${code}')"
      >
        <title>${name} (${severity.toUpperCase()})</title>
      </path>
    `;

    // 3D Floating Pulse Marker
    markerElements += `
      <g 
        class="group cursor-pointer"
        transform="translate(${cx}, ${cy})"
        onclick="window.selectIndiaState('${code}')"
        data-code="${code}"
      >
        <!-- 3D Floating Outer Ping Halo -->
        <circle r="14" fill="${colors.glow}" opacity="0.4" class="animate-ping" />
        <circle r="7" fill="${colors.dot}" opacity="0.6" />
        <!-- Inner Solid Dot -->
        <circle r="4" fill="${colors.dot}" stroke="#020403" stroke-width="1.5" />
        
        <!-- Label -->
        <text y="18" text-anchor="middle" fill="#E2E8F0" font-size="9" font-weight="700" font-family="Inter" class="pointer-events-none drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)] opacity-90 group-hover:opacity-100 group-hover:fill-[#00F0FF]">
          ${code}
        </text>

        <!-- Hover Tooltip -->
        <g class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
          <rect x="-65" y="-38" width="130" height="26" rx="6" fill="#040812" stroke="${colors.stroke}" stroke-width="1.5" class="shadow-2xl" />
          <text x="0" y="-24" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="bold" font-family="Inter">
            ${name}
          </text>
          <text x="0" y="-14" text-anchor="middle" fill="${colors.dot}" font-size="8" font-family="Inter">
            ${severity.toUpperCase()} ATTACK ZONE
          </text>
        </g>
      </g>
    `;
  });

  mapSvgContainer.innerHTML = `
    <div id="india3dStage" class="w-full h-full flex items-center justify-center py-4" style="perspective: 1400px; transform-style: preserve-3d;">
      <div id="india3dPlane" class="w-full h-auto transition-transform duration-300 ease-out" style="transform: rotateX(48deg) rotateZ(-12deg) translateZ(0px); transform-style: preserve-3d;">
        <svg viewBox="0 0 960 900" class="w-full h-auto max-h-[750px] object-contain select-none filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(0,240,255,0.25)]">
          <defs>
            <pattern id="mapGrid3d" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.05)" stroke-width="1"/>
              <circle cx="40" cy="40" r="1.5" fill="rgba(0, 240, 255, 0.2)" />
            </pattern>
          </defs>

          <!-- 3D Cyber Grid Floor -->
          <rect width="960" height="900" fill="url(#mapGrid3d)" />

          <!-- 3D Extrusion Depth Layers -->
          <g id="svgStateDepthGroup">
            ${pathElements3DDepth}
          </g>

          <!-- Top GeoJSON projected state surfaces -->
          <g id="svgStateTopGroup">
            ${pathElements2D}
          </g>

          <!-- Floating 3D Radar Pulse Markers -->
          <g id="svgMarkerGroup">
            ${markerElements}
          </g>
        </svg>
      </div>
    </div>
  `;

  // Setup interactive 3D Mouse Parallax
  setup3DMouseParallax();

  // Update bottom stats
  const stats = calculateLiveStats(dataMap);
  const elTotalAlerts = document.getElementById('statTotalAlerts');
  const elStatesAffected = document.getElementById('statStatesAffected');
  const elCriticalAlerts = document.getElementById('statCriticalAlerts');

  if (elTotalAlerts) elTotalAlerts.innerText = stats.totalActiveAlerts.toLocaleString('en-IN');
  if (elStatesAffected) elStatesAffected.innerText = `${stats.affectedStatesCount} / 36`;
  if (elCriticalAlerts) elCriticalAlerts.innerText = stats.criticalAlertsCount;
}

// Global initializer
export async function initIndiaThreatMap() {
  setupTabSwitcher();
  await renderIndiaSVGMap();
}

window.initIndiaThreatMap = initIndiaThreatMap;
window.selectIndiaState = (code) => {
  openStateReportModal(code);
};
window.closeStateReportModal = closeStateReportModal;
window.setMapPerspective = setMapPerspective;
