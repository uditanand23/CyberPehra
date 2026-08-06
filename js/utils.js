import { State } from './state.js';
import { UI } from './ui.js';

export const sanitizeHTML = (str) => {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

export const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => {
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault(); 
                    State.deferredPrompt = e; 
                    if(UI.installBtn) UI.installBtn.classList.remove('hidden'); 
                });
            })
            .catch(err => console.warn('PWA SW Registration Failed (Development Environment or Network Issue):', err));
    }
};