const getEl = (id) => document.getElementById(id);

export const UI = {
    // Navigation & Header Elements
    get langMenuToggle() { return getEl('langMenuToggle') || document.querySelector('[aria-label="Change Language"]'); },
    get langMenu() { return getEl('langMenu'); },
    get langBtns() { return document.querySelectorAll('.lang-btn'); },
    get currentLangLabel() { return getEl('currentLangLabel'); },
    get mobileMenuBtn() { return getEl('mobileMenuBtn') || getEl('menuBtn'); },
    get mobileMenu() { return getEl('mobileMenu'); },
    get menuIconOpen() { return getEl('menuIconOpen'); },
    get menuIconClose() { return getEl('menuIconClose'); },
    get brandLogoBtn() { return getEl('brandLogoBtn') || document.querySelector('header [aria-label="Go to top"]'); },
    get mobileNavLinks() { return document.querySelectorAll('.mobile-nav-link, #mobileMenu a'); },

    // Threat Scanner & Input Elements
    get tabBtns() { return document.querySelectorAll('.tab-btn'); },
    get scanPanels() { return document.querySelectorAll('.scan-panel'); },
    get submitBtn() { return getEl('submitBtn'); },
    get resultBox() { return getEl('resultBox'); },
    get scanBeamEl() { return getEl('scanBeamEl'); },
    get resultText() { return getEl('resultText'); },
    get breakdownContainer() { return getEl('breakdownContainer'); },
    get badgeStatus() { return getEl('badgeStatus'); },
    get gaugeArc() { return getEl('gaugeArc'); },
    get gaugeValue() { return getEl('gaugeValue'); },
    get govGuide() { return getEl('govGuide'); },
    get scanModeIndicator() { return getEl('scanModeIndicator'); },
    get fileHashInput() { return getEl('fileHashInput'); },
    get fileHashIndicator() { return getEl('fileHashIndicator'); },
    get urlInputArea() { return getEl('urlInputArea'); },
    get chatInputArea() { return getEl('chatInputArea'); },
    get qrInput() { return getEl('qrInput'); },
    get qrIndicator() { return getEl('qrIndicator'); },

    // Security Tools (Password, QR, Quiz)
    get pwdInput() { return getEl('pwdInput'); },
    get pwdBar() { return getEl('pwdBar'); },
    get pwdFeedback() { return getEl('pwdFeedback'); },
    get genPwdBtn() { return getEl('genPwdBtn'); },
    get qrGenInput() { return getEl('qrGenInput'); },
    get qrOutput() { return getEl('qrOutput'); },
    get genQrBtn() { return getEl('genQrBtn'); },
    get startQuizBtn() { return getEl('startQuizBtn'); },
    get evidenceBtn() { return getEl('evidenceBtn'); },
    get dontsBtn() { return getEl('dontsBtn'); },
    get lawCaseBtns() { return document.querySelectorAll('.law-case-btn'); },
    get faqTriggers() { return document.querySelectorAll('.faq-trigger'); },

    // Modals & Triggers
    get simpleModal() { return getEl('simpleModal'); },
    get simpleModalTitle() { return getEl('simpleModalTitle'); },
    get simpleModalBody() { return getEl('simpleModalBody'); },
    get contactModal() { return getEl('contactModal'); },

    // System Telemetry & Breakdown Elements
    get installBtn() { return getEl('installBtn'); },
    get trustSection() { return getEl('trustSection'); },
    get trustSource() { return getEl('trustSource'); },
    get trustEngines() { return getEl('trustEngines'); },
    get trustTime() { return getEl('trustTime'); },
    get trustUploaded() { return getEl('trustUploaded'); },
    get trustSha256() { return getEl('trustSha256'); },
    get trustStored() { return getEl('trustStored'); },
    get trustConfidence() { return getEl('trustConfidence'); },
    get sourceStatusHeader() { return getEl('sourceStatusHeader'); },
    get sourceStatusBadges() { return getEl('sourceStatusBadges'); },
    get rateLimitCountdownBox() { return getEl('rateLimitCountdownBox'); },
    get rateLimitTimer() { return getEl('rateLimitTimer'); },
    get fallbackNoticeBanner() { return getEl('fallbackNoticeBanner'); },
    get fallbackNoticeReason() { return getEl('fallbackNoticeReason'); },
    get multiSourceBreakdownContainer() { return getEl('multiSourceBreakdownContainer'); },
    get whyResultContainer() { return getEl('whyResultContainer'); },
    get actionChecklistContainer() { return getEl('actionChecklistContainer'); },

    // AI Incident Assistant Elements
    get aiIncidentAssistantSection() { return getEl('aiIncidentAssistantSection'); },
    get aiIncidentVerdictBadge() { return getEl('aiIncidentVerdictBadge'); },
    get aiIncidentWhatHappened() { return getEl('aiIncidentWhatHappened'); },
    get aiIncidentVerdictText() { return getEl('aiIncidentVerdictText'); },
    get aiIncidentWhyResult() { return getEl('aiIncidentWhyResult'); },
    get aiIncidentActionChecklist() { return getEl('aiIncidentActionChecklist'); },
    get aiIncidentShouldCall1930() { return getEl('aiIncidentShouldCall1930'); },
    get aiIncidentEvidenceToSave() { return getEl('aiIncidentEvidenceToSave'); },
    get aiIncidentOfficialLinks() { return getEl('aiIncidentOfficialLinks'); },
    get aiIncidentPrivacyPromise() { return getEl('aiIncidentPrivacyPromise'); },
    get aiIncidentCanITrust() { return getEl('aiIncidentCanITrust'); },
    get scamExplainAiSection() { return getEl('scamExplainAiSection'); },
    get aiConfidenceBadge() { return getEl('aiConfidenceBadge'); },
    get aiWhatHappened() { return getEl('aiWhatHappened'); },
    get aiWhySuspicious() { return getEl('aiWhySuspicious'); },
    get aiEvidenceSupports() { return getEl('aiEvidenceSupports'); },
    get aiIgnoredImpact() { return getEl('aiIgnoredImpact'); },
    get aiConfidenceText() { return getEl('aiConfidenceText'); },
    get aiNextSteps() { return getEl('aiNextSteps'); },
    get aiVictimMistakes() { return getEl('aiVictimMistakes'); },
    get aiScammerTrick() { return getEl('aiScammerTrick'); },
    get aiScammerGoal() { return getEl('aiScammerGoal'); },
    get aiPreventionTips() { return getEl('aiPreventionTips'); },
    get aiRelatedScams() { return getEl('aiRelatedScams'); },
    get aiLearnMoreContent() { return getEl('aiLearnMoreContent'); },
    get aiLearnIcon() { return getEl('aiLearnIcon'); },
    get cyberAlertsContainer() { return getEl('cyberAlertsContainer'); },
    get cyberAlertsList() { return getEl('cyberAlertsList'); },

    // Scam Encyclopedia & Intelligence Elements
    get checklistProgressText() { return getEl('checklistProgressText'); },
    get checklistProgressBar() { return getEl('checklistProgressBar'); },
    get encyclopediaSearchInput() { return getEl('scamSearch') || getEl('encyclopediaSearchInput'); },
    get scamSearchInput() { return getEl('scamSearch'); },
    get scamListContainer() { return getEl('scamListContainer'); },
    get categoryFilterChips() { return getEl('categoryFilterChips'); },
    get scamCountIndicator() { return getEl('scamCountIndicator'); },
    get clearScamSearchBtn() { return getEl('clearScamSearchBtn'); },
    get browserModal() { return getEl('browserModal'); },
    get browserReportContainer() { return getEl('browserReportContainer'); },
    get cyberIntelContainer() { return getEl('cyberIntelContainer'); },
    get intelLastUpdated() { return getEl('intelLastUpdated'); },
    get intelAlertsList() { return getEl('intelAlertsList'); },
    get intelScamTrends() { return getEl('intelScamTrends'); },
    get intelNewsList() { return getEl('intelNewsList'); },
    get intelSecurityUpdates() { return getEl('intelSecurityUpdates'); },
    get intelAwarenessTip() { return getEl('intelAwarenessTip'); },

    // Safety Dashboard & Checklist
    get dashboardStatusBadge() { return getEl('dashboardStatusBadge'); },
    get dashboardCompletedCount() { return getEl('dashboardCompletedCount'); },
    get dashboardRemainingCount() { return getEl('dashboardRemainingCount'); },
    get dashboardPercentText() { return getEl('dashboardPercentText'); },
    get dashboardProgressBar() { return getEl('dashboardProgressBar'); },
    get dashboardNextStepText() { return getEl('dashboardNextStepText'); },
    get dashboardLastUpdated() { return getEl('dashboardLastUpdated'); },
    get dashboardChecklistContainer() { return getEl('dashboardChecklistContainer'); },
    get btnFilterAll() { return getEl('btnFilterAll'); },
    get btnFilterIncomplete() { return getEl('btnFilterIncomplete'); },
    get btnFilterCompleted() { return getEl('btnFilterCompleted'); },

    // Emergency SOS & Playbook Elements
    get emergencyIncidentSelect() { return getEl('emergencyIncidentSelect'); },
    get emergencyPlaybookTitle() { return getEl('emergencyPlaybookTitle'); },
    get emergencyPlaybookSteps() { return getEl('emergencyPlaybookSteps'); },
    get emergencyEvidenceChecklist() { return getEl('emergencyEvidenceChecklist'); },
    get evidenceItemCount() { return getEl('evidenceItemCount'); },
    get downloadEmergencyPdfBtn() { return getEl('downloadEmergencyPdfBtn'); }
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
            title.innerText = "Privacy Policy (0-Day Retention Policy)";
            body.innerHTML = `
                <div class="space-y-3">
                    <p>1. <strong>Local Client Hashing:</strong> File SHA-256 hashes are computed locally inside your browser using Web Crypto API. Your files are NEVER uploaded to our servers.</p>
                    <p>2. <strong>Zero Data Retention:</strong> CyberPehra operates under a strict <strong>0-day data retention policy</strong>. No search queries, IP addresses, or personal info are stored.</p>
                    <p>3. <strong>Verified Third-Party Nodes:</strong> Domain queries and file hash lookups are sent directly to official VirusTotal and public WHOIS/RDAP endpoints.</p>
                </div>
            `;
            break;
        case 'terms':
            title.innerText = "Terms of Service & Security Notice";
            body.innerHTML = `
                <div class="space-y-3">
                    <p>1. <strong>Public Cyber Defense Tool:</strong> CyberPehra provides automated threat telemetry and security risk indicators.</p>
                    <p>2. <strong>Verification Disclaimer:</strong> Risk verdicts are automated consensus assessments. They do not constitute formal legal advice or guarantees. Human verification is recommended.</p>
                </div>
            `;
            break;
        case 'evidence':
            title.innerText = "📸 Incident Evidence Preservation Checklist";
            body.innerHTML = `
                <div class="space-y-3">
                    <ul class="list-disc pl-5 space-y-2 text-slate-300">
                        <li><strong>Chat Screenshots:</strong> Take full-screen screenshots showing profile info, phone numbers, and timestamps.</li>
                        <li><strong>Payment Records:</strong> Export PDF transaction receipts and save bank UTR numbers immediately.</li>
                        <li><strong>Do NOT Delete:</strong> Keep original WhatsApp / SMS conversation history intact for law enforcement.</li>
                    </ul>
                </div>
            `;
            break;
        case 'donts':
            title.innerText = "🚫 Extortion & Scams — Critical Mistakes to Avoid";
            body.innerHTML = `
                <div class="space-y-3 text-rose-300">
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Never Transfer Advance Fees:</strong> Scammers ask for "processing fees" to release promised funds or lottery winnings.</li>
                        <li><strong>Never Install Remote Apps:</strong> Never install AnyDesk, TeamViewer, or RustDesk on request of unknown callers.</li>
                        <li><strong>Call 1930 Helpline Immediately:</strong> Report financial fraud within the 24-hour Golden Hour window to initiate bank freeze.</li>
                    </ul>
                </div>
            `;
            break;
        case 'quiz':
            title.innerText = "🎮 Cyber Security Scenario Assessment";
            if (typeof window.resetCyberQuiz === 'function') {
                window.resetCyberQuiz();
            } else {
                body.innerHTML = `<div id="quizContainer">Loading interactive quiz...</div>`;
            }
            break;
        case 'whois':
            title.innerText = "🌐 WHOIS Domain Lookup Tool";
            body.innerHTML = `
                <div class="space-y-4 font-sans text-xs">
                    <p class="text-slate-300">Enter a domain name to inspect registration records & creation timestamp:</p>
                    <div class="flex gap-2">
                        <input type="text" id="whoisInput" class="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-xs focus:outline-none focus:border-[#00FF88]" placeholder="e.g. google.com">
                        <button data-action="runWhoisLookup" class="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold text-xs uppercase">Lookup</button>
                    </div>
                    <div id="whoisOutput" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hidden whitespace-pre-wrap"></div>
                </div>
            `;
            break;
        case 'ip':
            title.innerText = "🌍 IP Geolocation & Threat Lookup";
            body.innerHTML = `
                <div class="space-y-4 font-sans text-xs">
                    <p class="text-slate-300">Enter an IP address to query ISP, country, and ASN details:</p>
                    <div class="flex gap-2">
                        <input type="text" id="ipInput" class="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-xs focus:outline-none focus:border-[#00FF88]" placeholder="e.g. 8.8.8.8">
                        <button data-action="runIpLookup" class="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold text-xs uppercase">Inspect IP</button>
                    </div>
                    <div id="ipOutput" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hidden whitespace-pre-wrap"></div>
                </div>
            `;
            break;
        case 'dns':
            title.innerText = "🔍 DNS Record Topology Lookup";
            body.innerHTML = `
                <div class="space-y-4 font-sans text-xs">
                    <p class="text-slate-300">Query DNS A, MX, TXT, and NS records via Google DNS over HTTPS:</p>
                    <div class="flex gap-2">
                        <input type="text" id="dnsInput" class="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-xs focus:outline-none focus:border-[#00FF88]" placeholder="e.g. github.com">
                        <button data-action="runDnsLookup" class="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold text-xs uppercase">Fetch DNS</button>
                    </div>
                    <div id="dnsOutput" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hidden whitespace-pre-wrap"></div>
                </div>
            `;
            break;
        case 'screenshot':
            if (typeof window.openScreenshotWorkspace === 'function') {
                closeModals();
                window.openScreenshotWorkspace();
                return;
            }
            title.innerText = "📸 Visual Cyber Investigation Workspace";
            body.innerHTML = `
                <div class="space-y-4 font-sans text-xs">
                    <p class="text-slate-300">Upload screenshot images to inspect for scam patterns, URLs, UPI handles & threat indicators:</p>
                    <label class="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 cursor-pointer transition">
                        <span class="text-2xl mb-1">📸</span>
                        <span class="text-xs font-sans text-emerald-400 font-bold">Select Screenshot Image</span>
                        <span id="screenshotIndicator" class="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, WebP</span>
                        <input type="file" id="screenshotInput" accept="image/*" class="hidden" onchange="window.handleScreenshotUpload(event)">
                    </label>
                    <div id="screenshotOutput" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hidden"></div>
                </div>
            `;
            break;
        case 'phishing':
            title.innerText = "🎣 Phishing Link & Domain Detector";
            body.innerHTML = `
                <div class="space-y-4 font-sans text-xs">
                    <p class="text-slate-300">Phishing URLs frequently impersonate banking portals, government services, or courier tracking sites using typosquatting.</p>
                    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div class="font-bold text-amber-400">Key Markers of Phishing Websites:</div>
                        <ul class="list-disc pl-4 space-y-1 text-slate-300">
                            <li>Misspelled domain names (e.g. <code>sbl-bank.com</code> instead of <code>sbi.co.in</code>)</li>
                            <li>Requests to update KYC, unblock SIM, or verify netbanking urgently</li>
                            <li>Unencrypted HTTP protocol or recent WHOIS registration (&lt; 30 days old)</li>
                        </ul>
                    </div>
                    <button data-action="launchUrlScannerWithInput" class="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold uppercase tracking-wider">Launch Full URL Scanner ➔</button>
                </div>
            `;
            break;
        case 'law-money':
            title.innerText = '💸 Financial Fraud Legal Playbook';
            body.innerHTML = '<p>Report the incident immediately under IT Act Section 66D to your bank and National Cyber Crime Helpline 1930.</p><p>Preserve bank UTR transaction numbers and conversation screenshots. Do NOT send money to unknown "recovery agents".</p>';
            break;
        case 'law-photo':
            title.innerText = '📸 Blackmail & Image Misuse Legal Playbook';
            body.innerHTML = '<p>File a complaint under IT Act Sections 66E and 67 at cybercrime.gov.in or your nearest cyber police station.</p><p>Do NOT give in to extortion demands or transfer money. Block the perpetrator and save evidence.</p>';
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

export const switchDashboardView = (viewId) => {
    const views = document.querySelectorAll('.dashboard-view');
    const navLinks = document.querySelectorAll('.sidebar-nav-link, .mobile-nav-link, .mobile-dock-item');

    let targetView = document.getElementById(`view-${viewId}`);
    if (!targetView) {
        targetView = document.getElementById('view-dashboard');
        viewId = 'dashboard';
    }

    views.forEach(v => {
        v.classList.add('hidden');
        v.classList.remove('animate-fadeIn');
    });

    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('animate-fadeIn');
    }

    // Fix Black Screen Bug: Scroll window and document to top immediately on view switch
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    navLinks.forEach(link => {
        const isMatch = (link.dataset.view === viewId);
        const isDockItem = link.classList.contains('mobile-dock-item');

        if (isDockItem) {
            if (isMatch) {
                if (link.dataset.view === 'emergency') {
                    link.classList.add('bg-[#FF3B5C]/25', 'text-rose-300', 'border-[#FF3B5C]/60', 'shadow-[0_0_15px_rgba(255,59,92,0.35)]', 'font-extrabold', 'scale-[1.03]');
                    link.classList.remove('bg-[#FF3B5C]/10', 'text-rose-400', 'border-[#FF3B5C]/30', 'text-slate-400');
                } else {
                    link.classList.add('text-[#00FF88]', 'font-bold', 'scale-[1.03]');
                    link.classList.remove('text-slate-400', 'text-slate-300');
                }
            } else {
                link.classList.remove('text-[#00FF88]', 'font-bold', 'scale-[1.03]', 'bg-[#FF3B5C]/25', 'text-rose-300', 'border-[#FF3B5C]/60', 'shadow-[0_0_15px_rgba(255,59,92,0.35)]', 'font-extrabold');
                if (link.dataset.view === 'emergency') {
                    link.classList.add('bg-[#FF3B5C]/10', 'text-rose-400', 'border', 'border-[#FF3B5C]/30');
                } else {
                    link.classList.add('text-slate-400');
                }
            }
        } else {
            if (isMatch) {
                link.classList.add('bg-[#00FF88]/15', 'text-[#00FF88]', 'border', 'border-[#00FF88]/50', 'shadow-[0_0_20px_rgba(0,255,136,0.25)]', 'font-bold');
                link.classList.remove('text-slate-400', 'text-slate-300', 'hover:bg-white/5');
            } else {
                link.classList.remove('bg-[#00FF88]/15', 'text-[#00FF88]', 'border', 'border-[#00FF88]/50', 'shadow-[0_0_20px_rgba(0,255,136,0.25)]', 'bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30', 'font-bold');
                if (link.dataset.view !== 'emergency') {
                    link.classList.add('text-slate-300');
                }
            }
        }
    });

    const mainContainer = document.getElementById('mainContentArea');
    if (mainContainer) mainContainer.scrollTop = 0;

    // Execute view initializers on navigation
    if ((viewId === 'safety' || viewId === 'dashboard') && typeof window.renderSafetyDashboard === 'function') {
        window.renderSafetyDashboard();
    }
    if (viewId === 'scams' && typeof window.renderScamEncyclopedia === 'function') {
        window.renderScamEncyclopedia();
    }
    if (viewId === 'intel' && typeof window.fetchCyberIntelligence === 'function') {
        window.fetchCyberIntelligence();
    }
    if (viewId === 'emergency' && typeof window.renderEmergencyCenter === 'function') {
        window.renderEmergencyCenter();
    }
    if (viewId === 'map' && typeof window.initIndiaThreatMap === 'function') {
        window.initIndiaThreatMap();
    }
};

export const initCanvasAnimation = () => {
    const c = document.getElementById('netCanvas');
    if(!c) return;
    const ctx = c.getContext('2d');
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;

    let nodes = Array.from({length: 45}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1
    }));

    let radarAngle = 0;
    let animId;

    const frame = () => {
        ctx.clearRect(0, 0, w, h);

        // 1. Isometric Grid Overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // 2. Slow Radar Sweep Effect
        radarAngle += 0.005;
        const centerX = w / 2;
        const centerY = h / 2;
        const radarRadius = Math.max(w, h) * 0.6;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radarRadius, radarAngle, radarAngle + 0.2);
        ctx.closePath();
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radarRadius);
        grad.addColorStop(0, 'rgba(0, 255, 136, 0.08)');
        grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        // 3. Particle Network & Connection Lines
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
            ctx.fill();

            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = `rgba(0, 255, 136, ${0.18 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

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

export const initShield3DEffect = () => {
    const shieldContainer = document.getElementById('cyberShield3D');
    if (!shieldContainer) return;

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;

        const rotX = ((clientY - halfHeight) / halfHeight) * -12;
        const rotY = ((clientX - halfWidth) / halfWidth) * 12;

        shieldContainer.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
};

export const initThreatGlobe = () => {
    const globeCanvas = document.getElementById('threatGlobeCanvas');
    if (!globeCanvas) return;
    const ctx = globeCanvas.getContext('2d');
    let angle = 0;

    const markers = [
        { lat: 20.5937, lon: 78.9629, label: "CERT-In National Advisory" },
        { lat: 28.6139, lon: 77.2090, label: "Delhi Cyber Cell" },
        { lat: 19.0760, lon: 72.8777, label: "Mumbai Cyber Threat Unit" },
        { lat: 12.9716, lon: 77.5946, label: "Bengaluru Tech Shield" }
    ];

    const drawGlobe = () => {
        const w = globeCanvas.width = globeCanvas.clientWidth || 280;
        const h = globeCanvas.height = globeCanvas.clientHeight || 280;
        const r = Math.min(w, h) * 0.4;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);
        angle += 0.008;

        // Draw Globe Wireframe
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Parallels & Meridians
        for (let i = -r + 15; i < r; i += 25) {
            const widthAtHeight = Math.sqrt(r * r - i * i);
            ctx.beginPath();
            ctx.ellipse(cx, cy + i * 0.5, widthAtHeight, widthAtHeight * 0.3, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
            ctx.stroke();
        }

        // Animated Rotating Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.15, 0, Math.PI * 1.5);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.restore();

        // Glowing Core
        const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        radial.addColorStop(0, 'rgba(0, 255, 136, 0.15)');
        radial.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(drawGlobe);
    };

    drawGlobe();
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
    toast.className = `fixed bottom-6 right-6 z-[1000] px-4 py-3 rounded-xl font-sans text-xs shadow-2xl flex items-center gap-2 border backdrop-blur-md transition-all duration-300 ${bgClass}`;
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
    if (!screen) return;

    let isHidden = false;

    const hideScreen = () => {
        if (isHidden) return;
        isHidden = true;
        screen.style.opacity = '0';
        screen.style.visibility = 'hidden';
        screen.style.pointerEvents = 'none';
        setTimeout(() => {
            screen.style.display = 'none';
        }, 500);
    };

    // Hard fallback timer: GUARANTEE boot screen hides after max 5 seconds under all circumstances
    const fallbackTimer = setTimeout(hideScreen, 5000);

    const skipBtn = document.getElementById('skipBootBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            clearTimeout(fallbackTimer);
            hideScreen();
        });
    }

    const handleKeydown = (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            clearTimeout(fallbackTimer);
            hideScreen();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);

    screen.addEventListener('click', () => {
        clearTimeout(fallbackTimer);
        hideScreen();
    });

    if (!l || !b) {
        hideScreen();
        return;
    }

    let i = 0;
    const lines = [
        'Initializing CyberPehra Neural Core v5.0...',
        'Connecting VirusTotal API node & Google Safe Browsing heuristics...',
        'Loading SHA-256 local cryptographic engine...',
        'Syncing CERT-In & National Threat Telemetry feeds...',
        'CyberPehra Command Shield Online.'
    ];

    const nextLine = () => {
        if (isHidden) return;
        if (i < lines.length) {
            const d = document.createElement('div');
            d.className = 'text-emerald-400 font-sans text-xs py-0.5 tracking-wider';
            d.textContent = '> ' + lines[i++];
            l.appendChild(d);
            b.style.width = (i / lines.length * 100) + '%';
            setTimeout(nextLine, 350);
        } else {
            setTimeout(() => {
                hideScreen();
            }, 400);
        }
    };
    nextLine();
};