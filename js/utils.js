import { State } from './state.js';
import { UI, showToast } from './ui.js';

export const sanitizeHTML = (str) => {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

export const initServiceWorker = () => {
    // Check standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const pwaContainer = document.getElementById('pwaInstallMenuContainer');
    const pwaBtn = document.getElementById('pwaInstallActionBtn');
    const pwaSubtitle = document.getElementById('pwaInstallSubtitle');

    if (isStandalone) {
        if (pwaContainer) pwaContainer.classList.add('hidden');
        return;
    }

    // Register Service Worker if supported
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('CyberPehra Service Worker active:', reg.scope);
            })
            .catch(err => console.warn('CyberPehra SW Notice:', err));
    }

    // iOS Safari Fallback Handling
    if (isIOS) {
        if (pwaContainer) pwaContainer.classList.remove('hidden');
        if (pwaSubtitle) pwaSubtitle.innerText = 'Tap Share → Add to Home Screen';
        if (pwaBtn) {
            pwaBtn.innerText = 'How to Add';
            pwaBtn.onclick = () => {
                showToast("iOS Install: Tap Share in Safari → 'Add to Home Screen'", "info");
            };
        }
        return;
    }

    // Listen for beforeinstallprompt event (Android / Chromium)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredInstallPrompt = e;
        State.deferredPrompt = e;
        if (pwaContainer) pwaContainer.classList.remove('hidden');
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
        window.deferredInstallPrompt = null;
        State.deferredPrompt = null;
        if (pwaContainer) pwaContainer.classList.add('hidden');
        showToast("CyberPehra app installed successfully! 🚀", "success");
    });
};

export const triggerPWAInstall = async () => {
    const promptEvent = window.deferredInstallPrompt || State.deferredPrompt;
    if (!promptEvent) {
        showToast("Install CyberPehra: Tap browser menu → 'Add to Home Screen'", "info");
        return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
        window.deferredInstallPrompt = null;
        State.deferredPrompt = null;
        const pwaContainer = document.getElementById('pwaInstallMenuContainer');
        if (pwaContainer) pwaContainer.classList.add('hidden');
        showToast("CyberPehra installed successfully! 🚀", "success");
    }
};