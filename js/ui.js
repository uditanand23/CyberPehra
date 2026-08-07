export const UI = {
    get langMenuToggle() { return document.getElementById('langMenuToggle') || document.querySelector('[aria-label="Change Language"]'); },
    get langMenu() { return document.getElementById('langMenu'); },
    get langBtns() { return document.querySelectorAll('.lang-btn'); },
    get currentLangLabel() { return document.getElementById('currentLangLabel'); },
    get mobileMenuBtn() { return document.getElementById('mobileMenuBtn') || document.getElementById('menuBtn'); },
    get mobileMenu() { return document.getElementById('mobileMenu'); },
    get menuIconOpen() { return document.getElementById('menuIconOpen'); },
    get menuIconClose() { return document.getElementById('menuIconClose'); },
    get brandLogoBtn() { return document.getElementById('brandLogoBtn') || document.querySelector('header [aria-label="Go to top"]'); },
    get mobileNavLinks() { return document.querySelectorAll('.mobile-nav-link, #mobileMenu a'); },
    get tabBtns() { return document.querySelectorAll('.tab-btn'); },
    get scanPanels() { return document.querySelectorAll('.scan-panel'); },
    get submitBtn() { return document.getElementById('submitBtn'); },
    get resultBox() { return document.getElementById('resultBox'); },
    get scanBeamEl() { return document.getElementById('scanBeamEl'); },
    get resultText() { return document.getElementById('resultText'); },
    get breakdownContainer() { return document.getElementById('breakdownContainer'); },
    get badgeStatus() { return document.getElementById('badgeStatus'); },
    get gaugeArc() { return document.getElementById('gaugeArc'); },
    get gaugeValue() { return document.getElementById('gaugeValue'); },
    get govGuide() { return document.getElementById('govGuide'); },
    get scanModeIndicator() { return document.getElementById('scanModeIndicator'); },
    get fileHashInput() { return document.getElementById('fileHashInput'); },
    get fileHashIndicator() { return document.getElementById('fileHashIndicator'); },
    get urlInputArea() { return document.getElementById('urlInputArea'); },
    get chatInputArea() { return document.getElementById('chatInputArea'); },
    get qrInput() { return document.getElementById('qrInput'); },
    get qrIndicator() { return document.getElementById('qrIndicator'); },
    get pwdInput() { return document.getElementById('pwdInput'); },
    get pwdBar() { return document.getElementById('pwdBar'); },
    get pwdFeedback() { return document.getElementById('pwdFeedback'); },
    get genPwdBtn() { return document.getElementById('genPwdBtn'); },
    get qrGenInput() { return document.getElementById('qrGenInput'); },
    get qrOutput() { return document.getElementById('qrOutput'); },
    get genQrBtn() { return document.getElementById('genQrBtn'); },
    get startQuizBtn() { return document.getElementById('startQuizBtn'); },
    get evidenceBtn() { return document.getElementById('evidenceBtn'); }, 
    get dontsBtn() { return document.getElementById('dontsBtn'); },       
    get lawCaseBtns() { return document.querySelectorAll('.law-case-btn'); },
    get faqTriggers() { return document.querySelectorAll('.faq-trigger'); },
    get simpleModal() { return document.getElementById('simpleModal'); },
    get simpleModalTitle() { return document.getElementById('simpleModalTitle'); },
    get simpleModalBody() { return document.getElementById('simpleModalBody'); },
    get contactModal() { return document.getElementById('contactModal'); },
    get installBtn() { return document.getElementById('installBtn'); },
    get trustSection() { return document.getElementById('trustSection'); },
    get trustSource() { return document.getElementById('trustSource'); },
    get trustEngines() { return document.getElementById('trustEngines'); },
    get trustTime() { return document.getElementById('trustTime'); },
    get trustUploaded() { return document.getElementById('trustUploaded'); },
    get trustSha256() { return document.getElementById('trustSha256'); },
    get trustStored() { return document.getElementById('trustStored'); },
    get trustConfidence() { return document.getElementById('trustConfidence'); },
    get whyResultContainer() { return document.getElementById('whyResultContainer'); },
    get actionChecklistContainer() { return document.getElementById('actionChecklistContainer'); },
    get aiIncidentAssistantSection() { return document.getElementById('aiIncidentAssistantSection'); },
    get aiIncidentVerdictBadge() { return document.getElementById('aiIncidentVerdictBadge'); },
    get aiIncidentWhatHappened() { return document.getElementById('aiIncidentWhatHappened'); },
    get aiIncidentVerdictText() { return document.getElementById('aiIncidentVerdictText'); },
    get aiIncidentWhyResult() { return document.getElementById('aiIncidentWhyResult'); },
    get aiIncidentActionChecklist() { return document.getElementById('aiIncidentActionChecklist'); },
    get aiIncidentShouldCall1930() { return document.getElementById('aiIncidentShouldCall1930'); },
    get aiIncidentEvidenceToSave() { return document.getElementById('aiIncidentEvidenceToSave'); },
    get aiIncidentOfficialLinks() { return document.getElementById('aiIncidentOfficialLinks'); },
    get aiIncidentPrivacyPromise() { return document.getElementById('aiIncidentPrivacyPromise'); },
    get aiIncidentCanITrust() { return document.getElementById('aiIncidentCanITrust'); },
    get scamExplainAiSection() { return document.getElementById('scamExplainAiSection'); },
    get aiConfidenceBadge() { return document.getElementById('aiConfidenceBadge'); },
    get aiWhatHappened() { return document.getElementById('aiWhatHappened'); },
    get aiWhySuspicious() { return document.getElementById('aiWhySuspicious'); },
    get aiEvidenceSupports() { return document.getElementById('aiEvidenceSupports'); },
    get aiIgnoredImpact() { return document.getElementById('aiIgnoredImpact'); },
    get aiConfidenceText() { return document.getElementById('aiConfidenceText'); },
    get aiNextSteps() { return document.getElementById('aiNextSteps'); },
    get aiVictimMistakes() { return document.getElementById('aiVictimMistakes'); },
    get aiScammerTrick() { return document.getElementById('aiScammerTrick'); },
    get aiScammerGoal() { return document.getElementById('aiScammerGoal'); },
    get aiPreventionTips() { return document.getElementById('aiPreventionTips'); },
    get aiRelatedScams() { return document.getElementById('aiRelatedScams'); },
    get aiLearnMoreContent() { return document.getElementById('aiLearnMoreContent'); },
    get aiLearnIcon() { return document.getElementById('aiLearnIcon'); },
    get cyberAlertsContainer() { return document.getElementById('cyberAlertsContainer'); },
    get cyberAlertsList() { return document.getElementById('cyberAlertsList'); },
    get checklistProgressText() { return document.getElementById('checklistProgressText'); },
    get checklistProgressBar() { return document.getElementById('checklistProgressBar'); },
    get encyclopediaSearchInput() { return document.getElementById('scamSearch') || document.getElementById('encyclopediaSearchInput'); },
    get scamSearchInput() { return document.getElementById('scamSearch'); },
    get scamListContainer() { return document.getElementById('scamListContainer'); },
    get categoryFilterChips() { return document.getElementById('categoryFilterChips'); },
    get scamCountIndicator() { return document.getElementById('scamCountIndicator'); },
    get clearScamSearchBtn() { return document.getElementById('clearScamSearchBtn'); },
    get browserModal() { return document.getElementById('browserModal'); },
    get browserReportContainer() { return document.getElementById('browserReportContainer'); },
    get cyberIntelContainer() { return document.getElementById('cyberIntelContainer'); },
    get intelLastUpdated() { return document.getElementById('intelLastUpdated'); },
    get intelAlertsList() { return document.getElementById('intelAlertsList'); },
    get intelScamTrends() { return document.getElementById('intelScamTrends'); },
    get intelNewsList() { return document.getElementById('intelNewsList'); },
    get intelSecurityUpdates() { return document.getElementById('intelSecurityUpdates'); },
    get intelAwarenessTip() { return document.getElementById('intelAwarenessTip'); },
    get dashboardStatusBadge() { return document.getElementById('dashboardStatusBadge'); },
    get dashboardCompletedCount() { return document.getElementById('dashboardCompletedCount'); },
    get dashboardRemainingCount() { return document.getElementById('dashboardRemainingCount'); },
    get dashboardPercentText() { return document.getElementById('dashboardPercentText'); },
    get dashboardProgressBar() { return document.getElementById('dashboardProgressBar'); },
    get dashboardNextStepText() { return document.getElementById('dashboardNextStepText'); },
    get dashboardLastUpdated() { return document.getElementById('dashboardLastUpdated'); },
    get dashboardChecklistContainer() { return document.getElementById('dashboardChecklistContainer'); },
    get btnFilterAll() { return document.getElementById('btnFilterAll'); },
    get btnFilterIncomplete() { return document.getElementById('btnFilterIncomplete'); },
    get btnFilterCompleted() { return document.getElementById('btnFilterCompleted'); },
    get emergencyIncidentSelect() { return document.getElementById('emergencyIncidentSelect'); },
    get emergencyPlaybookTitle() { return document.getElementById('emergencyPlaybookTitle'); },
    get emergencyPlaybookSteps() { return document.getElementById('emergencyPlaybookSteps'); },
    get emergencyEvidenceChecklist() { return document.getElementById('emergencyEvidenceChecklist'); },
    get evidenceItemCount() { return document.getElementById('evidenceItemCount'); },
    get bankEmergencyGrid() { return document.getElementById('bankEmergencyGrid'); },
    get upiEmergencyGrid() { return document.getElementById('upiEmergencyGrid'); },
    get telecomEmergencyGrid() { return document.getElementById('telecomEmergencyGrid'); },
    get officialResourcesGrid() { return document.getElementById('officialResourcesGrid'); },
    get downloadEmergencyPdfBtn() { return document.getElementById('downloadEmergencyPdfBtn'); }
};

export const toggleMobileMenu = () => {
    const menu = UI.mobileMenu;
    const openIcon = UI.menuIconOpen;
    const closeIcon = UI.menuIconClose;
    const btn = UI.mobileMenuBtn;
    if (!menu || !openIcon || !closeIcon) return;
    const isHidden = menu.classList.toggle('hidden');
    openIcon.classList.toggle('hidden', !isHidden);
    closeIcon.classList.toggle('hidden', isHidden);
    if (btn) btn.setAttribute('aria-expanded', String(!isHidden));
};

export const openModal = (type) => {
    if (type === 'contact') {
        if (UI.contactModal) {
            UI.contactModal.classList.remove('hidden');
            UI.contactModal.classList.add('flex');
        }
        return;
    }
    const modal = UI.simpleModal;
    const title = UI.simpleModalTitle;
    const body = UI.simpleModalBody;
    if (!modal || !title || !body) return;
    modal.classList.remove('hidden'); 
    modal.classList.add('flex');
    
    switch(type) {
        case 'privacy':
            title.innerText = "Privacy Policy (0-Day Retention)";
            body.innerHTML = `<p>1. <strong>Local Computation:</strong> File SHA-256 hashes are generated locally. Your files are NEVER uploaded to our servers.</p><p>2. <strong>Data Retention:</strong> We adhere to a strict <strong>0-day retention policy</strong>. No scan logs or personal info are stored.</p><p>3. <strong>Third-Party APIs:</strong> Hashes and domain queries are routed directly to VirusTotal and WHOIS nodes.</p>`;
            break;
        case 'terms':
            title.innerText = "Terms of Service & Liability";
            body.innerHTML = `<p>1. <strong>Educational Shield:</strong> CyberPehra provides automated threat telemetry.</p><p>2. <strong>No Warranty:</strong> Risk scores are probabilistic and do not guarantee absolute safety or replace professional advice. Use at your own risk.</p>`;
            break;
        case 'evidence':
            title.innerText = "📸 Evidence Checklist";
            body.innerHTML = `<ul class="list-disc pl-5 space-y-2"><li><strong>Screenshots:</strong> Take screenshots of chat/profile immediately.</li><li><strong>Transactions:</strong> Save PDF receipts of transfers.</li><li><strong>Do NOT delete:</strong> Do not delete chat history.</li></ul>`;
            break;
        case 'donts':
            title.innerText = "🚫 Abhi Kya Na Kare";
            body.innerHTML = `<ul class="list-disc pl-5 space-y-2 text-rose-300"><li><strong>Do not pay fees:</strong> Scammers ask for money to "unlock" money.</li><li><strong>Do not install AnyDesk:</strong> Never install screen-sharing apps.</li><li><strong>Call 1930:</strong> Report within the first 24 hours.</li></ul>`;
            break;
        case 'quiz':
            title.innerText = "🧠 Quick Cyber Quiz";
            body.innerHTML = `<p>CyberPehra's quiz experience is ready to expand with interactive questions and score tracking.</p><p>For now, this button opens a lightweight safety guide while keeping the existing experience intact.</p>`;
            break;
        case 'law-money':
            title.innerText = '💸 Financial Fraud Guidance'; 
            body.innerHTML = '<p>Block the transfer immediately, preserve the payment proof, and report the scam to the cybercrime portal.</p><p>Never attempt to “recover” funds through another unknown contact.</p>';
            break;
        case 'law-photo':
            title.innerText = '📸 Image & Video Blackmail Guidance'; 
            body.innerHTML = '<p>Do not engage with the blackmailer. Preserve screenshots, report the profile, and contact the cybercrime helpline.</p><p>Do not share more images or private data.</p>';
            break;
    }
};

export const closeModals = () => {
    if (UI.simpleModal) {
        UI.simpleModal.classList.add('hidden');
        UI.simpleModal.classList.remove('flex');
    }
    if (UI.contactModal) {
        UI.contactModal.classList.add('hidden');
        UI.contactModal.classList.remove('flex');
    }
};

export const initCanvasAnimation = () => {
    const c = document.getElementById('netCanvas');
    if(!c) return;
    const ctx = c.getContext('2d');
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;
    let nodes = Array.from({length: 40}, () => ({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3 }));
    let animId;

    const frame = () => {
        ctx.clearRect(0,0,w,h);
        nodes.forEach(n => { 
            n.x += n.vx; n.y += n.vy; 
            if(n.x < 0 || n.x > w) n.vx *= -1; 
            if(n.y < 0 || n.y > h) n.vy *= -1; 
            ctx.beginPath(); 
            ctx.arc(n.x, n.y, 1.2, 0, Math.PI*2); 
            ctx.fillStyle = 'rgba(34,197,94,0.4)'; 
            ctx.fill(); 
        });
        animId = requestAnimationFrame(frame);
    };

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animId);
        else animId = requestAnimationFrame(frame);
    });
    
    window.addEventListener('resize', () => {
        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
    });

    animId = requestAnimationFrame(frame);
};

export const showToast = (message, type = 'success') => {
    let toast = document.getElementById('cyberToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cyberToast';
        document.body.appendChild(toast);
    }
    const bgClass = type === 'error' 
        ? 'bg-rose-950/95 text-rose-300 border-rose-800 shadow-rose-950/50' 
        : 'bg-emerald-950/95 text-emerald-300 border-emerald-800 shadow-emerald-950/50';
    toast.className = `fixed bottom-6 right-6 z-[1000] px-4 py-3 rounded-xl font-mono text-xs shadow-2xl flex items-center gap-2 border backdrop-blur-md transition-all duration-300 ${bgClass}`;
    toast.innerHTML = `<span class="text-base">${type === 'error' ? '⚠️' : '⚡'}</span> <span>${message}</span>`;
    
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
};

export const initLiveMeters = () => {
    const indCounter = document.getElementById('indiaLossCounter');
    const glbCounter = document.getElementById('globalScamsCounter');
    if(!indCounter || !glbCounter) return;
    
    const startOfDay = new Date().setHours(0,0,0,0);
    
    const updateMeters = () => {
        const s = (Date.now() - startOfDay) / 1000;
        indCounter.innerText = `₹${(142.80 + (s * 0.0008)).toFixed(2)} Crores`; 
        glbCounter.innerText = (48219 + Math.floor(s * 0.05)).toLocaleString('en-IN');
        setTimeout(() => requestAnimationFrame(updateMeters), 1000);
    };
    requestAnimationFrame(updateMeters);
};

export const bootSequence = () => {
    const l = document.getElementById('bootLog');
    const b = document.getElementById('bootBar');
    const screen = document.getElementById('bootScreen');
    if(!l || !b || !screen) return;
    
    let i = 0;
    const lines = ['Initializing Engine...', 'Hooking VirusTotal API...', 'Loading heuristics...', 'Systems online.']; 
    
    const nextLine = () => {
        if (i < lines.length) {
            const d = document.createElement('div');
            d.textContent = '> ' + lines[i++]; 
            l.appendChild(d); 
            b.style.width = (i/lines.length*100) + '%'; 
            setTimeout(nextLine, 200);
        } else {
            setTimeout(() => {
                screen.style.opacity = '0';
                screen.style.visibility = 'hidden';
                setTimeout(() => { screen.style.display = 'none'; }, 600);
            }, 400);
        }
    };
    nextLine();
};