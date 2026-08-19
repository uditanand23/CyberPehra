import { State } from './state.js';
import { UI, toggleMobileMenu, openModal, closeModals, initCanvasAnimation, initLiveMeters, bootSequence, showToast, switchDashboardView, initShield3DEffect, initThreatGlobe } from './ui.js';
import { applyLanguage, toggleLangMenu } from './language.js';
import { switchScanMode, handleFileHash, executeScan, handleQrUpload } from './scanner.js';
import { checkPasswordStrength, generatePassword, generateQR, downloadPDFReport, copyToClipboard, ScamEncyclopediaDB, updateSafetyChecklist, initCyberAlerts, fetchCyberIntelligence, renderScamEncyclopedia, filterScamsCategory, filterScams, clearScamSearch, openScamDetails, executeRelatedScamTool, renderSafetyDashboard, toggleChecklistItem, toggleSelectAllChecklist, filterChecklistCategory, resetSafetyDashboard, executeFixTool, downloadCyberHygienePDFReport, renderEmergencyCenter, switchEmergencyIncident, downloadEmergencyActionPDF, renderStateThreatDetails, runWhoisLookup, runIpLookup, runDnsLookup, handleScreenshotUpload, runPasswordBreachCheck, renderCyberCellDetails, renderCyberQuiz, submitQuizAnswer, nextQuizQuestion, resetCyberQuiz, openScreenshotWorkspace, closeScreenshotWorkspace, toggleWorkspaceLangMenu, renderScreenshotWorkspace, handleWorkspaceDrop, handleWorkspaceFileSelect, setActiveScreenshotIndex, clearAllScreenshots, adjustScreenshotZoom, rotateScreenshotCanvas, resetScreenshotCanvasView, toggleScreenshotRedactMode, clearScreenshotRedactions, cancelScreenshotScan, startScreenshotInvestigation, downloadScreenshotPDFReport, copyScreenshotReportText } from './tools.js';
import { initServiceWorker, triggerPWAInstall } from './utils.js';
import { initIndiaThreatMap, openStateReportModal, closeStateReportModal } from './indiaMap.js';
import { initEventBindings } from './eventBindings.js';

// Expose global window methods for inline HTML onclick attributes
window.triggerPWAInstall = triggerPWAInstall;
window.switchDashboardView = switchDashboardView;
window.initIndiaThreatMap = initIndiaThreatMap;
window.selectIndiaState = (code) => {
    openStateReportModal(code);
    State.selectedState = code;
};
window.closeStateReportModal = closeStateReportModal;
window.toggleLangMenu = toggleLangMenu;
window.setLanguage = (lang) => applyLanguage(lang);
window.toggleMobileMenu = toggleMobileMenu;
window.switchMode = (mode) => switchScanMode(mode);
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