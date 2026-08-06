import { State } from './state.js';
import { UI } from './ui.js';

export const Translations = {
    en: {
        boot_sys: "CYBERPEHRA SECURITY CORE", nav_scanner: "Scanner", nav_how: "How it Works", nav_tools: "Tools", nav_law: "⚖️ Law Hub", nav_sos: "🚨 SOS", nav_report: "Report", nav_ai: "CyberPehra AI",
        hero_badge: "SYSTEM ONLINE <span class=\"text-slate-500\">//</span> Neural Core v4.0<span class=\"caret\">_</span>",
        hero_title: "Analyze Risk Before <br><span class=\"bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent\">It Compromises You.</span>",
        hero_desc: "India's advanced AI-powered cybersecurity command shield. Analyze links, WhatsApp messages, UPI IDs, or check fake websites instantly.",
        ts_privacy: "Zero Data Stored (Privacy First)", ts_active: "Active Since 2026", ts_verified: "AI Engine Verified",
        tab_chat: "💬 Chat Scan", tab_url: "🔗 URL Scan", tab_file: "📁 File/APK (VT)", tab_qr: "▦ QR", tab_phone: "📞 Phone", tab_upi: "💳 UPI ID",
        lbl_chat: "Scam Conversation Analyzer", ph_chat_scan: "Paste WhatsApp chat, SMS, or suspicious email here...",
        lbl_url: "Website / URL Risk Verification", ph_url: "https://suspicious-link.com", lbl_url_desc: "Requires http:// or https://. Checked against VT, Safe Browsing heuristics, WHOIS, and IP Geolocation.",
        lbl_file: "File / APK Verification (VirusTotal Hash API)", lbl_file_sel: "Select APK or File to compute local SHA-256", lbl_file_desc: "Your file NEVER leaves your device. Only the cryptographic hash string is checked against 70+ AV engines.",
        lbl_qr: "QR Code Scan", lbl_qr_sel: "Upload QR code image", lbl_qr_desc: "Decodes and analyzes the hidden links inside the QR code",
        lbl_phone: "Phone Number Check", ph_phone: "+91 XXXXX XXXXX", lbl_phone_desc: "Checks phone number against community-reported fraud databases.",
        lbl_upi: "UPI ID / VPA Trust Score", ph_upi: "e.g., scammer@paytm or 98765@ybl", lbl_upi_desc: "Verify VPA handles against reported fraudulent accounts in India.",
        msg_upi_dev: "There is currently no official public API for verifying Indian UPI VPAs. To prevent false accusations and legal liability, <strong>CyberPehra does not generate fake or simulated trust scores for UPI IDs</strong>.", msg_upi_dev2: "Status: Community reporting portal integration planned. No risk score will be shown until real data is live.",
        msg_ph_dev: "To guarantee accuracy and prevent defamation of innocent phone numbers, <strong>no automated fallback scores are generated for phone inputs</strong>.", msg_ph_dev2: "If you have received a scam call, please report it immediately to the National Cyber Crime Helpline at <strong class=\"text-green-400\">1930</strong>.",
        tag_heuristics: "Heuristics", tag_risk: "Risk %", btn_scan: "Run Risk Analysis",
        res_prob: "🛡️ Threat Assessment Result", res_score_lbl: "Ratio / Score", res_disclaimer: "⚠️ <strong>Verification Notice:</strong> Results are aggregated automatically from VirusTotal, Google Safe Browsing, and public WHOIS nodes. This is an automated assessment and not a legal verdict. Human verification is required.",
        res_guide_title: "🚨 Official Action Guidance", res_guide_desc: "If financial loss or cyber extortion has occurred, immediately initiate account freeze:", res_guide_p: "Portal:", res_guide_h: "Helpline:", btn_dl_pdf: "📄 Download Evidence PDF",
        how_badge: "Simple Workflow", how_title: "How CyberPehra Works", how_step1_title: "1. Paste or Upload", how_step1_desc: "Paste any suspicious URL, or upload an APK file to generate its local hash.", how_step2_title: "2. Threat Intelligence", how_step2_desc: "Our engine securely queries VirusTotal and Safe Browsing nodes for exact detections.", how_step3_title: "3. Get Real Verdict", how_step3_desc: "Instantly know if it's flagged by security vendors. No fake fallback scores.",
        tools_title: "🛠️ Mini Cyber Tools", tools_desc: "Free local utilities to keep your digital life secure.", tool_pwd: "Password Security", ph_pwd: "Test a password...", btn_gen_pwd: "Generate Strong Password ⚡", tool_qr: "Secure QR Generator", ph_qr_gen: "Enter link or text...", btn_gen_qr: "Create QR Code ▦", tool_quiz: "Cyber Security Quiz", tool_quiz_d: "Test your knowledge with a quick awareness test.", btn_start_quiz: "Start Quiz 🎮",
        rh_badge: "Emergency Action Kit", rh_title: "Report a Cyber Scam Instantly", rh_desc: "If you or someone you know has fallen victim to online fraud, act immediately using this toolkit.", kit_ev_btn: "Evidence Checklist 📸", kit_dont_btn: "Abhi Kya Na Kare 🚫",
        sys_title: "System Status & Updates", log_v4: "Implemented strictly real, data-backed scanning. Removed all fallback/default risk scores. VirusTotal API integrated for accurate verification.",
        vis_badge: "The Visionary Behind CyberPehra", vis_title: "Meet <span class=\"text-green-400\">Udit Anand</span>", vis_sub: "Founder & Developer", vis_p1: "I am a cybersecurity student from Tarapur, Bihar. Growing up here, I noticed a significant gap in digital literacy in my region — many people remain vulnerable to online scams simply due to a lack of awareness.", vis_p2: "Combining this observation with my growing knowledge, I built <strong class=\"text-white font-display tracking-wide\">CyberPehra</strong> — a free tool that anyone can use to stay safe. Protecting people from digital fraud isn't just a project for me, it's the core focus of my professional path.", vis_tag1: "Tarapur, Bihar", vis_tag2: "100% Free Public Initiative",
        law_badge: "Legal Empowerment Center", law_title: "⚖️ Cyber Law Awareness Hub",
        lb_h: "Cyber Crime Kya Hai", lb_c1: "Fake link ya QR code ke zariye bank account se paise nikal lena.", lb_c2: "Police ya CBI banakar video call par dara-dhamka kar paise vasoolna.", lb_c3: "Private photos ki dhmki dekar blackmail karna ya harass karna.",
        ls_h: "Mera Case Kis Category Mein Aata Hai?", ls_btn1: "💸 \"Mujhse online ya UPI se paisa loot liya gaya\"", ls_btn2: "📸 \"Meri photo ya video ka galat istemal ho raha hai\"",
        lm_title: "Live Cyber Fraud Loss Meter", lm_ind: "India Daily Loss Est.", lm_glb: "Global Scams Active",
        btn_bug: "✉️ Contact / Grievance", ft_priv: "Privacy Policy",
        ft_disc: "<strong>Disclaimer:</strong> CyberPehra uses AI/API-based threat intelligence to provide probabilistic risk scores. Always perform human verification as results are not 100% guaranteed. The legal awareness information provided should not replace professional legal, financial, or technical advice."
    },
    hi: {
        boot_sys: "साइबर-पहरा सिक्योरिटी कोर", nav_scanner: "स्कैनर", nav_how: "यह कैसे काम करता है", nav_tools: "टूल्स", nav_law: "⚖️ लॉ हब", nav_sos: "🚨 इमरजेंसी", nav_report: "रिपोर्ट करें", nav_ai: "CyberPehra AI",
        hero_badge: "सिस्टम ऑनलाइन <span class=\"text-slate-500\">//</span> Neural Core v4.0<span class=\"caret\">_</span>",
        hero_title: "रिस्क को एनालाइज करें <br><span class=\"bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent\">नुकसान होने से पहले।</span>",
        hero_desc: "भारत का एडवांस AI-पावर्ड साइबर सिक्योरिटी शील्ड। लिंक्स, मैसेज, या वेबसाइट तुरंत चेक करें।",
        ts_privacy: "जीरो डेटा स्टोर (प्राइवेसी फर्स्ट)", ts_active: "2026 से एक्टिव", ts_verified: "AI इंजन द्वारा प्रमाणित",
        tab_chat: "💬 चैट स्कैन", tab_url: "🔗 URL स्कैन", tab_file: "📁 फाइल/APK (VT)", tab_qr: "▦ QR", tab_phone: "📞 फोन", tab_upi: "💳 UPI ID",
        lbl_chat: "स्कैम कन्वर्सेशन एनालाइजर", ph_chat_scan: "संदिग्ध WhatsApp चैट या SMS यहाँ पेस्ट करें...",
        lbl_url: "वेबसाइट / URL रिस्क वेरिफिकेशन", ph_url: "https://suspicious-link.com", lbl_url_desc: "URL http:// या https:// से शुरू होना चाहिए।",
        lbl_file: "फाइल / APK वेरिफिकेशन (VirusTotal Hash API)", lbl_file_sel: "लोकल SHA-256 हैश के लिए कोई भी फाइल चुनें", lbl_file_desc: "सिर्फ हैश चेक होता है। आपकी फाइल कभी भी हमारे सर्वर पर अपलोड नहीं होती।",
        lbl_qr: "QR कोड स्कैन", lbl_qr_sel: "QR कोड की फोटो अपलोड करें", lbl_qr_desc: "QR के अंदर छिपे हुए लिंक को डिकोड करता है।",
        lbl_phone: "फोन नंबर चेक", ph_phone: "+91 XXXXX XXXXX", lbl_phone_desc: "फोन नंबर को फ्रॉड डेटाबेस में चेक करता है।",
        lbl_upi: "UPI ID ट्रस्ट स्कोर", ph_upi: "जैसे, scammer@paytm", lbl_upi_desc: "VPA (UPI ID) चेक करें।",
        msg_upi_dev: "फ़िलहाल भारतीय UPI ID को वेरिफाई करने के लिए कोई आधिकारिक सार्वजनिक API नहीं है। झूठे आरोपों से बचने के लिए, <strong>CyberPehra UPI ID के लिए कोई नकली या बनावटी रिस्क स्कोर जनरेट नहीं करता है।</strong>", msg_upi_dev2: "स्थिति: कम्युनिटी रिपोर्टिंग पोर्टल का इंटीग्रेशन जारी है। जब तक रियल डेटा उपलब्ध नहीं होता, कोई रिस्क स्कोर नहीं दिखाया जाएगा।",
        msg_ph_dev: "निर्दोष फोन नंबरों की बदनामी से बचने और 100% सटीकता सुनिश्चित करने के लिए, <strong>फोन नंबरों के लिए कोई ऑटोमेटेड डिफ़ॉल्ट स्कोर जनरेट नहीं किया जाता है।</strong>", msg_ph_dev2: "अगर आपको कोई स्कैम कॉल आई है, तो कृपया तुरंत राष्ट्रीय साइबर अपराध हेल्पलाइन <strong class=\"text-green-400\">1930</strong> पर रिपोर्ट करें।",
        tag_heuristics: "ह्यूरिस्टिक्स", tag_risk: "रिस्क %", btn_scan: "रिस्क एनालिसिस चलाएं",
        res_prob: "🛡️ थ्रेट असेसमेंट रिज़ल्ट", res_score_lbl: "रेश्यो / स्कोर", res_disclaimer: "⚠️ <strong>ध्यान दें:</strong> यह VirusTotal, Safe Browsing और पब्लिक WHOIS से लिया गया एक ऑटोमेटेड परिणाम है। कोई भी कदम उठाने से पहले खुद जांच जरूर करें।",
        res_guide_title: "🚨 आधिकारिक शिकायत गाइड", res_guide_desc: "अगर वित्तीय नुकसान या साइबर जबरन वसूली हुई है, तो तुरंत खाता फ्रीज करवाएं:", res_guide_p: "पोर्टल:", res_guide_h: "हेल्पलाइन:", btn_dl_pdf: "📄 सबूत PDF डाउनलोड करें",
        how_badge: "आसान तरीका", how_title: "CyberPehra कैसे काम करता है", how_step1_title: "1. पेस्ट या अपलोड करें", how_step1_desc: "कोई भी संदिग्ध URL डालें या APK फाइल का लोकल हैश जनरेट करें।", how_step2_title: "2. थ्रेट इंटेलिजेंस", how_step2_desc: "हमारा सिस्टम VirusTotal और Safe Browsing से सटीक जानकारी निकालता है।", how_step3_title: "3. असली रिज़ल्ट पाएं", how_step3_desc: "तुरंत जानें कि ये सुरक्षित है या स्कैम। कोई नकली (fake) स्कोर नहीं।",
        tools_title: "🛠️ मिनी साइबर टूल्स", tools_desc: "आपकी डिजिटल सुरक्षा के लिए मुफ़्त टूल्स।", tool_pwd: "पासवर्ड सिक्योरिटी", ph_pwd: "पासवर्ड टेस्ट करें...", btn_gen_pwd: "मजबूत पासवर्ड बनाएं ⚡", tool_qr: "QR जनरेटर", ph_qr_gen: "लिंक या टेक्स्ट डालें...", btn_gen_qr: "QR कोड बनाएं ▦", tool_quiz: "साइबर सिक्योरिटी क्विज", tool_quiz_d: "एक छोटे टेस्ट से अपनी जानकारी जांचें।", btn_start_quiz: "क्विज शुरू करें 🎮",
        rh_badge: "इमरजेंसी एक्शन किट", rh_title: "तुरंत साइबर स्कैम रिपोर्ट करें", rh_desc: "अगर फ्रॉड हुआ है, तो तुरंत इस किट का इस्तेमाल करें।", kit_ev_btn: "सबूत (Evidence) चेकलिस्ट 📸", kit_dont_btn: "अभी क्या ना करें 🚫",
        sys_title: "सिस्टम स्टेटस और अपडेट्स", log_v4: "अब स्कैनिंग 100% असली डेटा पर आधारित है। सारे डिफ़ॉल्ट/नकली रिस्क स्कोर हटा दिए गए हैं। VirusTotal API इंटीग्रेट कर दिया गया है।",
        vis_badge: "CyberPehra के पीछे की सोच", vis_title: "मिलिए <span class=\"text-green-400\">उदित आनंद</span> से", vis_sub: "फाउंडर और डेवलपर", vis_p1: "मैं तारापुर, बिहार से एक साइबर सुरक्षा का छात्र हूँ। यहाँ पले-बढ़े होने के नाते, मैंने डिजिटल साक्षरता में कमी देखी — लोग जागरूकता की कमी के कारण स्कैम का शिकार होते हैं।", vis_p2: "अपनी नॉलेज से मैंने <strong class=\"text-white font-display tracking-wide\">CyberPehra</strong> बनाया — एक फ्री टूल जो कोई भी इस्तेमाल कर सकता है। लोगों को बचाना मेरा मुख्य लक्ष्य है।", vis_tag1: "तारापुर, बिहार", vis_tag2: "100% फ्री पब्लिक इनिशिएटिव",
        law_badge: "लीगल एम्पावरमेंट सेंटर", law_title: "⚖️ साइबर लॉ अवेयरनेस हब",
        lb_h: "साइबर क्राइम क्या है", lb_c1: "फेक लिंक या QR कोड के ज़रिये बैंक अकाउंट से पैसे निकाल लेना।", lb_c2: "पुलिस या CBI बनकर वीडियो कॉल पर डरा-धमका कर पैसे वसूलना।", lb_c3: "प्राइवेट फोटो की धमकी देकर ब्लैकमेल करना या हैरेस करना।",
        ls_h: "मेरा केस किस केटेगरी में आता है?", ls_btn1: "💸 \"मुझसे ऑनलाइन या UPI से पैसा लूट लिया गया\"", ls_btn2: "📸 \"मेरी फोटो या वीडियो का गलत इस्तेमाल हो रहा है\"",
        lm_title: "लाइव साइबर फ्रॉड लॉस मीटर", lm_ind: "भारत में रोजाना का नुकसान (अनुमानित)", lm_glb: "एक्टिव ग्लोबल स्कैम्स",
        btn_bug: "✉️ कांटेक्ट / शिकायत", ft_priv: "प्राइवेसी पॉलिसी",
        ft_disc: "<strong>चेतावनी (Disclaimer):</strong> CyberPehra एक AI/API-आधारित थ्रेट इंटेलिजेंस टूल है। हालाँकि हम सटीक परिणाम देने की कोशिश करते हैं, कृपया किसी भी निर्णय से पहले खुद जांच जरूर करें। दिए गए रिस्क स्कोर को लीगल सलाह न मानें।"
    },
    hinglish: {
        boot_sys: "CYBERPEHRA SECURITY CORE", nav_scanner: "Scanner", nav_how: "How it Works", nav_tools: "Tools", nav_law: "⚖️ Law Hub", nav_sos: "🚨 SOS", nav_report: "Report", nav_ai: "CyberPehra AI",
        hero_badge: "SYSTEM ONLINE <span class=\"text-slate-500\">//</span> Neural Core v4.0<span class=\"caret\">_</span>",
        hero_title: "Risk Ko Analyze Karein <br><span class=\"bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent\">Nuksan Hone Se Pehle.</span>",
        hero_desc: "India ka advanced AI-powered cybersecurity shield. Suspicious links, chats, ya files turant verify karein.",
        ts_privacy: "Zero Data Stored (Privacy First)", ts_active: "2026 Se Active", ts_verified: "AI Engine Verified",
        tab_chat: "💬 Chat Scan", tab_url: "🔗 URL Scan", tab_file: "📁 File/APK (VT)", tab_qr: "▦ QR", tab_phone: "📞 Phone", tab_upi: "💳 UPI ID",
        lbl_chat: "Scam Conversation Analyzer", ph_chat_scan: "WhatsApp chat ya SMS yahan paste karein...",
        lbl_url: "Website / URL Risk Verification", ph_url: "https://suspicious-link.com", lbl_url_desc: "Requires http:// or https://. Checked against VT, Safe Browsing heuristics, WHOIS, and IP Geolocation.",
        lbl_file: "File / APK Verification (VirusTotal Hash API)", lbl_file_sel: "Local SHA-256 hash ke liye koi bhi File chunein", lbl_file_desc: "Sirf hash check hota hai. Aapki actual file kabhi upload nahi hoti.",
        lbl_qr: "QR Code Scan", lbl_qr_sel: "QR code photo upload karein", lbl_qr_desc: "QR code ke andar chhupe link ko decode karta hai.",
        lbl_phone: "Phone Number Check", ph_phone: "+91 XXXXX XXXXX", lbl_phone_desc: "Phone number ko fraud database mein check karta hai.",
        lbl_upi: "UPI ID Trust Score", ph_upi: "jaise, scammer@paytm", lbl_upi_desc: "VPA handle verify karein.",
        msg_upi_dev: "Filhal Indian UPI VPAs verify karne ke liye koi official public API nahi hai. False accusations aur legal risk se bachne ke liye, <strong>CyberPehra UPI IDs par fake ya simulated risk score generate nahi karta.</strong>", msg_upi_dev2: "Status: Community reporting portal development mein hai. Real data aane tak koi score nahi dikhaya jayega.",
        msg_ph_dev: "Innocent phone numbers ki badnami se bachne aur 100% accuracy maintain karne ke liye, <strong>phone inputs par koi automated fallback score generate nahi hota.</strong>", msg_ph_dev2: "Agar aapko scam call aayi hai, toh kripya National Cyber Crime Helpline <strong class=\"text-green-400\">1930</strong> par turant report karein.",
        tag_heuristics: "Heuristics", tag_risk: "Risk %", btn_scan: "Run Risk Analysis",
        res_prob: "🛡️ Threat Assessment Result", res_score_lbl: "Ratio/Score", res_disclaimer: "⚠️ <strong>Verification Notice:</strong> Yeh result VirusTotal, Safe Browsing aur public WHOIS se liya gaya ek automated assessment hai. Koi bhi action lene se pehle khud zaroor check karein.",
        res_guide_title: "🚨 Official Action Guide", res_guide_desc: "Agar financial fraud ya extortion hua hai, toh account turant freeze karwayein:", res_guide_p: "Portal:", res_guide_h: "Helpline:", btn_dl_pdf: "📄 Evidence PDF Download Karein",
        how_badge: "Simple Workflow", how_title: "CyberPehra Kaise Kaam Karta Hai", how_step1_title: "1. Paste ya Upload Karein", how_step1_desc: "Koi bhi suspicious URL ya APK file yahan daalein.", how_step2_title: "2. Threat Intelligence", how_step2_desc: "Humara system VirusTotal aur Safe Browsing se exact detection nikalega.", how_step3_title: "3. Asli Verdict Payein", how_step3_desc: "Turant pata lagayein ki ye safe hai ya scam. Koi fake fallback score nahi.",
        tools_title: "🛠️ Mini Cyber Tools", tools_desc: "Free local tools aapki digital safety ke liye.", tool_pwd: "Password Security", ph_pwd: "Password test karein...", btn_gen_pwd: "Strong Password Banao ⚡", tool_qr: "Secure QR Generator", ph_qr_gen: "Link ya text daalein...", btn_gen_qr: "QR Code Banao ▦", tool_quiz: "Cyber Security Quiz", tool_quiz_d: "Apni knowledge test karein is mini quiz se.", btn_start_quiz: "Quiz Shuru Karein 🎮",
        rh_badge: "Emergency Action Kit", rh_title: "Turant Cyber Scam Report Karein", rh_desc: "Agar fraud hua hai, toh is toolkit ka turant use karein.", kit_ev_btn: "Evidence Checklist 📸", kit_dont_btn: "Abhi Kya Na Kare 🚫",
        sys_title: "System Status & Updates", log_v4: "Ab scanning 100% real data par based hai. Saare fake/default risk scores hata diye gaye hain. VirusTotal API integrated for files.",
        vis_badge: "The Visionary Behind CyberPehra", vis_title: "Meet <span class=\"text-green-400\">Udit Anand</span>", vis_sub: "Founder & Developer", vis_p1: "Main Tarapur, Bihar se ek cybersecurity student hu. Maine dekha ki awareness ki kami se log asani se online scams ka shikar ban jate hain.", vis_p2: "Apni knowledge use karke maine <strong class=\"text-white font-display tracking-wide\">CyberPehra</strong> banaya — ek free tool jo koi bhi use kar sakta hai. Ye sirf ek project nahi, mere career ka focus hai.", vis_tag1: "Tarapur, Bihar", vis_tag2: "100% Free Public Initiative",
        law_badge: "Legal Empowerment Center", law_title: "⚖️ Cyber Law Awareness Hub",
        lb_h: "Cyber Crime Kya Hai", lb_c1: "Fake link ya QR code ke zariye bank account se paise nikal lena.", lb_c2: "Police ya CBI banakar video call par dara-dhamka kar paise vasoolna.", lb_c3: "Private photos ki dhmki dekar blackmail karna ya harass karna.",
        ls_h: "Mera Case Kis Category Mein Aata Hai?", ls_btn1: "💸 \"Mujhse online ya UPI se paisa loot liya gaya\"", ls_btn2: "📸 \"Meri photo ya video ka galat istemal ho raha hai\"",
        lm_title: "Live Cyber Fraud Loss Meter", lm_ind: "India Daily Loss Est.", lm_glb: "Global Scams Active",
        btn_bug: "✉️ Contact / Grievance", ft_priv: "Privacy Policy",
        ft_disc: "<strong>Disclaimer:</strong> CyberPehra ek AI/API-based tool hai. Hum accurate results dene ki poori koshish karte hain, par cybersecurity me threats constantly change hote hain. Isliye, CyberPehra 100% guarantee nahi deta. Hamesha human verification zaroor karein."
    }
};

export const getTranslation = (key) => {
    return Translations[State.currentLang] && Translations[State.currentLang][key] ? Translations[State.currentLang][key] : key;
};

export const applyLanguage = (lang) => {
    const safeLang = ['en', 'hi', 'hinglish'].includes(lang) ? lang : 'en';
    State.currentLang = safeLang; 
    localStorage.setItem('cyberpehra_lang', safeLang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        if (Translations[safeLang] && Translations[safeLang][key]) { 
            el.innerHTML = Translations[safeLang][key]; 
        } 
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { 
        const key = el.getAttribute('data-i18n-placeholder'); 
        if (Translations[safeLang] && Translations[safeLang][key]) { 
            el.placeholder = Translations[safeLang][key]; 
        } 
    });
    
    UI.langBtns.forEach(btn => {
        if (btn.dataset.lang === safeLang) { 
            btn.classList.add('text-green-400', 'font-bold'); 
            btn.classList.remove('text-slate-300'); 
            if (UI.currentLangLabel) UI.currentLangLabel.innerText = btn.innerText.substring(0,2).toUpperCase(); 
        } else { 
            btn.classList.remove('text-green-400', 'font-bold'); 
            btn.classList.add('text-slate-300'); 
        }
    });
};

export const toggleLangMenu = (forceClose = false) => {
    if (!UI.langMenu) return;
    if (forceClose) {
        UI.langMenu.classList.add('hidden');
        UI.langMenuToggle.setAttribute('aria-expanded', 'false');
        return;
    }
    const isHidden = UI.langMenu.classList.toggle('hidden');
    UI.langMenuToggle.setAttribute('aria-expanded', String(!isHidden));
};