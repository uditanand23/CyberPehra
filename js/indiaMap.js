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

// Open State Report Modal
export function openStateReportModal(stateCode) {
  if (!cyberData) return;
  const stateInfo = cyberData[stateCode];
  if (!stateInfo) return;

  const modalOverlay = document.getElementById('stateReportModalOverlay');
  const modalContent = document.getElementById('stateReportModalContent');
  if (!modalOverlay || !modalContent) return;

  const colors = getSeverityColors(stateInfo.severity);
  const isPending = stateInfo.isPending;

  modalContent.innerHTML = `
    <div class="p-6 sm:p-8 space-y-6 text-white font-sans">
      <!-- Header -->
      <div class="flex items-start justify-between border-b border-white/10 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="text-2xl font-bold font-display tracking-tight text-white">${stateInfo.state}</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold font-sans border ${colors.badgeClass} uppercase">
              ${isPending ? 'Data Pending' : stateInfo.severity + ' severity'}
            </span>
          </div>
          <p class="text-xs text-slate-400 font-sans">Region Code: <span class="text-emerald-400 font-mono font-bold">${stateInfo.code}</span> • ${stateInfo.source}</p>
        </div>
        <button onclick="window.closeStateReportModal()" class="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-slate-400 hover:text-white" aria-label="Close modal">
          ✕
        </button>
      </div>

      ${isPending ? `
        <div class="p-6 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-3 text-center">
          <span class="text-3xl">⏳</span>
          <h4 class="text-base font-bold text-amber-300">Verified Regional Telemetry Pending</h4>
          <p class="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Detailed state-wise cyber crime statistics for <strong>${stateInfo.state}</strong> are currently pending official publication in the upcoming NCRB / I4C quarterly dataset.
          </p>
          <div class="pt-2">
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Source Notice: ${stateInfo.source}
            </span>
          </div>
        </div>
      ` : `
        <!-- Main Stats 3-Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span class="text-[11px] text-slate-400 font-medium">Total Cyber Crime Cases</span>
            <div class="text-2xl font-bold text-white font-display">${stateInfo.totalCases ? stateInfo.totalCases.toLocaleString('en-IN') : 'N/A'}</div>
            <div class="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span>${stateInfo.trend === 'increasing' ? '▲ Increasing Trend' : stateInfo.trend === 'decreasing' ? '▼ Decreasing' : '► Stable'}</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span class="text-[11px] text-slate-400 font-medium">Active Alerts</span>
            <div class="text-2xl font-bold text-amber-400 font-display">${stateInfo.activeAlerts}</div>
            <span class="text-[10px] text-slate-500">Monitored live</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span class="text-[11px] text-slate-400 font-medium">Most Common Scam</span>
            <div class="text-sm font-bold text-emerald-400 truncate">${stateInfo.commonScamType}</div>
            <span class="text-[10px] text-slate-400">High frequency</span>
          </div>
        </div>

        <!-- Biggest Scam Highlight Box -->
        <div class="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border border-rose-800/40 flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <span class="text-[10px] font-bold text-rose-400 uppercase tracking-wider">⚠️ Largest Reported Scam Incident</span>
            <div class="text-sm font-bold text-white">${stateInfo.biggestScam.type}</div>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400">Approx. Value</span>
            <div class="text-lg font-bold text-rose-400 font-mono">${stateInfo.biggestScam.amount}</div>
          </div>
        </div>

        <!-- 6-Month Trend Chart -->
        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-300">📊 6-Month Incident Trajectory</span>
            <span class="text-[10px] text-slate-500">Feb 2026 – Jul 2026</span>
          </div>
          ${renderSixMonthSvgChart(stateInfo.sixMonthTrend)}
        </div>

        <!-- Recent Incident Summaries -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span class="text-emerald-400">⚡</span> Recent Verified Bulletins:
          </span>
          <ul class="space-y-2">
            ${stateInfo.recentIncidents.map(inc => `
              <li class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                <span class="text-emerald-400 text-sm flex-shrink-0">✦</span>
                <span>${inc}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `}

      <!-- Footer Source Note -->
      <div class="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-400 font-sans">
        <div>
          <span>Data updated as of: </span>
          <strong class="text-slate-200">${stateInfo.lastUpdated}</strong>
        </div>
        <div>
          <span>Source: </span>
          <strong class="text-emerald-400">${stateInfo.source}</strong>
        </div>
      </div>
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
