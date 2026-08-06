import { UI } from './ui.js';
import { sanitizeHTML } from './utils.js';

export const checkPasswordStrength = () => {
    const pwd = UI.pwdInput.value;
    if (!pwd) { UI.pwdBar.style.width = '0%'; UI.pwdFeedback.innerText = ''; return; }
    let s = 0; 
    if (pwd.length >= 8) s += 30; 
    if (/[A-Z]/.test(pwd)) s += 25; 
    if (/[0-9]/.test(pwd)) s += 25; 
    if (/[^A-Za-z0-9]/.test(pwd)) s += 20;
    
    UI.pwdBar.style.width = s + '%'; 
    UI.pwdBar.className = `h-full transition-all duration-300 ${s < 50 ? 'bg-rose-500' : s < 80 ? 'bg-amber-400' : 'bg-green-500'}`;
    UI.pwdFeedback.innerText = s < 50 ? 'Weak entropy' : s < 80 ? 'Moderate strength' : 'High entropy strong password';
};

export const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"; 
    let pass = "";
    const randomValues = new Uint32Array(16);
    window.crypto.getRandomValues(randomValues);
    for(let i = 0; i < 16; i++) {
        pass += charset[randomValues[i] % charset.length];
    }
    UI.pwdInput.value = pass; 
    checkPasswordStrength();
};

export const generateQR = () => {
    const val = sanitizeHTML(UI.qrGenInput.value);
    if (!val) return; 
    UI.qrOutput.innerHTML = ""; 
    UI.qrOutput.classList.remove('hidden'); 
    new QRCode(UI.qrOutput, { text: val, width: 120, height: 120 });
};

export const downloadPDFReport = () => {
    if(!window.jspdf) { alert("PDF generator is loading. Please wait."); return; }
    const doc = new window.jspdf.jsPDF(); 
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(16); 
    doc.text("CYBERPEHRA - THREAT REPORT", 20, 20); 
    doc.setFontSize(10); 
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30); 
    doc.text(doc.splitTextToSize(UI.resultText.innerText, 170), 20, 45); 
    doc.save(`CyberPehra_Report.pdf`);
};