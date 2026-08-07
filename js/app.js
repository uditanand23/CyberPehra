import { State } from './state.js';
import { UI, toggleMobileMenu, openModal, closeModals, initCanvasAnimation, initLiveMeters, bootSequence, showToast, switchDashboardView, initShield3DEffect, initThreatGlobe } from './ui.js';
import { applyLanguage, toggleLangMenu } from './language.js';
import { switchScanMode, handleFileHash, executeScan, handleQrUpload } from './scanner.js';
import { checkPasswordStrength, generatePassword, generateQR, downloadPDFReport, copyToClipboard, ScamEncyclopediaDB, updateSafetyChecklist, initCyberAlerts, runBrowserSecurityCheck, fetchCyberIntelligence, renderScamEncyclopedia, filterScamsCategory, filterScams, clearScamSearch, openScamDetails, executeRelatedScamTool, renderSafetyDashboard, toggleChecklistItem, toggleSelectAllChecklist, filterChecklistCategory, resetSafetyDashboard, executeFixTool, downloadCyberHygienePDFReport, renderEmergencyCenter, switchEmergencyIncident, downloadEmergencyActionPDF, renderStateThreatDetails } from './tools.js';
import { initServiceWorker } from './utils.js';

// Expose global window methods for inline HTML onclick attributes
window.switchDashboardView = switchDashboardView;
window.selectIndiaState = (code) => {
    renderStateThreatDetails(code);
    State.selectedState = code;
};
window.toggleLangMenu = toggleLangMenu;
window.setLanguage = (lang) => applyLanguage(lang);
window.toggleMobileMenu = toggleMobileMenu;
window.switchMode = (mode) => switchScanMode(mode);
window.handleFileHash = handleFileHash;
window.handleQrUpload = handleQrUpload;
window.executeScan = executeScan;
window.downloadPDFReport = downloadPDFReport;
window.runBrowserSecurityCheck = runBrowserSecurityCheck;
window.refreshCyberIntel = () => fetchCyberIntelligence(true);
window.openBrowserCheckModal = () => {
    openModal('browser');
    runBrowserSecurityCheck();
};
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
    alert('PWA install prompt is not ready yet. Please use browser menu to install.');
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
    bindEvents();
    applyLanguage(State.currentLang);
    switchScanMode(State.currentMode);
    initCanvasAnimation();
    initShield3DEffect();
    initThreatGlobe();
    initCyberAlerts();
    fetchCyberIntelligence();
    renderScamEncyclopedia();
    renderSafetyDashboard();
    renderEmergencyCenter();
    renderStateThreatDetails('BR'); // Default Bihar state threat info
    initServiceWorker();
    bootSequence();
});