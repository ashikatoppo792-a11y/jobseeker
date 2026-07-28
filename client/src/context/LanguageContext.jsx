import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' }
];

export const TRANSLATIONS = {
  en: {
    findJobs: 'Find Jobs',
    browseAll: 'Browse All',
    myApplications: 'My Applications',
    employerHub: 'Employer Hub',
    adminPanel: 'Admin Panel',
    signIn: 'Sign In',
    postFindJobs: 'Post / Find Jobs',
    heroTag: '#1 Pan India Job Portal',
    heroTitle: 'Find Your Dream Career Across Pan India',
    heroSubtitle: 'Discover thousands of verified opportunities across all 28 States, UTs & 30 Districts of Odisha.',
    searchPlaceholder: 'Job title, skills, keyword, or company...',
    locationPlaceholder: 'City, District, or State',
    stateDistrictBtn: 'State & District',
    searchBtn: 'Search Jobs',
    popularSearches: 'Popular Pan India Searches:',
    activeJobs: 'Active Pan India Jobs',
    verifiedEmployers: 'Verified Employers',
    successfulHires: 'Successful Hires',
    featuredOpenings: 'Featured Pan India Openings',
    quickView: 'Quick View',
    applyNow: 'Apply Now',
    aiAssistant: 'AI Assistant',
    selectLanguage: 'Select Language'
  },
  hi: {
    findJobs: 'नौकरी खोजें',
    browseAll: 'सभी देखें',
    myApplications: 'मेरे आवेदन',
    employerHub: 'नियोक्ता हब',
    adminPanel: 'एडमिन पैनल',
    signIn: 'साइन इन करें',
    postFindJobs: 'जॉब पोस्ट / खोजें',
    heroTag: '#1 ऑल इंडिया जॉब पोर्टल',
    heroTitle: 'पूरे भारत में अपना ड्रीम करियर खोजें',
    heroSubtitle: 'सभी 28 राज्यों, केंद्र शासित प्रदेशों और ओडिशा के 30 जिलों में हजारों सत्यापित अवसरों की खोज करें।',
    searchPlaceholder: 'नौकरी का शीर्षक, कौशल, या कंपनी...',
    locationPlaceholder: 'शहर, जिला, या राज्य',
    stateDistrictBtn: 'राज्य और जिला',
    searchBtn: 'नौकरी खोजें',
    popularSearches: 'लोकप्रिय खोजें:',
    activeJobs: 'सक्रिय भारत नौकरियां',
    verifiedEmployers: 'सत्यापित नियोक्ता',
    successfulHires: 'सफल भर्तियां',
    featuredOpenings: 'प्रमुख भारत नौकरियां',
    quickView: 'त्वरित देखें',
    applyNow: 'अभी आवेदन करें',
    aiAssistant: 'एआई सहायक',
    selectLanguage: 'भाषा चुनें'
  },
  or: {
    findJobs: 'ଚାକିରି ଖୋଜନ୍ତୁ',
    browseAll: 'ସମସ୍ତ ଦେଖନ୍ତୁ',
    myApplications: 'ମୋର ଆବେଦନ',
    employerHub: 'ନିଯୁକ୍ତିଦାତା ହବ୍',
    adminPanel: 'ଆଡମିନ୍ ପ୍ୟାନେଲ୍',
    signIn: 'ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    postFindJobs: 'ପୋଷ୍ଟ / ଖୋଜନ୍ତୁ',
    heroTag: '#1 ସମଗ୍ର ଭାରତ ଓ ଓଡ଼ିଶା ଚାକିରି ପୋର୍ଟାଲ୍',
    heroTitle: 'ଓଡ଼ିଶା ଓ ସମଗ୍ର ଭାରତରେ ଆପଣଙ୍କ ସ୍ୱପ୍ନର ଚାକିରି ଖୋଜନ୍ତୁ',
    heroSubtitle: 'ଓଡ଼ିଶାର ସମସ୍ତ ୩୦ ଜିଲ୍ଲା ଏବଂ ଭାରତର ୨୮ ରାଜ୍ୟରେ ହଜାର ହଜାର ଚାକିରି ସୁଯୋଗ।',
    searchPlaceholder: 'ଚାକିରି ନାମ, ଦକ୍ଷତା, କିମ୍ବା କମ୍ପାନୀ...',
    locationPlaceholder: 'ସହର, ଜିଲ୍ଲା, କିମ୍ବା ରାଜ୍ୟ',
    stateDistrictBtn: 'ରାଜ୍ୟ ଓ ଜିଲ୍ଲା',
    searchBtn: 'ଚାକିରି ଖୋଜନ୍ତୁ',
    popularSearches: 'ଲୋକପ୍ରିୟ ଖୋଜ:',
    activeJobs: 'ସକ୍ରିୟ ଚାକିରି',
    verifiedEmployers: 'ଯାଞ୍ଚ ହୋଇଥିବା କମ୍ପାନୀ',
    successfulHires: 'ସଫଳ ନିଯୁକ୍ତି',
    featuredOpenings: 'ପ୍ରମୁଖ ଚାକିରି',
    quickView: 'ଶୀଘ୍ର ଦେଖନ୍ତୁ',
    applyNow: 'ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ',
    aiAssistant: 'ଏଆଇ ସହାୟକ',
    selectLanguage: 'ଭାଷା ବାଛନ୍ତୁ'
  },
  bn: {
    findJobs: 'চাকরি খুঁজুন',
    browseAll: 'সব দেখুন',
    myApplications: 'আমার আবেদনসমূহ',
    employerHub: 'নিয়োগকর্তা হাব',
    adminPanel: 'অ্যাডমিন প্যানেল',
    signIn: 'সাইন ইন করুন',
    postFindJobs: 'পোস্ট / চাকরি খুঁজুন',
    heroTag: '#১ সর্বভারতীয় চাকরি পোর্টাল',
    heroTitle: 'সমগ্র ভারতে আপনার স্বপ্নের ক্যারিয়ার খুঁজুন',
    heroSubtitle: 'ভারতের ২৮টি রাজ্য এবং ওড়িশার ৩০টি জেলাজুড়ে হাজার হাজার যাচাইকৃত চাকরির সুযোগ।',
    searchPlaceholder: 'চাকরির পদ, দক্ষতা, বা কোম্পানি...',
    locationPlaceholder: 'শহর, জেলা, বা রাজ্য',
    stateDistrictBtn: 'রাজ্য ও জেলা',
    searchBtn: 'চাকরি খুঁজুন',
    popularSearches: 'জনপ্রিয় অনুসন্ধান:',
    activeJobs: 'সক্রিয় চাকরি',
    verifiedEmployers: 'যাচাইকৃত নিয়োগকর্তা',
    successfulHires: 'সফল নিয়োগ',
    featuredOpenings: 'বিশেষ চাকরি',
    quickView: 'দ্রুত দেখুন',
    applyNow: 'এখনই আবেদন করুন',
    aiAssistant: 'এআই সহকারী',
    selectLanguage: 'ভাষা নির্বাচন করুন'
  },
  te: {
    findJobs: 'ఉద్యోగాలు వెతకండి',
    browseAll: 'అన్నీ చూడండి',
    myApplications: 'నా దరఖాస్తులు',
    employerHub: 'యజమాని హబ్',
    adminPanel: 'అడ్మిన్ ప్యానెల్',
    signIn: 'సైన్ ఇన్ చేయండి',
    postFindJobs: 'పోస్ట్ / ఉద్యోగాలు వెతకండి',
    heroTag: '#1 ఆల్ ఇండియా జాబ్ పోర్టల్',
    heroTitle: 'భారతదేశమంతటా మీ కలల కెరీర్‌ను కనుగొనండి',
    heroSubtitle: '28 రాష్ట్రాలు మరియు ఒడిశాలోని 30 జిల్లాలలో వేలాది ధృవీకరించబడిన ఉద్యోగ అవకాశాలు.',
    searchPlaceholder: 'ఉద్యోగ శీర్షిక, నైపుణ్యాలు, లేదా కంపెనీ...',
    locationPlaceholder: 'నగరం, జిల్లా, లేదా రాష్ట్రం',
    stateDistrictBtn: 'రాష్ట్రం & జిల్లా',
    searchBtn: 'ఉద్యోగాలు వెతకండి',
    popularSearches: 'ప్రజాదరణ పొందిన శోధనలు:',
    activeJobs: 'సక్రియ ఉద్యోగాలు',
    verifiedEmployers: 'ధృవీకరించబడిన యజమానులు',
    successfulHires: 'విజయవంతమైన నియామకాలు',
    featuredOpenings: 'ముఖ్యమైన ఉద్యోగాలు',
    quickView: 'త్వరిత వీక్షణ',
    applyNow: 'ఇప్పుడే దరఖాస్తు చేయండి',
    aiAssistant: 'ఏఐ అసిస్టెంట్',
    selectLanguage: 'భాషను ఎంచుకోండి'
  },
  mr: {
    findJobs: 'नोकरी शोधा',
    browseAll: 'सर्व पहा',
    myApplications: 'माझे अर्ज',
    employerHub: 'नियोक्ता हब',
    adminPanel: 'ॲडमिन पॅनेल',
    signIn: 'साइन इन करा',
    postFindJobs: 'नोकरी पोस्ट / शोधा',
    heroTag: '#१ ऑल इंडिया जॉब पोर्टल',
    heroTitle: 'संपूर्ण भारतात तुमचे स्वप्नातील करिअर शोधा',
    heroSubtitle: '२८ राज्ये आणि ओडिशाच्या ३० जिल्ह्यांमध्ये हजारो सत्यापित संधी.',
    searchPlaceholder: 'नोकरीचे नाव, कौशल्य, किंवा कंपनी...',
    locationPlaceholder: 'शहर, जिल्हा, किंवा राज्य',
    stateDistrictBtn: 'राज्य आणि जिल्हा',
    searchBtn: 'नोकरी शोधा',
    popularSearches: 'लोकप्रिय शोध:',
    activeJobs: 'सक्रिय नोकऱ्या',
    verifiedEmployers: 'सत्यापित नियोक्ते',
    successfulHires: 'यशस्वी भरती',
    featuredOpenings: 'प्रमुख नोकऱ्या',
    quickView: 'झटपट पहा',
    applyNow: 'आत्ताच अर्ज करा',
    aiAssistant: 'एआय सहाय्यक',
    selectLanguage: 'भाषा निवडा'
  },
  ta: {
    findJobs: 'வேலை தேடுக',
    browseAll: 'அனைத்தும் பார்க்க',
    myApplications: 'என் விண்ணப்பங்கள்',
    employerHub: 'நிறுவனர் மையம்',
    adminPanel: 'நிர்வாகக் குழு',
    signIn: 'உள்நுழைக',
    postFindJobs: 'பதிவு / வேலை தேடுக',
    heroTag: '#1 இந்திய வேலைவாய்ப்பு தளம்',
    heroTitle: 'இந்தியா முழுவதும் உங்கள் கனவு வேலையைக் கண்டறியவும்',
    heroSubtitle: '28 மாநிலங்கள் மற்றும் ஒடிசாவின் 30 மாவட்டங்களில் ஆயிரக்கணக்கான சரிபார்க்கப்பட்ட வேலைகள்.',
    searchPlaceholder: 'வேலை தலைப்பு, திறன்கள், அல்லது நிறுவனம்...',
    locationPlaceholder: 'நகரம், மாவட்டம், அல்லது மாநிலம்',
    stateDistrictBtn: 'மாநிலம் & மாவட்டம்',
    searchBtn: 'வேலை தேடுக',
    popularSearches: 'பிரபலமான தேடல்கள்:',
    activeJobs: 'செயலில் உள்ள வேலைகள்',
    verifiedEmployers: 'சரிபார்க்கப்பட்ட நிறுவனங்கள்',
    successfulHires: 'வெற்றிகரமான நியமனங்கள்',
    featuredOpenings: 'முக்கிய வேலைகள்',
    quickView: 'விரைவுப் பார்வை',
    applyNow: 'இப்பொழுதே விண்ணப்பிக்கவும்',
    aiAssistant: 'ஏஐ உதவியாளர்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்'
  },
  kn: {
    findJobs: 'ಉದ್ಯೋಗ ಹುಡುಕಿ',
    browseAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    myApplications: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    employerHub: 'ಉದ್ಯೋಗದಾತ ಹಬ್',
    adminPanel: 'ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್',
    signIn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    postFindJobs: 'ಪೋಸ್ಟ್ / ಹುಡುಕಿ',
    heroTag: '#1 ಆಲ್ ಇಂಡಿಯಾ ಜಾಬ್ ಪೋರ್ಟಲ್',
    heroTitle: 'ಭಾರತದಾದ್ಯಂತ ನಿಮ್ಮ ಕನಸಿನ ಉದ್ಯೋಗವನ್ನು ಕಂಡುಕೊಳ್ಳಿ',
    heroSubtitle: '28 ರಾಜ್ಯಗಳು ಮತ್ತು ಒಡಿಶಾದ 30 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಸಾವಿರಾರು ಪರಿಶೀಲಿಸಿದ ಉದ್ಯೋಗ ಅವಕಾಶಗಳು.',
    searchPlaceholder: 'ಉದ್ಯೋಗ ಶೀರ್ಷಿಕೆ, ಕೌಶಲ್ಯ, ಅಥವಾ ಕಂಪನಿ...',
    locationPlaceholder: 'ನಗರ, ಜಿಲ್ಲೆ, ಅಥವಾ ರಾಜ್ಯ',
    stateDistrictBtn: 'ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ',
    searchBtn: 'ಉದ್ಯೋಗ ಹುಡುಕಿ',
    popularSearches: 'ಜನಪ್ರಿಯ ಹುಡುಕಾಟಗಳು:',
    activeJobs: 'ಸಕ್ರಿಯ ಉದ್ಯೋಗಗಳು',
    verifiedEmployers: 'ಪರಿಶೀಲಿಸಿದ ಉದ್ಯೋಗದಾತರು',
    successfulHires: 'ಯಶಸ್ವಿ ನೇಮಕಾತಿಗಳು',
    featuredOpenings: 'ಪ್ರಮುಖ ಉದ್ಯೋಗಗಳು',
    quickView: 'ತ್ವರಿತ ನೋಟ',
    applyNow: 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    aiAssistant: 'ಎಐ ಸಹಾಯಕ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ'
  },
  gu: {
    findJobs: 'નોકરી શોધો',
    browseAll: 'બધું જુઓ',
    myApplications: 'મારી અરજીઓ',
    employerHub: 'એમ્પ્લોયર હબ',
    adminPanel: 'એડમિન પેનલ',
    signIn: 'સાઇન ઇન કરો',
    postFindJobs: 'પોસ્ટ / નોકરી શોધો',
    heroTag: '#1 ઓલ ઈન્ડિયા જોબ પોર્ટલ',
    heroTitle: 'સમગ્ર ભારતમાં તમારી ડ્રીમ કેરિયર શોધો',
    heroSubtitle: '૨૮ રાજ્યો અને ઓડિશાના ૩૦ જિલ્લાઓમાં હજારો ચકાસાયેલ તકો.',
    searchPlaceholder: 'જોબ ટાઇટલ, સ્કીલ, અથવા કંપની...',
    locationPlaceholder: 'શહેર, જિલ્લો, અથવા રાજ્ય',
    stateDistrictBtn: 'રાજ્ય અને જિલ્લો',
    searchBtn: 'નોકરી શોધો',
    popularSearches: 'લોકપ્રિય શોધો:',
    activeJobs: 'સક્રિય નોકરીઓ',
    verifiedEmployers: 'ચકાસાયેલ એમ્પ્લોયરો',
    successfulHires: 'સફળ ભરતી',
    featuredOpenings: 'મુખ્ય નોકરીઓ',
    quickView: 'ઝડપી જુઓ',
    applyNow: 'હમણાં અરજી કરો',
    aiAssistant: 'એઆઈ સહાયક',
    selectLanguage: 'ભાષા પસંદ કરો'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jobseeker_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('jobseeker_lang', lang);
  }, [lang]);

  const t = (key) => {
    const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const changeLanguage = (code) => {
    setLang(code);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
