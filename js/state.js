export const State = {
    currentMode: 'url',
    currentLang: localStorage.getItem('cyberpehra_lang') || 'en',
    currentView: 'dashboard',
    selectedState: null,
    isBooting: true,
    pendingHash: null,
    isScanning: false,
    deferredPrompt: null,
    lastScanResult: null
};