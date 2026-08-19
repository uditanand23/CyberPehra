import { State } from './state.js';
import { UI } from './ui.js';

export const Translations = {
    en: {
        // Boot screen
        boot_sys: "CYBERPEHRA SECURITY CORE",
        boot_title: "CYBERPEHRA SOC v5.0",
        boot_desc: "Analyze Risk Before It Compromises You",
        boot_skip: "Skip Sequence ↗",

        // Header & Nav
        nav_status: "SYSTEM ONLINE",
        nav_version: "Neural SOC v5.0",
        nav_emergency_sos: "🚨 Emergency SOS",
        nav_cat_main: "MAIN",
        nav_cat_scanners: "SCANNERS",
        nav_cat_intel: "INTELLIGENCE",
        nav_cat_tools: "TOOLS",
        nav_cat_response: "RESPONSE",

        nav_home: "🏠 Home",
        nav_scam_scanner: "🛡️ Scam Scanner",
        nav_screenshot: "📸 Screenshot Analyzer",
        nav_website_scanner: "🌐 Website Scanner",
        nav_india_map: "🗺️ India Threat Map",
        nav_intel_link: "🌍 Cyber Intelligence",
        nav_scam_encyclopedia: "📖 Scam Encyclopedia",
        nav_safety_dashboard: "📊 Safety Dashboard",
        nav_pwd_checker: "🔑 Password Checker",
        nav_whois: "🌐 WHOIS",
        nav_ip_lookup: "🌍 IP Lookup",
        nav_dns_lookup: "🔍 DNS Lookup",
        nav_qr_gen: "▦ CyberPehra Tools",
        nav_quiz: "🎮 Cyber Security Quiz",
        nav_emergency_ctr: "🚨 Emergency Center",
        nav_report_scam: "📢 Report Scam",

        nav_dashboard: "Dashboard",
        nav_scanner: "Threat Scanner",
        nav_emergency: "🚨 Emergency Center",
        nav_safety: "🛡️ Safety Dashboard",
        nav_map: "🇮🇳 India Cyber Map",
        nav_tools: "🛠️ Tools Center",
        nav_how: "Workflow",
        nav_scams: "📖 Scam Encyclopedia",
        nav_intel: "🌍 Threat Intelligence",
        nav_law: "⚖️ Law Hub",
        nav_report: "📢 Report Center",
        nav_founder: "👤 Founder Vision",
        nav_settings: "⚙️ System Settings",
        nav_ai: "CyberPehra AI",
        nav_footer_initiative: "100% Free Public Initiative",
        nav_footer_india: "Made for Digital India 🇮🇳",

        // Hero Section
        hero_badge: "SYSTEM ONLINE <span class=\"text-slate-500\">//</span> Neural SOC v5.0<span class=\"caret\">_</span>",
        hero_title: "Analyze Risk Before <br><span class=\"bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent\">It Compromises You.</span>",
        hero_desc: "Your digital safety intelligence layer for suspicious links, files, messages and cyber threats.",
        hero_cta_scan: "⚡ Scan a Suspicious Link",
        hero_cta_tools: "Explore Security ↗",

        // Intelligence Strip
        strip_zero_data: "🔒 Zero Data Stored",
        strip_zero_data_sub: "Local Web Crypto SHA-256",
        strip_vt: "🛡️ VirusTotal API v3",
        strip_vt_sub: "70+ AV Vendor Consensus",
        strip_cert: "🌐 CERT-In Connected",
        strip_cert_sub: "Verified National Bulletins",
        strip_india: "🇮🇳 Made for India",
        strip_india_sub: "100% Free Public Initiative",

        // Security Console
        sec_console_title: "Security Console",
        sec_console_badge: "Multi-Vector Threat Scanner",
        card_link_title: "Link / URL Scan",
        card_link_desc: "Verify suspicious links & domain WHOIS records.",
        card_file_title: "File / APK Scan",
        card_file_desc: "Local SHA-256 hash lookup against 70+ AV engines.",
        card_chat_title: "Message Analyzer",
        card_chat_desc: "Inspect SMS, WhatsApp, and Telegram text for scam flags.",
        card_qr_title: "QR Code Scanner",
        card_qr_desc: "Decode hidden QR payloads & payment traps.",

        // Scanner Console
        scanner_title: "🛡️ Threat Analysis Console",
        scanner_desc: "Multi-Vector Threat Intelligence Engine",
        scanner_mode_link: "Active Mode: Link Verification",
        tab_chat: "💬 Chat Scan",
        tab_url: "🔗 URL Scan",
        tab_file: "📁 File/APK (VT)",
        tab_qr: "▦ QR Scan",
        lbl_chat: "Scam Conversation Analyzer",
        ph_chat_scan: "Paste WhatsApp chat, SMS, Telegram offer, or suspicious email text here...",
        lbl_chat_desc: "Scans message text for financial fraud markers, urgency triggers, and credential phishing patterns.",
        lbl_url: "Website / URL Risk Verification",
        ph_url: "google.com or https://suspicious-link.com",
        lbl_url_desc: "Supports domain names (e.g. google.com) or full URLs. Checked against VirusTotal, Google Safe Browsing, and WHOIS nodes.",
        lbl_file: "File / APK Verification (VirusTotal Hash API)",
        lbl_file_sel: "Select APK or File to compute local SHA-256",
        lbl_file_desc: "Your file NEVER leaves your device. Only the local SHA-256 cryptographic hash string is checked.",
        lbl_qr: "QR Code Scan",
        lbl_qr_sel: "Upload QR code image",
        lbl_qr_desc: "Decodes and analyzes hidden payment or phishing URLs embedded in QR codes.",
        tag_heuristics: "Heuristics",
        tag_risk: "Risk Score",
        btn_scan: "⚡ Start Risk Analysis",

        // Results
        res_prob: "🛡️ Threat Assessment Result",
        res_score_lbl: "Vendor Consensus Ratio",
        res_disclaimer: "⚠️ <strong>Verification Notice:</strong> Results are aggregated automatically from VirusTotal, Google Safe Browsing, and public WHOIS nodes. This is an automated assessment and not a legal verdict. Human verification is required.",
        res_guide_title: "🚨 Official Action Guidance",
        res_guide_desc: "If financial loss or cyber extortion has occurred, immediately initiate account freeze:",
        res_guide_p: "Portal:",
        res_guide_h: "Helpline:",
        btn_dl_pdf: "📄 Download Evidence PDF",
        btn_emergency_1930: "🚨 Emergency 1930 Reporting",

        // Threat Intel Section
        intel_sec_title: "Threat Intelligence",
        btn_refresh_intel: "↻ Refresh Telemetry",
        intel_page_title: "🌍 Live Threat Intelligence Center",
        intel_page_desc: "Aggregated Advisories from CERT-In, CISA, and Public Security Bulletins",
        intel_updated: "Updated Just Now",

        // How CyberPehra Works
        how_badge: "Simple Workflow",
        how_title: "How CyberPehra Analyzes",
        how_subtitle: "Transparent 3-Step Threat Intelligence Verification Protocol",
        how_step1_title: "1. Paste or Upload",
        how_step1_desc: "Input any suspicious link, message text, or APK file. Cryptographic SHA-256 hashes are calculated locally.",
        how_step2_title: "2. Threat Intelligence",
        how_step2_desc: "Our engine queries VirusTotal API v3 vendor consensus nodes and Google Safe Browsing heuristics.",
        how_step3_title: "3. Verified Verdict",
        how_step3_desc: "Receive an evidence verdict, vendor ratio, technical breakdown, and emergency action checklist.",

        // Emergency Response
        em_banner_badge: "GOLDEN HOUR EMERGENCY RESPONSE",
        em_banner_title: "Money Stolen or Facing Active Extortion?",
        em_banner_desc: "Call the National Cyber Crime Helpline 1930 immediately to freeze accounts within 24 hours.",
        em_btn_call: "📞 Call 1930 Now",
        em_btn_playbooks: "View Playbooks 📖",

        em_cmd_badge: "GOLDEN HOUR RESPONSE CENTER",
        em_cmd_title: "Emergency Response Command",
        em_cmd_desc: "If financial loss or cyber extortion has occurred, initiate account freeze and law enforcement actions immediately using official resources.",
        em_playbook_select: "📖 Select Your Cyber Incident Playbook",

        // Safety Dashboard
        safety_title: "🛡️ Citizen Safety Dashboard",
        safety_desc: "Apple Health & Microsoft Defender Inspired Digital Hygiene System",
        btn_dl_hygiene: "Download Hygiene Report 📄",
        safety_checklist_title: "Security Action Checklist",
        filter_all: "All",
        filter_pending: "Pending",
        filter_completed: "Completed",
        safety_completed_lbl: "Completed Checks",
        safety_pending_lbl: "Pending Actions",
        safety_next_lbl: "Recommended Next Step:",

        // Scam Encyclopedia & Intel
        enc_title: "📖 National Cyber Scam Encyclopedia",
        enc_desc: "Verified Repository of Cyber Scams, Modus Operandi, and Prevention Tactics in India",
        enc_showing_all: "Showing All Scams",
        intel_title: "🌍 Live Threat Intelligence Center",
        intel_sub: "Aggregated Advisories from CERT-In, CISA, and Public Security Bulletins",

        // Map Section
        map_title: "🇮🇳 Live Cyber Threat Map – India",
        map_desc: "Real-time cyber attacks across India • Click any state to view telemetry report",
        map_tab_india: "🇮🇳 India View",
        map_tab_global: "🌍 Global View",
        map_radar_label: "Interactive 36 States & UT Radar Map",
        map_3d_btn: "🎲 3D Isometric",
        map_2d_btn: "🗺️ 2D Flat",
        map_ncrb_sync: "NCRB / I4C Telemetry Sync",
        map_quick_select: "📍 Regional Quick Select (All 36 States & UTs):",
        map_quick_hint: "Click any region for instant telemetry report",
        map_legend_title: "Severity Legend:",
        map_legend_high: "🔴 High Attacks",
        map_legend_med: "🟠 Medium Attacks",
        map_legend_low: "🟢 Low Attacks",
        map_legend_pending: "⚪ Data Pending",

        // Security Tools
        tools_title: "🛠️ Security Tools Suite",
        tools_desc: "Free local utilities to keep your digital life secure.",
        tool_pwd: "Password Entropy Analyzer",
        ph_pwd: "Enter password to test entropy...",
        btn_gen_pwd: "Generate 16-Char Password ⚡",
        btn_copy: "Copy 📋",

        tool_pwned_title: "Password Data Breach Checker",
        tool_pwned_guarantee: "k-Anonymity Privacy Guarantee",
        tool_pwned_desc: "Checks if a password has appeared in public data breaches using 5-character SHA-1 hash prefixes. Your full password is NEVER transmitted.",
        ph_pwned: "Enter password to check breach corpus...",
        btn_check_breach: "Check Breach 🔍",

        tool_cell_title: "Official Cyber Crime Cell Directory",
        tool_cell_badge: "State Nodal Officer Directory",
        tool_cell_desc: "Select your State/UT to find official Cyber Crime Cell addresses, nodal officer contact numbers, and reporting details.",
        tool_cell_label: "Select State / Union Territory:",

        tool_qr: "CyberPehra Tools (Secure QR Generator)",
        ph_qr_gen: "Enter link or payload text...",
        btn_gen_qr: "Generate Secure QR ▦",
        btn_copy_text: "Copy Text 📋",

        tool_quiz: "Cyber Awareness Test",
        tool_quiz_d: "Evaluate your cybersecurity readiness with our interactive scenario test.",
        btn_start_quiz: "Start Cyber Quiz 🎮",

        // Scam Encyclopedia
        scam_enc_title: "📖 National Cyber Scam Encyclopedia",
        scam_enc_desc: "Verified Repository of Cyber Scams, Modus Operandi, and Prevention Tactics in India",
        scam_search_ph: "Search scams by keyword (e.g. Digital Arrest, UPI, Telegram)...",
        btn_clear: "Clear",

        // Cyber Law Hub
        law_badge: "Legal Empowerment Center",
        law_title: "⚖️ Cyber Law Awareness Hub",
        law_desc: "Public Guidance on Indian Cyber Crime Laws, IT Act 2000, and Legal Procedures",
        lb_h: "Understanding Cyber Crime",
        lb_c1: "Unauthorized money withdrawal via phishing links, fake APKs, or fraudulent QR codes.",
        lb_c2: "Extortion via fake police/CBI video calls (Digital Arrest scams).",
        lb_c3: "Blackmail and harassment using altered private photos or personal data.",
        ls_h: "Select Your Incident Category",
        ls_btn1: "\"Money Stolen via Online/UPI Fraud\"",
        ls_btn2: "\"Photos/Videos Misused or Blackmailed\"",

        // Report Center
        rh_badge: "Emergency Action Kit",
        rh_title: "National Cyber Emergency Response",
        rh_desc: "Take immediate action using official resources.",
        kit_ev_btn: "Evidence Checklist 📸",
        kit_dont_btn: "Abhi Kya Na Kare 🚫",

        // Founder & Vision
        vis_badge: "The Vision Behind CyberPehra",
        vis_title: "Meet <span class=\"text-emerald-400\">Udit Anand</span>",
        vis_sub: "Founder & Developer",
        vis_p1: "I'm Udit Anand — a self-taught cybersecurity builder from India. No degree yet. No formal classroom. Just relentless curiosity and hands-on learning in Ethical Hacking, Linux, Network Security, and Python automation.",
        vis_p2: "I'm building CyberPehra to help people identify malicious URLs, files, QR codes, phishing attacks, UPI frauds, and digital arrest scams before they become victims. I believe real skill is proven by what you build, not just what you study.",
        vis_tag1: "India",
        vis_tag2: "100% Free Public Initiative",
        vis_tag3: "Made for Digital India 🇮🇳",

        // Settings
        sys_title: "System Settings & Telemetry",
        sys_desc: "API Status, Client Privacy Policy, and System Nodes",
        log_v4: "Neural SOC v5.0 operational. 100% data-backed scanning. VirusTotal & Google Safe Browsing active. Zero logs retained.",

        // Footer & Modals
        btn_bug: "Contact / Grievance",
        ft_priv: "Privacy Policy",
        ft_terms: "Terms of Service",
        ft_disc: "<strong>Disclaimer:</strong> CyberPehra provides automated threat telemetry using verified APIs. Results are probabilistic risk indicators and do not constitute legal advice. Always perform human verification.",

        // Threat Report & HUD Keys
        hud_ready: "SCAN READY",
        hud_started: "SCAN STARTED",
        hud_scanning: "SCANNING",
        hud_analyzing: "ANALYZING THREAT SIGNALS",
        hud_querying: "QUERYING SECURITY SOURCES",
        hud_finalizing: "FINALIZING ASSESSMENT",
        hud_completed: "SCAN COMPLETED",
        hud_failed: "SCAN FAILED",
        hud_stage1: "1. INITIALIZING CONNECTION & CONTEXT",
        hud_stage2: "2. PARSING INPUT FORMAT & PARAMETERS",
        hud_stage3: "3. EXTRACTING TARGET TELEMETRY",
        hud_stage4: "4. LOCAL HEURISTIC ANALYSIS",
        hud_stage5: "5. VIRUSTOTAL / THREAT INTELLIGENCE",
        hud_stage6: "6. GOOGLE SAFE BROWSING / CHECKS",
        hud_stage7: "7. AGGREGATING SECURITY VENDOR REPORTS",
        hud_stage8: "8. FINALIZING VERDICT & REPORT",

        report_title: "CyberPehra Threat Assessment Report",
        report_scan_id: "Scan ID",
        report_timestamp: "Timestamp",
        report_scan_type: "Scan Type",
        report_orig_input: "Original Input",
        report_norm_input: "Normalized Target",
        report_protocol: "Protocol",
        report_host: "Host / Domain",
        report_ip: "IP Telemetry",
        report_vt: "VirusTotal Consensus",
        report_gsb: "Google Safe Browsing",
        report_heuristics: "Local Heuristics",
        report_risk_score: "Calculated Risk Score",
        report_classification: "Risk Classification",
        report_indicators: "Detected Security Indicators",
        report_attribution: "Evidence Attribution",
        report_rec_action: "Recommended Action",
        report_means: "What This Result Means",
        report_not_proves: "What This Result Does NOT Prove",
        report_methodology: "Scan Methodology",
        report_limitations: "Technical Limitations",
        report_privacy: "Privacy & Zero Retention Guarantee",

        sw_title: "Visual Cyber Investigation Workspace",
        sw_subtitle: "Local-First Visual Threat Intelligence & Forensic Analysis",
        sw_back: "Back",
        sw_close: "Close Analysis",
        sw_privacy_banner: "🔒 Privacy Guarantee: Screenshots are processed 100% locally inside browser memory. Zero image data is ever uploaded or saved on any server.",
        sw_confidential_warning: "⚠️ Confidentiality Notice: Do NOT upload screenshots containing plain passwords, OTPs, UPI PINs, banking credentials, or recovery codes.",
        sw_dropzone_title: "Drag & Drop Screenshot Images Here",
        sw_dropzone_desc: "Or click to browse, paste with Ctrl+V, or take mobile photo. Supports PNG, JPG, WebP (Max 20MB, up to 5 images).",
        sw_btn_browse: "Select Screenshots 📸",
        sw_btn_scan: "Start Cyber Investigation 🚀",
        sw_btn_add_more: "+ Add More",
        sw_btn_clear_all: "Clear All",
        sw_btn_zoom_in: "Zoom In +",
        sw_btn_zoom_out: "Zoom Out -",
        sw_btn_rotate: "Rotate 90°",
        sw_btn_reset: "Reset View",
        sw_btn_redact: "Create Privacy Mask ✏️",
        sw_report_title: "CYBERPEHRA VISUAL INVESTIGATION REPORT",
        sw_export_pdf: "Export Investigation PDF 📄",
        sw_evidence_inventory: "Evidence Inventory",
        sw_evidence_trace: "Evidence Traceability Matrix",
        sw_exec_summary: "Executive Investigation Summary",
        sw_methodology: "CyberPehra Forensic Methodology",
        sw_disclaimer: "Automated Analysis & Legal Disclaimer",
        sw_threat_intel: "Live Threat Intelligence Telemetry",
        sw_rec_actions: "Recommended Citizen Actions"
    },
    hi: {
        // Boot screen
        boot_sys: "CyberPehra Security Core",
        boot_title: "CYBERPEHRA SOC v5.0",
        boot_desc: "रिस्क को एनालाइज करें, नुकसान होने से पहले",
        boot_skip: "स्किप करें ↗",

        // Header & Nav
        nav_status: "सिस्टम ऑनलाइन",
        nav_version: "Neural SOC v5.0",
        nav_emergency_sos: "🚨 इमरजेंसी SOS",
        nav_cat_main: "मुख्य मेन्यू",
        nav_cat_scanners: "स्कैनर्स",
        nav_cat_intel: "थ्रेट इंटेलिजेंस",
        nav_cat_tools: "सुरक्षा टूल्स",
        nav_cat_response: "आपातकालीन मदद",

        nav_home: "🏠 होम",
        nav_scam_scanner: "🛡️ स्कैम स्कैनर",
        nav_screenshot: "📸 स्क्रीनशॉट एनालाइजर",
        nav_website_scanner: "🌐 वेबसाइट स्कैनर",
        nav_india_map: "🗺️ भारत थ्रेट मैप",
        nav_intel_link: "🌍 साइबर इंटेलिजेंस",
        nav_scam_encyclopedia: "📖 स्कैम ज्ञानकोश",
        nav_safety_dashboard: "📊 सेफ्टी डैशबोर्ड",
        nav_pwd_checker: "🔑 पासवर्ड चेकर",
        nav_whois: "🌐 WHOIS जांच",
        nav_ip_lookup: "🌍 IP लुकअप",
        nav_dns_lookup: "🔍 DNS लुकअप",
        nav_qr_gen: "▦ CyberPehra Tools",
        nav_quiz: "🎮 साइबर सुरक्षा क्विज",
        nav_emergency_ctr: "🚨 इमरजेंसी सेंटर",
        nav_report_scam: "📢 स्कैम रिपोर्ट करें",

        nav_dashboard: "डैशबोर्ड",
        nav_scanner: "थ्रेट स्कैनर",
        nav_emergency: "🚨 इमरजेंसी सेंटर",
        nav_safety: "🛡️ सेफ्टी डैशबोर्ड",
        nav_map: "🇮🇳 भारत साइबर मैप",
        nav_tools: "🛠️ टूल्स सेंटर",
        nav_how: "कार्यप्रणाली",
        nav_scams: "📖 स्कैम ज्ञानकोश",
        nav_intel: "🌍 थ्रेट इंटेलिजेंस",
        nav_law: "⚖️ लॉ हब",
        nav_report: "📢 रिपोर्ट सेंटर",
        nav_founder: "👤 संस्थापकीय सोच",
        nav_settings: "⚙️ सिस्टम सेटिंग्स",
        nav_ai: "CyberPehra AI",
        nav_footer_initiative: "100% मुफ़्त जनहित पहल",
        nav_footer_india: "डिजिटल इंडिया हेतु समर्पित 🇮🇳",

        // Hero Section
        hero_badge: "सिस्टम ऑनलाइन <span class=\"text-slate-500\">//</span> Neural SOC v5.0<span class=\"caret\">_</span>",
        hero_title: "रिस्क को एनालाइज करें <br><span class=\"bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent\">नुकसान होने से पहले।</span>",
        hero_desc: "संदिग्ध लिंक्स, फाइल्स, चैट्स और साइबर खतरों से बचाव के लिए भारत की एडवांस AI सुरक्षा प्रणाली।",
        hero_cta_scan: "⚡ संदिग्ध लिंक जांचें",
        hero_cta_tools: "सुरक्षा टूल्स देखें ↗",

        // Intelligence Strip
        strip_zero_data: "🔒 जीरो डेटा स्टोर",
        strip_zero_data_sub: "लोकल वेब क्रिप्टो SHA-256",
        strip_vt: "🛡️ VirusTotal API v3",
        strip_vt_sub: "70+ एंटीवायरस इंजन जांच",
        strip_cert: "🌐 CERT-In कनेक्टेड",
        strip_cert_sub: "सत्यापित राष्ट्रीय बुलेटिन",
        strip_india: "🇮🇳 डिजिटल इंडिया हेतु निर्मित",
        strip_india_sub: "100% मुफ़्त जनहित पहल",

        // Security Console
        sec_console_title: "सिक्योरिटी कंसोल",
        sec_console_badge: "मल्टी-वेक्टर थ्रेट स्कैनर",
        card_link_title: "लिंक / URL स्कैन",
        card_link_desc: "संदिग्ध लिंक्स एवं डोमेन रिकॉर्ड्स की जांच करें।",
        card_file_title: "फाइल / APK स्कैन",
        card_file_desc: "फाइल का SHA-256 हैश 70+ एंटीवायरस इंजनों से जांचें।",
        card_chat_title: "मैसेज एनालाइजर",
        card_chat_desc: "SMS, WhatsApp और Telegram मैसेज में स्कैम पहचानें।",
        card_qr_title: "QR कोड स्कैनर",
        card_qr_desc: "QR कोड में छिपे फ़िशिंग लिंक्स एवं पेमेंट ट्रैप डिकोड करें।",

        // Scanner Console
        scanner_title: "🛡️ थ्रेट एनालिसिस कंसोल",
        scanner_desc: "मल्टी-वेक्टर थ्रेट इंटेलिजेंस इंजन",
        scanner_mode_link: "सक्रिय मोड: लिंक सत्यापन",
        tab_chat: "💬 चैट स्कैन",
        tab_url: "🔗 URL स्कैन",
        tab_file: "📁 फाइल/APK (VT)",
        tab_qr: "▦ QR स्कैन",
        lbl_chat: "स्कैम वार्तालाप विश्लेषक",
        ph_chat_scan: "संदिग्ध WhatsApp चैट, SMS, Telegram ऑफ़र या ईमेल यहाँ पेस्ट करें...",
        lbl_chat_desc: "वित्तीय धोखाधड़ी के संकेतों, जल्दबाज़ी के दबाव और फ़िशिंग पैटर्न की जांच करता है।",
        lbl_url: "वेबसाइट / URL रिस्क सत्यापन",
        ph_url: "google.com या https://suspicious-link.com",
        lbl_url_desc: "डोमेन नाम (जैसे google.com) या पूरा URL भरें। VirusTotal, Google Safe Browsing और WHOIS द्वारा जांचा जाता है।",
        lbl_file: "फाइल / APK सत्यापन (VirusTotal Hash API)",
        lbl_file_sel: "लोकल SHA-256 हैश जनरेट करने के लिए फाइल चुनें",
        lbl_file_desc: "आपकी फाइल कभी भी आपके डिवाइस से बाहर नहीं जाती। केवल SHA-256 हैश जांचा जाता है।",
        lbl_qr: "QR कोड स्कैन",
        lbl_qr_sel: "QR कोड की फोटो अपलोड करें",
        lbl_qr_desc: "QR कोड में छिपे हुए पेमेंट या फ़िशिंग लिंक को डिकोड करता है।",
        tag_heuristics: "ह्यूरिस्टिक्स",
        tag_risk: "रिस्क स्कोर",
        btn_scan: "⚡ रिस्क एनालिसिस चलाएं",

        // Results
        res_prob: "🛡️ थ्रेट असेसमेंट परिणाम",
        res_score_lbl: "वेंडर सहमति अनुपात",
        res_disclaimer: "⚠️ <strong>सूचना:</strong> यह परिणाम VirusTotal, Safe Browsing और WHOIS से स्वचालित रूप से संकलित किया गया है। यह कोई कानूनी फैसला नहीं है।",
        res_guide_title: "🚨 आधिकारिक शिकायत गाइड",
        res_guide_desc: "यदि वित्तीय नुकसान हुआ है, तो तुरंत खाता फ्रीज करवाएं:",
        res_guide_p: "पोर्टल:",
        res_guide_h: "हेल्पलाइन:",
        btn_dl_pdf: "📄 सबूत PDF डाउनलोड करें",
        btn_emergency_1930: "🚨 इमरजेंसी 1930 रिपोर्टिंग",

        // Threat Intel Section
        intel_sec_title: "थ्रेट इंटेलिजेंस",
        btn_refresh_intel: "↻ डेटा रिफ्रेश करें",
        intel_page_title: "🌍 लाइव थ्रेट इंटेलिजेंस सेंटर",
        intel_page_desc: "CERT-In, CISA और आधिकारिक सुरक्षा एजेंसियों द्वारा जारी एडवाइजरी",
        intel_updated: "अभी अपडेट किया गया",

        // How CyberPehra Works
        how_badge: "सरल प्रक्रिया",
        how_title: "CyberPehra कैसे काम करता है",
        how_subtitle: "पारदर्शी 3-चरणीय सुरक्षा सत्यापन प्रोटोकॉल",
        how_step1_title: "1. पेस्ट या अपलोड करें",
        how_step1_desc: "कोई भी संदिग्ध URL, मैसेज डालें या APK फाइल का लोकल SHA-256 हैश जनरेट करें।",
        how_step2_title: "2. थ्रेट इंटेलिजेंस",
        how_step2_desc: "हमारा सिस्टम VirusTotal और Google Safe Browsing से सटीक जानकारी निकालता है।",
        how_step3_title: "3. सत्यापित निर्णय",
        how_step3_desc: "सुरक्षा असेसमेंट रिपोर्ट, वेंडर रेशियो और आपातकालीन गाइड प्राप्त करें।",

        // Emergency Response
        em_banner_badge: "गोल्डन आवर इमरजेंसी रिस्पॉन्स",
        em_banner_title: "पैसे चोरी हुए या एक्टिव ब्लैकमेलिंग हो रही है?",
        em_banner_desc: "खाता फ्रीज करवाने के लिए तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।",
        em_btn_call: "📞 1930 पर तुरंत कॉल करें",
        em_btn_playbooks: "प्लेबुक देखें 📖",

        em_cmd_badge: "गोल्डन आवर रिस्पॉन्स सेंटर",
        em_cmd_title: "इमरजेंसी रिस्पॉन्स कमान",
        em_cmd_desc: "यदि वित्तीय नुकसान या साइबर जबरन वसूली हुई है, तो तुरंत आधिकारिक संसाधनों का उपयोग करके कार्रवाई करें।",
        em_playbook_select: "📖 अपनी घटना के अनुसार प्लेबुक चुनें",

        // Safety Dashboard
        safety_title: "🛡️ नागरिक सुरक्षा डैशबोर्ड",
        safety_desc: "ऐप्पल हेल्थ एवं माइक्रोसॉफ्ट डिफेंडर से प्रेरित डिजिटल सुरक्षा प्रणाली",
        btn_dl_hygiene: "हाइजीन रिपोर्ट डाउनलोड करें 📄",
        safety_checklist_title: "सुरक्षा जांच सूची",
        filter_all: "सभी",
        filter_pending: "लंबित",
        filter_completed: "पूर्ण",
        safety_completed_lbl: "पूर्ण जांच",
        safety_pending_lbl: "लंबित कदम",
        safety_next_lbl: "अनुशंसित अगला कदम:",

        // Scam Encyclopedia & Intel
        enc_title: "📖 राष्ट्रीय साइबर स्कैम ज्ञानकोश",
        enc_desc: "भारत में साइबर स्कैम, कार्यप्रणाली और रोकथाम के तरीकों का सत्यापित रिपोजिटरी",
        enc_showing_all: "सभी स्कैम दिखाए जा रहे हैं",
        intel_title: "🌍 लाइव थ्रेट इंटेलिजेंस सेंटर",
        intel_sub: "CERT-In, CISA और सार्वजनिक सुरक्षा बुलेटिन से एकत्रित सलाह",

        // Map Section
        map_title: "🇮🇳 लाइव साइबर थ्रेट मैप – भारत",
        map_desc: "भारत भर में साइबर हमलों की लाइव स्थिति • विस्तृत रिपोर्ट के लिए राज्य पर क्लिक करें",
        map_tab_india: "🇮🇳 भारत व्यू",
        map_tab_global: "🌍 ग्लोबल व्यू",
        map_radar_label: "इंटरएक्टिव 36 राज्य एवं UT राडार मैप",
        map_3d_btn: "🎲 3D आइसोमेट्रिक",
        map_2d_btn: "🗺️ 2D फ़्लैट",
        map_ncrb_sync: "NCRB / I4C डेटा सिंक",
        map_quick_select: "📍 राज्य एवं केंद्र शासित प्रदेश (36 राज्य/UT):",
        map_quick_hint: "त्वरित रिपोर्ट के लिए किसी भी राज्य पर क्लिक करें",
        map_legend_title: "गंभीरता संकेतक:",
        map_legend_high: "🔴 उच्च साइबर हमले",
        map_legend_med: "🟠 मध्यम साइबर हमले",
        map_legend_low: "🟢 कम साइबर हमले",
        map_legend_pending: "⚪ डेटा प्रक्रियाधीन",

        // Security Tools
        tools_title: "🛠️ सुरक्षा टूल्स",
        tools_desc: "आपकी डिजिटल सुरक्षा के लिए मुफ़्त टूल्स - पासवर्ड जांचें, QR बनाएं और साइबर ज्ञान परखें।",
        tool_pwd: "पासवर्ड मजबूती विश्लेषक",
        ph_pwd: "जांचने के लिए पासवर्ड दर्ज करें...",
        btn_gen_pwd: "16-अक्षर का पासवर्ड बनाएं ⚡",
        btn_copy: "कॉपी करें 📋",

        tool_pwned_title: "पासवर्ड डेटा ब्रीच चेकर",
        tool_pwned_guarantee: "k-Anonymity गोपनीयता गारंटी",
        tool_pwned_desc: "जांचें कि आपका पासवर्ड किसी लीक हुए डेटाबेस में तो नहीं है। आपका पूरा पासवर्ड कभी ट्रांसमिट नहीं होता।",
        ph_pwned: "डेटाबेस में जांचने के लिए पासवर्ड दर्ज करें...",
        btn_check_breach: "लीक जांचें 🔍",

        tool_cell_title: "आधिकारिक साइबर क्राइम सेल निर्देशिका",
        tool_cell_badge: "राज्य नोडल अधिकारी निर्देशिका",
        tool_cell_desc: "अपने राज्य/UT का चयन करके आधिकारिक साइबर क्राइम सेल का पता और फोन नंबर प्राप्त करें।",
        ph_qr_gen: "लिंक या टेक्स्ट डालें...",
        btn_gen_qr: "QR कोड बनाएं ▦",
        btn_copy_text: "टेक्स्ट कॉपी करें 📋",

        tool_quiz: "साइबर सुरक्षा क्विज",
        tool_quiz_d: "एक छोटे टेस्ट से अपनी साइबर सुरक्षा जागरूकता परखें।",
        btn_start_quiz: "क्विज शुरू करें 🎮",

        // Scam Encyclopedia
        scam_enc_title: "📖 राष्ट्रीय साइबर स्कैम ज्ञानकोश",
        scam_enc_desc: "भारत में होने वाले साइबर स्कैम, उनके तरीके और बचाव के तरीकों का सत्यापित संग्रह",
        scam_search_ph: "स्कैम खोजें (उदा. डिजिटल अरेस्ट, UPI, टेलीग्राम)...",
        btn_clear: "साफ़ करें",

        // Cyber Law Hub
        law_badge: "कानूनी जागरूकता केंद्र",
        law_title: "⚖️ साइबर लॉ अवेयरनेस हब",
        law_desc: "भारतीय साइबर अपराध कानूनों (IT Act 2000) और कानूनी प्रक्रियाओं की जानकारी",
        lb_h: "साइबर अपराध को समझें",
        lb_c1: "फेक लिंक या QR कोड के ज़रिये बैंक अकाउंट से पैसे निकालना।",
        lb_c2: "पुलिस/CBI बनकर डिजिटल अरेस्ट के नाम पर रंगदारी वसूलना।",
        lb_c3: "प्राइवेट फोटो/वीडियो की धमकी देकर ब्लैकमेल या हैरेस करना।",
        ls_h: "अपनी घटना की श्रेणी चुनें",
        ls_btn1: "\"ऑनलाइन या UPI से पैसा लूट लिया गया\"",
        ls_btn2: "\"फोटो या वीडियो का गलत इस्तेमाल हो रहा है\"",

        // Report Center
        rh_badge: "इमरजेंसी एक्शन किट",
        rh_title: "राष्ट्रीय साइबर आपातकालीन प्रतिक्रिया",
        rh_desc: "गोल्डन आवर में आधिकारिक भारतीय साइबर आपातकालीन संसाधनों का उपयोग करें।",
        kit_ev_btn: "सबूत चेकलिस्ट 📸",
        kit_dont_btn: "अभी क्या ना करें 🚫",

        // Founder & Vision
        vis_badge: "CyberPehra के संस्थापक की सोच",
        vis_title: "मिलिए <span class=\"text-emerald-400\">उदित आनंद</span> से",
        vis_sub: "संस्थापक एवं डेवलपर",
        vis_p1: "मैं उदित आनंद हूँ — भारत से एक स्व-शिक्षित साइबर सुरक्षा डेवलपर। अभी कोई डिग्री नहीं, कोई औपचारिक क्लासरूम नहीं — केवल एथिकल हैकिंग, लिनक्स, नेटवर्क सुरक्षा और पायथन ऑटोमेशन के प्रति अटूट जिज्ञासा और प्रयास।",
        vis_p2: "मैंने CyberPehra बनाया ताकि आम नागरिकों को डिजिटल अरेस्ट, UPI फ्रॉड और फ़िशिंग स्कैम से बचाया जा सके। मेरा मानना है कि वास्तविक कौशल आपके द्वारा बनाए गए प्रोजेक्ट्स से साबित होता है।",
        vis_tag1: "भारत",
        vis_tag2: "100% मुफ़्त जनहित पहल",
        vis_tag3: "डिजिटल इंडिया हेतु समर्पित 🇮🇳",

        // Settings
        sys_title: "सिस्टम सेटिंग्स एवं स्थिति",
        sys_desc: "API स्थिति, प्राइवेसी पॉलिसी एवं सिस्टम नोड्स",
        log_v4: "Neural SOC v5.0 सक्रिय। 100% सत्यापित डेटा स्कैनिंग। शून्य डेटा संचयन।",

        // Footer & Modals
        btn_bug: "संपर्क / शिकायत",
        ft_priv: "प्राइवेसी पॉलिसी",
        ft_terms: "नियम एवं शर्तें",
        ft_disc: "<strong>चेतावनी (Disclaimer):</strong> CyberPehra स्वचालित सुरक्षा विश्लेषण प्रदान करता है। परिणाम संभावित संकेतक हैं, कानूनी निर्णय नहीं।",

        // Threat Report & HUD Keys
        hud_ready: "स्कैन तैयार है",
        hud_started: "स्कैन शुरू हुआ",
        hud_scanning: "स्कैनिंग जारी है",
        hud_analyzing: "थ्रेट सिग्नल विश्लेषण",
        hud_querying: "सुरक्षा स्रोतों की जांच",
        hud_finalizing: "आकलन को अंतिम रूप",
        hud_completed: "स्कैन पूरा हुआ",
        hud_failed: "स्कैन विफल",
        hud_stage1: "1. कनेक्शन एवं संदर्भ प्रारंभ",
        hud_stage2: "2. इनपुट प्रारूप एवं पैरामीटर विश्लेषण",
        hud_stage3: "3. लक्षित टेलीमेट्री निष्कर्षण",
        hud_stage4: "4. स्थानीय नियम विश्लेषण",
        hud_stage5: "5. VirusTotal / थ्रेट इंटेलिजेंस",
        hud_stage6: "6. गूगल सेफ़ ब्राउज़िंग / सुरक्षा जांच",
        hud_stage7: "7. सुरक्षा वेंडर रिपोर्ट एकत्रीकरण",
        hud_stage8: "8. अंतिम निर्णय एवं रिपोर्ट तैयार",

        report_title: "CyberPehra थ्रेट असेसमेंट रिपोर्ट",
        report_scan_id: "स्कैन आईडी",
        report_timestamp: "समय",
        report_scan_type: "स्कैन प्रकार",
        report_orig_input: "मूल इनपुट",
        report_norm_input: "सत्यापित इनपुट",
        report_protocol: "प्रोटोकॉल",
        report_host: "होस्ट / डोमेन",
        report_ip: "आईपी टेलीमेट्री",
        report_vt: "VirusTotal वेंडर सहमति",
        report_gsb: "गूगल सेफ़ ब्राउज़िंग",
        report_heuristics: "स्थानीय नियम विश्लेषण",
        report_risk_score: "गणना की गई रिस्क दर",
        report_classification: "रिस्क वर्गीकरण",
        report_indicators: "पहचाने गए थ्रेट संकेत",
        report_attribution: "प्रमाण स्रोत",
        report_rec_action: "अनुशंसित कार्रवाई",
        report_means: "इस परिणाम का क्या अर्थ है",
        report_not_proves: "यह परिणाम क्या साबित नहीं करता",
        report_methodology: "स्कैन कार्यप्रणाली",
        report_limitations: "तकनीकी सीमाएं",
        report_privacy: "गोपनीयता एवं शून्य संचयन नीति",

        sw_title: "Visual Cyber Investigation Workspace",
        sw_subtitle: "लोकल-फर्स्ट विजुअल थ्रेट इंटेलिजेंस और फॉरेंसिक विश्लेषण",
        sw_back: "वापस",
        sw_close: "विश्लेषण बंद करें",
        sw_privacy_banner: "🔒 गोपनीयता गारंटी: स्क्रीनशॉट 100% स्थानीय रूप से ब्राउज़र मेमोरी में प्रोसेस किए जाते हैं। कोई इमेज डेटा कभी सर्वर पर अपलोड नहीं किया जाता।",
        sw_confidential_warning: "⚠️ गोपनीयता चेतावनी: ऐसे स्क्रीनशॉट अपलोड न करें जिनमें पासवर्ड, ओटीपी, यूपीआई पिन, बैंकिंग क्रेडेंशियल या रिकवरी कोड हों।",
        sw_dropzone_title: "स्क्रीनशॉट इमेज यहाँ खींचें और छोड़ें",
        sw_dropzone_desc: "या क्लिक करके ब्राउज़ करें, Ctrl+V से पेस्ट करें। PNG, JPG, WebP समर्थित (अधिकतम 20MB, 5 इमेज तक)।",
        sw_btn_browse: "स्क्रीनशॉट चुनें 📸",
        sw_btn_scan: "साइबर जांच शुरू करें 🚀",
        sw_btn_add_more: "+ और इमेज जोड़ें",
        sw_btn_clear_all: "सब साफ़ करें",
        sw_btn_zoom_in: "ज़ूम इन +",
        sw_btn_zoom_out: "ज़ूम आउट -",
        sw_btn_rotate: "90° घुमाएं",
        sw_btn_reset: "रीसेट व्यू",
        sw_btn_redact: "गोपनीयता मास्क बनाएं ✏️",
        sw_report_title: "CyberPehra विजुअल इन्वेस्टिगेशन रिपोर्ट",
        sw_export_pdf: "इन्वेस्टिगेशन पीडीएफ निर्यात करें 📄",
        sw_evidence_inventory: "साक्ष्य सूची (इन्वेंट्री)",
        sw_evidence_trace: "साक्ष्य पता लगाने की मैट्रिक्स",
        sw_exec_summary: "कार्यकारी जांच सारांश",
        sw_methodology: "CyberPehra फॉरेंसिक कार्यप्रणाली",
        sw_disclaimer: "स्वचालित विश्लेषण एवं कानूनी अस्वीकरण",
        sw_threat_intel: "लाइव थ्रेट इंटेलिजेंस टेलीमेट्री",
        sw_rec_actions: "अनुशंसित नागरिक सुरक्षा कदम"
    },
    hinglish: {
        boot_sys: "CYBERPEHRA SECURITY CORE",
        boot_title: "CYBERPEHRA SOC v5.0",
        boot_desc: "Analyze Risk Before It Compromises You",
        boot_skip: "Skip Karein ↗",

        nav_status: "SYSTEM ONLINE",
        nav_version: "Neural SOC v5.0",
        nav_emergency_sos: "🚨 Emergency SOS",
        nav_cat_main: "MAIN MENU",
        nav_cat_scanners: "SCANNERS",
        nav_cat_intel: "THREAT INTEL",
        nav_cat_tools: "SECURITY TOOLS",
        nav_cat_response: "EMERGENCY HELP",

        nav_home: "🏠 Home",
        nav_scam_scanner: "🛡️ Scam Scanner",
        nav_screenshot: "📸 Screenshot Analyzer",
        nav_website_scanner: "🌐 Website Scanner",
        nav_india_map: "🗺️ India Threat Map",
        nav_intel_link: "🌍 Cyber Intelligence",
        nav_scam_encyclopedia: "📖 Scam Encyclopedia",
        nav_safety_dashboard: "📊 Safety Dashboard",
        nav_pwd_checker: "🔑 Password Checker",
        nav_whois: "🌐 WHOIS Lookup",
        nav_ip_lookup: "🌍 IP Lookup",
        nav_dns_lookup: "🔍 DNS Lookup",
        nav_qr_gen: "▦ CyberPehra Tools",
        nav_quiz: "🎮 Cyber Security Quiz",
        nav_emergency_ctr: "🚨 Emergency Center",
        nav_report_scam: "📢 Report Scam",

        nav_dashboard: "Dashboard",
        nav_scanner: "Threat Scanner",
        nav_emergency: "🚨 Emergency Center",
        nav_safety: "🛡️ Safety Dashboard",
        nav_map: "🇮🇳 India Cyber Map",
        nav_tools: "🛠️ Tools Center",

        report_indicators: "Detected Security Indicators",
        report_attribution: "Evidence Attribution",
        report_rec_action: "Recommended Action",
        report_means: "What This Result Means",
        report_not_proves: "What This Result Does NOT Prove",
        report_methodology: "Scan Methodology",
        report_limitations: "Technical Limitations",
        report_privacy: "Privacy & Zero Retention Guarantee",

        sw_title: "Visual Cyber Investigation Workspace",
        sw_subtitle: "Local-First Visual Threat Intelligence & Forensic Analysis",
        sw_back: "Wapas",
        sw_close: "Analysis Close Karein",
        sw_privacy_banner: "🔒 Privacy Guarantee: Screenshots 100% locally browser memory mein process hote hain. Koi image data kisi server par upload nahi hota.",
        sw_confidential_warning: "⚠️ Confidentiality Notice: Aise screenshots upload na karein jinme passwords, OTP, UPI PIN ya banking credentials hon.",
        sw_dropzone_title: "Drag & Drop Screenshot Images Yahan Karein",
        sw_dropzone_desc: "Ya click karke select karein, Ctrl+V se paste karein. PNG, JPG, WebP supported (Max 20MB, up to 5 images).",
        sw_btn_browse: "Screenshots Select Karein 📸",
        sw_btn_scan: "Start Cyber Investigation 🚀",
        sw_btn_add_more: "+ Aur Images Jodein",
        sw_btn_clear_all: "Sab Clear Karein",
        sw_btn_zoom_in: "Zoom In +",
        sw_btn_zoom_out: "Zoom Out -",
        sw_btn_rotate: "Rotate 90°",
        sw_btn_reset: "Reset View",
        sw_btn_redact: "Privacy Mask Banayein ✏️",
        sw_report_title: "CYBERPEHRA VISUAL INVESTIGATION REPORT",
        sw_export_pdf: "Export Investigation PDF 📄",
        sw_evidence_inventory: "Evidence Inventory",
        sw_evidence_trace: "Evidence Traceability Matrix",
        sw_exec_summary: "Executive Investigation Summary",
        sw_methodology: "CyberPehra Forensic Methodology",
        sw_disclaimer: "Automated Analysis & Legal Disclaimer",
        sw_threat_intel: "Live Threat Intelligence Telemetry",
        sw_rec_actions: "Recommended Citizen Actions"
    }
};

export const getTranslation = (key) => {
    return Translations[State.currentLang] && Translations[State.currentLang][key] !== undefined
        ? Translations[State.currentLang][key]
        : (Translations['en'][key] || key);
};

export const applyLanguage = (lang) => {
    const safeLang = ['en', 'hi', 'hinglish'].includes(lang) ? lang : 'en';
    State.currentLang = safeLang;
    localStorage.setItem('cyberpehra_lang', safeLang);

    document.documentElement.lang = safeLang === 'hi' ? 'hi' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = (Translations[safeLang] && Translations[safeLang][key] !== undefined)
            ? Translations[safeLang][key]
            : Translations['en'][key];
        if (translation !== undefined) {
            el.innerHTML = translation;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = (Translations[safeLang] && Translations[safeLang][key] !== undefined)
            ? Translations[safeLang][key]
            : Translations['en'][key];
        if (translation !== undefined) {
            el.placeholder = translation;
        }
    });

    UI.langBtns.forEach(btn => {
        if (btn.dataset.lang === safeLang) {
            btn.classList.add('text-emerald-400', 'font-bold');
            btn.classList.remove('text-slate-300');
            if (UI.currentLangLabel) {
                UI.currentLangLabel.innerText = safeLang === 'hi' ? 'HI' : (safeLang === 'hinglish' ? 'HINGLISH' : 'EN');
            }
        } else {
            btn.classList.remove('text-emerald-400', 'font-bold');
            btn.classList.add('text-slate-300');
        }
    });

    const wsLangLabel = document.getElementById('workspaceCurrentLangLabel');
    if (wsLangLabel) {
        wsLangLabel.innerText = safeLang === 'hi' ? 'हिन्दी' : (safeLang === 'hinglish' ? 'Hinglish' : 'English');
    }

    // Re-render dynamic modules to reflect language selection across the entire website
    try {
        if (typeof window.initIndiaThreatMap === 'function') window.initIndiaThreatMap();
        if (typeof window.renderScamEncyclopedia === 'function') window.renderScamEncyclopedia();
        if (typeof window.renderSafetyDashboard === 'function') window.renderSafetyDashboard();
        if (typeof window.renderEmergencyCenter === 'function') window.renderEmergencyCenter();
        if (typeof window.renderCyberCellDetails === 'function') window.renderCyberCellDetails(State.selectedState || 'DL');
        if (typeof window.renderScreenshotWorkspace === 'function') window.renderScreenshotWorkspace();
        if (typeof window.renderToolsView === 'function') window.renderToolsView();
        if (typeof window.renderFounderVision === 'function') window.renderFounderVision();
    } catch(e) {
        console.warn('Language dynamic re-render notice:', e);
    }
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