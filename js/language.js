import { State } from './state.js';
import { UI } from './ui.js';

export const Translations = {
    en: {
        boot_sys: "CYBERPEHRA SECURITY CORE", nav_dashboard: "Dashboard", nav_scanner: "Threat Scanner", nav_emergency: "🚨 Emergency Center", nav_safety: "🛡️ Safety Dashboard", nav_map: "🇮🇳 India Cyber Map", nav_tools: "🛠️ Tools Center", nav_how: "Workflow", nav_scams: "📖 Scam Encyclopedia", nav_intel: "🌍 Threat Intelligence", nav_law: "⚖️ Law Hub", nav_report: "📢 Report Center", nav_founder: "👤 Founder Vision", nav_settings: "⚙️ System Settings", nav_ai: "CyberPehra AI",
        hero_badge: "SYSTEM ONLINE <span class=\"text-slate-500\">//</span> Neural SOC v5.0<span class=\"caret\">_</span>",
        hero_title: "Analyze Risk Before <br><span class=\"bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent\">It Compromises You.</span>",
        hero_desc: "India's advanced AI-powered cybersecurity platform built to help citizens detect scams before they become victims. Analyze links, files, chats, and QR codes with zero data retention.",
        ts_privacy: "Zero Data Stored", ts_ai: "AI Verified Intelligence", ts_vt: "VirusTotal Connected", ts_first: "Privacy First", ts_india: "Made for India",
        tab_chat: "💬 Chat Scan", tab_url: "🔗 URL Scan", tab_file: "📁 File/APK (VT)", tab_qr: "▦ QR",
        lbl_chat: "Scam Conversation Analyzer", ph_chat_scan: "Paste suspicious WhatsApp chat, SMS, Telegram offer, or email text here...",
        lbl_url: "Website / URL Risk Verification", ph_url: "https://suspicious-link.com", lbl_url_desc: "Supports domain names (e.g. google.com) or full URLs. Checked against VirusTotal, Safe Browsing heuristics, WHOIS, and IP Geolocation.",
        lbl_file: "File / APK Verification (VirusTotal Hash API)", lbl_file_sel: "Select APK or File to compute cryptographic local SHA-256 hash", lbl_file_desc: "Your file NEVER leaves your device. Only the SHA-256 hash is verified against 70+ antivirus engines.",
        lbl_qr: "QR Code Scan", lbl_qr_sel: "Upload QR code image", lbl_qr_desc: "Decodes and analyzes hidden payment or phishing URLs embedded in QR codes.",
        tag_heuristics: "Heuristics", tag_risk: "Risk Score", btn_scan: "⚡ Start Risk Analysis",
        res_prob: "🛡️ Threat Assessment Result", res_score_lbl: "Vendor Consensus Ratio", res_disclaimer: "⚠️ <strong>Verification Notice:</strong> Results are aggregated automatically from VirusTotal, Google Safe Browsing, and public WHOIS nodes. This is an automated assessment and not a legal verdict. Human verification is required.",
        res_guide_title: "🚨 Official Action Guidance", res_guide_desc: "If financial loss or cyber extortion has occurred, immediately initiate account freeze:", res_guide_p: "Portal:", res_guide_h: "Helpline:", btn_dl_pdf: "📄 Download Evidence PDF",
        how_badge: "Simple Workflow", how_title: "How CyberPehra Works", how_step1_title: "1. Paste or Upload", how_step1_desc: "Paste any suspicious URL, message, or select an APK file to generate its cryptographic SHA-256 hash locally.", how_step2_title: "2. Threat Intelligence", how_step2_desc: "Our neural core securely queries VirusTotal and Google Safe Browsing nodes for exact consensus detections.", how_step3_title: "3. Get Real Verdict", how_step3_desc: "Instantly receive a verified risk score and action guidance. Zero simulated or fake fallback scores.",
        tools_title: "🛠️ Security Tools Suite", tools_desc: "Free local utilities to analyze password entropy, generate secure QR codes, audit browser safety, and test cyber awareness.", tool_pwd: "Password Entropy Analyzer", ph_pwd: "Enter password to test entropy...", btn_gen_pwd: "Generate 16-Char Password ⚡", tool_qr: "Secure QR Generator", ph_qr_gen: "Enter URL or payload...", btn_gen_qr: "Generate Secure QR ▦", tool_quiz: "Cyber Awareness Test", tool_quiz_d: "Evaluate your cybersecurity readiness with our interactive scenario test.", btn_start_quiz: "Start Cyber Quiz 🎮",
        rh_badge: "Emergency Action Kit", rh_title: "National Cyber Emergency Response", rh_desc: "Take immediate action within the Golden Hour using official Indian cyber emergency resources.", kit_ev_btn: "Evidence Checklist 📸", kit_dont_btn: "Abhi Kya Na Kare 🚫",
        sys_title: "System Telemetry & Nodes", log_v4: "Neural SOC v5.0 operational. 100% data-backed scanning. VirusTotal & Google Safe Browsing active. Zero logs retained.",
        vis_badge: "The Vision Behind CyberPehra", vis_title: "Meet <span class=\"text-emerald-400\">Udit Anand</span>", vis_sub: "Founder & Lead Developer", vis_p1: "I'm Udit Anand — a self-taught cybersecurity builder from Bihar, India. No degree yet. No formal classroom. Just relentless curiosity and hands-on learning in Ethical Hacking, Linux, Network Security, and Python for security automation.", vis_p2: "I'm currently building CyberPehra to help people identify malicious URLs, files, QR codes, phishing attacks, UPI frauds, and digital arrest scams before they become victims. I believe real skill is proven by what you build, not just what you study.", vis_tag1: "Tarapur, Bihar", vis_tag2: "100% Free Public Initiative", vis_tag3: "Made for Digital India",
        law_badge: "Legal Empowerment Center", law_title: "⚖️ Cyber Law Awareness Hub",
        lb_h: "Understanding Cyber Crime", lb_c1: "Unauthorized money withdrawal via phishing links, fake APKs, or fraudulent QR codes.", lb_c2: "Extortion via fake police/CBI video calls (Digital Arrest scams).", lb_c3: "Blackmail and harassment using altered private photos or personal data.",
        ls_h: "Select Your Cyber Incident Category", ls_btn1: "💸 \"Money Stolen via Online/UPI Fraud\"", ls_btn2: "📸 \"Photos/Videos Misused or Blackmailed\"",
        lm_title: "Live Cyber Threat Intelligence Meter", lm_ind: "India Daily Fraud Loss (Est.)", lm_glb: "Active Cyber Advisories",
        btn_bug: "✉️ Contact / Grievance", ft_priv: "Privacy Policy",
        ft_disc: "<strong>Disclaimer:</strong> CyberPehra provides automated threat telemetry using verified APIs. Results are probabilistic risk indicators and do not constitute legal advice. Always verify with official authorities."
    },
    hi: {
        boot_sys: "साइबर-पहरा सिक्योरिटी कोर", nav_dashboard: "डैशबोर्ड", nav_scanner: "थ्रेट स्कैनर", nav_emergency: "🚨 इमरजेंसी सेंटर", nav_safety: "🛡️ सेफ्टी डैशबोर्ड", nav_map: "🇮🇳 भारत साइबर मैप", nav_tools: "🛠️ टूल्स सेंटर", nav_how: "कार्यप्रणाली", nav_scams: "📖 स्कैम ज्ञानकोश", nav_intel: "🌍 थ्रेट इंटेलिजेंस", nav_law: "⚖️ लॉ हब", nav_report: "📢 रिपोर्ट सेंटर", nav_founder: "👤 संस्थापकीय सोच", nav_settings: "⚙️ सिस्टम सेटिंग्स", nav_ai: "CyberPehra AI",
        hero_badge: "सिस्टम ऑनलाइन <span class=\"text-slate-500\">//</span> Neural SOC v5.0<span class=\"caret\">_</span>",
        hero_title: "रिस्क को एनालाइज करें <br><span class=\"bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent\">नुकसान होने से पहले।</span>",
        hero_desc: "भारत का उन्नत AI-आधारित साइबर सुरक्षा मंच जो नागरिकों को स्कैम का शिकार होने से पहले अलर्ट करता है। शून्य डेटा संचयन के साथ लिंक्स, फाइल्स और चैट स्कैन करें।",
        ts_privacy: "जीरो डेटा स्टोर", ts_ai: "AI सत्यापित जानकारी", ts_vt: "VirusTotal कनेक्टेड", ts_first: "प्राइवेसी प्रथम", ts_india: "डिजिटल इंडिया हेतु निर्मित",
        tab_chat: "💬 चैट स्कैन", tab_url: "🔗 URL स्कैन", tab_file: "📁 फाइल/APK (VT)", tab_qr: "▦ QR",
        lbl_chat: "स्कैम वार्तालाप विश्लेषक", ph_chat_scan: "संदिग्ध WhatsApp चैट, SMS, Telegram ऑफ़र या ईमेल यहाँ पेस्ट करें...",
        lbl_url: "वेबसाइट / URL रिस्क सत्यापन", ph_url: "https://suspicious-link.com", lbl_url_desc: "डोमेन नाम (जैसे google.com) या पूरा URL भरें। VirusTotal, Safe Browsing और WHOIS द्वारा जांचा गया।",
        lbl_file: "फाइल / APK सत्यापन (VirusTotal Hash API)", lbl_file_sel: "लोकल SHA-256 हैश जनरेट करने के लिए फाइल चुनें", lbl_file_desc: "आपकी फाइल कभी भी आपके डिवाइस से बाहर नहीं जाती। केवल SHA-256 हैश 70+ एंटीवायरस इंजनों से जांचा जाता है।",
        lbl_qr: "QR कोड स्कैन", lbl_qr_sel: "QR कोड की फोटो अपलोड करें", lbl_qr_desc: "QR कोड में छिपे हुए पेमेंट या फ़िशिंग लिंक को डिकोड करता है।",
        tag_heuristics: "ह्यूरिस्टिक्स", tag_risk: "रिस्क स्कोर", btn_scan: "⚡ रिस्क एनालिसिस चलाएं",
        res_prob: "🛡️ थ्रेट असेसमेंट परिणाम", res_score_lbl: "वेंडर सहमति अनुपात", res_disclaimer: "⚠️ <strong>सूचना:</strong> यह परिणाम VirusTotal, Safe Browsing और WHOIS से स्वचालित रूप से संकलित किया गया है। यह कोई कानूनी फैसला नहीं है।",
        res_guide_title: "🚨 आधिकारिक शिकायत गाइड", res_guide_desc: "यदि वित्तीय नुकसान हुआ है, तो तुरंत खाता फ्रीज करवाएं:", res_guide_p: "पोर्टल:", res_guide_h: "हेल्पलाइन:", btn_dl_pdf: "📄 सबूत PDF डाउनलोड करें",
        how_badge: "सरल प्रक्रिया", how_title: "CyberPehra कैसे काम करता है", how_step1_title: "1. पेस्ट या अपलोड करें", how_step1_desc: "कोई भी संदिग्ध URL, मैसेज डालें या APK फाइल का लोकल SHA-256 हैश जनरेट करें।", how_step2_title: "2. थ्रेट इंटेलिजेंस", how_step2_desc: "हमारा सिस्टम VirusTotal और Google Safe Browsing से सटीक जानकारी निकालता है।", how_step3_title: "3. असली रिज़ल्ट पाएं", how_step3_desc: "तुरंत जानें कि यह सुरक्षित है या स्कैम। कोई नकली (fake) डिफ़ॉल्ट स्कोर नहीं।",
        tools_title: "🛠️ सुरक्षा टूल्स", tools_desc: "आपकी डिजिटल सुरक्षा के लिए मुफ़्त टूल्स - पासवर्ड मजबूती जांचें, सुरक्षित QR कोड बनाएं और साइबर ज्ञान परखें।", tool_pwd: "पासवर्ड एंट्रॉपी विश्लेषक", ph_pwd: "पासवर्ड टेस्ट करें...", btn_gen_pwd: "16-अक्षर का पासवर्ड बनाएं ⚡", tool_qr: "सुरक्षित QR जनरेटर", ph_qr_gen: "लिंक या टेक्स्ट डालें...", btn_gen_qr: "QR कोड बनाएं ▦", tool_quiz: "साइबर सुरक्षा क्विज", tool_quiz_d: "एक छोटे टेस्ट से अपनी साइबर सुरक्षा जागरूकता परखें।", btn_start_quiz: "क्विज शुरू करें 🎮",
        rh_badge: "इमरजेंसी एक्शन किट", rh_title: "राष्ट्रीय साइबर आपातकालीन प्रतिक्रिया", rh_desc: "गोल्डन आवर में आधिकारिक भारतीय साइबर आपातकालीन संसाधनों का उपयोग करके त्वरित कार्रवाई करें।", kit_ev_btn: "सबूत चेकलिस्ट 📸", kit_dont_btn: "अभी क्या ना करें 🚫",
        sys_title: "सिस्टम स्थिति", log_v4: "Neural SOC v5.0 सक्रिय। 100% सत्यापित डेटा स्कैनिंग। शून्य डेटा संचयन।",
        vis_badge: "CyberPehra के संस्थापक की सोच", vis_title: "मिलिए <span class=\"text-emerald-400\">उदित आनंद</span> से", vis_sub: "संस्थापक एवं डेवलपर", vis_p1: "मैं उदित आनंद हूँ — तारापुर, बिहार से एक स्व-शिक्षित साइबर सुरक्षा डेवलपर। अभी कोई डिग्री नहीं, कोई औपचारिक क्लासरूम नहीं — केवल एथिकल हैकिंग, लिनक्स, नेटवर्क सुरक्षा और पायथन ऑटोमेशन के प्रति अटूट जिज्ञासा और निरंतर प्रयास।", vis_p2: "मैंने CyberPehra बनाया ताकि आम नागरिकों को डिजिटल अरेस्ट, UPI फ्रॉड और फ़िशिंग स्कैम से बचाया जा सके। मेरा मानना है कि वास्तविक कौशल आपके द्वारा बनाए गए प्रोजेक्ट्स से साबित होता है।", vis_tag1: "तारापुर, बिहार", vis_tag2: "100% मुफ़्त जनहित पहल", vis_tag3: "डिजिटल इंडिया हेतु समर्पित",
        law_badge: "कानूनी जागरूकता केंद्र", law_title: "⚖️ साइबर लॉ अवेयरनेस हब",
        lb_h: "साइबर अपराध को समझें", lb_c1: "फेक लिंक या QR कोड के ज़रिये बैंक अकाउंट से पैसे निकालना।", lb_c2: "पुलिस/CBI बनकर डिजिटल अरेस्ट के नाम पर रंगदारी वसूलना।", lb_c3: "प्राइवेट फोटो/वीडियो की धमकी देकर ब्लैकमेल या हैरेस करना।",
        ls_h: "अपनी घटना की श्रेणी चुनें", ls_btn1: "💸 \"ऑनलाइन या UPI से पैसा लूट लिया गया\"", ls_btn2: "📸 \"फोटो या वीडियो का गलत इस्तेमाल हो रहा है\"",
        lm_title: "लाइव साइबर थ्रेट इंटेलिजेंस मीटर", lm_ind: "भारत में अनुमानित दैनिक नुकसान", lm_glb: "सक्रिय साइबर एडवाइजरी",
        btn_bug: "✉️ संपर्क / शिकायत", ft_priv: "प्राइवेसी पॉलिसी",
        ft_disc: "<strong>चेतावनी (Disclaimer):</strong> CyberPehra एक AI/API-आधारित थ्रेट इंटेलिजेंस टूल है। कृपया किसी भी निर्णय से पहले खुद जांच जरूर करें। दिए गए रिस्क स्कोर को कानूनी सलाह न मानें।"
    },
    hinglish: {
        boot_sys: "CYBERPEHRA SECURITY CORE", nav_dashboard: "Dashboard", nav_scanner: "Threat Scanner", nav_emergency: "🚨 Emergency Center", nav_safety: "🛡️ Safety Dashboard", nav_map: "🇮🇳 India Cyber Map", nav_tools: "🛠️ Tools Center", nav_how: "Workflow", nav_scams: "📖 Scam Encyclopedia", nav_intel: "🌍 Threat Intelligence", nav_law: "⚖️ Law Hub", nav_report: "📢 Report Center", nav_founder: "👤 Founder Vision", nav_settings: "⚙️ System Settings", nav_ai: "CyberPehra AI",
        hero_badge: "SYSTEM ONLINE <span class=\"text-slate-500\">//</span> Neural SOC v5.0<span class=\"caret\">_</span>",
        hero_title: "Risk Ko Analyze Karein <br><span class=\"bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent\">Nuksan Hone Se Pehle.</span>",
        hero_desc: "India ka advanced AI-powered cybersecurity platform jo citizens ko scams se bachane ke liye bana hai. Zero data retention ke saath links, chats, files aur QR codes verify karein.",
        ts_privacy: "Zero Data Stored", ts_ai: "AI Verified Intelligence", ts_vt: "VirusTotal Connected", ts_first: "Privacy First", ts_india: "Made for India",
        tab_chat: "💬 Chat Scan", tab_url: "🔗 URL Scan", tab_file: "📁 File/APK (VT)", tab_qr: "▦ QR",
        lbl_chat: "Scam Conversation Analyzer", ph_chat_scan: "WhatsApp chat, SMS, Telegram offers ya suspicious emails yahan paste karein...",
        lbl_url: "Website / URL Risk Verification", ph_url: "https://suspicious-link.com", lbl_url_desc: "Domain names (jaise google.com) ya full URLs daalein. Checked against VirusTotal, Safe Browsing heuristics, WHOIS, and IP Geolocation.",
        lbl_file: "File / APK Verification (VirusTotal Hash API)", lbl_file_sel: "Local SHA-256 hash generate karne ke liye File chunein", lbl_file_desc: "Aapki actual file kabhi device se bahar nahi jati. Sirf cryptographic hash 70+ antivirus engines par check hota hai.",
        lbl_qr: "QR Code Scan", lbl_qr_sel: "QR code photo upload karein", lbl_qr_desc: "QR code ke andar chhupe payment ya phishing link ko decode karta hai.",
        tag_heuristics: "Heuristics", tag_risk: "Risk Score", btn_scan: "⚡ Start Risk Analysis",
        res_prob: "🛡️ Threat Assessment Result", res_score_lbl: "Vendor Consensus Ratio", res_disclaimer: "⚠️ <strong>Verification Notice:</strong> Yeh result VirusTotal, Safe Browsing aur public WHOIS se liya gaya ek automated assessment hai. Action lene se pehle human verification zaroor karein.",
        res_guide_title: "🚨 Official Action Guide", res_guide_desc: "Agar financial loss ya cyber extortion hua hai, toh account turant freeze karwayein:", res_guide_p: "Portal:", res_guide_h: "Helpline:", btn_dl_pdf: "📄 Evidence PDF Download Karein",
        how_badge: "Simple Workflow", how_title: "CyberPehra Kaise Kaam Karta Hai", how_step1_title: "1. Paste ya Upload Karein", how_step1_desc: "Suspicious URL ya message daalein, ya APK file ka local SHA-256 hash generate karein.", how_step2_title: "2. Threat Intelligence", how_step2_desc: "Humara neural system VirusTotal aur Google Safe Browsing se exact detection nikalega.", how_step3_title: "3. Asli Verdict Payein", how_step3_desc: "Turant verified risk score aur action guidance payein. Zero fake fallback scores.",
        tools_title: "🛠️ Security Tools Suite", tools_desc: "Free local utilities - password entropy test karein, secure QR codes banayein aur browser safety audit karein.", tool_pwd: "Password Entropy Analyzer", ph_pwd: "Password test karein...", btn_gen_pwd: "Generate 16-Char Password ⚡", tool_qr: "Secure QR Generator", ph_qr_gen: "Link ya text daalein...", btn_gen_qr: "Generate Secure QR ▦", tool_quiz: "Cyber Awareness Test", tool_quiz_d: "Apni cybersecurity readiness evaluate karein mini quiz se.", btn_start_quiz: "Start Cyber Quiz 🎮",
        rh_badge: "Emergency Action Kit", rh_title: "National Cyber Emergency Response", rh_desc: "Golden hour mein official Indian cyber emergency helpline 1930 ka use karke instant action lein.", kit_ev_btn: "Evidence Checklist 📸", kit_dont_btn: "Abhi Kya Na Kare 🚫",
        sys_title: "System Telemetry & Status", log_v4: "Neural SOC v5.0 operational. 100% real data scanning. Zero logs stored.",
        vis_badge: "The Vision Behind CyberPehra", vis_title: "Meet <span class=\"text-emerald-400\">Udit Anand</span>", vis_sub: "Founder & Developer", vis_p1: "Main Udit Anand hu — Tarapur, Bihar se ek self-taught cybersecurity builder. Koi degree nahi, koi formal classroom nahi — sirf Ethical Hacking, Linux, Network Security aur Python automation mein relentless curiosity.", vis_p2: "Maine CyberPehra banaya hai taaki log Digital Arrest, UPI fraud aur phishing scams ke victim banne se pehle alert ho sakein. Real skill dikhti hai jo aap build karte hain.", vis_tag1: "Tarapur, Bihar", vis_tag2: "100% Free Public Initiative", vis_tag3: "Made for Digital India",
        law_badge: "Legal Empowerment Center", law_title: "⚖️ Cyber Law Awareness Hub",
        lb_h: "Cyber Crime Samajhein", lb_c1: "Fake link ya QR code ke zariye bank account se paise nikal lena.", lb_c2: "Police/CBI banakar video call par dara-dhamka kar paise vasoolna (Digital Arrest).", lb_c3: "Private photos ki dhmki dekar blackmail karna ya harass karna.",
        ls_h: "Apne Cyber Incident Ki Category Select Karein", ls_btn1: "💸 \"Mujhse online ya UPI se paisa loot liya gaya\"", ls_btn2: "📸 \"Meri photo ya video ka galat istemal ho raha hai\"",
        lm_title: "Live Cyber Fraud Loss Meter", lm_ind: "India Daily Fraud Loss (Est.)", lm_glb: "Active Cyber Advisories",
        btn_bug: "✉️ Contact / Grievance", ft_priv: "Privacy Policy",
        ft_disc: "<strong>Disclaimer:</strong> CyberPehra ek AI/API-based threat intelligence tool hai. Decisions lene se pehle human verification zaroor karein."
    }
};

export const getTranslation = (key) => {
    return Translations[State.currentLang] && Translations[State.currentLang][key] ? Translations[State.currentLang][key] : (Translations['en'][key] || key);
};

export const applyLanguage = (lang) => {
    const safeLang = ['en', 'hi', 'hinglish'].includes(lang) ? lang : 'en';
    State.currentLang = safeLang; 
    localStorage.setItem('cyberpehra_lang', safeLang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        const translation = (Translations[safeLang] && Translations[safeLang][key]) || Translations['en'][key];
        if (translation) { 
            el.innerHTML = translation; 
        } 
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { 
        const key = el.getAttribute('data-i18n-placeholder'); 
        const translation = (Translations[safeLang] && Translations[safeLang][key]) || Translations['en'][key];
        if (translation) { 
            el.placeholder = translation; 
        } 
    });
    
    UI.langBtns.forEach(btn => {
        if (btn.dataset.lang === safeLang) { 
            btn.classList.add('text-emerald-400', 'font-bold'); 
            btn.classList.remove('text-slate-300'); 
            if (UI.currentLangLabel) {
                UI.currentLangLabel.innerText = safeLang === 'hinglish' ? 'HI-EN' : safeLang.toUpperCase(); 
            }
        } else { 
            btn.classList.remove('text-emerald-400', 'font-bold'); 
            btn.classList.add('text-slate-300'); 
        }
    });
};

export const toggleLangMenu = (forceClose = false) => {
    if (!UI.langMenu) return;
    if (forceClose) {
        UI.langMenu.classList.add('hidden');
        if (UI.langMenuToggle) UI.langMenuToggle.setAttribute('aria-expanded', 'false');
        return;
    }
    const isHidden = UI.langMenu.classList.toggle('hidden');
    if (UI.langMenuToggle) UI.langMenuToggle.setAttribute('aria-expanded', String(!isHidden));
};