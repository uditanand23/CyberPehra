-- ====================================================================
-- CYBERPEHRA PUBLIC SEED DATASET
-- Verified Public Cyber Defense Intelligence & Official Directory Data
-- ====================================================================

-- 1. SEED EMERGENCY DIRECTORY
INSERT INTO emergency_directory (category, entity_name, tollfree_number, emergency_action_url, reporting_instructions)
VALUES
('BANK', 'State Bank of India (SBI)', '1800 11 2211', 'https://sbi.co.in/web/customer-care/fraud-reporting', 'Call 1930 immediately or block via SMS BLOCK to 567676'),
('BANK', 'HDFC Bank', '1800 202 6161', 'https://www.hdfcbank.com/personal/useful-links/security', 'Report unauthorized transactions within 24 hours to ensure 0-liability'),
('BANK', 'ICICI Bank', '1800 1080', 'https://www.icicibank.com/cyber-security', 'Block internet banking via mobile app or emergency desk 1800 1080'),
('UPI', 'National Payments Corporation of India (NPCI / BHIM)', '1800 120 1740', 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism', 'Log UPI transaction ID in BHIM app dispute section & report to 1930'),
('TELECOM', 'Department of Telecommunications (TAFCAP / Sanchar Saathi)', '1945', 'https://sancharsaathi.gov.in', 'Report stolen mobile via CEIR portal or disconnect fraudulent SIMs via TAFCAP'),
('GOV_AGENCY', 'National Cyber Crime Reporting Portal (NCCC)', '1930', 'https://cybercrime.gov.in', 'Official 24x7 Government Helpline for financial cyber fraud mitigation')
ON CONFLICT DO NOTHING;

-- 2. SEED PUBLIC SCAMS ENCYCLOPEDIA
INSERT INTO public_scams (slug, title_en, title_hi, category, severity, description_en, description_hi, red_flags, prevention_steps, target_demographics)
VALUES
(
  'apk-malware-banking',
  'Malicious Android APK Banking Trojan',
  'मैलिशियस एंड्रॉइड APK बैंकिंग ट्रोजन',
  'APK_MALWARE',
  'CRITICAL',
  'Scammers send APK files masquerading as official utility bill payment, PM-Kisan, or courier tracking updates over WhatsApp or SMS. Once installed, the APK intercepts SMS OTPs and executes background banking transfers.',
  'धोखेबाज़ व्हाट्सएप या एसएमएस पर बिजली बिल, पीएम-किसान या कूरियर ट्रैकिंग अपडेट का झांसा देकर APK फाइलें भेजते हैं। एक बार इंस्टॉल होने के बाद, APK आपके SMS OTP को चोरी करके बैकग्राउंड में पैसे ट्रांसफर कर लेता है।',
  '["Unsolicited .apk files received on WhatsApp or Telegram", "App requests Accessibility and SMS read permissions", "App not listed on official Google Play Store"]'::jsonb,
  '["Never install .apk files received via messaging apps", "Keep Google Play Protect enabled", "Disable Install from Unknown Sources in Android settings"]'::jsonb,
  'Android Users, Elderly, Rural Beneficiaries'
),
(
  'digital-arrest-extortion',
  'Fake Digital Arrest & Police Impersonation',
  'नकली डिजिटल अरेस्ट एवं पुलिस रंगदारी',
  'EXTORTION',
  'CRITICAL',
  'Cybercriminals impersonating CBI, Narcotics Control Bureau (NCB), or Cyber Police initiate video calls claiming a parcel in your name contained illegal drugs or contraband. They force victims to stay on continuous video call under "digital arrest" and demand money.',
  'साइबर अपराधी सीबीआई, नारकोटिक्स कंट्रोल ब्यूरो (NCB) या साइबर पुलिस बनकर वीडियो कॉल करते हैं और दावा करते हैं कि आपके नाम से भेजे गए पार्सल में ड्रग्स पाए गए हैं। वे पीड़ित को वीडियो कॉल पर बंधक बनाकर पैसे ऐंठते हैं।',
  '["Demands to stay on continuous video call under Digital Arrest", "Claims of illegal drugs found in courier package", "Urgent demands to transfer money to police safety accounts"]'::jsonb,
  '["Understand that Indian Law Enforcement NEVER executes Digital Arrests over Skype/WhatsApp", "Disconnect the call immediately and report to 1930", "Verify with nearest local police station"]'::jsonb,
  'Senior Citizens, Working Professionals, Students'
),
(
  'part-time-job-telegram',
  'Prepaid Task & Telegram Part-Time Job Scam',
  'टेलीग्राम पार्ट-टाइम जॉब एवं टास्क फ्रॉड',
  'JOB_FRAUD',
  'HIGH',
  'Victims are contacted via WhatsApp offering part-time jobs for reviewing YouTube videos or rating hotels. Scammers pay initial small payouts, then lure victims into Telegram investment groups requiring higher "prepaid crypto deposits".',
  'पीड़ितों को यूट्यूब वीडियो लाइक करने या होटल रेटिंग की पार्ट-टाइम जॉब का लालच दिया जाता है। शुरुआती छोटे भुगतान के बाद, उन्हें टेलीग्राम ग्रुप में जोड़कर बड़े निवेश की मांग की जाती है।',
  '["Offers high income for simple video liking or hotel rating", "Requirement to deposit prepaid money to unlock commission", "Communication shifted strictly to Telegram groups"]'::jsonb,
  '["No legitimate employer asks candidates to deposit money to work", "Block and report the contact immediately", "Report fraud transaction UTRs to 1930"]'::jsonb,
  'Students, Job Seekers, Homemakers'
)
ON CONFLICT DO NOTHING;

-- 3. SEED THREAT ADVISORIES
INSERT INTO threat_advisories (advisory_code, title, severity, source, summary, action_required)
VALUES
(
  'CIAD-2026-0412',
  'CERT-In Advisory: Advisory on Malicious Android Remote Access Trojans (RAT)',
  'HIGH',
  'CERT-In',
  'CERT-In has observed active distribution of Android RAT malware impersonating banking updates. Victims are targeted via phishing SMS containing shortened URLs.',
  'Users are advised to inspect app permissions and never download APKs outside official app stores.'
),
(
  'RBI-SECURITY-2026',
  'RBI Alert: Beware of Fraudulent Customer Care Numbers on Search Engines',
  'HIGH',
  'RBI',
  'Reserve Bank of India warns public against calling unverified bank customer support numbers found on search engine listings or maps.',
  'Always retrieve customer support details directly from the bank official website or back of debit/credit card.'
)
ON CONFLICT DO NOTHING;
