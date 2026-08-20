import { getTimeFilteredIntel, filterIntelByTag, searchIntelRecords, refreshIntelFeed, getActiveIntelState } from './intelService.js';
import { sanitizeHTML } from './utils.js';
import { State } from './state.js';
import { UI, toggleMobileMenu, openModal, closeModals, initCanvasAnimation, initLiveMeters, bootSequence, showToast, switchDashboardView, initShield3DEffect, initThreatGlobe } from './ui.js';
import { applyLanguage, toggleLangMenu } from './language.js';
import { switchScanMode, handleFileHash, executeScan, handleQrUpload } from './scanner.js';
import { checkPasswordStrength, generatePassword, generateQR, downloadPDFReport, copyToClipboard, ScamEncyclopediaDB, updateSafetyChecklist, initCyberAlerts, renderScamEncyclopedia, filterScamsCategory, filterScams, clearScamSearch, openScamDetails, executeRelatedScamTool, renderSafetyDashboard, toggleChecklistItem, toggleSelectAllChecklist, filterChecklistCategory, resetSafetyDashboard, executeFixTool, downloadCyberHygienePDFReport, renderEmergencyCenter, switchEmergencyIncident, downloadEmergencyActionPDF, renderStateThreatDetails, runWhoisLookup, runIpLookup, runDnsLookup, handleScreenshotUpload, runPasswordBreachCheck, renderCyberCellDetails, renderCyberQuiz, submitQuizAnswer, nextQuizQuestion, resetCyberQuiz, openScreenshotWorkspace, closeScreenshotWorkspace, toggleWorkspaceLangMenu, renderScreenshotWorkspace, handleWorkspaceDrop, handleWorkspaceFileSelect, setActiveScreenshotIndex, clearAllScreenshots, adjustScreenshotZoom, rotateScreenshotCanvas, resetScreenshotCanvasView, toggleScreenshotRedactMode, clearScreenshotRedactions, cancelScreenshotScan, startScreenshotInvestigation, downloadScreenshotPDFReport, copyScreenshotReportText } from './tools.js';
import { initServiceWorker, triggerPWAInstall } from './utils.js';
import { initIndiaThreatMap, openStateReportModal, closeStateReportModal, openFullStateResearchModal } from './indiaMap.js';
import { initEventBindings } from './eventBindings.js';

// Expose global window methods for inline HTML onclick attributes
window.triggerPWAInstall = triggerPWAInstall;
window.switchDashboardView = switchDashboardView;
window.initIndiaThreatMap = initIndiaThreatMap;
window.openFullStateResearchModal = openFullStateResearchModal;
window.selectIndiaState = (code) => {
    openStateReportModal(code);
    State.selectedState = code;
};
window.closeStateReportModal = closeStateReportModal;
window.toggleLangMenu = toggleLangMenu;
window.applyLanguage = applyLanguage;
window.setLanguage = (lang) => applyLanguage(lang);
window.switchLanguage = (lang) => applyLanguage(lang);
window.toggleMobileMenu = toggleMobileMenu;
window.switchMode = (mode) => switchScanMode(mode);

export async function fetchCyberIntelligence() {
    await getTimeFilteredIntel('ALL');
    renderCyberIntelUI();
}

export function renderCyberIntelUI() {
    const state = getActiveIntelState();
    const incidents = state.filteredIncidents || [];

    const totalCountEl = document.getElementById('ctiTotalCount');
    const tier1CountEl = document.getElementById('ctiTier1Count');
    const indiaCountEl = document.getElementById('ctiIndiaCount');
    const statusBadgeEl = document.getElementById('intelStatusBadge');
    const freshnessLabelEl = document.getElementById('intelFreshnessLabel');

    if (totalCountEl) totalCountEl.innerText = state.metadata.totalRecords || incidents.length;
    if (tier1CountEl) tier1CountEl.innerText = state.metadata.tier1GovtCount || incidents.filter(i => i.sourceTier === 1).length;
    if (indiaCountEl) indiaCountEl.innerText = state.metadata.indiaRelevantCount || incidents.filter(i => i.indiaRelevance === 'india_specific' || i.indiaRelevance === 'india_relevant').length;

    if (statusBadgeEl) {
        if (state.sourceStatus === 'LIVE') {
            statusBadgeEl.className = 'px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md';
            statusBadgeEl.innerHTML = '🟢 LIVE VERIFIED';
        } else if (state.sourceStatus === 'UNAVAILABLE') {
            statusBadgeEl.className = 'px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md';
            statusBadgeEl.innerHTML = '🔴 SOURCE UNAVAILABLE';
        } else if (state.sourceStatus === 'UNVERIFIED') {
            statusBadgeEl.className = 'px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md';
            statusBadgeEl.innerHTML = '⚪ UNVERIFIED';
        } else {
            statusBadgeEl.className = 'px-3 py-1 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md';
            statusBadgeEl.innerHTML = '🟡 PREVIOUSLY VERIFIED — CACHED';
        }
    }

    if (freshnessLabelEl) {
        freshnessLabelEl.innerText = state.lastVerifiedText || 'Verified Local Store';
    }

    document.querySelectorAll('#ctiFilterPills .cti-pill-btn').forEach(btn => {
        const arg = btn.getAttribute('data-arg');
        if (arg === state.activeTag) {
            btn.className = 'cti-pill-btn px-3 py-1.5 rounded-xl bg-emerald-500/20 text-[#00FF88] border border-emerald-500/40 font-bold shrink-0 cursor-pointer';
        } else {
            btn.className = 'cti-pill-btn px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold shrink-0 cursor-pointer';
        }
    });

    const listContainer = document.getElementById('intelAlertsList');
    if (!listContainer) return;

    if (incidents.length === 0) {
        listContainer.className = 'col-span-full';
        listContainer.innerHTML = `
            <div class="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-3">
                <div class="text-3xl">🔍</div>
                <h3 class="text-base font-bold text-white">No Verified Intelligence Available</h3>
                <p class="text-xs text-slate-400 max-w-md mx-auto">No records matched your search query or selected filter criteria in the verified intelligence stream.</p>
                <button data-action="filterIntelByTag" data-arg="ALL" class="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold hover:bg-emerald-900 transition cursor-pointer">Reset All Filters</button>
            </div>
        `;
        return;
    }

    listContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
    listContainer.innerHTML = incidents.map(item => {
        let sevBadge = 'bg-rose-950/90 text-rose-300 border-rose-800';
        if (item.severity === 'HIGH') sevBadge = 'bg-amber-950/90 text-amber-300 border-amber-800';
        if (item.severity === 'MEDIUM') sevBadge = 'bg-yellow-950/90 text-yellow-300 border-yellow-800';
        if (item.severity === 'LOW' || item.severity === 'INFO') sevBadge = 'bg-sky-950/90 text-sky-300 border-sky-800';

        let tierBadge = 'bg-emerald-950 text-emerald-400 border-emerald-800';
        let tierText = '🏛️ Tier 1 Official Govt';
        if (item.sourceTier === 2) {
            tierBadge = 'bg-sky-950 text-sky-300 border-sky-800';
            tierText = '🛡️ Tier 2 National Security';
        } else if (item.sourceTier === 3) {
            tierBadge = 'bg-purple-950 text-purple-300 border-purple-800';
            tierText = '🌐 Tier 3 International';
        }

        const pubDateFormatted = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date Unavailable';

        return `
            <div class="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div class="space-y-3">
                    <div class="flex items-center justify-between gap-2 flex-wrap text-[10px]">
                        <span class="px-2.5 py-0.5 rounded-full ${sevBadge} font-bold border uppercase tracking-wider">
                            ${item.severity || 'HIGH'}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full ${tierBadge} font-bold border uppercase tracking-wider">
                            ${tierText}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                            ${item.verificationStatus ? item.verificationStatus.toUpperCase() : 'VERIFIED'}
                        </span>
                    </div>

                    <h3 class="text-base font-bold text-white leading-snug">${sanitizeHTML(item.title)}</h3>
                    <p class="text-slate-300 text-xs leading-relaxed line-clamp-3">${sanitizeHTML(item.summary)}</p>
                </div>

                <div class="space-y-3 pt-3 border-t border-white/10 text-xs">
                    <div class="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
                        <div>Publisher: <strong class="text-white">${sanitizeHTML(item.publisher)}</strong></div>
                        <div class="font-mono text-slate-500">Published: ${pubDateFormatted}</div>
                    </div>

                    <div class="flex items-center justify-between gap-2 pt-1">
                        <a href="${sanitizeHTML(item.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1">
                            <span>Official Source</span> <span>↗</span>
                        </a>

                        <button data-action="openIntelDetailView" data-arg="${item.id}" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-lg shadow-emerald-950/40">
                            <span>Read Intelligence</span> <span>➔</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

export function openIntelDetailView(id) {
    const state = getActiveIntelState();
    const item = (state.incidents || []).find(i => i.id === id);
    if (!item) return;

    const container = document.getElementById('intelDetailContainer');
    if (!container) return;

    const pubDateFormatted = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date Unavailable';
    const retDateFormatted = item.retrievedAt ? new Date(item.retrievedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Retrieval Date Unavailable';

    let sevBadge = 'bg-rose-950/90 text-rose-300 border-rose-800';
    if (item.severity === 'HIGH') sevBadge = 'bg-amber-950/90 text-amber-300 border-amber-800';

    container.innerHTML = `
        <div class="space-y-6 font-sans text-xs">
            
            <!-- CTI HEADER CARD -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-3">
                <div class="flex items-center justify-between gap-3 flex-wrap text-xs">
                    <span class="px-3 py-1 rounded-full ${sevBadge} font-bold border uppercase tracking-wider">
                        ${item.severity} SEVERITY
                    </span>
                    <span class="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase tracking-wider">
                        ${item.confidence} CONFIDENCE (${item.verificationStatus ? item.verificationStatus.toUpperCase() : 'VERIFIED'})
                    </span>
                    <span class="text-slate-400 font-mono text-xs">Published: ${pubDateFormatted}</span>
                </div>

                <h1 class="text-xl sm:text-2xl font-extrabold text-white leading-tight">${sanitizeHTML(item.title)}</h1>
                <div class="flex items-center gap-3 text-xs text-slate-300 flex-wrap pt-1">
                    <div>Publisher: <strong class="text-white">${sanitizeHTML(item.publisher)}</strong> (Tier ${item.sourceTier})</div>
                    <div>•</div>
                    <div>Threat Vector: <strong class="text-emerald-400">${sanitizeHTML(item.threatType)}</strong></div>
                </div>
            </div>

            <!-- SECTION 1: EXECUTIVE THREAT SUMMARY -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-3">
                <h2 class="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-3">
                    <span>📄 SECTION 1 / 5 — EXECUTIVE THREAT SUMMARY</span>
                    <span class="text-slate-500 font-mono text-[10px]">Evidence-First Briefing</span>
                </h2>
                <p class="text-slate-200 text-sm leading-relaxed bg-slate-950/80 p-5 rounded-2xl border border-slate-800">${sanitizeHTML(item.summary)}</p>
            </div>

            <!-- SECTION 2: ATTACK FLOW / MODUS OPERANDI -->
            ${item.modusOperandi ? `
                <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                    <h2 class="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                        <span>📄 SECTION 2 / 5 — ATTACK FLOW & MODUS OPERANDI</span>
                        <span class="text-slate-500 font-mono text-[10px]">Step-by-Step Mechanism</span>
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <strong class="text-amber-400 font-bold text-xs block">1. Initial Contact Vector</strong>
                            <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.modusOperandi.step1 || 'N/A')}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <strong class="text-amber-400 font-bold text-xs block">2. Social Engineering / Manipulation</strong>
                            <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.modusOperandi.step2 || 'N/A')}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <strong class="text-amber-400 font-bold text-xs block">3. Technical Exploitation / Pressure</strong>
                            <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.modusOperandi.step3 || 'N/A')}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <strong class="text-amber-400 font-bold text-xs block">4. Financial Laundering / Exfiltration</strong>
                            <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.modusOperandi.step4 || 'N/A')}</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- SECTION 3: TECHNICAL DETAILS & INDICATORS OF COMPROMISE (IoCs) -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                <h2 class="text-sm font-bold text-sky-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>📄 SECTION 3 / 5 — TECHNICAL ANALYSIS & INDICATORS OF COMPROMISE (IoCs)</span>
                    <span class="text-slate-500 font-mono text-[10px]">Cyber Telemetry</span>
                </h2>

                <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <strong class="text-white font-bold text-xs block">Technical Defensive Analysis</strong>
                    <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.technicalDetails || 'Official technical details provided in source bulletin.')}</p>
                </div>

                ${item.indicators ? `
                    <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                        <strong class="text-sky-300 font-bold text-xs block">Verified Indicators of Compromise (IoCs)</strong>
                        <pre class="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-slate-300 text-[11px] overflow-x-auto">${sanitizeHTML(JSON.stringify(item.indicators, null, 2))}</pre>
                    </div>
                ` : ''}
            </div>

            <!-- SECTION 4: CITIZEN MITIGATION & GOVERNMENT GUIDANCE -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                <h2 class="text-sm font-bold text-rose-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>📄 SECTION 4 / 5 — CITIZEN MITIGATION & GOVERNMENT ADVISORY</span>
                    <span class="text-slate-500 font-mono text-[10px]">Emergency Protocol</span>
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div class="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 space-y-2">
                        <h3 class="font-bold text-emerald-300 text-xs uppercase tracking-wider">🛡️ Recommended Citizen Mitigation Steps</h3>
                        <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.mitigation)}</p>
                    </div>

                    <div class="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                        <h3 class="font-bold text-rose-300 text-xs uppercase tracking-wider">🚨 Official Government Helpline Guidance</h3>
                        <p class="text-slate-300 leading-relaxed">${sanitizeHTML(item.governmentGuidance)}</p>
                        <p class="text-slate-400 text-[11px] pt-1">National Helpline: <strong class="text-emerald-400 font-mono">1930</strong> | National Portal: <strong class="text-white font-mono">cybercrime.gov.in</strong></p>
                    </div>
                </div>
            </div>

            <!-- SECTION 5: PROVENANCE VERIFICATION BOX -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                <h2 class="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>📄 SECTION 5 / 5 — PROVENANCE & AUTHENTICITY AUDIT</span>
                    <span class="text-slate-500 font-mono text-[10px]">Verification Signature</span>
                </h2>

                <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                        <div><strong>Publisher:</strong> ${sanitizeHTML(item.provenance.who || item.publisher)}</div>
                        <div><strong>Document ID:</strong> ${sanitizeHTML(item.provenance.what || item.id)}</div>
                        <div><strong>Official Published Date:</strong> ${pubDateFormatted}</div>
                        <div><strong>CyberPehra Retrieval Date:</strong> ${retDateFormatted}</div>
                    </div>

                    <div class="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <div>Official Source URL: <strong class="text-white">${sanitizeHTML(item.sourceUrl)}</strong></div>
                        <div>Verification Status: <strong class="text-emerald-400">${sanitizeHTML(item.provenance.howVerified || 'HTTPS Domain Verified against Controlled Source Registry (Tier ' + item.sourceTier + ')')}</strong></div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3">
                    <button data-action="switchDashboardView" data-arg="intel" class="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                        <span>← Back to Threat Intelligence Center</span>
                    </button>

                    <a href="${sanitizeHTML(item.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950">
                        <span>Open Official Source Website</span> <span>↗</span>
                    </a>
                </div>
            </div>

        </div>
    `;

    if (typeof window.switchDashboardView === 'function') {
        window.switchDashboardView('intel-detail');
    }
}

window.fetchCyberIntelligence = fetchCyberIntelligence;
window.renderCyberIntelUI = renderCyberIntelUI;
window.openIntelDetailView = openIntelDetailView;
window.filterIntelByTag = filterIntelByTag;
window.searchIntelRecords = searchIntelRecords;
window.refreshIntelFeed = refreshIntelFeed;
window.handleFileHash = handleFileHash;
window.handleQrUpload = handleQrUpload;
window.executeScan = executeScan;
window.downloadPDFReport = downloadPDFReport;
window.refreshCyberIntel = () => fetchCyberIntelligence(true);
window.runWhoisLookup = runWhoisLookup;
window.runIpLookup = runIpLookup;
window.runDnsLookup = runDnsLookup;
window.handleScreenshotUpload = handleScreenshotUpload;
window.openScreenshotWorkspace = openScreenshotWorkspace;
window.closeScreenshotWorkspace = closeScreenshotWorkspace;
window.toggleWorkspaceLangMenu = toggleWorkspaceLangMenu;
window.renderScreenshotWorkspace = renderScreenshotWorkspace;
window.handleWorkspaceDrop = handleWorkspaceDrop;
window.handleWorkspaceFileSelect = handleWorkspaceFileSelect;
window.setActiveScreenshotIndex = setActiveScreenshotIndex;
window.clearAllScreenshots = clearAllScreenshots;
window.adjustScreenshotZoom = adjustScreenshotZoom;
window.rotateScreenshotCanvas = rotateScreenshotCanvas;
window.resetScreenshotCanvasView = resetScreenshotCanvasView;
window.toggleScreenshotRedactMode = toggleScreenshotRedactMode;
window.clearScreenshotRedactions = clearScreenshotRedactions;
window.cancelScreenshotScan = cancelScreenshotScan;
window.startScreenshotInvestigation = startScreenshotInvestigation;
window.downloadScreenshotPDFReport = downloadScreenshotPDFReport;
window.copyScreenshotReportText = copyScreenshotReportText;
window.runPasswordBreachCheck = runPasswordBreachCheck;
window.renderCyberCellDetails = renderCyberCellDetails;
window.renderCyberQuiz = renderCyberQuiz;
window.submitQuizAnswer = submitQuizAnswer;
window.nextQuizQuestion = nextQuizQuestion;
window.resetCyberQuiz = resetCyberQuiz;
window.openModal = openModal;
window.checkPasswordStrength = checkPasswordStrength;
window.generatePassword = generatePassword;
window.generateQR = generateQR;
window.copyToClipboard = copyToClipboard;
window.updateSafetyChecklist = updateSafetyChecklist;
window.renderScamEncyclopedia = renderScamEncyclopedia;
window.filterScams = filterScams;
window.filterScamsCategory = filterScamsCategory;
window.clearScamSearch = clearScamSearch;
window.openScamDetails = openScamDetails;
window.executeRelatedScamTool = executeRelatedScamTool;
window.renderSafetyDashboard = renderSafetyDashboard;
window.toggleChecklistItem = toggleChecklistItem;
window.toggleSelectAllChecklist = toggleSelectAllChecklist;
window.filterChecklistCategory = filterChecklistCategory;
window.resetSafetyDashboard = resetSafetyDashboard;
window.executeFixTool = executeFixTool;
window.downloadCyberHygienePDFReport = downloadCyberHygienePDFReport;
window.renderEmergencyCenter = renderEmergencyCenter;
window.switchEmergencyIncident = switchEmergencyIncident;
window.downloadEmergencyActionPDF = downloadEmergencyActionPDF;

window.copyPassword = () => {
    const val = UI.pwdInput ? UI.pwdInput.value : '';
    if (!val) { showToast("No password to copy!", "error"); return; }
    copyToClipboard(val, "Password copied to clipboard! 📋");
};
window.copyQRText = () => {
    const val = UI.qrGenInput ? UI.qrGenInput.value : '';
    if (!val) { showToast("No QR text to copy!", "error"); return; }
    copyToClipboard(val, "QR Link copied to clipboard! 📋");
};
window.startQuiz = () => openModal('quiz');
window.openEvidenceChecklist = () => openModal('evidence');
window.openDontsChecklist = () => openModal('donts');
window.selectLawCase = (type) => openModal(`law-${type}`);
window.openFeedbackModal = () => openModal('contact');
window.closeSimpleModal = closeModals;
window.closeContactModal = closeModals;
window.openPrivacyModal = () => openModal('privacy');
window.openTermsModal = () => openModal('terms');
window.toggleAiLearnMore = () => {
    const content = UI.aiLearnMoreContent;
    const icon = UI.aiLearnIcon;
    if (!content) return;
    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.innerText = '−';
    } else {
        content.classList.add('hidden');
        if (icon) icon.innerText = '+';
    }
};
window.installPWA = () => {
    const btn = UI.installBtn;
    if (btn) btn.classList.add('hidden');
    if (State.deferredPrompt) {
        State.deferredPrompt.prompt();
        State.deferredPrompt = null;
        return;
    }
    showToast('PWA install prompt is not ready yet. Please use browser menu to install.', 'info');
};

const bindEvents = () => {
    // SPA View Navigation
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetView = btn.dataset.view;
            if (targetView) {
                switchDashboardView(targetView);
                const mobileMenu = UI.mobileMenu;
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Brand logo click goes home
    if (UI.brandLogoBtn) UI.brandLogoBtn.addEventListener('click', () => switchDashboardView('dashboard'));
    if (UI.langMenuToggle) UI.langMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleLangMenu(); });
    document.addEventListener('click', () => toggleLangMenu(true));

    // Language selection
    UI.langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyLanguage(btn.dataset.lang);
            toggleLangMenu(true);
        });
    });

    if(UI.mobileMenuBtn) UI.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Scanner Tab switching
    UI.tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            switchScanMode(btn.dataset.mode);
        });
        btn.addEventListener('keydown', (e) => {
            let newIndex = index;
            if (e.key === 'ArrowRight') newIndex = (index + 1) % UI.tabBtns.length;
            if (e.key === 'ArrowLeft') newIndex = (index - 1 + UI.tabBtns.length) % UI.tabBtns.length;
            if (newIndex !== index) {
                UI.tabBtns[newIndex].focus();
                switchScanMode(UI.tabBtns[newIndex].dataset.mode);
            }
        });
    });

    // Inputs & Primary Scanner Actions
    if(UI.fileHashInput) UI.fileHashInput.addEventListener('change', handleFileHash);
    if(UI.qrInput) UI.qrInput.addEventListener('change', handleQrUpload);
    if(UI.submitBtn) UI.submitBtn.addEventListener('click', executeScan);

    // Tools
    if(UI.pwdInput) UI.pwdInput.addEventListener('input', checkPasswordStrength);
    if(UI.genPwdBtn) UI.genPwdBtn.addEventListener('click', generatePassword);
    if(UI.genQrBtn) UI.genQrBtn.addEventListener('click', generateQR);
    if(UI.startQuizBtn) UI.startQuizBtn.addEventListener('click', () => openModal('quiz'));

    // Action Kit & Legal
    if(UI.evidenceBtn) UI.evidenceBtn.addEventListener('click', () => openModal('evidence'));
    if(UI.dontsBtn) UI.dontsBtn.addEventListener('click', () => openModal('donts'));
    if(document.getElementById('pdfDownloadBtn')) document.getElementById('pdfDownloadBtn').addEventListener('click', downloadPDFReport);
    UI.lawCaseBtns.forEach(btn => btn.addEventListener('click', (e) => openModal(`law-${e.target.dataset.case || 'money'}`)));

    // Modals
    const openContact = () => openModal('contact');
    if(document.getElementById('floatingContactBtn')) document.getElementById('floatingContactBtn').addEventListener('click', openContact);
    if(document.getElementById('footerContactBtn')) document.getElementById('footerContactBtn').addEventListener('click', openContact);
    if(document.getElementById('footerPrivacyBtn')) document.getElementById('footerPrivacyBtn').addEventListener('click', () => openModal('privacy'));
    if(document.getElementById('footerTermsBtn')) document.getElementById('footerTermsBtn').addEventListener('click', () => openModal('terms'));

    document.querySelectorAll('#closeSimpleModalBtnTop, #closeSimpleModalBtnBottom, #closeContactModalBtn').forEach(btn => {
        if(btn) btn.addEventListener('click', closeModals);
    });

    // FAQ
    UI.faqTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const panel = item ? item.querySelector('.faq-panel') : null;
            const icon = btn.querySelector('.faq-icon');
            if (!panel || !icon) return;
            const isHidden = panel.classList.toggle('hidden');
            icon.textContent = isHidden ? '+' : '−';
            btn.setAttribute('aria-expanded', String(!isHidden));
        });
    });

    // PWA
    if(UI.installBtn) {
        UI.installBtn.addEventListener('click', window.installPWA);
    }
};

export const renderEncyclopediaCards = () => {
    renderScamEncyclopedia();
};

// Application Boot
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initiate boot sequence preloader immediately
    try { bootSequence(); } catch(e) { console.error('Boot sequence init error:', e); }

    // 2. Safe modular initializations - no single error can halt application startup
    const safeInit = (fn, name) => {
        try { fn(); } catch(e) { console.warn(`Module init warning [${name}]:`, e); }
    };

    safeInit(bindEvents, 'bindEvents');
    safeInit(initEventBindings, 'initEventBindings');
    safeInit(() => applyLanguage(State.currentLang), 'applyLanguage');
    safeInit(() => switchScanMode(State.currentMode), 'switchScanMode');
    safeInit(initCanvasAnimation, 'initCanvasAnimation');
    safeInit(initShield3DEffect, 'initShield3DEffect');
    safeInit(initThreatGlobe, 'initThreatGlobe');
    safeInit(initCyberAlerts, 'initCyberAlerts');
    safeInit(fetchCyberIntelligence, 'fetchCyberIntelligence');
    safeInit(renderScamEncyclopedia, 'renderScamEncyclopedia');
    safeInit(renderSafetyDashboard, 'renderSafetyDashboard');
    safeInit(renderEmergencyCenter, 'renderEmergencyCenter');
    safeInit(() => renderCyberCellDetails('DL'), 'renderCyberCellDetails');
    safeInit(initIndiaThreatMap, 'initIndiaThreatMap');
    safeInit(initServiceWorker, 'initServiceWorker');
});