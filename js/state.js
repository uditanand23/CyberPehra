export const State = {
    currentMode: 'url',
    currentLang: localStorage.getItem('cyberpehra_lang') || 'en',
    pendingHash: null,
    isScanning: false,
    deferredPrompt: null
};