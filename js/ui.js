export const UI = {
    langMenuToggle: document.getElementById('langMenuToggle'),
    langMenu: document.getElementById('langMenu'),
    langBtns: document.querySelectorAll('.lang-btn'),
    currentLangLabel: document.getElementById('currentLangLabel'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    menuIconOpen: document.getElementById('menuIconOpen'),
    menuIconClose: document.getElementById('menuIconClose'),
    brandLogoBtn: document.getElementById('brandLogoBtn'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    scanPanels: document.querySelectorAll('.scan-panel'),
    submitBtn: document.getElementById('submitBtn'),
    resultBox: document.getElementById('resultBox'),
    scanBeamEl: document.getElementById('scanBeamEl'),
    resultText: document.getElementById('resultText'),
    breakdownContainer: document.getElementById('breakdownContainer'),
    badgeStatus: document.getElementById('badgeStatus'),
    gaugeArc: document.getElementById('gaugeArc'),
    gaugeValue: document.getElementById('gaugeValue'),
    govGuide: document.getElementById('govGuide'),
    scanModeIndicator: document.getElementById('scanModeIndicator'),
    fileHashInput: document.getElementById('fileHashInput'),
    fileHashIndicator: document.getElementById('fileHashIndicator'),
    urlInputArea: document.getElementById('urlInputArea'),
    chatInputArea: document.getElementById('chatInputArea'),
    qrInput: document.getElementById('qrInput'),
    qrIndicator: document.getElementById('qrIndicator'),
    pwdInput: document.getElementById('pwdInput'),
    pwdBar: document.getElementById('pwdBar'),
    pwdFeedback: document.getElementById('pwdFeedback'),
    genPwdBtn: document.getElementById('genPwdBtn'),
    qrGenInput: document.getElementById('qrGenInput'),
    qrOutput: document.getElementById('qrOutput'),
    genQrBtn: document.getElementById('genQrBtn'),
    startQuizBtn: document.getElementById('startQuizBtn'),
    evidenceBtn: document.getElementById('evidenceBtn'), 
    dontsBtn: document.getElementById('dontsBtn'),       
    lawCaseBtns: document.querySelectorAll('.law-case-btn'),
    faqTriggers: document.querySelectorAll('.faq-trigger'),
    simpleModal: document.getElementById('simpleModal'),
    simpleModalTitle: document.getElementById('simpleModalTitle'),
    simpleModalBody: document.getElementById('simpleModalBody'),
    contactModal: document.getElementById('contactModal'),
    installBtn: document.getElementById('installBtn')
};

export const toggleMobileMenu = () => {
    if (!UI.mobileMenu || !UI.menuIconOpen || !UI.menuIconClose) return;
    const isHidden = UI.mobileMenu.classList.toggle('hidden');
    UI.menuIconOpen.classList.toggle('hidden', !isHidden);
    UI.menuIconClose.classList.toggle('hidden', isHidden);
    UI.mobileMenuBtn.setAttribute('aria-expanded', String(!isHidden));
};

export const openModal = (type) => {
    if (!UI.simpleModal || !UI.simpleModalTitle || !UI.simpleModalBody) return;
    UI.simpleModal.classList.remove('hidden'); 
    UI.simpleModal.classList.add('flex');
    
    switch(type) {
        case 'privacy':
            UI.simpleModalTitle.innerText = "Privacy Policy (0-Day Retention)";
            UI.simpleModalBody.innerHTML = `<p>1. <strong>Local Computation:</strong> File SHA-256 hashes are generated locally. Your files are NEVER uploaded to our servers.</p><p>2. <strong>Data Retention:</strong> We adhere to a strict <strong>0-day retention policy</strong>. No scan logs or personal info are stored.</p><p>3. <strong>Third-Party APIs:</strong> Hashes and domain queries are routed directly to VirusTotal and WHOIS nodes.</p>`;
            break;
        case 'terms':
            UI.simpleModalTitle.innerText = "Terms of Service & Liability";
            UI.simpleModalBody.innerHTML = `<p>1. <strong>Educational Shield:</strong> CyberPehra provides automated threat telemetry.</p><p>2. <strong>No Warranty:</strong> Risk scores are probabilistic and do not guarantee absolute safety or replace professional advice. Use at your own risk.</p>`;
            break;
        case 'evidence':
            UI.simpleModalTitle.innerText = "📸 Evidence Checklist";
            UI.simpleModalBody.innerHTML = `<ul class="list-disc pl-5 space-y-2"><li><strong>Screenshots:</strong> Take screenshots of chat/profile immediately.</li><li><strong>Transactions:</strong> Save PDF receipts of transfers.</li><li><strong>Do NOT delete:</strong> Do not delete chat history.</li></ul>`;
            break;
        case 'donts':
            UI.simpleModalTitle.innerText = "🚫 Abhi Kya Na Kare";
            UI.simpleModalBody.innerHTML = `<ul class="list-disc pl-5 space-y-2 text-rose-300"><li><strong>Do not pay fees:</strong> Scammers ask for money to "unlock" money.</li><li><strong>Do not install AnyDesk:</strong> Never install screen-sharing apps.</li><li><strong>Call 1930:</strong> Report within the first 24 hours.</li></ul>`;
            break;
        case 'quiz':
            UI.simpleModalTitle.innerText = "🧠 Quick Cyber Quiz";
            UI.simpleModalBody.innerHTML = `<p>CyberPehra's quiz experience is ready to expand with interactive questions and score tracking.</p><p>For now, this button opens a lightweight safety guide while keeping the existing experience intact.</p>`;
            break;
        case 'law-money':
            UI.simpleModalTitle.innerText = '💸 Financial Fraud Guidance'; 
            UI.simpleModalBody.innerHTML = '<p>Block the transfer immediately, preserve the payment proof, and report the scam to the cybercrime portal.</p><p>Never attempt to “recover” funds through another unknown contact.</p>';
            break;
        case 'law-photo':
            UI.simpleModalTitle.innerText = '📸 Image & Video Blackmail Guidance'; 
            UI.simpleModalBody.innerHTML = '<p>Do not engage with the blackmailer. Preserve screenshots, report the profile, and contact the cybercrime helpline.</p><p>Do not share more images or private data.</p>';
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
            setTimeout(() => screen.style.display = 'none', 400);
        }
    };
    nextLine();
};