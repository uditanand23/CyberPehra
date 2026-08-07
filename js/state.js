export const State = {
    version: '5.0.0',
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