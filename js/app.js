import { State } from './state.js';
import { UI, toggleMobileMenu, openModal, closeModals, initCanvasAnimation, initLiveMeters, bootSequence } from './ui.js';
import { applyLanguage, toggleLangMenu } from './language.js';
import { switchScanMode, handleFileHash, executeScan, handleQrUpload } from './scanner.js';
import { checkPasswordStrength, generatePassword, generateQR, downloadPDFReport } from './tools.js';
import { initServiceWorker } from './utils.js';

const bindEvents = () => {
    // Navigation & UI
    if(UI.brandLogoBtn) UI.brandLogoBtn.addEventListener('click', () => window.scrollTo(0,0));
    if(UI.langMenuToggle) UI.langMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleLangMenu(); });
    document.addEventListener('click', () => toggleLangMenu(true));
    
    // Language logic fix
    UI.langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyLanguage(btn.dataset.lang);
            toggleLangMenu(true);
        });
    });
    
    if(UI.mobileMenuBtn) UI.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    UI.mobileNavLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));
    
    // Tab logic fix
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

    // Inputs & Primary Actions
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
    UI.lawCaseBtns.forEach(btn => btn.addEventListener('click', (e) => openModal(`law-${e.target.dataset.case}`)));
    
    // Modals
    const openContact = () => { if(UI.contactModal) { UI.contactModal.classList.remove('hidden'); UI.contactModal.classList.add('flex'); } };
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
        UI.installBtn.addEventListener('click', () => {
            UI.installBtn.classList.add('hidden');
            if (State.deferredPrompt) {
                State.deferredPrompt.prompt();
                State.deferredPrompt = null;
            }
        });
    }
};

// Application Boot
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    applyLanguage(State.currentLang);
    switchScanMode(State.currentMode);
    initCanvasAnimation();
    initLiveMeters();
    initServiceWorker();
    bootSequence();
});