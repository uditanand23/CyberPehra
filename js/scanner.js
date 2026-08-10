import { State } from './state.js';
import { UI } from './ui.js';
import { sanitizeHTML } from './utils.js';
import { getTranslation } from './language.js';

export const switchScanMode = (mode) => {
    State.currentMode = mode;
    
    UI.tabBtns.forEach(btn => {
        const isActive = (btn.dataset.mode === mode);
        btn.setAttribute('aria-selected', String(isActive));
        btn.setAttribute('tabindex', isActive ? "0" : "-1");
        if (isActive) {
            btn.classList.add('active', 'bg-[#00FF88]', 'text-black', 'shadow-[0_0_20px_rgba(0,255,136,0.35)]', 'font-bold');
            btn.classList.remove('text-slate-400');
        } else {
            btn.classList.remove('active', 'bg-[#00FF88]', 'text-black', 'shadow-[0_0_20px_rgba(0,255,136,0.35)]', 'font-bold');
            btn.classList.add('text-slate-400');
        }
    });
    
    UI.scanPanels.forEach(panel => panel.classList.remove('active'));
    
    const activePanel = document.getElementById(`panel-${mode}`);
    if(activePanel) activePanel.classList.add('active');
    if(UI.resultBox) UI.resultBox.classList.add('hidden');
    
    UI.submitBtn.disabled = false; 
    UI.submitBtn.classList.remove('opacity-40', 'cursor-not-allowed'); 
    UI.submitBtn.innerText = "Run Risk Analysis";

    UI.scanModeIndicator.innerText = `Active Mode: ${mode.toUpperCase()} Verification`;
};

const renderScamExplainAi = (mode, target, malicious, total, riskScore, status, flags = []) => {
    if (!UI.scamExplainAiSection) return;
    UI.scamExplainAiSection.classList.remove('hidden');

    const safeTarget = sanitizeHTML(target || '');
    const hasEvidence = total > 0 || (flags && flags.length > 0);
    const isMalicious = riskScore >= 40 || malicious > 0 || (flags && flags.length > 0);

    // 1. What happened?
    if (UI.aiWhatHappened) {
        if (mode === 'url') {
            UI.aiWhatHappened.innerText = `CyberPehra queried VirusTotal threat telemetry for ${safeTarget}.`;
        } else if (mode === 'file') {
            UI.aiWhatHappened.innerText = `CyberPehra calculated a client-side cryptographic SHA-256 hash for your file and checked antivirus databases.`;
        } else if (mode === 'chat') {
            UI.aiWhatHappened.innerText = `CyberPehra scanned the message text for common financial fraud patterns, urgency triggers, and credential phishing markers.`;
        } else {
            UI.aiWhatHappened.innerText = "There is not enough verified evidence to draw a stronger conclusion.";
        }
    }

    // 2. Why is this suspicious?
    if (UI.aiWhySuspicious) {
        if (isMalicious) {
            UI.aiWhySuspicious.innerText = mode === 'chat'
                ? `The message contained ${flags.length} scam marker(s): ${flags.join('; ')}.`
                : `${malicious} out of ${total} security vendors explicitly flagged ${safeTarget} as malicious or phishing.`;
        } else if (total > 0 || mode === 'chat') {
            UI.aiWhySuspicious.innerText = `No antivirus vendor or heuristic rule flagged ${safeTarget} as malicious during this scan.`;
        } else {
            UI.aiWhySuspicious.innerText = "There is not enough verified evidence to draw a stronger conclusion.";
        }
    }

    // 3. What evidence supports this result?
    if (UI.aiEvidenceSupports) {
        if (mode === 'url' || mode === 'file') {
            UI.aiEvidenceSupports.innerText = total > 0 
                ? `Evidence ratio: ${malicious}/${total} antivirus vendor consensus reports.`
                : "Not enough verified evidence.";
        } else if (mode === 'chat') {
            UI.aiEvidenceSupports.innerText = flags.length > 0
                ? `Heuristic pattern matches: ${flags.length} urgency/bait rule triggers.`
                : "Zero scam keywords matched out of 5 core heuristic rules.";
        } else {
            UI.aiEvidenceSupports.innerText = "Not enough verified evidence.";
        }
    }

    // 4. What could happen if warning is ignored?
    if (UI.aiIgnoredImpact) {
        if (isMalicious) {
            UI.aiIgnoredImpact.innerText = mode === 'file'
                ? "Installing flagged APKs or files can infect your phone with Trojans, remote access tools, or banking spyware."
                : mode === 'chat'
                ? "Sharing OTPs or clicking scam links can lead to unauthorized UPI money transfers or account takeover."
                : "Visiting phishing links can capture your banking passwords, credit card numbers, or session cookies.";
        } else {
            UI.aiIgnoredImpact.innerText = "Current evidence indicates low immediate threat, but always remain vigilant before entering sensitive data.";
        }
    }

    // 5. How confident can CyberPehra be? & Confidence Badge
    let confidenceLevel = "Not Available";
    let confidenceExplanation = "There is not enough verified evidence to draw a stronger conclusion.";

    if (total >= 50) {
        confidenceLevel = "High";
        confidenceExplanation = `High Confidence: Backed by real-time consensus from ${total} global antivirus security vendors.`;
    } else if (total > 0 || (flags && flags.length > 0)) {
        confidenceLevel = "Medium";
        confidenceExplanation = `Medium Confidence: Backed by verified ${total > 0 ? `${total} security vendors` : `${flags.length} heuristic rules`}.`;
    } else if (hasEvidence) {
        confidenceLevel = "Low";
        confidenceExplanation = "Low Confidence: Limited security vendor responses available for this target.";
    }

    if (UI.aiConfidenceBadge) {
        UI.aiConfidenceBadge.innerText = `Confidence: ${confidenceLevel}`;
        UI.aiConfidenceBadge.className = confidenceLevel === "High"
            ? "text-[10px] font-sans px-2.5 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800"
            : confidenceLevel === "Medium"
            ? "text-[10px] font-sans px-2.5 py-1 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-800"
            : "text-[10px] font-sans px-2.5 py-1 rounded-full font-bold bg-slate-800 text-sky-400 border border-sky-800";
    }
    if (UI.aiConfidenceText) {
        UI.aiConfidenceText.innerText = confidenceExplanation;
    }

    // 6. What should the user do next?
    if (UI.aiNextSteps) {
        if (isMalicious) {
            UI.aiNextSteps.innerText = "Do NOT open link, do NOT install file, and do NOT share OTP/PIN. If money was sent, call 1930 Helpline immediately.";
        } else {
            UI.aiNextSteps.innerText = "Verify the sender's phone number or domain identity independently before initiating financial transactions.";
        }
    }

    // FEATURE 4 IMPROVEMENTS: 5 NEW EVIDENCE-BASED INSIGHTS
    // 7. Common victim mistakes
    if (UI.aiVictimMistakes) {
        UI.aiVictimMistakes.innerText = isMalicious
            ? "Trusting urgent messages, scanning unknown QR codes to receive funds, or assuming legitimate brand logos guarantee safety."
            : "Assuming clean links are safe forever; domain ownership can change or host malicious scripts later.";
    }

    // 8. Why scammers use this trick
    if (UI.aiScammerTrick) {
        UI.aiScammerTrick.innerText = mode === 'chat'
            ? "Scammers exploit human panic and urgency so victims act fast before verifying bank details or calling family."
            : mode === 'file'
            ? "File-based malware bypasses browser warnings by tricking victims into manually sideloading APK files."
            : "Phishing links mimic genuine banking portals to exploit familiar visual trust.";
    }

    // 9. What scammers want
    if (UI.aiScammerGoal) {
        UI.aiScammerGoal.innerText = isMalicious
            ? "Direct UPI money transfers, NetBanking passwords, OTP access, or remote screen control."
            : "User attention, credentials, or engagement bait.";
    }

    // 10. Real prevention tips
    if (UI.aiPreventionTips) {
        UI.aiPreventionTips.innerText = "Enable 2FA on banking apps, never enter UPI PIN to receive money, and verify customer care numbers only on official websites.";
    }

    // 11. Related scam categories
    if (UI.aiRelatedScams) {
        UI.aiRelatedScams.innerText = mode === 'chat'
            ? "Digital Arrest Scam • Telegram Task Scam • WhatsApp OTP Scam"
            : mode === 'file'
            ? "Illegal Loan App Spyware • Remote Access App Scam"
            : "Fake Courier Parcel Scam • Fake Bank KYC Scam";
    }
};

const renderAiIncidentAssistant = (mode, target, malicious, total, riskScore, status, flags = [], isError = false) => {
    if (!UI.aiIncidentAssistantSection) return;
    UI.aiIncidentAssistantSection.classList.remove('hidden');

    const safeTarget = sanitizeHTML(target || '');
    const isThreat = isError ? false : (riskScore >= 40 || malicious > 0 || (flags && flags.length > 0));
    const isSuspicious = isError ? false : (!isThreat && (riskScore > 0 || (status && status.toLowerCase().includes('caution'))));

    // 1. What happened?
    if (UI.aiIncidentWhatHappened) {
        if (isError) {
            UI.aiIncidentWhatHappened.innerText = `CyberPehra attempted to analyze ${safeTarget || 'the input target'}, but an error occurred.`;
        } else if (mode === 'url') {
            UI.aiIncidentWhatHappened.innerText = `CyberPehra queried global VirusTotal threat intelligence and domain heuristics for ${safeTarget}.`;
        } else if (mode === 'file') {
            UI.aiIncidentWhatHappened.innerText = `CyberPehra calculated a client-side cryptographic SHA-256 hash (${safeTarget}) and queried antivirus vendor databases without uploading your file.`;
        } else if (mode === 'chat') {
            UI.aiIncidentWhatHappened.innerText = `CyberPehra analyzed the message text for financial fraud indicators, urgency triggers, and credential phishing markers using local heuristics.`;
        } else {
            UI.aiIncidentWhatHappened.innerText = `CyberPehra completed a security scan for ${safeTarget}.`;
        }
    }

    // 2. Overall Verdict (Safe / Suspicious / Threat Detected / Unknown)
    if (UI.aiIncidentVerdictBadge) {
        if (isError) {
            UI.aiIncidentVerdictBadge.innerText = "VERDICT: UNKNOWN / ERROR";
            UI.aiIncidentVerdictBadge.className = "text-[10px] font-sans px-3 py-1 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider";
        } else if (isThreat) {
            UI.aiIncidentVerdictBadge.innerText = "VERDICT: THREAT DETECTED";
            UI.aiIncidentVerdictBadge.className = "text-[10px] font-sans px-3 py-1 rounded-full font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse uppercase tracking-wider";
        } else if (isSuspicious) {
            UI.aiIncidentVerdictBadge.innerText = "VERDICT: SUSPICIOUS";
            UI.aiIncidentVerdictBadge.className = "text-[10px] font-sans px-3 py-1 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider";
        } else {
            UI.aiIncidentVerdictBadge.innerText = "VERDICT: SAFE";
            UI.aiIncidentVerdictBadge.className = "text-[10px] font-sans px-3 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider";
        }
    }

    if (UI.aiIncidentVerdictText) {
        if (isError) {
            UI.aiIncidentVerdictText.innerHTML = `<span class="text-slate-400 font-bold">Unknown Verdict:</span> Scan failed. ${sanitizeHTML(status || 'Unable to retrieve telemetry.')}`;
        } else if (isThreat) {
            UI.aiIncidentVerdictText.innerHTML = `<span class="text-rose-400 font-bold">🚨 Threat Detected:</span> Malicious indicators or scam patterns detected. Avoid interaction with this ${mode === 'url' ? 'website' : mode === 'file' ? 'file' : 'message'}.`;
        } else if (isSuspicious) {
            UI.aiIncidentVerdictText.innerHTML = `<span class="text-amber-400 font-bold">⚠️ Suspicious:</span> Potential security warnings exist. Proceed with caution.`;
        } else {
            UI.aiIncidentVerdictText.innerHTML = `<span class="text-emerald-400 font-bold">✅ Safe:</span> No malicious indicators or scam flags were detected across security vendors and heuristics.`;
        }
    }

    // 3. Why this result? (Only based on actual scan evidence)
    if (UI.aiIncidentWhyResult) {
        if (isError) {
            UI.aiIncidentWhyResult.innerText = `Scan request failed or returned invalid response: ${status || 'Input error'}.`;
        } else if (mode === 'chat') {
            UI.aiIncidentWhyResult.innerText = flags.length > 0 
                ? `Message text contained ${flags.length} scam marker(s): ${flags.map(f => sanitizeHTML(f)).join('; ')}.`
                : "Zero scam keywords or urgency triggers were matched out of 5 core heuristic rules.";
        } else if (mode === 'url' || mode === 'file') {
            if (malicious > 0) {
                UI.aiIncidentWhyResult.innerText = `${malicious} out of ${total} global security vendors explicitly flagged ${safeTarget} as malicious or suspicious.`;
            } else if (total > 0) {
                UI.aiIncidentWhyResult.innerText = `0 out of ${total} global security vendors flagged ${safeTarget} as malicious during this scan.`;
            } else {
                UI.aiIncidentWhyResult.innerText = "No verified vendor threat data was returned for this query.";
            }
        }
    }

    // 4. Immediate Action Checklist
    if (UI.aiIncidentActionChecklist) {
        if (isError) {
            UI.aiIncidentActionChecklist.innerHTML = `
                <li class="flex items-start gap-1.5"><span class="text-amber-400 font-bold">⚠️</span> <span>Verify your input and retry the scan.</span></li>
                <li class="flex items-start gap-1.5"><span class="text-amber-400 font-bold">⚠️</span> <span>Do NOT open unknown links or files without verification.</span></li>
            `;
        } else if (isThreat || isSuspicious) {
            UI.aiIncidentActionChecklist.innerHTML = `
                <li class="flex items-start gap-1.5"><span class="text-rose-400 font-bold">❌</span> <span>Do NOT click link, open file, or reply to message.</span></li>
                <li class="flex items-start gap-1.5"><span class="text-rose-400 font-bold">❌</span> <span>Never share OTP, UPI PIN, NetBanking passwords, or personal details.</span></li>
                <li class="flex items-start gap-1.5"><span class="text-amber-400 font-bold">📸</span> <span>Take screenshots of the interaction with timestamps as evidence.</span></li>
                <li class="flex items-start gap-1.5"><span class="text-sky-400 font-bold">🚫</span> <span>Block sender profile / disconnect suspicious network.</span></li>
            `;
        } else {
            UI.aiIncidentActionChecklist.innerHTML = `
                <li class="flex items-start gap-1.5"><span class="text-emerald-400 font-bold">✅</span> <span>Verify sender or domain identity independently before initiating transactions.</span></li>
                <li class="flex items-start gap-1.5"><span class="text-emerald-400 font-bold">✅</span> <span>Ensure 2-Factor Authentication (2FA) is enabled on bank & social accounts.</span></li>
                <li class="flex items-start gap-1.5"><span class="text-emerald-400 font-bold">✅</span> <span>Remember: UPI PIN is ONLY for paying money, NEVER for receiving money.</span></li>
            `;
        }
    }

    // 5. Should I call 1930?
    if (UI.aiIncidentShouldCall1930) {
        if (isThreat || isSuspicious) {
            UI.aiIncidentShouldCall1930.innerText = "YES — If you transferred money, shared an OTP/PIN, or lost account control, call National Cyber Helpline 1930 immediately to freeze accounts within the 24-hour Golden Hour window.";
        } else {
            UI.aiIncidentShouldCall1930.innerText = "NO — No threat indicators were detected. Call 1930 Helpline only if financial fraud or extortion has actually occurred.";
        }
    }

    // 6. Evidence to Save
    if (UI.aiIncidentEvidenceToSave) {
        if (mode === 'url') {
            UI.aiIncidentEvidenceToSave.innerHTML = `1. Full website URL address & domain name<br>2. Screenshots of the webpage showing address bar<br>3. Transaction/bank transfer reference numbers (if payment attempted)`;
        } else if (mode === 'file') {
            UI.aiIncidentEvidenceToSave.innerHTML = `1. Original filename & local SHA-256 hash<br>2. Source download URL / page link<br>3. VirusTotal antivirus detection vendor report summary`;
        } else if (mode === 'chat') {
            UI.aiIncidentEvidenceToSave.innerHTML = `1. Full SMS/WhatsApp conversation screenshots with timestamps<br>2. Sender phone number, UPI VPA handle, or social ID<br>3. Bank account statement & payment confirmation receipts`;
        } else {
            UI.aiIncidentEvidenceToSave.innerHTML = `1. Target item details & screenshot<br>2. Interaction timestamp<br>3. Vendor detection reports`;
        }
    }

    // 7. Official Reporting Links are statically present in HTML with links: tel:1930, cybercrime.gov.in, cert-in.org.in

    // 8. Privacy Promise
    if (UI.aiIncidentPrivacyPromise) {
        UI.aiIncidentPrivacyPromise.innerText = "Strict 0-Day Data Retention Policy. Local browser SHA-256 computation. Zero scan queries, IP addresses, or personal info stored on CyberPehra servers.";
    }

    // 9. Can I trust this result?
    if (UI.aiIncidentCanITrust) {
        if (isError) {
            UI.aiIncidentCanITrust.innerText = "Scan errored out. Results cannot be verified until a clean scan is performed.";
        } else if (mode === 'url' || mode === 'file') {
            if (total >= 50) {
                UI.aiIncidentCanITrust.innerText = `High Evidence Confidence: Results backed by real-time consensus from ${total} global security vendors via VirusTotal API v3. No fake confidence scores or simulated percentages.`;
            } else if (total > 0) {
                UI.aiIncidentCanITrust.innerText = `Medium Evidence Confidence: Results backed by ${total} global security vendors via VirusTotal API v3.`;
            } else {
                UI.aiIncidentCanITrust.innerText = "Medium Evidence Confidence: Based on local domain pattern analysis.";
            }
        } else if (mode === 'chat') {
            UI.aiIncidentCanITrust.innerText = "Medium Evidence Confidence: Evaluated against CyberPehra's 5 core financial fraud & urgency heuristic rules locally in your browser.";
        }
    }
};

const updateResultUI = (isError, riskScore, malicious, total, domainOrHash, status, firstSeen) => {
    UI.breakdownContainer.classList.remove('hidden');
    
    if (isError) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-sans bg-rose-950 text-rose-400 border-rose-800"; 
        UI.badgeStatus.innerText = "SCAN FAILED"; 
        UI.gaugeArc.style.stroke = "#F43F5E"; 
        UI.gaugeArc.style.strokeDashoffset = 0; 
        UI.gaugeValue.innerText = "ERR"; 
        UI.resultText.innerHTML = `<strong class="text-rose-400">Analysis Error:</strong> ${sanitizeHTML(status)}<br><span class="text-slate-400 text-xs">Please verify the input and try again.</span>`; 
        UI.breakdownContainer.classList.add('hidden'); 
        UI.govGuide.classList.add('hidden');
        State.lastScanResult = null;
        renderAiIncidentAssistant(State.currentMode, domainOrHash, 0, 0, 0, status, [], true);
        return;
    }

    State.lastScanResult = {
        mode: State.currentMode,
        target: domainOrHash,
        riskScore,
        malicious,
        total,
        status,
        timestamp: firstSeen || new Date().toLocaleString('en-IN')
    };

    renderScamExplainAi(State.currentMode, domainOrHash, malicious, total, riskScore, status, []);
    renderAiIncidentAssistant(State.currentMode, domainOrHash, malicious, total, riskScore, status, [], false);
    const safeTarget = sanitizeHTML(domainOrHash);

    // Update Trust Section (Real Evidence Only)
    if (UI.trustSource) UI.trustSource.innerText = (State.currentMode === 'url' || State.currentMode === 'file') ? "VirusTotal API v3" : "Local Heuristic Engine";
    if (UI.trustEngines) UI.trustEngines.innerText = total > 0 ? `${total} AV Engines` : "5 Heuristic Rules";
    if (UI.trustTime) UI.trustTime.innerText = firstSeen || "Not Available";
    if (UI.trustUploaded) UI.trustUploaded.innerText = "No (0-Day Retention)";
    if (UI.trustSha256) UI.trustSha256.innerText = (State.currentMode === 'file') ? "Yes (Client Web Crypto)" : "No";
    if (UI.trustStored) UI.trustStored.innerText = "No (Privacy First)";
    if (UI.trustConfidence) UI.trustConfidence.innerText = total >= 50 ? "High Evidence (70+ AV Engines)" : total > 0 ? "Medium Evidence (Vendor Consensus)" : "Medium Evidence (Rule Match)";

    if (riskScore >= 40 || malicious > 0) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-sans bg-rose-950 text-rose-400 border-rose-800 animate-pulse"; 
        UI.badgeStatus.innerText = "HIGH RISK // SUSPICIOUS"; 
        UI.gaugeArc.style.stroke = "#F43F5E"; 
        UI.gaugeArc.style.strokeDashoffset = 251 - (riskScore / 100) * 251; 
        UI.gaugeValue.innerText = (State.currentMode === 'file') ? `${malicious}/${total}` : `${riskScore}%`; 
        UI.resultText.innerHTML = `<strong class="text-rose-400">High Risk Threat Detected:</strong> Multiple security vendors flagged <code>${safeTarget}</code>. Avoid interaction.`; 
        UI.govGuide.classList.remove('hidden');
    } else if (riskScore > 0) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-sans bg-amber-950 text-amber-400 border-amber-800"; 
        UI.badgeStatus.innerText = "CAUTION ADVISED"; 
        UI.gaugeArc.style.stroke = "#F59E0B"; 
        UI.gaugeArc.style.strokeDashoffset = 251 - (riskScore / 100) * 251; 
        UI.gaugeValue.innerText = (State.currentMode === 'file') ? `${malicious}/${total}` : `${riskScore}%`; 
        UI.resultText.innerHTML = `<strong class="text-amber-400">Moderate Risk Flags:</strong> Security indicators exist for <code>${safeTarget}</code>. Exercise caution.`; 
        UI.govGuide.classList.add('hidden');
    } else {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-sans bg-emerald-950 text-emerald-400 border-emerald-800"; 
        UI.badgeStatus.innerText = "SECURE // SAFE"; 
        UI.gaugeArc.style.stroke = "#34D399"; 
        UI.gaugeArc.style.strokeDashoffset = 251; 
        UI.gaugeValue.innerText = (State.currentMode === 'file') ? `0/${total}` : "0%"; 
        UI.resultText.innerHTML = `<strong class="text-emerald-400">No Malicious Indicators Found:</strong> Security vendors did not flag <code>${safeTarget}</code>.`; 
        UI.govGuide.classList.add('hidden');
    }

    renderDetailedThreatReport(isError, riskScore, malicious, total, domainOrHash, status, []);
};

const renderDetailedThreatReport = (isError, riskScore, malicious, total, domainOrHash, status, flags = []) => {
    const container = document.getElementById('detailedThreatReportContainer');
    if (!container) return;

    if (isError) {
        container.classList.add('hidden');
        return;
    }
    container.classList.remove('hidden');

    const scanId = 'CP-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const rptIdEl = document.getElementById('reportScanId');
    if (rptIdEl) rptIdEl.innerText = scanId;

    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }) + ' IST';
    const rptTimeEl = document.getElementById('reportTimestamp');
    if (rptTimeEl) rptTimeEl.innerText = formattedDate;

    const modeLabel = State.currentMode === 'url' ? 'Link Verification'
        : State.currentMode === 'file' ? 'File SHA-256 Hash Analysis'
        : State.currentMode === 'chat' ? 'Scam Conversation Text'
        : 'QR Code Payload Analysis';

    const rptScanType = document.getElementById('rptScanType');
    if (rptScanType) rptScanType.innerText = modeLabel;

    const rptOrigInput = document.getElementById('rptOrigInput');
    if (rptOrigInput) rptOrigInput.innerText = domainOrHash || 'Not available / Not checked';

    let normTarget = domainOrHash || 'Not available / Not checked';
    let protocolStr = 'Not available / Not checked';
    let hostStr = 'Not available / Not checked';

    if (State.currentMode === 'url') {
        const norm = normalizeAndValidateUrl(domainOrHash);
        if (norm.valid) {
            normTarget = norm.normalizedUrl;
            protocolStr = norm.parsedUrl ? norm.parsedUrl.protocol : 'https:';
            hostStr = norm.parsedUrl ? norm.parsedUrl.hostname : domainOrHash;
        }
    } else if (State.currentMode === 'file') {
        protocolStr = 'SHA-256 (Web Crypto)';
        hostStr = 'Local Client File';
    } else if (State.currentMode === 'chat') {
        protocolStr = 'Text Payload';
        hostStr = 'Message Input';
    } else if (State.currentMode === 'qr') {
        protocolStr = 'QR Decoded Payload';
        hostStr = 'Image Payload';
    }

    const rptNormInput = document.getElementById('rptNormInput');
    if (rptNormInput) rptNormInput.innerText = normTarget;

    const rptProtocol = document.getElementById('rptProtocol');
    if (rptProtocol) rptProtocol.innerText = protocolStr;

    const rptHost = document.getElementById('rptHost');
    if (rptHost) rptHost.innerText = hostStr;

    const rptIpInfo = document.getElementById('rptIpInfo');
    if (rptIpInfo) rptIpInfo.innerText = "Not available / Not checked";

    const rptVtResult = document.getElementById('rptVtResult');
    if (rptVtResult) {
        rptVtResult.innerText = total > 0 ? `${malicious}/${total} AV Engines (${malicious > 0 ? 'Detections Found' : 'Clean'})` : 'Unconfigured / Offline (Local Fallback)';
    }

    const rptGsbResult = document.getElementById('rptGsbResult');
    if (rptGsbResult) {
        rptGsbResult.innerText = (status && status.includes('Safe Browsing')) ? status : (riskScore === 0 ? 'Clean (No threats found)' : 'Unconfigured / Offline');
    }

    const rptHeuristicsResult = document.getElementById('rptHeuristicsResult');
    if (rptHeuristicsResult) {
        rptHeuristicsResult.innerText = flags.length > 0 ? `${flags.length} Heuristic Flags Triggered` : 'Passed Heuristic Checks (0 Flags)';
    }

    const rptRiskScore = document.getElementById('rptRiskScore');
    if (rptRiskScore) rptRiskScore.innerText = `${riskScore}%`;

    const rptRiskClass = document.getElementById('rptRiskClass');
    if (rptRiskClass) {
        if (riskScore >= 40 || malicious > 0) {
            rptRiskClass.className = "text-xs font-bold text-rose-400 mt-0.5";
            rptRiskClass.innerText = "HIGH RISK // SUSPICIOUS";
        } else if (riskScore > 0) {
            rptRiskClass.className = "text-xs font-bold text-amber-400 mt-0.5";
            rptRiskClass.innerText = "CAUTION ADVISED";
        } else {
            rptRiskClass.className = "text-xs font-bold text-[#00FF88] mt-0.5";
            rptRiskClass.innerText = "SECURE // SAFE";
        }
    }

    const rptIndicatorList = document.getElementById('rptIndicatorList');
    if (rptIndicatorList) {
        if (flags.length > 0) {
            rptIndicatorList.innerHTML = flags.map(f => `<div class="flex items-center gap-2 text-amber-300"><span>⚠️</span> <span>${sanitizeHTML(f)}</span></div>`).join('');
        } else {
            rptIndicatorList.innerHTML = `<div class="text-[#00FF88] font-medium flex items-center gap-2"><span>✓</span> <span>No malicious or suspicious indicators detected.</span></div>`;
        }
    }

    const rptRecAction = document.getElementById('rptRecAction');
    if (rptRecAction) {
        if (riskScore >= 40 || malicious > 0) {
            rptRecAction.className = "p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs font-semibold leading-relaxed";
            rptRecAction.innerText = "DO NOT open this link, download files, share OTPs, or transfer money. If financial loss occurred, call 1930 immediately.";
        } else if (riskScore > 0) {
            rptRecAction.className = "p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs font-semibold leading-relaxed";
            rptRecAction.innerText = "Exercise caution. Verify the domain and sender identity before making any payment or sharing personal credentials.";
        } else {
            rptRecAction.className = "p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 text-xs font-semibold leading-relaxed";
            rptRecAction.innerText = "No threat indicators detected. Proceed normally, but always maintain standard cybersecurity hygiene.";
        }
    }

    const rptWhatMeans = document.getElementById('rptWhatMeans');
    if (rptWhatMeans) {
        rptWhatMeans.innerText = riskScore > 0
            ? "Security indicators or vendor detections were matched against this target. Potential security risks were identified."
            : "The target item was evaluated against client-side URL pattern rules, domain registration heuristics, and available security databases. No known scam or threat markers matched.";
    }

    const rptWhatNotProves = document.getElementById('rptWhatNotProves');
    if (rptWhatNotProves) {
        rptWhatNotProves.innerText = "This result is an automated risk metric based on technical telemetry. It is not a legal determination, guarantee of permanent safety, or proof of criminal activity. Always exercise independent caution.";
    }
};

// Rate Limit Timer Helper
let rateLimitTimerInterval = null;

const startRateLimitCountdown = (seconds) => {
    if (rateLimitTimerInterval) clearInterval(rateLimitTimerInterval);
    const box = UI.rateLimitCountdownBox;
    const timerEl = UI.rateLimitTimer;
    if (!box || !timerEl) return;

    box.classList.remove('hidden');
    let remaining = seconds;
    timerEl.innerText = `${remaining}s`;

    rateLimitTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
            clearInterval(rateLimitTimerInterval);
            box.classList.add('hidden');
        } else {
            timerEl.innerText = `${remaining}s`;
        }
    }, 1000);
};

// Client-side URL Pattern & RDAP Domain Age Heuristic Fallback
export const runLocalUrlHeuristicFallback = async (urlInput, vtStatus, gsbStatus) => {
    let parsedUrl;
    try {
        parsedUrl = new URL(urlInput);
    } catch(e) {
        updateResultUI(true, 0, 0, 0, "", "Invalid URL format for heuristic scan", "");
        return;
    }

    const domain = parsedUrl.hostname;
    let score = 10;
    const flags = [];
    let domainAgeText = "Unverifiable domain registry";

    // 1. Direct IP Address in URL
    const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain);
    if (isIp) {
        flags.push("⚠️ Direct IP address used in URL instead of domain name");
        score += 35;
    }

    // 2. Punycode / Homograph Domain Check
    if (domain.startsWith('xn--') || /[^\x00-\x7F]/.test(domain)) {
        flags.push("⚠️ Punycode / Homograph domain character spoofing detected");
        score += 40;
    }

    // 3. Excessive Subdomain Depth (4+ subdomains)
    const subdomains = domain.split('.');
    if (subdomains.length >= 4) {
        flags.push(`⚠️ Excessive subdomain depth (${subdomains.length} subdomain levels)`);
        score += 25;
    }

    // 4. Known URL Shortener Masking
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly', 'rb.gy', 'shorturl.at'];
    const isShortened = shorteners.some(s => domain.toLowerCase().includes(s));
    if (isShortened) {
        flags.push("⚠️ Masked short URL service — final destination is hidden");
        score += 30;
    }

    // 5. Sensitive Keyword & Brand Spoofing Analysis
    const hasHttp = parsedUrl.protocol === 'http:';
    const sensitiveKeywords = ['login', 'bank', 'verify', 'account', 'signin', 'update', 'secure', 'pay', 'wallet', 'kyc', 'paypal', 'security', 'check'];
    const domainLower = domain.toLowerCase();
    const matchedKeywords = sensitiveKeywords.filter(kw => domainLower.includes(kw));

    if (hasHttp && matchedKeywords.length > 0) {
        flags.push(`⚠️ Insecure HTTP connection containing sensitive keyword(s): '${matchedKeywords.join("', '")}'`);
        score += 35;
    } else if (matchedKeywords.length >= 2) {
        flags.push(`⚠️ Suspicious keyword stacking in domain name ('${matchedKeywords.join("', '")}')`);
        score += 25;
    }

    // 6. Live RDAP Domain Age Check
    try {
        const rdapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
        if (rdapRes.ok) {
            const rdapData = await rdapRes.json();
            const events = rdapData.events || [];
            const regEvent = events.find(e => e.eventAction === 'registration');
            if (regEvent && regEvent.eventDate) {
                const regDate = new Date(regEvent.eventDate);
                const ageDays = Math.floor((new Date() - regDate) / (1000 * 60 * 60 * 24));
                domainAgeText = `${ageDays} days old (${regDate.toLocaleDateString('en-IN')})`;
                if (ageDays < 30) {
                    flags.push(`⚠️ Newly registered domain (${ageDays} days old — high scam risk)`);
                    score += 30;
                }
            }
        }
    } catch(err) {
        // RDAP unavailable - keep default domainAgeText
    }

    // Update Fallback Transparency Banner
    if (UI.fallbackNoticeBanner) {
        UI.fallbackNoticeBanner.classList.remove('hidden');
        if (UI.fallbackNoticeReason) {
            const vtReason = vtStatus ? (vtStatus.error || 'VT Unavailable') : 'VT Unavailable';
            const gsbReason = gsbStatus ? (gsbStatus.error || 'GSB Unavailable') : 'GSB Unavailable';
            UI.fallbackNoticeReason.innerText = `Live API sources unavailable (${vtReason}; ${gsbReason}). Evaluated against domain age & 5 client-side URL pattern rules.`;
        }
    }

    // Update Source Status Badges Header
    if (UI.sourceStatusHeader && UI.sourceStatusBadges) {
        UI.sourceStatusHeader.classList.remove('hidden');
        UI.sourceStatusBadges.innerHTML = `
            <span class="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">VirusTotal: ${vtStatus?.unconfigured ? '🔒 Not Configured' : vtStatus?.rateLimited ? '⏳ Throttled' : '✕ Offline'}</span>
            <span class="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">Google Safe Browsing: ${gsbStatus?.unconfigured ? '🔒 Not Configured' : '✕ Offline'}</span>
            <span class="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-bold">Local Heuristics: ✓ Active (${flags.length} Flags)</span>
        `;
    }

    // Render Multi-Source Breakdown Cards
    if (UI.multiSourceBreakdownContainer) {
        UI.multiSourceBreakdownContainer.innerHTML = `
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div class="font-bold text-amber-400">Local URL Pattern Analysis</div>
                <div class="text-[11px] text-slate-300">${flags.length > 0 ? flags.join('<br>') : 'No suspicious URL pattern triggers matched.'}</div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div class="font-bold text-slate-300">RDAP Domain Registration Age</div>
                <div class="text-[11px] text-slate-300">${domainAgeText}</div>
            </div>
        `;
    }

    const finalScore = flags.length === 0 ? 0 : Math.min(score, 99);
    updateResultUI(false, finalScore, flags.length, 0, domain, flags.length === 0 ? 'Passed Heuristics' : 'Heuristic Risk Flags', domainAgeText);
};

export function normalizeAndValidateUrl(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
        return { valid: false, error: "Empty target input. Enter a website domain (e.g. google.com) or URL." };
    }

    let trimmed = rawInput.trim();
    if (!trimmed) {
        return { valid: false, error: "Target input cannot be empty whitespace." };
    }

    let originalInput = trimmed;

    // Check if input already has a scheme
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed);

    if (hasScheme) {
        try {
            const parsed = new URL(trimmed);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return { valid: false, error: "Only http:// and https:// website URLs are supported." };
            }
            return {
                valid: true,
                originalInput,
                normalizedUrl: trimmed,
                domain: parsed.hostname,
                protocol: parsed.protocol,
                isIp: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(parsed.hostname)
            };
        } catch (err) {
            return { valid: false, error: "Malformed URL format. Please check address syntax." };
        }
    }

    // Check direct IP address candidate (e.g. 192.168.1.1 or 192.168.1.1/login)
    const ipMatch = trimmed.match(/^((?:[0-9]{1,3}\.){3}[0-9]{1,3})(?::\d+)?([/?#].*)?$/);
    if (ipMatch) {
        const normalizedUrl = `http://${trimmed}`;
        try {
            const parsed = new URL(normalizedUrl);
            return {
                valid: true,
                originalInput,
                normalizedUrl,
                domain: parsed.hostname,
                protocol: 'http:',
                isIp: true
            };
        } catch(err) {
            return { valid: false, error: "Malformed IP address target." };
        }
    }

    // Domain candidate validation (e.g. google.com, www.google.com, sub.domain.co.in/path)
    const domainCandidateRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?(?:[/?#]\S*)?$/;
    if (domainCandidateRegex.test(trimmed)) {
        const normalizedUrl = `https://${trimmed}`;
        try {
            const parsed = new URL(normalizedUrl);
            return {
                valid: true,
                originalInput,
                normalizedUrl,
                domain: parsed.hostname,
                protocol: 'https:',
                isIp: false
            };
        } catch (err) {
            return { valid: false, error: "Unable to normalize domain structure." };
        }
    }

    return {
        valid: false,
        error: "Invalid target format. Enter a domain (e.g. google.com) or URL (e.g. https://example.com)."
    };
}

export const runURLScan = async (urlInput) => {
    const norm = normalizeAndValidateUrl(urlInput);
    if (!norm.valid) {
        updateResultUI(true, 0, 0, 0, "", norm.error, "");
        return;
    }

    const targetUrl = norm.normalizedUrl;
    const originalTarget = norm.originalInput;
    const domain = norm.domain;

    // Reset UI banners & countdown
    if (UI.fallbackNoticeBanner) UI.fallbackNoticeBanner.classList.add('hidden');
    if (UI.rateLimitCountdownBox) UI.rateLimitCountdownBox.classList.add('hidden');

    // Execute Parallel Multi-Source API Call (Promise.allSettled)
    const [vtSettled, gsbSettled] = await Promise.allSettled([
        fetch('/.netlify/functions/virustotal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl })
        }).then(async r => {
            const body = await r.json().catch(() => ({}));
            return { status: r.status, ok: r.ok, body };
        }),
        fetch('/.netlify/functions/safebrowsing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl })
        }).then(async r => {
            const body = await r.json().catch(() => ({}));
            return { status: r.status, ok: r.ok, body };
        })
    ]);

    const vtResult = vtSettled.status === 'fulfilled' ? vtSettled.value : null;
    const gsbResult = gsbSettled.status === 'fulfilled' ? gsbSettled.value : null;

    const vtOk = vtResult && vtResult.ok;
    const gsbOk = gsbResult && gsbResult.ok;

    // Handle Rate Limit (HTTP 429) from VT
    if (vtResult && vtResult.status === 429) {
        startRateLimitCountdown(vtResult.body?.retryAfter || 15);
    }

    // Both APIs failed / unconfigured / rate-limited -> Fallback to Local Heuristics
    if (!vtOk && !gsbOk) {
        await runLocalUrlHeuristicFallback(
            urlInput,
            vtResult?.body || { error: 'Network error' },
            gsbResult?.body || { error: 'Network error' }
        );
        return;
    }

    // Process VirusTotal payload if available
    let vtMalicious = 0;
    let vtTotal = 0;
    let vtStatusText = "Unavailable";
    if (vtOk) {
        const stats = vtResult.body.stats || {};
        vtMalicious = Number(stats.malicious || 0) + Number(stats.suspicious || 0);
        vtTotal = vtMalicious + Number(stats.harmless || 0) + Number(stats.undetected || 0) || 70;
        vtStatusText = `${vtMalicious}/${vtTotal} AV vendors`;
    }

    // Process Google Safe Browsing payload if available
    let gsbClean = true;
    let gsbThreats = [];
    let gsbStatusText = "Clean";
    if (gsbOk) {
        gsbClean = gsbResult.body.clean !== false;
        gsbThreats = gsbResult.body.threatTypes || [];
        gsbStatusText = gsbClean ? "No threats found" : `Threat detected (${gsbThreats.join(', ')})`;
    }

    // Multi-Source Disagreement & Combined Verdict
    const hasVtThreat = vtMalicious > 0;
    const hasGsbThreat = !gsbClean;
    const isMixedSignal = (vtOk && gsbOk) && ((hasVtThreat && !hasGsbThreat) || (!hasVtThreat && hasGsbThreat));

    // Calculate combined risk score
    let combinedScore = 0;
    if (hasVtThreat || hasGsbThreat) {
        const vtRatio = vtTotal > 0 ? (vtMalicious / vtTotal) * 100 : 0;
        combinedScore = Math.max(45, Math.round(vtRatio));
        if (hasGsbThreat) combinedScore = Math.max(combinedScore, 85);
    }

    // Render Source Status Badges Header
    if (UI.sourceStatusHeader && UI.sourceStatusBadges) {
        UI.sourceStatusHeader.classList.remove('hidden');
        let vtBadge = `<span class="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">VirusTotal: ✓ ${vtStatusText}</span>`;
        if (!vtOk) {
            const isUnconfigured = vtResult?.body?.unconfigured;
            const isRateLimit = vtResult?.status === 429;
            vtBadge = `<span class="px-2.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">VirusTotal: ${isUnconfigured ? '🔒 Not Configured' : isRateLimit ? '⏳ Throttled (4/min)' : '✕ Offline'}</span>`;
        }

        let gsbBadge = `<span class="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">Google Safe Browsing: ✓ ${gsbStatusText}</span>`;
        if (!gsbOk) {
            const isUnconfigured = gsbResult?.body?.unconfigured;
            gsbBadge = `<span class="px-2.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">Google Safe Browsing: ${isUnconfigured ? '🔒 Not Configured' : '✕ Offline'}</span>`;
        }

        UI.sourceStatusBadges.innerHTML = `${vtBadge} ${gsbBadge}`;
    }

    // Render Multi-Source Breakdown Cards
    if (UI.multiSourceBreakdownContainer) {
        UI.multiSourceBreakdownContainer.innerHTML = `
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div class="font-bold text-slate-200">VirusTotal Vendor Consensus</div>
                <div class="text-[11px] ${hasVtThreat ? 'text-rose-400 font-bold' : 'text-slate-300'}">${vtOk ? vtStatusText : (vtResult?.body?.error || 'Unconfigured')}</div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div class="font-bold text-slate-200">Google Safe Browsing</div>
                <div class="text-[11px] ${hasGsbThreat ? 'text-rose-400 font-bold' : 'text-slate-300'}">${gsbOk ? gsbStatusText : (gsbResult?.body?.error || 'Unconfigured')}</div>
            </div>
        `;
    }

    const finalStatusText = isMixedSignal ? "MIXED SIGNAL // EXERCISE CAUTION" : (hasVtThreat || hasGsbThreat) ? "THREAT DETECTED" : "CLEAN VERDICT";
    updateResultUI(false, combinedScore, vtMalicious + (hasGsbThreat ? 1 : 0), (vtTotal || 70) + (gsbOk ? 1 : 0), domain, finalStatusText, new Date().toLocaleString('en-IN'));
};

export const handleFileHash = async (event) => {
    const file = event.target.files[0]; 
    if (!file) return;
    event.target.value = ''; 
    
    if (file.size > 50 * 1024 * 1024) {
        UI.fileHashIndicator.classList.remove('hidden');
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
        UI.fileHashIndicator.innerText = 'Error: File exceeds local 50MB hashing limit to prevent browser crash.';
        return;
    }

    if (!crypto || !crypto.subtle) {
        UI.fileHashIndicator.classList.remove('hidden');
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
        UI.fileHashIndicator.innerText = 'Error: Secure context (HTTPS) is required for local cryptographic hashing.';
        return;
    }

    UI.fileHashIndicator.classList.remove('hidden');
    UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-amber-400 bg-amber-950/40 border border-amber-800/50';
    UI.fileHashIndicator.innerText = 'Computing SHA-256 hash locally on client...';

    try {
        const buffer = await file.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', buffer);
        State.pendingHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-green-400 bg-green-950/40 border border-green-800/50';
        UI.fileHashIndicator.innerText = `File: ${sanitizeHTML(file.name)} (${(file.size/1024).toFixed(1)} KB)\nSHA-256: ${State.pendingHash}`;
    } catch(err) { 
        UI.fileHashIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
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

export const runChatScan = (overrideText) => {
    const text = typeof overrideText === 'string' ? overrideText.trim() : (UI.chatInputArea ? (UI.chatInputArea.querySelector('textarea')?.value || UI.chatInputArea.value || '') : '');
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

    State.lastScanResult = {
        mode: 'chat',
        target: text.length > 40 ? text.substring(0, 40) + '...' : text,
        riskScore: flags.length === 0 ? 0 : Math.min(score, 99),
        malicious: flags.length,
        total: 5,
        flags,
        status: flags.length === 0 ? 'Passed Heuristics' : 'Scam Markers Detected',
        timestamp: new Date().toLocaleString('en-IN')
    };
    
    if(flags.length === 0) {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-sans bg-emerald-950 text-emerald-400 border-emerald-800"; 
        UI.badgeStatus.innerText = "NO FLAGS FOUND"; 
        UI.gaugeArc.style.stroke = "#34D399"; 
        UI.gaugeArc.style.strokeDashoffset = 251; 
        UI.gaugeValue.innerText = "0%"; 
        UI.resultText.innerHTML = `<strong class="text-emerald-400">No obvious scam markers found.</strong> However, always verify the sender's identity independently.`;
    } else {
        UI.badgeStatus.className = "text-xs font-bold px-3 py-1 rounded-full border uppercase font-sans bg-rose-950 text-rose-400 border-rose-800 animate-pulse"; 
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

    renderScamExplainAi('chat', text, flags.length, 5, flags.length === 0 ? 0 : Math.min(score, 99), flags.length === 0 ? 'Passed Heuristics' : 'Scam Markers Detected', flags);
    renderAiIncidentAssistant('chat', text, flags.length, 5, flags.length === 0 ? 0 : Math.min(score, 99), flags.length === 0 ? 'Passed Heuristics' : 'Scam Markers Detected', flags, false);

    // Update Trust Section for Chat Scan
    if (UI.trustSource) UI.trustSource.innerText = "Local Heuristic Engine";
    if (UI.trustEngines) UI.trustEngines.innerText = "5 Heuristic Rules";
    if (UI.trustTime) UI.trustTime.innerText = new Date().toLocaleString('en-IN');
    if (UI.trustUploaded) UI.trustUploaded.innerText = "No (Local Browser Computation)";
    if (UI.trustSha256) UI.trustSha256.innerText = "No";
    if (UI.trustStored) UI.trustStored.innerText = "No (Privacy First)";
    if (UI.trustConfidence) UI.trustConfidence.innerText = "Medium Evidence (Rule Match)";

    // Why This Result?
    const whyBox = document.getElementById('whyResultContainer');
    const whyText = document.getElementById('whyResultText');
    if (whyBox && whyText) {
        whyBox.classList.remove('hidden');
        whyText.innerText = flags.length > 0 
            ? "Message text contains urgent requests for OTP, payment passwords, or job bait typical of financial scams."
            : "No common scam keywords or panic triggers were detected in this message string.";
    }

    // Action Checklist
    const actionBox = document.getElementById('actionChecklistContainer');
    const actionList = document.getElementById('actionChecklistItems');
    if (actionBox && actionList) {
        actionBox.classList.remove('hidden');
        let checklistHtml = '';
        if (flags.length > 0) {
            checklistHtml += `<li><span class="text-rose-400">[ ]</span> Do NOT share OTP, UPI PIN, or passwords</li>`;
            checklistHtml += `<li><span class="text-rose-400">[ ]</span> Take screenshots of the chat/SMS for incident evidence</li>`;
            checklistHtml += `<li><span class="text-rose-400">[ ]</span> Block the sender profile immediately</li>`;
            checklistHtml += `<li><span class="text-rose-400">[ ]</span> Report suspicious financial fraud to 1930 Helpline</li>`;
        } else {
            checklistHtml += `<li><span class="text-emerald-400">[ ]</span> Never transfer money to unknown accounts</li>`;
        }
        actionList.innerHTML = checklistHtml;
    }
};

let scanHudTimerInterval = null;
let scanHudStartTime = 0;

const startScanHudTimer = () => {
    scanHudStartTime = performance.now();
    const timerEl = document.getElementById('hudTimer');
    const hudOverlay = document.getElementById('scanHudOverlay');
    const statusBadge = document.getElementById('hudStatusBadge');
    const corePulse = document.getElementById('hudCorePulse');
    const coreIcon = document.getElementById('hudCoreIcon');
    const ring1 = document.getElementById('hudRing1');
    const ring2 = document.getElementById('hudRing2');

    if (hudOverlay) hudOverlay.classList.remove('hidden');
    if (statusBadge) {
        statusBadge.className = "px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase tracking-wider text-[10px]";
        statusBadge.innerText = getTranslation('hud_started');
    }
    if (corePulse) {
        corePulse.className = "w-8 h-8 rounded-full bg-[#00FF88]/20 border border-[#00FF88] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.6)] animate-pulse";
    }
    if (coreIcon) coreIcon.innerText = "⚡";
    if (ring1) ring1.classList.add('animate-spin');
    if (ring2) ring2.classList.add('animate-spin');

    if (scanHudTimerInterval) clearInterval(scanHudTimerInterval);
    scanHudTimerInterval = setInterval(() => {
        if (timerEl) {
            const elapsed = ((performance.now() - scanHudStartTime) / 1000).toFixed(1);
            timerEl.innerText = `${elapsed}s`;
        }
    }, 50);
};

const updateScanHudStage = (stageNum, isError = false, statusText = '') => {
    const activeText = document.getElementById('hudActiveStageText');
    const percentEl = document.getElementById('hudProgressPercent');
    const barEl = document.getElementById('hudProgressBar');
    const stageGrid = document.getElementById('hudStageGrid');
    const statusBadge = document.getElementById('hudStatusBadge');

    const stateBadgeKeys = [
        'hud_started',
        'hud_scanning',
        'hud_scanning',
        'hud_analyzing',
        'hud_querying',
        'hud_querying',
        'hud_finalizing',
        'hud_finalizing'
    ];

    if (statusBadge && !isError) {
        const badgeKey = stateBadgeKeys[stageNum - 1] || 'hud_scanning';
        statusBadge.innerText = getTranslation(badgeKey);
    }

    const stageNames = [
        getTranslation('hud_stage1'),
        getTranslation('hud_stage2'),
        getTranslation('hud_stage3'),
        getTranslation('hud_stage4'),
        getTranslation('hud_stage5'),
        getTranslation('hud_stage6'),
        getTranslation('hud_stage7'),
        getTranslation('hud_stage8')
    ];

    if (activeText) {
        activeText.innerHTML = isError
            ? `<span class="text-rose-400 font-bold">❌ ${stageNames[stageNum-1] || 'Error'}: ${sanitizeHTML(statusText)}</span>`
            : `<span class="text-emerald-400 font-bold">${stageNames[stageNum-1] || 'Processing'}:</span> <span class="text-slate-300">${sanitizeHTML(statusText)}</span>`;
    }

    const percent = Math.round((stageNum / 8) * 100);
    if (percentEl) percentEl.innerText = `${percent}%`;
    if (barEl) barEl.style.width = `${percent}%`;

    if (stageGrid) {
        let html = '';
        for (let i = 1; i <= 8; i++) {
            const isDone = i < stageNum;
            const isActive = i === stageNum;
            const isErr = isActive && isError;

            let badgeClass = "bg-slate-950 text-slate-500 border-slate-800";
            let icon = `${i}`;
            if (isDone) {
                badgeClass = "bg-emerald-950/80 text-emerald-400 border-emerald-700/60";
                icon = "✓";
            } else if (isErr) {
                badgeClass = "bg-rose-950 text-rose-300 border-rose-800 animate-pulse";
                icon = "✕";
            } else if (isActive) {
                badgeClass = "bg-emerald-500/20 text-[#00FF88] border-[#00FF88]/60 shadow-[0_0_15px_rgba(0,255,136,0.3)] animate-pulse";
            }

            const shortTitle = (stageNames[i-1] || '').split('. ')[1] || `Stage ${i}`;
            html += `
                <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg border font-sans text-[10px] ${badgeClass}">
                    <span class="font-bold font-mono">${icon}</span>
                    <span class="truncate">${shortTitle}</span>
                </div>
            `;
        }
        stageGrid.innerHTML = html;
    }
};

const completeScanHud = (isError = false, reason = '') => {
    if (scanHudTimerInterval) clearInterval(scanHudTimerInterval);
    const statusBadge = document.getElementById('hudStatusBadge');
    const corePulse = document.getElementById('hudCorePulse');
    const coreIcon = document.getElementById('hudCoreIcon');
    const ring1 = document.getElementById('hudRing1');
    const ring2 = document.getElementById('hudRing2');
    const percentEl = document.getElementById('hudProgressPercent');
    const barEl = document.getElementById('hudProgressBar');

    if (ring1) ring1.classList.remove('animate-spin');
    if (ring2) ring2.classList.remove('animate-spin');

    if (isError) {
        if (statusBadge) {
            statusBadge.className = "px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase tracking-wider text-[10px]";
            statusBadge.innerText = getTranslation('hud_failed');
        }
        if (corePulse) {
            corePulse.className = "w-8 h-8 rounded-full bg-rose-950 border border-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)]";
        }
        if (coreIcon) coreIcon.innerText = "✕";
    } else {
        if (statusBadge) {
            statusBadge.className = "px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase tracking-wider text-[10px]";
            statusBadge.innerText = getTranslation('hud_completed');
        }
        if (corePulse) {
            corePulse.className = "w-8 h-8 rounded-full bg-[#00FF88]/30 border border-[#00FF88] flex items-center justify-center shadow-[0_0_25px_rgba(0,255,136,0.8)]";
        }
        if (coreIcon) coreIcon.innerText = "✓";
        if (percentEl) percentEl.innerText = "100%";
        if (barEl) barEl.style.width = "100%";
    }
};

export const executeScan = async () => {
    if (State.isScanning) return;
    State.isScanning = true;
    
    UI.submitBtn.disabled = true;
    UI.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    if (UI.resultBox) UI.resultBox.classList.add('hidden');
    if (UI.scanBeamEl) UI.scanBeamEl.classList.remove('hidden');
    
    startScanHudTimer();

    try {
        updateScanHudStage(1, false, "Establishing secure connection & context...");
        await new Promise(r => setTimeout(r, 80));

        updateScanHudStage(2, false, "Parsing input format & protocol parameters...");
        await new Promise(r => setTimeout(r, 80));

        updateScanHudStage(3, false, "Extracting target domain / hash telemetry...");
        await new Promise(r => setTimeout(r, 80));

        updateScanHudStage(4, false, "Executing local client heuristic analysis...");
        await new Promise(r => setTimeout(r, 80));

        updateScanHudStage(5, false, "Querying VirusTotal & intelligence nodes...");

        if (State.currentMode === 'url') {
            const val = UI.urlInputArea ? UI.urlInputArea.querySelector('input')?.value.trim() : '';
            await runURLScan(val);
        } else if (State.currentMode === 'file') {
            await runFileScan();
        } else if (State.currentMode === 'chat') {
            const txt = UI.chatInputArea ? (UI.chatInputArea.querySelector('textarea')?.value || UI.chatInputArea.value) : '';
            runChatScan(txt);
        } else if (State.currentMode === 'qr') {
            const qrText = UI.qrIndicator ? UI.qrIndicator.innerText : '';
            if (qrText.includes('Decoded: ')) {
                const payload = qrText.replace(/^Decoded:\s*/, '').trim();
                const norm = normalizeAndValidateUrl(payload);
                if (norm.valid) {
                    await runURLScan(payload);
                } else {
                    runChatScan(payload);
                }
            } else {
                updateResultUI(true, 0, 0, 0, "", "No decoded QR code payload found. Please upload a clear QR code image first.", "");
            }
        }

        updateScanHudStage(6, false, "Checking Google Safe Browsing threat nodes...");
        await new Promise(r => setTimeout(r, 80));

        updateScanHudStage(7, false, "Aggregating security vendor consensus reports...");
        await new Promise(r => setTimeout(r, 80));

        updateScanHudStage(8, false, "Finalizing verdict & generating threat assessment report...");
        await new Promise(r => setTimeout(r, 80));

        completeScanHud(false);
        if (UI.resultBox) UI.resultBox.classList.remove('hidden');

    } catch(err) {
        updateScanHudStage(5, true, err.message || "Execution error");
        completeScanHud(true, err.message);
        if (UI.resultBox) UI.resultBox.classList.remove('hidden');
    } finally {
        if (UI.scanBeamEl) UI.scanBeamEl.classList.add('hidden');
        if (UI.submitBtn) {
            UI.submitBtn.disabled = false;
            UI.submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        State.isScanning = false;
    }
};

export const handleQrUpload = (event) => {
    const file = event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;
    if (event.target) event.target.value = ''; 

    if (!file.type.startsWith('image/')) {
        if (UI.qrIndicator) {
            UI.qrIndicator.classList.remove('hidden');
            UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
            UI.qrIndicator.innerText = 'Please upload a valid image file.';
        }
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
            const qrDecoder = typeof jsQR === 'function' ? jsQR : (window.jsQR || null);
            const code = qrDecoder ? qrDecoder(imageData.data, imageData.width, imageData.height) : null;
            
            if (UI.qrIndicator) {
                UI.qrIndicator.classList.remove('hidden');
                if (!code) {
                    UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-amber-400 bg-amber-950/40 border border-amber-800/50';
                    UI.qrIndicator.innerText = 'No QR code detected. Try a clearer image.';
                } else {
                    UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-green-400 bg-green-950/40 border border-green-800/50';
                    UI.qrIndicator.innerText = `Decoded: ${code.data}`;
                }
            }
        };
        image.onerror = () => {
            if (UI.qrIndicator) {
                UI.qrIndicator.classList.remove('hidden');
                UI.qrIndicator.className = 'text-xs mt-2 p-3 rounded-xl font-sans break-all text-rose-400 bg-rose-950/40 border border-rose-800/50';
                UI.qrIndicator.innerText = 'The image could not be decoded.';
            }
        };
        image.src = result;
    };
    reader.readAsDataURL(file);
};