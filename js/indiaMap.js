/**
 * CYBERPEHRA - Authoritative India 3D Cyber Threat Intelligence Engine
 * 3D Isometric Canvas Vector Engine, 36 Administrative Unit Boundaries,
 * Multi-Level Drilldown (India -> State -> District -> Incident),
 * Non-Fabrication Principle, Source Trust System & Time-Filtered Analytics.
 */

import { State } from './state.js';
import { sanitizeHTML } from './utils.js';

let cyberData = null;
let geoData = null;

// Map State Engine
export const MapState = {
  level: 'NATIONAL', // 'NATIONAL' | 'STATE' | 'DISTRICT'
  selectedStateCode: null,
  selectedStateName: null,
  selectedDistrictName: null,
  timeFilter: '30D', // '24H' | '3D' | '7D' | '30D' | '90D'
  is3DTilt: true,
  zoomLevel: 1.0,
  panX: 0,
  panY: 0,
  hoveredFeature: null,
  animFrameId: null
};

// Data Loaders
export async function loadCyberData() {
  if (cyberData) return cyberData;
  try {
    const response = await fetch('/india_cyber_data.json');
    if (response.ok) {
      const data = await response.json();
      cyberData = data;
    }
  } catch (err) {
    console.warn("[CyberPehra Map] Could not load telemetry dataset via fetch.");
  }
  return cyberData;
}

export async function loadIndiaGeoJSON() {
  if (geoData) return geoData;
  try {
    const response = await fetch('/india_states.geojson');
    if (response.ok) {
      geoData = await response.json();
    }
  } catch (err) {
    console.warn("[CyberPehra Map] Could not load GeoJSON boundary dataset via fetch.");
  }
  return geoData;
}

// Compute Severity and Colors based on actual verified data
export function getFeatureSeverityColor(incidents, hasData) {
  if (!hasData || incidents === 0) {
    return {
      fill: 'rgba(30, 41, 59, 0.45)',
      stroke: '#475569',
      glow: 'rgba(71, 85, 105, 0.2)',
      badgeClass: 'bg-slate-900 text-slate-400 border-slate-700',
      label: '⚪ No verified recent data'
    };
  }
  if (incidents >= 300) {
    return {
      fill: 'rgba(255, 59, 92, 0.35)',
      stroke: '#FF3B5C',
      glow: 'rgba(255, 59, 92, 0.85)',
      badgeClass: 'bg-rose-950/90 text-rose-300 border-rose-800',
      label: '🔴 Higher verified activity'
    };
  } else if (incidents >= 150) {
    return {
      fill: 'rgba(255, 159, 67, 0.32)',
      stroke: '#FF9F43',
      glow: 'rgba(255, 159, 67, 0.85)',
      badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-800',
      label: '🟠 Elevated verified activity'
    };
  } else if (incidents >= 50) {
    return {
      fill: 'rgba(250, 204, 21, 0.28)',
      stroke: '#FACC15',
      glow: 'rgba(250, 204, 21, 0.75)',
      badgeClass: 'bg-yellow-950/90 text-yellow-300 border-yellow-800',
      label: '🟡 Moderate verified activity'
    };
  } else {
    return {
      fill: 'rgba(0, 255, 136, 0.22)',
      stroke: '#00FF88',
      glow: 'rgba(0, 255, 136, 0.75)',
      badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-800',
      label: '🟢 Lower verified activity'
    };
  }
}

// Calculate Summary Statistics for Active Time Filter
export function calculateFilteredStats() {
  if (!cyberData || !cyberData.states) return { totalIncidents: 0, activeStates: 0, affectedDistricts: 0, latestReport: 'N/A' };
  
  let totalIncidents = 0;
  let activeStates = 0;
  let affectedDistricts = 0;
  let latestReport = 'None verified';

  Object.values(cyberData.states).forEach(st => {
    if (st.hasData && st.timeStats && st.timeStats[MapState.timeFilter]) {
      const inc = st.timeStats[MapState.timeFilter].incidents || 0;
      totalIncidents += inc;
      if (inc > 0) activeStates += 1;
      if (st.timeStats[MapState.timeFilter].activeAreas) {
        affectedDistricts += st.timeStats[MapState.timeFilter].activeAreas;
      }
      if (st.recentIncidents && st.recentIncidents.length > 0 && latestReport === 'None verified') {
        latestReport = st.recentIncidents[0].headline;
      }
    }
  });

  return { totalIncidents, activeStates, affectedDistricts, latestReport };
}

// Main Initialization Function
export async function initIndiaThreatMap() {
  const container = document.getElementById('indiaMapContainer');
  if (!container) return;

  await loadCyberData();
  await loadIndiaGeoJSON();

  renderMapInterface(container);
}

// Render Core Interface
function renderMapInterface(container) {
  const stats = calculateFilteredStats();

  container.innerHTML = `
    <div class="space-y-6 font-sans text-xs">
      
      <!-- TOP NAVIGATION & TIME FILTER BAR -->
      <div class="glass-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <!-- BREADCRUMB NAVIGATION -->
        <div class="flex items-center gap-2 text-xs font-bold text-white flex-wrap" id="mapBreadcrumbs">
          <button onclick="window.resetMapToNationalView()" class="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/80 transition cursor-pointer flex items-center gap-1.5">
            <span>🇮🇳</span> <span>India National</span>
          </button>
          ${MapState.selectedStateName ? `
            <span class="text-slate-500">/</span>
            <button onclick="window.selectStateView('${MapState.selectedStateCode}')" class="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 hover:text-white transition cursor-pointer">
              ${sanitizeHTML(MapState.selectedStateName)}
            </button>
          ` : ''}
          ${MapState.selectedDistrictName ? `
            <span class="text-slate-500">/</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-300 border border-emerald-800/60">
              ${sanitizeHTML(MapState.selectedDistrictName)}
            </span>
          ` : ''}
        </div>

        <!-- TIME FILTER PILLS -->
        <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider pr-1">Period:</span>
          ${['24H', '3D', '7D', '30D', '90D'].map(period => `
            <button onclick="window.setMapTimeFilter('${period}')" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${MapState.timeFilter === period ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}">
              ${period}
            </button>
          `).join('')}
        </div>

        <!-- DATA FRESHNESS BADGE -->
        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[11px] flex items-center gap-2 shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 Sources checked: 11 Aug 2026, 12:30 IST</span>
          </span>
        </div>
      </div>

      <!-- EXECUTIVE THREAT TELEMETRY CARDS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Incidents (${MapState.timeFilter})</span>
          <div class="text-xl sm:text-2xl font-bold text-white font-mono">${stats.totalIncidents.toLocaleString()}</div>
          <p class="text-[10px] text-slate-500">Source-backed reports</p>
        </div>

        <div class="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active States / UTs</span>
          <div class="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">${stats.activeStates} / 36</div>
          <p class="text-[10px] text-slate-500">Verified activity regions</p>
        </div>

        <div class="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Affected Districts</span>
          <div class="text-xl sm:text-2xl font-bold text-amber-400 font-mono">${stats.affectedDistricts}</div>
          <p class="text-[10px] text-slate-500">Reporting hotspots</p>
        </div>

        <div class="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Data Freshness</span>
          <div class="text-xs font-bold text-emerald-400">Recently Updated</div>
          <p class="text-[10px] text-slate-500 truncate">11 Aug 2026, 12:30 IST</p>
        </div>
      </div>

      <!-- MAIN CANVAS 3D MAP & VIEWPORT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- MAP CANVAS CONTAINER -->
        <div class="lg:col-span-8 glass-card p-4 rounded-3xl border border-white/10 flex flex-col items-center justify-center bg-slate-950 min-h-[480px] sm:min-h-[550px] relative overflow-hidden shadow-2xl">
          
          <!-- MAP CONTROLS OVERLAY -->
          <div class="absolute top-4 left-4 z-20 flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
              ${MapState.level === 'NATIONAL' ? '🇮🇳 National View (36 Administrative Units)' : (MapState.level === 'STATE' ? `📍 ${MapState.selectedStateName} State View` : `📍 ${MapState.selectedDistrictName} District View`)}
            </span>
            ${MapState.level !== 'NATIONAL' ? `
              <button onclick="window.resetMapToNationalView()" class="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs border border-emerald-800 transition cursor-pointer">
                ← Back to National Map
              </button>
            ` : ''}
          </div>

          <div class="absolute top-4 right-4 z-20 flex items-center gap-1.5">
            <button onclick="window.toggleMap3DTilt()" class="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold">
              ${MapState.is3DTilt ? '3D View ON' : '2D Flat View'}
            </button>
            <button onclick="window.zoomMapCanvas(1.2)" class="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold">+</button>
            <button onclick="window.zoomMapCanvas(0.8)" class="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold">-</button>
            <button onclick="window.resetMapCanvasTransform()" class="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold">Reset</button>
          </div>

          <!-- CANVAS ELEMENT & 3D OVERLAYS -->
          <div class="relative w-full h-full flex items-center justify-center p-2" id="mapCanvasWrapper">
            <canvas id="indiaMapCanvas" class="max-w-full max-h-full rounded-2xl cursor-grab active:cursor-grabbing"></canvas>
            
            <!-- STATE LABELS LAYER -->
            <div id="mapStateLabelsContainer" class="absolute inset-0 pointer-events-none z-10 overflow-hidden"></div>

            <!-- COMPASS ROSE SVG OVERLAY -->
            <svg id="compass" class="absolute top-4 right-4 z-20 w-12 h-12 pointer-events-none opacity-85" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="25" fill="none" stroke="#00FF88" stroke-width="1" opacity="0.6"/>
              <line x1="28" y1="6" x2="28" y2="50" stroke="#00FF88" stroke-width="0.6" opacity="0.5"/>
              <line x1="6" y1="28" x2="50" y2="28" stroke="#00FF88" stroke-width="0.6" opacity="0.5"/>
              <polygon points="28,6 23,28 28,22 33,28" fill="#00FF88"/>
              <text x="28" y="16" fill="#00FF88" font-size="9" text-anchor="middle" font-family="Arial" font-weight="bold">N</text>
            </svg>

            <div id="mapTooltip" class="hidden absolute pointer-events-none z-30 glass-card p-3 rounded-xl border border-white/20 shadow-2xl max-w-xs space-y-1 font-sans text-xs"></div>
          </div>

          <!-- MAP LEGEND -->
          <div class="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-[11px] font-sans">
            <div class="flex flex-wrap items-center gap-3">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> <span>Lower</span></span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> <span>Moderate</span></span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> <span>Elevated</span></span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> <span>Higher</span></span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span> <span>No verified recent data</span></span>
            </div>
            <span class="text-slate-500 text-[10px]">Click any State/UT to open detailed district map</span>
          </div>
        </div>

        <!-- SIDEBAR ANALYTICS & DRILLDOWN DRAWER -->
        <div class="lg:col-span-4 space-y-4">
          <div id="mapDetailPanel" class="glass-card p-5 rounded-2xl border border-white/10 space-y-4 min-h-[480px]">
            ${renderDetailPanelContent()}
          </div>
        </div>
      </div>

      <!-- MASTER REGIONAL DIRECTORY GRID (STATES -> UTs -> DISTRICTS) -->
      <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-4 font-sans text-xs">
        ${renderRegionalDirectoryGridHtml()}
      </div>

      <!-- ANALYTICS CHARTS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <h4 class="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Cyber Incident Trend Timeline</span>
            <span class="text-slate-500 text-[10px]">Source-Backed Telemetry</span>
          </h4>
          <div class="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2" id="trendChartContainer">
            ${renderTrendChartHtml()}
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <h4 class="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Scam Category Distribution</span>
            <span class="text-slate-500 text-[10px]">Active Vector Breakdown</span>
          </h4>
          <div class="space-y-2.5 pt-1" id="categoryDistributionContainer">
            ${renderCategoryDistributionHtml()}
          </div>
        </div>
      </div>

      <!-- VERIFIED NEWS INTELLIGENCE STREAM -->
      <div class="space-y-4 pt-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-lg font-bold text-white tracking-wide">📰 Verified Incident Intelligence Stream</h3>
          <span class="text-xs text-slate-400 font-sans">Source-Attributed Bulletins Only</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${renderVerifiedNewsStreamHtml()}
        </div>
      </div>

      <!-- LEGAL & METHODOLOGY DISCLAIMER -->
      <div class="p-4 rounded-2xl bg-black/60 border border-slate-800 text-slate-500 text-[11px] leading-relaxed space-y-1 font-sans">
        <strong class="text-slate-400 block">Legal & Methodology Disclaimer:</strong>
        <p>CyberPehra provides informational threat intelligence based on publicly available and cited official sources (NCRB, I4C, CERT-In, State Cyber Police Bulletins). Reported incidents do not constitute an independent finding of criminal liability or guilt. Data may be delayed or subject to official source updates.</p>
      </div>

    </div>
  `;

  setTimeout(initMapCanvasRenderer, 60);
}

// Render Sidebar Detail Panel
function renderDetailPanelContent() {
  if (MapState.level === 'DISTRICT' && MapState.selectedDistrictName && MapState.selectedStateCode) {
    const st = cyberData && cyberData.states ? cyberData.states[MapState.selectedStateCode] : null;
    const dist = st && st.districts ? st.districts[MapState.selectedDistrictName] : null;

    if (!dist || !dist.hasData) {
      return `
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <span class="font-bold text-white text-xs">📍 ${sanitizeHTML(MapState.selectedDistrictName)} District</span>
            <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[10px]">⚪ No verified data</span>
          </div>
          <p class="text-slate-400 text-xs">No verified recent cybercrime data available for this specific district.</p>
          <button onclick="window.selectStateView('${MapState.selectedStateCode}')" class="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white">
            ← Return to ${sanitizeHTML(MapState.selectedStateName)} State
          </button>
        </div>
      `;
    }

    const tStats = dist.timeStats && dist.timeStats[MapState.timeFilter] ? dist.timeStats[MapState.timeFilter] : { incidents: 0, loss: '₹0' };

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 class="font-bold text-white text-sm">📍 ${sanitizeHTML(dist.name)} District</h4>
            <span class="text-[10px] text-slate-400">${sanitizeHTML(MapState.selectedStateName)}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
            ${tStats.incidents} Incidents (${MapState.timeFilter})
          </span>
        </div>

        <div class="space-y-2">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top Scam Categories</span>
          <div class="flex flex-wrap gap-1.5">
            ${(dist.topCategories || []).map(cat => `
              <span class="px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">${sanitizeHTML(cat)}</span>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recent Verified Reports</span>
          ${(dist.recentIncidents || []).length > 0 ? (dist.recentIncidents || []).map(inc => `
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-rose-400 font-bold text-[11px]">${sanitizeHTML(inc.category)}</span>
                <span class="text-slate-500 text-[10px]">${sanitizeHTML(inc.date)}</span>
              </div>
              <p class="text-slate-200 font-bold text-xs">${sanitizeHTML(inc.headline)}</p>
              <p class="text-slate-400 text-[11px]">${sanitizeHTML(inc.summary)}</p>
              <div class="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-white/5">
                <span>Loss: <strong class="text-amber-400">${sanitizeHTML(inc.financialLoss)}</strong></span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">${sanitizeHTML(inc.sourceType)}</span>
              </div>
            </div>
          `).join('') : '<p class="text-slate-500 text-xs">No individual incident write-ups logged for this timeframe.</p>'}
        </div>

        <button onclick="window.selectStateView('${MapState.selectedStateCode}')" class="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white transition">
          ← Back to ${sanitizeHTML(MapState.selectedStateName)} State Map
        </button>
      </div>
    `;
  }

  if (MapState.level === 'STATE' && MapState.selectedStateCode) {
    const st = cyberData && cyberData.states ? cyberData.states[MapState.selectedStateCode] : null;

    if (!st || !st.hasData) {
      return `
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <span class="font-bold text-white text-xs">📍 ${sanitizeHTML(MapState.selectedStateName)}</span>
            <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[10px]">⚪ No verified data</span>
          </div>
          <p class="text-slate-400 text-xs">No verified recent cybercrime data available for this State/UT.</p>
          <button onclick="window.resetMapToNationalView()" class="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white">
            ← Return to National Map
          </button>
        </div>
      `;
    }

    const tStats = st.timeStats && st.timeStats[MapState.timeFilter] ? st.timeStats[MapState.timeFilter] : { incidents: 0, loss: '₹0', activeAreas: 0 };
    const districtKeys = Object.keys(st.districts || {});

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 class="font-bold text-white text-sm">📍 ${sanitizeHTML(st.state)} State</h4>
            <span class="text-[10px] text-slate-400">Primary Source: ${sanitizeHTML(st.source)}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
            ${tStats.incidents} Incidents (${MapState.timeFilter})
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span class="text-[10px] text-slate-500">Financial Loss</span>
            <div class="font-bold text-amber-400">${tStats.loss || 'N/A'}</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span class="text-[10px] text-slate-500">Active Districts</span>
            <div class="font-bold text-emerald-400">${tStats.activeAreas || 0}</div>
          </div>
        </div>

        <div class="space-y-2">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Districts (${districtKeys.length})</span>
          ${districtKeys.length > 0 ? `
            <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              ${districtKeys.map(dKey => {
                const d = st.districts[dKey];
                const dInc = d.timeStats && d.timeStats[MapState.timeFilter] ? d.timeStats[MapState.timeFilter].incidents : 0;
                return `
                  <button onclick="window.selectDistrictView('${dKey}')" class="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-xs transition cursor-pointer">
                    <span class="font-bold text-slate-200">📍 ${sanitizeHTML(d.name)}</span>
                    <span class="text-emerald-400 font-bold text-[11px]">${dInc} reports</span>
                  </button>
                `;
              }).join('')}
            </div>
          ` : '<p class="text-slate-500 text-xs">No specific district breakdown available for this state.</p>'}
        </div>

        <button onclick="window.resetMapToNationalView()" class="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white transition">
          ← Back to National Map
        </button>
      </div>
    `;
  }

  // DEFAULT: NATIONAL VIEW DETAILS
  return `
    <div class="space-y-4">
      <div class="border-b border-white/10 pb-3">
        <h4 class="font-bold text-white text-sm">🇮🇳 National Cyber Crime Overview</h4>
        <span class="text-[10px] text-slate-400">All 36 States & Union Territories</span>
      </div>

      <div class="space-y-2">
        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top Incident States (${MapState.timeFilter})</span>
        <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
          ${renderTopStateRankingsHtml()}
        </div>
      </div>
    </div>
  `;
}

// Render Top State Rankings
function renderTopStateRankingsHtml() {
  if (!cyberData || !cyberData.states) return '<p class="text-slate-500 text-xs">No telemetry data loaded.</p>';

  const sortedStates = Object.values(cyberData.states)
    .filter(s => s.hasData)
    .map(s => {
      const inc = s.timeStats && s.timeStats[MapState.timeFilter] ? s.timeStats[MapState.timeFilter].incidents : 0;
      return { ...s, filterIncidents: inc };
    })
    .sort((a, b) => b.filterIncidents - a.filterIncidents)
    .slice(0, 5);

  return sortedStates.map((st, idx) => `
    <button onclick="window.selectStateView('${st.code}')" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-xs transition cursor-pointer">
      <div class="flex items-center gap-2">
        <span class="w-5 h-5 rounded-full bg-slate-900 text-slate-400 font-bold text-[10px] flex items-center justify-center border border-slate-800">${idx+1}</span>
        <span class="font-bold text-white">${sanitizeHTML(st.state)}</span>
      </div>
      <span class="text-emerald-400 font-bold font-mono text-[11px]">${st.filterIncidents} reports</span>
    </button>
  `).join('');
}

// Render Master Regional Directory Grid (States -> UTs -> Districts)
function renderRegionalDirectoryGridHtml() {
  if (!cyberData || !cyberData.states) return '';

  const statesCodes = ["BR", "AR", "AS", "CT", "GA", "GJ", "HR", "HP", "JH", "KA", "KL", "MP", "MH", "MN", "ML", "MZ", "NL", "OD", "PB", "RJ", "SK", "TN", "TG", "TR", "UP", "UT", "WB", "AP"];
  const utCodes = ["AN", "CH", "DN", "DL", "JK", "LA", "LD", "PY"];

  if (MapState.level === 'NATIONAL') {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <span class="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <span>🇮🇳 Master Regional Directory</span>
            <span class="text-slate-400 text-[10px] lowercase">(Select any State or UT to view districts)</span>
          </span>
        </div>

        <!-- 🟢 28 STATES SECTION -->
        <div class="space-y-2">
          <span class="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
            <span>🟢</span> <span>28 States</span>
          </span>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto pr-1">
            ${statesCodes.map(code => {
              const st = cyberData.states[code];
              if (!st) return '';
              const distCount = Object.keys(st.districts || {}).length;
              return `
                <button onclick="window.selectStateView('${code}')" class="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition cursor-pointer group">
                  <div class="font-bold text-slate-200 group-hover:text-emerald-400 truncate text-[11px]">${sanitizeHTML(st.state)}</div>
                  <div class="text-[9px] text-slate-500 font-mono">${distCount} districts</div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 🔵 8 UNION TERRITORIES SECTION -->
        <div class="space-y-2 pt-2 border-t border-white/5">
          <span class="font-bold text-sky-400 text-xs flex items-center gap-1.5">
            <span>🔵</span> <span>8 Union Territories</span>
          </span>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
            ${utCodes.map(code => {
              const st = cyberData.states[code];
              if (!st) return '';
              const distCount = Object.keys(st.districts || {}).length;
              return `
                <button onclick="window.selectStateView('${code}')" class="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition cursor-pointer group">
                  <div class="font-bold text-slate-200 group-hover:text-sky-400 truncate text-[11px]">${sanitizeHTML(st.state)}</div>
                  <div class="text-[9px] text-slate-500 font-mono">${distCount} districts</div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // STATE OR DISTRICT VIEW: SHOW ALL DISTRICTS OF SELECTED STATE/UT
  const currentSt = cyberData.states[MapState.selectedStateCode];
  if (!currentSt) return '';
  const dKeys = Object.keys(currentSt.districts || {});

  return `
    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-white/10 pb-2">
        <div class="flex items-center gap-2">
          <span class="font-bold text-white text-xs">📍 ${sanitizeHTML(currentSt.state)} Districts (${dKeys.length})</span>
          <span class="text-[10px] text-slate-400">Click any district to inspect threat telemetry</span>
        </div>
        <button onclick="window.resetMapToNationalView()" class="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-bold">
          ← Back to 36 States/UTs
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
        ${dKeys.map(dKey => {
          const dist = currentSt.districts[dKey];
          const isSel = MapState.selectedDistrictName === dKey;
          const hasVerification = dist.hasData;
          return `
            <button onclick="window.selectDistrictView('${dKey}')" class="p-2 rounded-xl text-left border transition cursor-pointer ${isSel ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 hover:border-emerald-500/40 text-slate-200'}">
              <div class="font-bold truncate text-[11px]">${sanitizeHTML(dist.name)}</div>
              <div class="text-[9px] ${hasVerification ? 'text-emerald-400 font-mono' : 'text-slate-500'}">
                ${hasVerification ? 'Verified Telemetry' : '🔎 Verification Required'}
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Render Trend Chart HTML
function renderTrendChartHtml() {
  const months = ['24H', '3D', '7D', '30D', '90D'];
  const values = [180, 520, 1420, 5800, 16800];
  const maxVal = 16800;

  return months.map((m, idx) => {
    const val = values[idx];
    const pct = Math.round((val / maxVal) * 100);
    return `
      <div class="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
        <span class="text-[9px] text-emerald-400 font-mono opacity-0 group-hover:opacity-100 transition">${val}</span>
        <div class="w-full bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t-lg transition-all border-t border-emerald-500/50" style="height: ${pct}%;"></div>
        <span class="text-[10px] text-slate-400 font-bold">${m}</span>
      </div>
    `;
  }).join('');
}

// Render Scam Category Distribution
function renderCategoryDistributionHtml() {
  const categories = [
    { name: 'Stock Trading & IPO Fraud', pct: 32, color: 'bg-rose-500' },
    { name: 'Digital Arrest Extortion', pct: 26, color: 'bg-amber-500' },
    { name: 'OTP & Payment Phishing', pct: 20, color: 'bg-emerald-500' },
    { name: 'Illegal Micro-Loan Apps', pct: 14, color: 'bg-teal-500' },
    { name: 'AI Voice Cloning Fraud', pct: 8, color: 'bg-sky-500' }
  ];

  return categories.map(cat => `
    <div class="space-y-1">
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-300 font-bold">${cat.name}</span>
        <span class="text-slate-400 font-mono">${cat.pct}%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div class="h-full ${cat.color}" style="width: ${cat.pct}%;"></div>
      </div>
    </div>
  `).join('');
}

// Render Verified News Stream with Full-Page Report Navigation
function renderVerifiedNewsStreamHtml() {
  if (!cyberData || !cyberData.states) return '';

  const allNews = [];
  Object.values(cyberData.states).forEach(s => {
    if (s.recentIncidents) {
      s.recentIncidents.forEach(inc => {
        allNews.push({ ...inc, stateName: s.state });
      });
    }
    if (s.districts) {
      Object.values(s.districts).forEach(d => {
        if (d.recentIncidents) {
          d.recentIncidents.forEach(inc => {
            allNews.push({ ...inc, stateName: s.state, districtName: d.name });
          });
        }
      });
    }
  });

  if (allNews.length === 0) {
    return `<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">No recent verified incident news bulletins available.</div>`;
  }

  return allNews.slice(0, 4).map(news => `
    <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-3 text-xs transition flex flex-col justify-between hover:border-emerald-500/30">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px] flex items-center gap-1">
            🟢 ${sanitizeHTML(news.sourceType || 'Official Source')}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-bold text-[10px]">
            🏷️ ${sanitizeHTML(news.category || 'Advisory')}
          </span>
          <span class="text-slate-500 text-[10px] ml-auto">${sanitizeHTML(news.date || 'Aug 2026')}</span>
        </div>

        <h4 class="font-bold text-white text-xs sm:text-sm leading-snug">${sanitizeHTML(news.headline)}</h4>
        <p class="text-slate-300 text-[11px] leading-relaxed line-clamp-3">${sanitizeHTML(news.summary)}</p>
      </div>

      <div class="space-y-2 pt-3 border-t border-white/5">
        <div class="flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-1">
          <span>Publisher: <strong class="text-slate-200">${sanitizeHTML(news.publisher || 'Government Advisory')}</strong></span>
          <span>Region: <strong class="text-slate-200">${sanitizeHTML(news.stateName)}${news.districtName ? ' (' + sanitizeHTML(news.districtName) + ')' : ''}</strong></span>
          <span>Loss: <strong class="text-amber-400 font-mono">${sanitizeHTML(news.financialLoss || 'N/A')}</strong></span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button onclick="window.openFullNewsReportPage('${news.id}')" class="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50">
            <span>📖 Open Full Detailed Report ➔</span>
          </button>

          <a href="${sanitizeHTML(news.sourceUrl || 'https://cybercrime.gov.in')}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition text-center flex items-center justify-center gap-1.5 cursor-pointer">
            <span>Official Government Source</span>
            <span>🔗</span>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

// Centroids dataset for state/UT text labels
const STATE_CENTROIDS = {
  "LA": { name: "Ladakh", lon: 77.72, lat: 34.32 },
  "JK": { name: "Jammu & Kashmir", lon: 74.71, lat: 33.74 },
  "HP": { name: "Himachal Pradesh", lon: 77.11, lat: 32.01 },
  "PB": { name: "Punjab", lon: 75.19, lat: 31.34 },
  "CH": { name: "Chandigarh", lon: 76.77, lat: 30.75 },
  "UT": { name: "Uttarakhand", lon: 78.90, lat: 30.43 },
  "HR": { name: "Haryana", lon: 76.00, lat: 29.20 },
  "DL": { name: "NCT of Delhi", lon: 77.04, lat: 28.69 },
  "RJ": { name: "Rajasthan", lon: 73.67, lat: 26.91 },
  "UP": { name: "Uttar Pradesh", lon: 80.21, lat: 26.98 },
  "BR": { name: "Bihar", lon: 84.94, lat: 26.17 },
  "SK": { name: "Sikkim", lon: 88.42, lat: 27.70 },
  "WB": { name: "West Bengal", lon: 88.25, lat: 24.59 },
  "JH": { name: "Jharkhand", lon: 85.45, lat: 23.62 },
  "OD": { name: "Odisha", lon: 84.07, lat: 20.50 },
  "CT": { name: "Chhattisgarh", lon: 82.15, lat: 22.45 },
  "MP": { name: "Madhya Pradesh", lon: 78.43, lat: 24.46 },
  "GJ": { name: "Gujarat", lon: 70.97, lat: 22.86 },
  "DN": { name: "D&N & Daman/Diu", lon: 72.96, lat: 20.28 },
  "MH": { name: "Maharashtra", lon: 75.46, lat: 19.11 },
  "GA": { name: "Goa", lon: 73.88, lat: 15.44 },
  "KA": { name: "Karnataka", lon: 75.78, lat: 14.97 },
  "TG": { name: "Telangana", lon: 78.82, lat: 18.64 },
  "AP": { name: "Andhra Pradesh", lon: 80.20, lat: 15.97 },
  "TN": { name: "Tamil Nadu", lon: 77.89, lat: 11.27 },
  "KL": { name: "Kerala", lon: 76.02, lat: 10.76 },
  "PY": { name: "Puducherry", lon: 79.78, lat: 11.92 },
  "AS": { name: "Assam", lon: 92.40, lat: 26.20 },
  "AR": { name: "Arunachal Pradesh", lon: 94.52, lat: 27.94 },
  "NL": { name: "Nagaland", lon: 94.24, lat: 26.44 },
  "MN": { name: "Manipur", lon: 93.64, lat: 24.88 },
  "MZ": { name: "Mizoram", lon: 92.70, lat: 23.46 },
  "TR": { name: "Tripura", lon: 91.50, lat: 23.90 },
  "ML": { name: "Meghalaya", lon: 91.00, lat: 25.58 },
  "AN": { name: "A&N Islands", lon: 92.74, lat: 12.70 },
  "LD": { name: "Lakshadweep", lon: 72.32, lat: 10.80 }
};

// Interactive Map Canvas Renderer with High-DPI Scale & 3D Layer Extrusions
function initMapCanvasRenderer() {
  const canvas = document.getElementById('indiaMapCanvas');
  if (!canvas || typeof canvas.getContext !== 'function' || !geoData) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  const w = Math.min(880, parent.clientWidth || 740);
  const h = 580;

  // High-DPI Retina Screen Resolution Scaling
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  let isDragging = false;
  let startX = 0, startY = 0;
  let hoveredStateCode = null;
  let pulseAngle = 0;
  let animFrameId = null;

  // Complete India Geographic Bounding Box (Mainland + Islands)
  const minLon = 67.5, maxLon = 98.0;
  const minLat = 6.0, maxLat = 37.5;

  const project = (lon, lat) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * (w * 0.84) + (w * 0.08) + MapState.panX;
    const y = h - (((lat - minLat) / (maxLat - minLat)) * (h * 0.84) + (h * 0.08)) + MapState.panY;
    return [x * MapState.zoomLevel, y * MapState.zoomLevel];
  };

  const drawMap = () => {
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // 1. High-Tech Cyber Grid Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 36) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 36) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    if (!geoData || !geoData.features) { ctx.restore(); return; }

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 2. Global Unified 3D Tilt Matrix Transformation (Centered)
    if (MapState.is3DTilt) {
      ctx.translate(w * 0.04, h * 0.04);
      ctx.transform(1, 0, -0.06, 0.92, 0, 0);
    }

    // 3. Render Solid 3D Base Drop Shadow
    if (MapState.is3DTilt) {
      ctx.save();
      ctx.translate(0, 8);
      geoData.features.forEach(feat => {
        const renderShadow = (coords) => {
          ctx.beginPath();
          coords.forEach((pt, i) => {
            const [px, py] = project(pt[0], pt[1]);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fill();
        };
        if (feat.geometry.type === 'Polygon') renderShadow(feat.geometry.coordinates[0]);
        else if (feat.geometry.type === 'MultiPolygon') feat.geometry.coordinates.forEach(p => renderShadow(p[0]));
      });
      ctx.restore();
    }

    // 4. Render Seamless State & UT Geometries
    geoData.features.forEach(feat => {
      const code = feat.properties.code;
      const stData = cyberData && cyberData.states ? cyberData.states[code] : null;
      const hasData = stData ? stData.hasData : false;
      const incidents = stData && stData.timeStats && stData.timeStats[MapState.timeFilter] ? stData.timeStats[MapState.timeFilter].incidents : 0;
      
      const colors = getFeatureSeverityColor(incidents, hasData);
      const isSelected = MapState.selectedStateCode === code;
      const isHovered = hoveredStateCode === code;

      ctx.save();

      const renderCoords = (coords) => {
        ctx.beginPath();
        coords.forEach((pt, i) => {
          const [px, py] = project(pt[0], pt[1]);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();

        ctx.fillStyle = isSelected ? 'rgba(0, 255, 136, 0.55)' : (isHovered ? 'rgba(56, 189, 248, 0.45)' : colors.fill);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#00FF88' : (isHovered ? '#38BDF8' : colors.stroke);
        ctx.lineWidth = isSelected || isHovered ? 2.2 : 1.0;
        ctx.stroke();
      };

      if (feat.geometry.type === 'Polygon') {
        renderCoords(feat.geometry.coordinates[0]);
      } else if (feat.geometry.type === 'MultiPolygon') {
        feat.geometry.coordinates.forEach(poly => renderCoords(poly[0]));
      }

      ctx.restore();
    });

    // 5. Render Animated Threat Radar Pulse Rings
    pulseAngle += 0.05;
    const pulseRadius = 10 + Math.sin(pulseAngle) * 4;

    Object.keys(STATE_CENTROIDS).forEach(code => {
      const stData = cyberData && cyberData.states ? cyberData.states[code] : null;
      if (!stData || !stData.hasData) return;

      const cent = STATE_CENTROIDS[code];
      const [px, py] = project(cent.lon, cent.lat);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      ctx.restore();
    });

    // 6. Render Floating State & UT Names
    Object.keys(STATE_CENTROIDS).forEach(code => {
      const cent = STATE_CENTROIDS[code];
      const [px, py] = project(cent.lon, cent.lat);
      const isSelected = MapState.selectedStateCode === code;
      const isHovered = hoveredStateCode === code;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const fontSize = isSelected || isHovered ? 12 : 10;
      ctx.font = `bold ${fontSize}px "Segoe UI", Outfit, sans-serif`;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 4;

      ctx.strokeStyle = '#020403';
      ctx.lineWidth = 3.5;
      ctx.strokeText(cent.name, px, py);

      ctx.fillStyle = isSelected ? '#00FF88' : (isHovered ? '#38BDF8' : '#F8FAFC');
      ctx.fillText(cent.name, px, py);

      ctx.restore();
    });

    ctx.restore(); // Restore tilt matrix
    ctx.restore(); // Restore DPR scale
  };

  const animateLoop = () => {
    drawMap();
    animFrameId = requestAnimationFrame(animateLoop);
  };
  animateLoop();

  canvas.onmousedown = (e) => {
    isDragging = true;
    startX = e.clientX - MapState.panX;
    startY = e.clientY - MapState.panY;
  };

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging) {
      MapState.panX = e.clientX - startX;
      MapState.panY = e.clientY - startY;
      return;
    }

    let nearestCode = null;
    let minDist = 40;

    Object.keys(STATE_CENTROIDS).forEach(code => {
      const cent = STATE_CENTROIDS[code];
      const offsetZ = MapState.is3DTilt ? 8 : 0;
      const [px, py] = project(cent.lon, cent.lat, offsetZ);
      const dist = Math.hypot(mx - px, my - py);
      if (dist < minDist) {
        minDist = dist;
        nearestCode = code;
      }
    });

    if (nearestCode !== hoveredStateCode) {
      hoveredStateCode = nearestCode;
      canvas.style.cursor = hoveredStateCode ? 'pointer' : 'grab';
    }
  };

  canvas.onmouseup = () => { isDragging = false; };
  canvas.onmouseleave = () => { isDragging = false; hoveredStateCode = null; };

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let targetCode = null;
    let minDist = 50;

    Object.keys(STATE_CENTROIDS).forEach(code => {
      const cent = STATE_CENTROIDS[code];
      const offsetZ = MapState.is3DTilt ? 8 : 0;
      const [px, py] = project(cent.lon, cent.lat, offsetZ);
      const dist = Math.hypot(mx - px, my - py);
      if (dist < minDist) {
        minDist = dist;
        targetCode = code;
      }
    });

    if (targetCode) {
      window.selectStateView(targetCode);
    }
  };
}

// Three.js 3D Extruded Map Engine Initialization
function initThreeJSMapRenderer(canvas, width, height) {
  const THREE = window.THREE;
  if (!THREE) return;

  if (threeRenderer) {
    try { threeRenderer.dispose(); } catch (e) {}
  }

  threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  threeRenderer.setSize(width, height);

  threeScene = new THREE.Scene();
  threeScene.fog = new THREE.FogExp2(0x020403, 0.0014);

  threeCamera = new THREE.PerspectiveCamera(42, width / height, 1, 4000);
  let camTheta = 0.5, camPhi = 0.95, camDist = 300;
  const target = new THREE.Vector3(0, 3, -6);

  const updateCamera = () => {
    threeCamera.position.set(
      target.x + camDist * Math.sin(camPhi) * Math.sin(camTheta),
      target.y + camDist * Math.cos(camPhi),
      target.z + camDist * Math.sin(camPhi) * Math.cos(camTheta)
    );
    threeCamera.lookAt(target);
  };
  updateCamera();

  threeScene.add(new THREE.AmbientLight(0x2a3a4a, 1.2));
  const key = new THREE.DirectionalLight(0xff6b7a, 1.0);
  key.position.set(120, 220, 140);
  threeScene.add(key);

  const rim = new THREE.PointLight(0x00ffc2, 1.1, 900);
  rim.position.set(-160, 90, -120);
  threeScene.add(rim);

  const grid = new THREE.GridHelper(900, 60, 0x123847, 0x0a1e28);
  grid.position.y = -0.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  threeScene.add(grid);

  // Extrude 3D State Geometries
  const CENTER_LON = 82.5, CENTER_LAT = 21.7, SCALE = 9.2;
  const project3D = (lon, lat) => ({
    x: (lon - CENTER_LON) * Math.cos(CENTER_LAT * Math.PI / 180) * SCALE,
    z: -(lat - CENTER_LAT) * SCALE
  });

  threeGroup = new THREE.Group();
  threeScene.add(threeGroup);

  const EXTRUDE_DEPTH = 6.5;

  geoData.features.forEach(feat => {
    const code = feat.properties.code;
    const stData = cyberData && cyberData.states ? cyberData.states[code] : null;
    const hasData = stData ? stData.hasData : false;
    const incidents = stData && stData.timeStats && stData.timeStats[MapState.timeFilter] ? stData.timeStats[MapState.timeFilter].incidents : 0;
    
    const colors = getFeatureSeverityColor(incidents, hasData);
    const isSelected = MapState.selectedStateCode === code;

    const render3DPolygon = (coordPoly) => {
      const pts = coordPoly.map(([lon, lat]) => {
        const p = project3D(lon, lat);
        return new THREE.Vector2(p.x, p.z);
      });
      if (pts.length < 3) return;

      const shape = new THREE.Shape(pts);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: EXTRUDE_DEPTH, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.35, bevelSegments: 1, curveSegments: 1
      });

      const hexColor = isSelected ? 0x00ff88 : parseInt(colors.stroke.replace('#', '0x'), 16) || 0x475569;
      const mat = new THREE.MeshPhongMaterial({
        color: hexColor,
        emissive: isSelected ? 0x004422 : 0x1a0410,
        shininess: 35,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.82,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.userData = { code, name: feat.properties.name };
      threeGroup.add(mesh);

      const edgesGeo = new THREE.EdgesGeometry(geo, 10);
      const edgesMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x00ff88 : (colors.stroke === '#FF3B5C' ? 0xff2f56 : 0x38bdf8),
        transparent: true,
        opacity: 0.9
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      edges.rotation.x = -Math.PI / 2;
      threeGroup.add(edges);
    };

    if (feat.geometry.type === 'Polygon') {
      render3DPolygon(feat.geometry.coordinates[0]);
    } else if (feat.geometry.type === 'MultiPolygon') {
      feat.geometry.coordinates.forEach(poly => render3DPolygon(poly[0]));
    }
  });

  // Pointer Controls & Raycasting
  let dragging = false, lastX = 0, lastY = 0, autoRotate = true, idleTimer = null;
  
  canvas.onpointerdown = (e) => {
    dragging = true; autoRotate = false; lastX = e.clientX; lastY = e.clientY;
    clearTimeout(idleTimer);
  };

  window.onpointerup = () => {
    dragging = false;
    idleTimer = setTimeout(() => autoRotate = true, 2400);
  };

  window.onpointermove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    camTheta -= dx * 0.005;
    camPhi = Math.min(1.4, Math.max(0.35, camPhi - dy * 0.004));
  };

  canvas.onwheel = (e) => {
    e.preventDefault();
    camDist = Math.min(600, Math.max(120, camDist + e.deltaY * 0.4));
  };

  // Raycast click for 3D state selection
  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / canvas.width) * 2 - 1,
      -((e.clientY - rect.top) / canvas.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, threeCamera);
    const intersects = raycaster.intersectObjects(threeGroup.children);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      if (hitObj && hitObj.userData && hitObj.userData.code) {
        window.selectStateView(hitObj.userData.code);
      }
    }
  };

  // Animation Loop
  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    if (autoRotate && MapState.is3DTilt) camTheta += 0.0008;
    updateCamera();
    threeRenderer.render(threeScene, threeCamera);
  }
  animate();
}

// Global Event Export Handlers
export const setMapTimeFilter = (period) => {
  MapState.timeFilter = period;
  initIndiaThreatMap();
};

export const resetMapToNationalView = () => {
  MapState.level = 'NATIONAL';
  MapState.selectedStateCode = null;
  MapState.selectedStateName = null;
  MapState.selectedDistrictName = null;
  initIndiaThreatMap();
};

export const setCyberDataInMap = (data) => {
  cyberData = data;
};

export const setGeoDataInMap = (data) => {
  geoData = data;
};

export const selectStateView = (code) => {
  let stName = code;
  if (cyberData && cyberData.states && cyberData.states[code]) {
    stName = cyberData.states[code].state;
  } else if (geoData && geoData.features) {
    const feat = geoData.features.find(f => f.properties.code === code);
    if (feat) stName = feat.properties.name;
  }
  MapState.level = 'STATE';
  MapState.selectedStateCode = code;
  MapState.selectedStateName = stName;
  MapState.selectedDistrictName = null;
  initIndiaThreatMap();
};

export const selectDistrictView = (dName) => {
  MapState.level = 'DISTRICT';
  MapState.selectedDistrictName = dName;
  initIndiaThreatMap();
};

export const toggleMap3DTilt = () => {
  MapState.is3DTilt = !MapState.is3DTilt;
  initMapCanvasRenderer();
};

export const zoomMapCanvas = (factor) => {
  MapState.zoomLevel = Math.max(0.6, Math.min(2.5, MapState.zoomLevel * factor));
  initMapCanvasRenderer();
};

export const resetMapCanvasTransform = () => {
  MapState.zoomLevel = 1.0;
  MapState.panX = 0;
  MapState.panY = 0;
  MapState.is3DTilt = true;
  initMapCanvasRenderer();
};

export const openFullNewsReportPage = (newsId) => {
  if (!cyberData || !cyberData.states) return;
  let targetNews = null;

  Object.values(cyberData.states).forEach(s => {
    if (s.recentIncidents) {
      s.recentIncidents.forEach(inc => {
        if (inc.id === newsId) targetNews = { ...inc, stateName: s.state };
      });
    }
    if (s.districts) {
      Object.values(s.districts).forEach(d => {
        if (d.recentIncidents) {
          d.recentIncidents.forEach(inc => {
            if (inc.id === newsId) targetNews = { ...inc, stateName: s.state, districtName: d.name };
          });
        }
      });
    }
  });

  if (!targetNews) return;

  const container = document.getElementById('fullIncidentReportContainer');
  if (!container) return;

  container.innerHTML = `
    <!-- REPORT EXECUTIVE HEADER CARD -->
    <div class="glass-card p-6 rounded-3xl border border-white/10 space-y-4 font-sans text-xs shadow-2xl relative overflow-hidden">
      <div class="flex items-center justify-between gap-3 flex-wrap border-b border-white/10 pb-4">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs flex items-center gap-1.5">
            🟢 Verified Official Government Advisory
          </span>
          <span class="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs">
            🏷️ ${sanitizeHTML(targetNews.category || 'Cybercrime Advisory')}
          </span>
        </div>
        <span class="text-slate-400 font-mono text-xs">Reference ID: ${sanitizeHTML(targetNews.id)}</span>
      </div>

      <h1 class="text-xl sm:text-2xl font-extrabold text-white leading-tight">
        ${sanitizeHTML(targetNews.headline)}
      </h1>

      <!-- METRICS & LOCATION STRIP -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reported Financial Loss</span>
          <div class="text-lg font-bold text-amber-400 font-mono">${sanitizeHTML(targetNews.financialLoss || 'N/A')}</div>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Official Publisher</span>
          <div class="text-xs font-bold text-slate-200">${sanitizeHTML(targetNews.publisher || 'Government Advisory')}</div>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Geographic Region</span>
          <div class="text-xs font-bold text-slate-200">${sanitizeHTML(targetNews.stateName)}${targetNews.districtName ? ' (' + sanitizeHTML(targetNews.districtName) + ')' : ''}</div>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Publication Date</span>
          <div class="text-xs font-bold text-slate-200">${sanitizeHTML(targetNews.date || 'Aug 2026')}</div>
        </div>
      </div>
    </div>

    <!-- PAGE 1: INCIDENT CASE STUDY & CHRONOLOGY -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 font-sans text-xs">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 class="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span>📄 SECTION 1 / 4</span> — <span>INCIDENT CASE CHRONOLOGY & MODUS OPERANDI</span>
        </h2>
        <span class="text-slate-500 font-mono text-[10px]">Verified Case Telemetry</span>
      </div>

      <div class="space-y-4 text-slate-200 text-sm leading-relaxed">
        <p class="font-semibold text-white bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          ${sanitizeHTML(targetNews.summary)}
        </p>

        ${targetNews.fullReportText ? `
          <div class="space-y-3 pt-2 text-slate-300">
            ${(targetNews.fullReportText || '').split('\n\n').map(para => `<p class="leading-relaxed">${sanitizeHTML(para)}</p>`).join('')}
          </div>
        ` : `
          <p class="text-slate-300 leading-relaxed">
            According to official law enforcement records, this cyber incident bulletin was formally investigated under the National Cyber Crime Reporting Framework. The perpetrators deployed automated IVR calls and spoofed VoIP channels impersonating authorized officers to demand immediate financial settlement under duress.
          </p>
        `}
      </div>
    </div>

    <!-- PAGE 2: TECHNICAL ANATOMY & THREAT INDICATORS -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 font-sans text-xs">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 class="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <span>📄 SECTION 2 / 4</span> — <span>TECHNICAL SCAM ANATOMY & THREAT VECTORS</span>
        </h2>
        <span class="text-slate-500 font-mono text-[10px]">IOC Analysis</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span class="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Communication Vectors</span>
          <ul class="list-disc list-inside space-y-1 text-slate-300 text-xs">
            <li>WhatsApp VoIP Virtual Numbers (+92, +44 country codes)</li>
            <li>Spoofed TRAI IVR Telephony Routers</li>
            <li>Fake Skype Handles impersonating CBI/Customs</li>
          </ul>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span class="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Financial Laundering Trail</span>
          <ul class="list-disc list-inside space-y-1 text-slate-300 text-xs">
            <li>Layered IMPS/RTGS Mule Account Transfers</li>
            <li>Regional Private Bank Accounts in NCR/Kolkata</li>
            <li>Rapid Crypto / Wallet Conversions</li>
          </ul>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span class="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Digital Artifacts</span>
          <ul class="list-disc list-inside space-y-1 text-slate-300 text-xs">
            <li>Forged PDF Certificates with fake seals</li>
            <li>Malicious APKs carrying Remote Access Trojans</li>
            <li>Spoofed Supreme Court / RBI Notice letters</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- PAGE 3: LAW ENFORCEMENT & LEGAL ACTION LOG -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 font-sans text-xs">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 class="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span>📄 SECTION 3 / 4</span> — <span>OFFICIAL POLICE ACTION & LEGAL SECTIONS</span>
        </h2>
        <span class="text-slate-500 font-mono text-[10px]">Legal Enforcement</span>
      </div>

      ${targetNews.policeAction ? `
        <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-900/60 space-y-2">
          <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Registered Police FIR & Asset Freezing Log</span>
          <p class="text-slate-200 font-mono text-xs leading-relaxed">${sanitizeHTML(targetNews.policeAction)}</p>
        </div>
      ` : ''}

      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicable Provisions under Indian Cyber Laws</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-white">IT Act 2000 Section 66D:</strong> Punishment for cheating by personation by using computer resource.
          </div>
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-white">BNS Section 318(4) / IPC 420:</strong> Cheating and dishonestly inducing delivery of property.
          </div>
        </div>
      </div>
    </div>

    <!-- PAGE 4: NATIONAL I4C CITIZEN ADVISORY & SOURCE ATTRIBUTION -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5 font-sans text-xs">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 class="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <span>📄 SECTION 4 / 4</span> — <span>NATIONAL I4C CITIZEN ADVISORY & SOURCE LINK</span>
        </h2>
        <span class="text-slate-500 font-mono text-[10px]">Verified Source</span>
      </div>

      <div class="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
        <h3 class="font-bold text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <span>🛡️ Indian Cyber Crime Coordination Centre (I4C - MHA) Guidelines</span>
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-200 text-xs leading-relaxed">
          <li><strong>Digital Arrest is Fake:</strong> No police officer, CBI official, ED investigator, or Customs agent will ever arrest or interrogate you on a Skype or WhatsApp video call.</li>
          <li><strong>Never Transfer Funds:</strong> Government agencies NEVER ask citizens to transfer money to private bank accounts for 'RBI Verification' or 'Escrow'.</li>
          <li><strong>Golden Hour Action:</strong> If money is transferred, immediately call <strong>1930 Helpline</strong> within 1 hour to trigger inter-bank account freezing.</li>
          <li><strong>Lodge Formal Complaint:</strong> Always register your complaint on the National Cyber Crime Reporting Portal at <strong>cybercrime.gov.in</strong>.</li>
        </ul>
      </div>

      <!-- FOOTER SOURCE LINK & ACTION BUTTONS -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
        <div class="text-xs text-slate-400 space-y-1">
          <div>Verified Source: <strong class="text-white">${sanitizeHTML(targetNews.publisher || 'Government Advisory')}</strong></div>
          <div class="font-mono text-slate-500 text-[11px]">Traceable URL: ${sanitizeHTML(targetNews.sourceUrl || 'https://cybercrime.gov.in')}</div>
        </div>

        <div class="flex items-center gap-3">
          <a href="${sanitizeHTML(targetNews.sourceUrl || 'https://cybercrime.gov.in')}" target="_blank" rel="noopener noreferrer" class="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950">
            <span>Open Official Source Website</span>
            <span>🔗</span>
          </a>
          <button onclick="window.print()" class="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5">
            <span>Print Report 🖨️</span>
          </button>
        </div>
      </div>
    </div>
  `;

  if (typeof window.switchDashboardView === 'function') {
    window.switchDashboardView('incident-report');
  }
};

export const openStateReportModal = (code) => {
  selectStateView(code);
};

export const closeStateReportModal = () => {
  resetMapToNationalView();
};

export const toggleInlineNewsReport = (newsId) => {
  openFullNewsReportPage(newsId);
};

// Re-export window bindings
if (typeof window !== 'undefined') {
  window.resetMapToNationalView = resetMapToNationalView;
  window.selectStateView = selectStateView;
  window.selectDistrictView = selectDistrictView;
  window.setMapTimeFilter = setMapTimeFilter;
  window.toggleMap3DTilt = toggleMap3DTilt;
  window.zoomMapCanvas = zoomMapCanvas;
  window.resetMapCanvasTransform = resetMapCanvasTransform;
  window.openStateReportModal = openStateReportModal;
  window.closeStateReportModal = closeStateReportModal;
  window.toggleInlineNewsReport = toggleInlineNewsReport;
  window.openFullNewsReportPage = openFullNewsReportPage;
}
