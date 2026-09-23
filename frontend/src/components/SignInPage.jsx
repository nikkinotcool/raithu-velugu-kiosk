import React, { useState, useEffect } from 'react';
import { User, Shield, Phone, Key, ArrowRight, Globe, CheckCircle2, AlertCircle, UserPlus, LogIn, Loader2 } from 'lucide-react';

const LANGUAGES = [
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🌾' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🌾' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🌾' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🌾' },
];

const STRINGS = {
  te: {
    appName: 'రైతు వెలుగు',
    appSub: 'PACS ప్రాథమిక వ్యవసాయ సహకార పరపతి సంఘం',
    kioskSubtitle: 'PACS చట్టపరమైన & సహకార సహాయక కియోస్క్',
    signInTitle: 'పోర్టల్ ప్రవేశం',
    registerTitle: 'కొత్త రైతు నమోదు',
    tabSignIn: 'లాగిన్',
    tabRegister: 'నమోదు',
    roleFarmer: 'రైతు / సభ్యుడు',
    roleOfficer: 'సొసైటీ అధికారి',
    phoneLabel: 'మొబైల్ నంబర్ లేదా ID',
    phonePlaceholder: '9876543210 లేదా సభ్యత్వ ID',
    passLabel: 'పాస్‌వర్డ్ / PIN',
    passPlaceholder: '•••••••• (డెమో: farmer123)',
    btnSignIn: 'ప్రవేశించండి',
    btnVerifying: 'ధృవీకరిస్తోంది...',
    btnRegister: 'ఖాతా సృష్టించండి',
    btnCreating: 'ఖాతా సృష్టిస్తోంది...',
    wakingUp: 'సర్వర్ కనెక్ట్ అవుతోంది, దయచేసి వేచి ఉండండి...',
    fillDemo: '⚡ డెమో క్రెడెన్షియల్స్ నింపండి',
    guestWalkIn: 'అతిథి ప్రవేశం',
    guestName: 'రైతు (అతిథి)',
    officerIdLabel: 'అధికారి ID',
    officerIdPlaceholder: 'SEC-SRD-09',
    officerPassLabel: 'పాస్‌వర్డ్',
    officerPassPlaceholder: '•••••••• (డెమో: officer123)',
    btnOfficerLogin: 'అధికారి లాగిన్',
    fillDemoOfficer: '⚡ డెమో PACS సెక్రటరీ (SEC-SRD-09)',
    regNameLabel: 'రైతు పూర్తి పేరు',
    regNamePlaceholder: 'ఉదా: కె. మల్లేష్',
    regPhoneLabel: '10-అంకెల మొబైల్ నంబర్',
    regPassLabel: 'పాస్‌వర్డ్ లేదా 4-అంకెల PIN',
    regDistrictLabel: 'జిల్లా',
    alreadyRegistered: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి',
    regSuccess: 'ఖాతా విజయవంతంగా నమోదైంది! ID: ',
    footerNotice: 'సహకార మంత్రిత్వ శాఖ • జాతీయ సహకార డేటాబేస్ (NCD) • భారత ప్రభుత్వం'
  },
  en: {
    appName: 'Raithu Velugu',
    appSub: 'Primary Agricultural Cooperative Society',
    kioskSubtitle: 'PACS Legal & Cooperative Governance Assistance Kiosk',
    signInTitle: 'Portal Sign In',
    registerTitle: 'New Member Registration',
    tabSignIn: 'Sign In',
    tabRegister: 'Register',
    roleFarmer: 'Farmer / Member',
    roleOfficer: 'PACS Officer',
    phoneLabel: 'Mobile Number or Member ID',
    phonePlaceholder: '9876543210 or Member ID',
    passLabel: 'Password or PIN',
    passPlaceholder: '•••••••• (demo: farmer123)',
    btnSignIn: 'Sign In',
    btnVerifying: 'Verifying...',
    btnRegister: 'Create Account',
    btnCreating: 'Creating Account...',
    wakingUp: 'Connecting to server, please wait a moment...',
    fillDemo: '⚡ Fill Demo Account',
    guestWalkIn: 'Guest Walk-in',
    guestName: 'Walk-in Farmer (Guest)',
    officerIdLabel: 'Officer ID',
    officerIdPlaceholder: 'SEC-SRD-09',
    officerPassLabel: 'Password',
    officerPassPlaceholder: '•••••••• (demo: officer123)',
    btnOfficerLogin: 'Officer Sign In',
    fillDemoOfficer: '⚡ Fill Demo PACS Secretary (SEC-SRD-09)',
    regNameLabel: 'Farmer Full Name',
    regNamePlaceholder: 'e.g. K. Mallesh',
    regPhoneLabel: '10-Digit Mobile Number',
    regPassLabel: 'Password or 4-Digit PIN',
    regDistrictLabel: 'District',
    alreadyRegistered: 'Already registered? Sign In',
    regSuccess: 'Account registered successfully! ID: ',
    footerNotice: 'Ministry of Cooperation • National Cooperative Database (NCD) • Govt. of India'
  },
  hi: {
    appName: 'रैतु वेलुगु',
    appSub: 'प्राथमिक कृषि ऋण सहकारी समिति (PACS)',
    kioskSubtitle: 'PACS विधिक एवं सहकारिता सहायता कियोस्क',
    signInTitle: 'पोर्टल लॉगिन',
    registerTitle: 'नया किसान पंजीकरण',
    tabSignIn: 'लॉगिन',
    tabRegister: 'पंजीकरण',
    roleFarmer: 'किसान / सदस्य',
    roleOfficer: 'समिति अधिकारी',
    phoneLabel: 'मोबाइल नंबर या सदस्य आईडी',
    phonePlaceholder: '9876543210 या सदस्य आईडी',
    passLabel: 'पासवर्ड / पिन',
    passPlaceholder: '•••••••• (डेमो: farmer123)',
    btnSignIn: 'प्रवेश करें',
    btnVerifying: 'सत्यापित हो रहा है...',
    btnRegister: 'खाता बनाएं',
    btnCreating: 'खाता बन रहा है...',
    wakingUp: 'सर्वर से कनेक्ट हो रहा है, कृपया प्रतीक्षा करें...',
    fillDemo: '⚡ डेमो क्रेडेंशियल भरें',
    guestWalkIn: 'अतिथि प्रवेश',
    guestName: 'किसान (अतिथि)',
    officerIdLabel: 'अधिकारी आईडी',
    officerIdPlaceholder: 'SEC-SRD-09',
    officerPassLabel: 'पासवर्ड',
    officerPassPlaceholder: '•••••••• (डेमो: officer123)',
    btnOfficerLogin: 'अधिकारी लॉगिन',
    fillDemoOfficer: '⚡ डेमो PACS सचिव (SEC-SRD-09)',
    regNameLabel: 'किसान का पूरा नाम',
    regNamePlaceholder: 'उदा. के. मल्लेष',
    regPhoneLabel: '10-अंकों का मोबाइल नंबर',
    regPassLabel: 'पासवर्ड या 4-अंकों का पिन',
    regDistrictLabel: 'जिला',
    alreadyRegistered: 'पहले से पंजीकृत हैं? लॉगिन करें',
    regSuccess: 'खाता सफलतापूर्वक पंजीकृत हुआ! ID: ',
    footerNotice: 'सहकारिता मंत्रालय • राष्ट्रीय सहकारी डेटाबेस (NCD) • भारत सरकार'
  },
  kn: {
    appName: 'ರೈತು ವೆಲುಗು',
    appSub: 'ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘ (PACS)',
    kioskSubtitle: 'PACS ಕಾನೂನು ಮತ್ತು ಸಹಕಾರ ನೆರವು ಕಿಯೋಸ್ಕ್',
    signInTitle: 'ಪೋರ್ಟಲ್ ಪ್ರವೇಶ',
    registerTitle: 'ಹೊಸ ರೈತರ ನೋಂದಣಿ',
    tabSignIn: 'ಲಾಗಿನ್',
    tabRegister: 'ನೋಂದಣಿ',
    roleFarmer: 'ರೈತ / ಸದಸ್ಯ',
    roleOfficer: 'ಸಂಘದ ಅಧಿಕಾರಿ',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಸದಸ್ಯ ಐಡಿ',
    phonePlaceholder: '9876543210 ಅಥವಾ ಸದಸ್ಯ ಐಡಿ',
    passLabel: 'ಪಾಸ್‌ವರ್ಡ್ / ಪಿನ್',
    passPlaceholder: '•••••••• (ಡೆಮೊ: farmer123)',
    btnSignIn: 'ಪ್ರವೇಶಿಸಿ',
    btnVerifying: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    btnRegister: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    btnCreating: 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...',
    wakingUp: 'ಸರ್ವರ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ಕಾಯಿರಿ...',
    fillDemo: '⚡ ಡೆಮೊ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ',
    guestWalkIn: 'ಅತಿಥಿ ಪ್ರವೇಶ',
    guestName: 'ರೈತ (ಅತಿಥಿ)',
    officerIdLabel: 'ಅಧಿಕಾರಿ ಐಡಿ',
    officerIdPlaceholder: 'SEC-SRD-09',
    officerPassLabel: 'ಪಾಸ್‌ವರ್ಡ್',
    officerPassPlaceholder: '•••••••• (ಡೆಮೊ: officer123)',
    btnOfficerLogin: 'ಅಧಿಕಾರಿ ಲಾಗಿನ್',
    fillDemoOfficer: '⚡ ಡೆಮೊ PACS ಕಾರ್ಯದರ್ಶಿ (SEC-SRD-09)',
    regNameLabel: 'ರೈತರ ಪೂರ್ಣ ಹೆಸರು',
    regNamePlaceholder: 'ಉದಾ: ಕೆ. ಮಲ್ಲೇಶ್',
    regPhoneLabel: '10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    regPassLabel: 'ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ 4-ಅಂಕಿಯ ಪಿನ್',
    regDistrictLabel: 'ಜಿಲ್ಲೆ',
    alreadyRegistered: 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ',
    regSuccess: 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ! ID: ',
    footerNotice: 'ಸಹಕಾರ ಸಚಿವಾಲಯ • ರಾಷ್ಟ್ರೀಯ ಸಹಕಾರ ಡೇಟಾಬೇಸ್ (NCD) • ಭಾರತ ಸರ್ಕಾರ'
  },
  ta: {
    appName: 'ரைது வெலுகு',
    appSub: 'தொடக்க வேளாண்மை கூட்டுறவு கடன் சங்கம் (PACS)',
    kioskSubtitle: 'PACS சட்ட & கூட்டுறவு உதவி மையம்',
    signInTitle: 'வலைப்பக்க உள்நுழைவு',
    registerTitle: 'புதிய விவசாயி பதிவு',
    tabSignIn: 'உள்நுழைக',
    tabRegister: 'பதிவு செய்க',
    roleFarmer: 'விவசாயி / உறுப்பினர்',
    roleOfficer: 'கூட்டுறவு அலுவலர்',
    phoneLabel: 'கைபேசி எண் அல்லது உறுப்பினர் ID',
    phonePlaceholder: '9876543210 அல்லது ID',
    passLabel: 'கடவுச்சொல் / பின் (PIN)',
    passPlaceholder: '•••••••• (டெமோ: farmer123)',
    btnSignIn: 'உள்நுழைக',
    btnVerifying: 'சரிபார்க்கிறது...',
    btnRegister: 'கணக்கு உருவாக்குக',
    btnCreating: 'உருவாக்கப்படுகிறது...',
    wakingUp: 'சேவையகத்தை இணைக்கிறது, காத்திருக்கவும்...',
    fillDemo: '⚡ டெமோ கணக்கை நிரப்புக',
    guestWalkIn: 'விருந்தினர் நுழைவு',
    guestName: 'விவசாயி (விருந்தினர்)',
    officerIdLabel: 'அலுவலர் ID',
    officerIdPlaceholder: 'SEC-SRD-09',
    officerPassLabel: 'கடவுச்சொல்',
    officerPassPlaceholder: '•••••••• (டெமோ: officer123)',
    btnOfficerLogin: 'அலுவலர் உள்நுழைவு',
    fillDemoOfficer: '⚡ டெமோ PACS செயலாளர் (SEC-SRD-09)',
    regNameLabel: 'விவசாயி முழுப் பெயர்',
    regNamePlaceholder: 'எ.கா: கே. மல்லேஷ்',
    regPhoneLabel: '10 இலக்க கைபேசி எண்',
    regPassLabel: 'கடவுச்சொல் அல்லது 4 இலக்க பின்',
    regDistrictLabel: 'மாவட்டம்',
    alreadyRegistered: 'ஏற்கனவே பதிவு செய்துள்ளீர்களா? உள்நுழைக',
    regSuccess: 'கணக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது! ID: ',
    footerNotice: 'கூட்டுறவு அமைச்சகம் • தேசிய கூட்டுறவு தரவுத்தளம் (NCD) • இந்திய அரசு'
  },
  mr: {
    appName: 'रैतू वेलूगू',
    appSub: 'प्राथमिक कृषी पतसंस्था (PACS)',
    kioskSubtitle: 'PACS विधी व सहकार सहाय्य केंद्र',
    signInTitle: 'पोर्टल लॉगिन',
    registerTitle: 'नवीन शेतकरी नोंदणी',
    tabSignIn: 'लॉगिन',
    tabRegister: 'नोंदणी',
    roleFarmer: 'शेतकरी / सभासद',
    roleOfficer: 'संस्था अधिकारी',
    phoneLabel: 'मोबाईल नंबर किंवा सभासद आयडी',
    phonePlaceholder: '9876543210 किंवा ID',
    passLabel: 'पासवर्ड / पिन',
    passPlaceholder: '•••••••• (डेमो: farmer123)',
    btnSignIn: 'प्रवेश करा',
    btnVerifying: 'पडताळणी सुरू आहे...',
    btnRegister: 'खाते तयार करा',
    btnCreating: 'खाते तयार होत आहे...',
    wakingUp: 'सर्व्हरशी जोडणी सुरू आहे, कृपया प्रतीक्षा करा...',
    fillDemo: '⚡ डेमो तपशील भरा',
    guestWalkIn: 'अतिथी प्रवेश',
    guestName: 'शेतकरी (अतिथी)',
    officerIdLabel: 'अधिकारी आयडी',
    officerIdPlaceholder: 'SEC-SRD-09',
    officerPassLabel: 'पासवर्ड',
    officerPassPlaceholder: '•••••••• (डेमो: officer123)',
    btnOfficerLogin: 'अधिकारी लॉगिन',
    fillDemoOfficer: '⚡ डेमो PACS सचिव (SEC-SRD-09)',
    regNameLabel: 'शेतकऱ्याचे पूर्ण नाव',
    regNamePlaceholder: 'उदा. के. मल्लेश',
    regPhoneLabel: '१०-अंकी मोबाईल नंबर',
    regPassLabel: 'पासवर्ड किंवा ४-अंकी पिन',
    regDistrictLabel: 'जिल्हा',
    alreadyRegistered: 'आधीच नोंदणी केली आहे का? लॉगिन करा',
    regSuccess: 'खाते यशस्वीरित्या तयार झाले! ID: ',
    footerNotice: 'सहकार मंत्रालय • राष्ट्रीय सहकारी डेटाबेस (NCD) • भारत सरकार'
  }
};

export default function SignInPage({ language, onLanguageChange, onLoginSuccess, apiBase }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register'
  const [activeTab, setActiveTab] = useState('farmer'); // 'farmer' | 'officer'
  
  // Form States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');
  const [username, setUsername] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState('Sangareddy');

  const [loading, setLoading] = useState(false);
  const [loadingSlow, setLoadingSlow] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const t = STRINGS[language] || STRINGS['te'] || STRINGS['en'];

  // Timer to show "server waking up" if fetch takes more than 3 seconds
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setLoadingSlow(true);
      }, 3000);
    } else {
      setLoadingSlow(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const CLOUD_FALLBACK_URL = 'https://raithu-velugu-kiosk.onrender.com/api';

  const fetchWithFallback = async (endpoint, options = {}) => {
    const primaryUrl = `${apiBase}${endpoint}`;
    try {
      return await fetch(primaryUrl, options);
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      if (apiBase !== CLOUD_FALLBACK_URL) {
        console.warn(`Primary endpoint ${primaryUrl} failed (${err.message}). Retrying with cloud fallback ${CLOUD_FALLBACK_URL}${endpoint}...`);
        return await fetch(`${CLOUD_FALLBACK_URL}${endpoint}`, options);
      }
      throw err;
    }
  };

  const handleFarmerLogin = async (e) => {
    e?.preventDefault();
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) return;

    setLoading(true);
    setLoadingSlow(false);
    setError('');

    // 15-second AbortController to guarantee button never gets stuck indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetchWithFallback('/auth/farmer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: cleanPhone,
          password: farmerPassword.trim() || 'farmer123',
          language
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Sign-in failed. Please check your credentials.');
      }
      const data = await res.json();
      onLoginSuccess(data.user, data.access_token);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Server response timed out. The cloud server may be waking up. You can retry, or continue using Guest Walk-in.');
      } else {
        setError(err.message || 'Failed to sign in. Please verify your connection or use Guest Walk-in.');
      }
    } finally {
      setLoading(false);
      setLoadingSlow(false);
    }
  };

  const handleOfficerLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !officerPassword.trim()) return;

    setLoading(true);
    setLoadingSlow(false);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetchWithFallback('/auth/officer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: username.trim(), password: officerPassword.trim() }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Invalid officer credentials.');
      }
      const data = await res.json();
      onLoginSuccess(data.user, data.access_token);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Server response timed out. Please retry in a few seconds.');
      } else {
        setError(err.message || 'Officer login failed.');
      }
    } finally {
      setLoading(false);
      setLoadingSlow(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError('Please provide your name, 10-digit mobile number, and password.');
      return;
    }
    if (regPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setLoadingSlow(false);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetchWithFallback('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: regName.trim(),
          phone_number: regPhone.trim(),
          password: regPassword.trim(),
          language,
          district: regDistrict.trim(),
          mandal: 'Kandi',
          pacs_name: 'Kandi Primary Agricultural Credit Society'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Registration failed.');
      }

      const data = await res.json();
      setSuccessMsg(`${t.regSuccess}${data.user.member_id}`);
      setTimeout(() => {
        onLoginSuccess(data.user, data.access_token);
      }, 700);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Server took too long to register. Please retry in a few seconds.');
      } else {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
      setLoadingSlow(false);
    }
  };

  const fillDemoFarmer = () => {
    setPhoneNumber('9876543210');
    setFarmerPassword('farmer123');
    setActiveTab('farmer');
    setError('');
  };

  const fillDemoOfficer = () => {
    setUsername('SEC-SRD-09');
    setOfficerPassword('officer123');
    setActiveTab('officer');
    setError('');
  };

  const handleWalkInGuest = () => {
    const guestUser = {
      id: 9999,
      full_name: t.guestName,
      phone_number: 'Walk-in',
      member_id: 'GUEST-KIOSK',
      role: 'farmer',
      preferred_language: language,
      pacs_name: 'Kandi Primary Agricultural Credit Society',
      village: 'Kandi',
      district: 'Sangareddy',
      state: 'Telangana'
    };
    onLoginSuccess(guestUser, 'token-guest-session');
  };

  return (
    <div 
      data-lang={language}
      className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-emerald-600 selection:text-white"
    >
      {/* Sleek Minimal Header */}
      <header className="px-4 py-3 sm:px-8 border-b border-slate-200/70 bg-white shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🌾
            </div>
            <div>
              <span className="font-heading text-base font-bold text-slate-900 block leading-tight">
                {t.appName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {t.appSub}
              </span>
            </div>
          </div>

          {/* Clean Language Selector */}
          <div className="relative flex items-center">
            <Globe className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 cursor-pointer transition-colors"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Centered Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40">
          {/* Brand Heading */}
          <div className="text-center mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {authMode === 'signin' ? t.signInTitle : t.registerTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t.kioskSubtitle}
            </p>
          </div>

          {/* Mode Segmented Switcher (Sign In vs Register) */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.tabSignIn}</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.tabRegister}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex flex-col gap-2 mb-4 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleWalkInGuest}
                className="self-start text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950 mt-0.5"
              >
                👉 {t.guestWalkIn}
              </button>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 mb-4 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN VIEW */}
          {authMode === 'signin' ? (
            <div>
              {/* Role Toggle Pill: Farmer vs Officer */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('farmer'); setError(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'farmer'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.roleFarmer}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('officer'); setError(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'officer'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.roleOfficer}</span>
                </button>
              </div>

              {activeTab === 'farmer' ? (
                <form onSubmit={handleFarmerLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t.phoneLabel}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t.passLabel}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={farmerPassword}
                        onChange={(e) => setFarmerPassword(e.target.value)}
                        placeholder={t.passPlaceholder}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !phoneNumber.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98 mt-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{loading ? t.btnVerifying : t.btnSignIn}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>

                  {loadingSlow && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg text-center animate-pulse">
                      ⏳ {t.wakingUp}
                    </p>
                  )}

                  {/* 1-Tap Quick Demo Helper */}
                  <div className="pt-2 text-center flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={fillDemoFarmer}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
                    >
                      {t.fillDemo}
                    </button>
                    <button
                      type="button"
                      onClick={handleWalkInGuest}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
                    >
                      {t.guestWalkIn}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOfficerLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t.officerIdLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t.officerIdPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t.officerPassLabel}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        placeholder={t.officerPassPlaceholder}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !username.trim() || !officerPassword.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 mt-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{loading ? t.btnVerifying : t.btnOfficerLogin}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>

                  {loadingSlow && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg text-center animate-pulse">
                      ⏳ {t.wakingUp}
                    </p>
                  )}

                  <div className="pt-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={fillDemoOfficer}
                      className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline"
                    >
                      {t.fillDemoOfficer}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* REGISTER VIEW */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t.regNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={t.regNamePlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t.regPhoneLabel} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t.regPassLabel} *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t.regDistrictLabel}
                </label>
                <input
                  type="text"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !regName.trim() || !regPhone.trim() || !regPassword.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98 mt-3"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? t.btnCreating : t.btnRegister}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {loadingSlow && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg text-center animate-pulse">
                  ⏳ {t.wakingUp}
                </p>
              )}

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  {t.alreadyRegistered}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Grounded Minimal Footer */}
      <footer className="py-3 px-4 text-center text-[11px] text-slate-400 font-medium border-t border-slate-200/60 bg-white">
        <span>{t.footerNotice}</span>
      </footer>
    </div>
  );
}
