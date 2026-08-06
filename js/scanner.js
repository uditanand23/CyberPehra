import { State } from './state.js';
import { UI } from './ui.js';
import { sanitizeHTML } from './utils.js';

export const switchScanMode = (mode) => {
    State.currentMode = mode;
    
    UI.tabBtns.forEach(btn => {
        const isActive = btn.dataset.mode === mode;
        btn.setAttribute('aria-selected', String(isActive));
        btn.setAttribute('tabindex', isActive ? "0" : "-1");
    });
    
    UI.scanPanels.forEach(panel => panel.classList.remove('active'));
    
    const activePanel = document.getElementById(`panel-${mode}`);
    if(activePanel) activePanel.classList.add('active');
    if(UI.resultBox) UI.resultBox.classList.add('hidden');
    
    if (mode === 'upi' || mode === 'phone') {
        UI.submitBtn.disabled = true; 
        UI.submitBtn.classList.add('opacity-40', 'cursor-not-allowed'); 
        UI.submitBtn.innerText = "Coming Soon (No Fake Scores)";
    } else {
        UI.submitBtn.disabled = false; 
        UI.submitBtn.classList.remove('opacity-40', 'cursor-not-allowed'); 
        UI.submitBtn.innerText = "Run Risk Analysis";
    }

    UI.scanModeIndicator.innerText = `Active Mode: ${mode.toUpperCase()} Verification`;
};

const updateResultUI = (isError, riskScore, malicious, total, domainOrHash, status, firstSeen) => {
    UI.breakdownContainer.classList.remove('hidden');
    
    if (isError) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-mono bg-rose-950 text-rose-400 border-rose-800"; 
        UI.badgeStatus.innerText = "SCAN FAILED"; 
        UI.gaugeArc.style.stroke = "#F43F5E"; 
        UI.gaugeArc.style.strokeDashoffset = 0; 
        UI.gaugeValue.innerText = "ERR"; 
        UI.resultText.innerHTML = `<strong class="text-rose-400">Analysis Error:</strong> ${sanitizeHTML(status)}<br><span class="text-slate-400 text-xs">Please verify the input and try again.</span>`; 
        UI.breakdownContainer.classList.add('hidden'); 
        UI.govGuide.classList.add('hidden');
        return;
    }

    UI.breakdownContainer.innerHTML = `<div><strong>Target:</strong> ${sanitizeHTML(domainOrHash)}</div><div><strong>Analysis Status:</strong> ${sanitizeHTML(status)}</div><div><strong>Detections:</strong> ${malicious} / ${total} vendors</div><div><strong>Timestamp:</strong> ${sanitizeHTML(firstSeen)}</div>`;
    const safeTarget = sanitizeHTML(domainOrHash);

    if (riskScore >= 40 || malicious > 0) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-mono bg-rose-950 text-rose-400 border-rose-800 animate-pulse"; 
        UI.badgeStatus.innerText = "HIGH RISK // SUSPICIOUS"; 
        UI.gaugeArc.style.stroke = "#F43F5E"; 
        UI.gaugeArc.style.strokeDashoffset = 251 - (riskScore / 100) * 251; 
        UI.gaugeValue.innerText = (State.currentMode === 'file') ? `${malicious}/${total}` : `${riskScore}%`; 
        UI.resultText.innerHTML = `<strong class="text-rose-400">High Risk Threat Detected:</strong> Multiple security vendors flagged <code>${safeTarget}</code>. Avoid interaction.`; 
        UI.govGuide.classList.remove('hidden');
    } else if (riskScore > 0) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-mono bg-amber-950 text-amber-400 border-amber-800"; 
        UI.badgeStatus.innerText = "CAUTION ADVISED"; 
        UI.gaugeArc.style.stroke = "#F59E0B"; 
        UI.gaugeArc.style.strokeDashoffset = 251 - (riskScore / 100) * 251; 
        UI.gaugeValue.innerText = (State.currentMode === 'file') ? `${malicious}/${total}` : `${riskScore}%`; 
        UI.resultText.innerHTML = `<strong class="text-amber-400">Moderate Risk Flags:</strong> Minor warnings exist for <code>${safeTarget}</code>. Proceed with caution.`; 
        UI.govGuide.classList.add('hidden');
    } else {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-mono bg-emerald-950 text-emerald-400 border-emerald-800"; 
        UI.badgeStatus.innerText = "SECURE // SAFE"; 
        UI.gaugeArc.style.stroke = "#34D399"; 
        UI.gaugeArc.style.strokeDashoffset = 251; 
        UI.gaugeValue.innerText = (State.currentMode === 'file') ? `0/${total}` : "0%"; 
        UI.resultText.innerHTML = `<strong class="text-emerald-400">No Malicious Indicators Found:</strong> Security vendors did not flag <code>${safeTarget}</code>.`; 
        UI.govGuide.classList.add('hidden');
    }
};

export const runURLScan = async (urlInput) => {
    let parsedUrl;
    try {
        if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) throw new Error("URL must start with http:// or https://");
        parsedUrl = new URL(urlInput);
        if (parsedUrl.protocol === 'file:' || parsedUrl.protocol === 'ftp:') throw new Error("Local file protocols cannot be scanned.");
    } catch (e) {
        updateResultUI(true, 0, 0, 0, "", e.message, "");
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/virustotal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || `VirusTotal request failed`);

        const domain = parsedUrl.hostname;
        const stats = payload.stats || {};
        const malicious = Number(stats.malicious || 0);
        const suspicious = Number(stats.suspicious || 0);
        const total = malicious + suspicious + Number(stats.harmless || 0) + Number(stats.undetected || 0) || 70;
        const riskScore = total > 0 ? Math.min(99, Math.round(((malicious + suspicious) / total) * 100)) : 0;
        const dateStr = payload.last_analysis_date ? new Date(payload.last_analysis_date * 1000).toLocaleString('en-IN') : 'Available in report';

        updateResultUI(false, riskScore, malicious + suspicious, total, domain, payload.status || 'Completed', dateStr);
    } catch (e) {
        updateResultUI(true, 0, 0, 0, "", e.message, "");
    }
};

export const handleFileHash = async (event) => {
    const file = event.target.files[0]; 
    if (!file) return;
    event.target.value = ''; 
    
    if (file.size > 50 * 1024 * 1024) {
        UI.fileHashIndicator.classList.remove('hidden');
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
        UI.fileHashIndicator.innerText = 'Error: File exceeds local 50MB hashing limit to prevent browser crash.';
        return;
    }

    if (!crypto || !crypto.subtle) {
        UI.fileHashIndicator.classList.remove('hidden');
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
        UI.fileHashIndicator.innerText = 'Error: Secure context (HTTPS) is required for local cryptographic hashing.';
        return;
    }

    UI.fileHashIndicator.classList.remove('hidden');
    UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-amber-400 bg-amber-950/40 border border-amber-800/50';
    UI.fileHashIndicator.innerText = 'Computing SHA-256 hash locally on client...';

    try {
        const buffer = await file.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', buffer);
        State.pendingHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-green-400 bg-green-950/40 border border-green-800/50';
        UI.fileHashIndicator.innerText = `File: ${sanitizeHTML(file.name)} (${(file.size/1024).toFixed(1)} KB)\nSHA-256: ${State.pendingHash}`;
    } catch(err) { 
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
        UI.fileHashIndicator.innerText = 'Local SHA-256 computation failed.'; 
        State.pendingHash = null; 
    }
};

export const runFileScan = async () => {
    if (!State.pendingHash) { 
        updateResultUI(true, 0, 0, 0, "", "No file selected. Please select a file to compute its hash first.", "");
        return; 
    }
    try {
        const response = await fetch('/.netlify/functions/virustotal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'file', hash: State.pendingHash })
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || `VirusTotal file scan failed`);

        const stats = payload.stats || {};
        const malicious = Number(stats.malicious || 0);
        const suspicious = Number(stats.suspicious || 0);
        const total = malicious + suspicious + Number(stats.harmless || 0) + Number(stats.undetected || 0) || 70;
        const riskScore = total > 0 ? Math.min(99, Math.round(((malicious + suspicious) / total) * 100)) : 0;
        const attributes = payload.report?.attributes || {};
        const dateStr = attributes.first_submission_date ? new Date(attributes.first_submission_date * 1000).toLocaleDateString('en-IN') : 'Unavailable';

        updateResultUI(false, riskScore, malicious + suspicious, total, State.pendingHash.substring(0, 16) + '...', payload.status || 'Completed', dateStr);
    } catch (err) {
        updateResultUI(true, 0, 0, 0, "", err.message, "");
    }
};

export const runChatScan = () => {
    const text = UI.chatInputArea.value;
    if(!text) { 
        updateResultUI(true, 0, 0, 0, "", "No text provided. Paste a message to scan.", "");
        return; 
    }
    let score = 10, flags = []; 
    const lower = text.toLowerCase();
    
    if(lower.includes('otp') || lower.includes('code')) { flags.push('⚠️ Requested OTP or Verification Code'); score += 35; }
    if(lower.includes('urgent') || lower.includes('block') || lower.includes('suspend') || lower.includes('arrest')) { flags.push('⚠️ Created false urgency / Panic'); score += 25; }
    if(lower.includes('job') || lower.includes('salary') || lower.includes('task') || lower.includes('part time')) { flags.push('⚠️ Suspicious Task/Job offer'); score += 25; }
    if(lower.includes('telegram') || lower.includes('t.me') || lower.includes('wa.me')) { flags.push('⚠️ Attempted platform shift'); score += 15; }
    if(lower.includes('lottery') || lower.includes('prize') || lower.includes('crore')) { flags.push('⚠️ Fake Lottery/Prize bait'); score += 40; }
    
    UI.breakdownContainer.classList.remove('hidden'); 
    UI.breakdownContainer.innerHTML = `<div><strong>Indicators Found:</strong> ${flags.length}</div>`;
    
    if(flags.length === 0) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-mono bg-emerald-950 text-emerald-400 border-emerald-800"; 
        UI.badgeStatus.innerText = "NO FLAGS FOUND"; 
        UI.gaugeArc.style.stroke = "#34D399"; 
        UI.gaugeArc.style.strokeDashoffset = 251 - (0.12 * 251); 
        UI.gaugeValue.innerText = "12%"; 
        UI.resultText.innerHTML = `<strong class="text-emerald-400">No obvious scam markers found.</strong> However, always verify the sender's identity independently.`;
    } else {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-mono bg-rose-950 text-rose-400 border-rose-800 animate-pulse"; 
        UI.badgeStatus.innerText = "HIGH RISK SCAM"; 
        let finalScore = Math.min(score, 99); 
        UI.gaugeArc.style.stroke = "#F43F5E"; 
        UI.gaugeArc.style.strokeDashoffset = 251 - (finalScore / 100) * 251; 
        UI.gaugeValue.innerText = finalScore + "%";
        let msg = `<strong class="text-rose-400">Scam Language Detected:</strong><br><ul class="list-disc pl-4 mt-2">`; 
        flags.forEach(f => msg += `<li>${sanitizeHTML(f)}</li>`); 
        msg += `</ul>`; 
        UI.resultText.innerHTML = msg;
    }
};

export const executeScan = async () => {
    if (State.isScanning) return;
    State.isScanning = true;
    
    UI.submitBtn.disabled = true;
    UI.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    UI.resultBox.classList.remove('hidden');
    UI.scanBeamEl.classList.remove('hidden');
    UI.resultText.innerHTML = '<span class="text-slate-400 animate-pulse">Establishing secure connection... Analyzing telemetry data...</span>';
    
    try {
        if (State.currentMode === 'url') await runURLScan(UI.urlInputArea.value.trim());
        else if (State.currentMode === 'file') await runFileScan();
        else if (State.currentMode === 'chat') runChatScan();
    } finally {
        UI.scanBeamEl.classList.add('hidden');
        UI.submitBtn.disabled = false;
        UI.submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        State.isScanning = false;
    }
};

export const handleQrUpload = (event) => {
    const file = event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;
    event.target.value = ''; 

    if (!file.type.startsWith('image/')) {
        UI.qrIndicator.classList.remove('hidden');
        UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
        UI.qrIndicator.innerText = 'Please upload a valid image file.';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const result = reader.result;
        const image = new Image();
        image.onload = () => {
            const MAX_WIDTH = 800;
            let width = image.width;
            let height = image.height;
            if (width > MAX_WIDTH) {
                height = Math.floor(height * (MAX_WIDTH / width));
                width = MAX_WIDTH;
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            UI.qrIndicator.classList.remove('hidden');
            if (!code) {
                UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-amber-400 bg-amber-950/40 border border-amber-800/50';
                UI.qrIndicator.innerText = 'No QR code detected. Try a clearer image.';
            } else {
                UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-green-400 bg-green-950/40 border border-green-800/50';
                UI.qrIndicator.innerText = `Decoded: ${code.data}`;
            }
        };
        image.onerror = () => {
            UI.qrIndicator.classList.remove('hidden');
            UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-mono break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
            UI.qrIndicator.innerText = 'The image could not be decoded.';
        };
        image.src = result;
    };
    reader.readAsDataURL(file);
};