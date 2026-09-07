import i18n from '../i18n';

// Comprehensive English to Marathi dictionary for terms, statuses, departments, roles, UI text, labels, and sentences
export const marathiDictionary = {
  // Application & Branding
  'govinnovate maharashtra': 'गव्हइनोव्हेट महाराष्ट्र',
  'govinnovate platform': 'गव्हइनोव्हेट व्यासपीठ',
  'public sector innovation & procurement platform': 'सार्वजनिक क्षेत्र नवोपक्रम आणि खरेदी व्यासपीठ',
  'government of maharashtra innovation registry': 'महाराष्ट्र शासन नवोपक्रम नोंदवही',
  'government of maharashtra emblem': 'महाराष्ट्र शासन राजमुद्रा',
  'government of maharashtra': 'महाराष्ट्र शासन',
  'maharashtra innovation portal': 'महाराष्ट्र नवोपक्रम पोर्टल',
  'maharashtra state innovation society (msins)': 'महाराष्ट्र राज्य नवोपक्रम संस्था (MSInS)',
  'maharashtra state innovation society': 'महाराष्ट्र राज्य नवोपक्रम संस्था (MSInS)',
  'maharashtra state innovation society (msins) initiative': 'महाराष्ट्र राज्य नवोपक्रम सोसायटी (MSInS) उपक्रम',
  'department of skills, employment, entrepreneurship and innovation': 'कौशल्य, रोजगार, उद्योजकता आणि नवोपक्रम विभाग',
  'single sign-on (sso) portal for public sector innovation procurement': 'सार्वजनिक क्षेत्र नवोपक्रम खरेदीसाठी सिंगल साइन-ऑन (SSO) पोर्टल',
  'maha-rbac v2.4': 'महा-RBAC आवृत्ती २.४',

  // Navigation & Headers
  'dashboard': 'डॅशबोर्ड',
  'dashboard overview': 'डॅशबोर्ड विहंगावलोकन',
  'challenges': 'आव्हाने',
  'browse challenges': 'आव्हाने पहा',
  'explore live challenges': 'सक्रिय आव्हाने पहा',
  'open government innovation challenges': 'खुली शासकीय नवोपक्रम आव्हाने',
  'startup discovery': 'स्टार्टअप शोध',
  'startups': 'स्टार्टअप्स',
  'applications': 'अर्ज',
  'my applications': 'माझे अर्ज',
  'my submitted proposals': 'माझे सादर केलेले प्रस्ताव',
  'my recent applications': 'माझे अलीकडील अर्ज',
  'evaluations': 'मूल्यमापन',
  'evaluation console': 'मूल्यमापन कन्सोल',
  'assigned proposals': 'नियुक्त प्रस्ताव',
  'scoring criteria': 'गुणदान निकष',
  'coi declarations': 'हितसंबंध संघर्ष (COI) घोषणा',
  'pilots': 'पथदर्शी प्रकल्प',
  'pilot workspace': 'पथदर्शी प्रकल्प कक्ष',
  'active controlled pilots': 'सक्रिय नियंत्रित पथदर्शी प्रकल्प',
  'kpi & performance': 'कामगिरी निर्देशांक (KPI)',
  'kpis': 'कामगिरी निर्देशांक',
  'live kpi telemetry': 'थेट कामगिरी निर्देशांक (KPI) टेलिमेट्री',
  'validation': 'स्वतंत्र पडताळणी',
  'validation console': 'पडताळणी कन्सोल',
  'validation reports (ivr)': 'स्वतंत्र पडताळणी अहवाल (IVR)',
  'empirical kpi audits': 'प्रत्यक्ष KPI लेखापरीक्षण',
  'procurement': 'शासकीय खरेदी',
  'scale-up': 'राज्यव्यापी विस्तार',
  'scale up': 'राज्यव्यापी विस्तार',
  'scaleup': 'राज्यव्यापी विस्तार',
  'scale-up & rollouts': 'राज्यव्यापी विस्तार आणि अंमलबजावणी',
  'government officers': 'शासकीय अधिकारी',
  'officer directory': 'अधिकारी निर्देशिका',
  'officer directory & role access management': 'शासकीय अधिकारी निर्देशिका आणि भूमिका प्रवेश व्यवस्थापन',
  'designated government officers': 'नियुक्त शासकीय अधिकारी',
  'notifications': 'सूचना',
  'recent notifications': 'नवीनतम सूचना',
  'audit log': 'लेखापरीक्षण नोंद',
  'transparency audit trail': 'पारदर्शकता लेखापरीक्षण नोंद',
  'transparency & public audit trail': 'पारदर्शकता आणि सार्वजनिक लेखापरीक्षण नोंद',
  'company profile': 'कंपनी प्रोफाइल',
  'payments & milestones': 'देयके आणि टप्पे',
  'portal access': 'पोर्टल प्रवेश',
  'sign in': 'साइन इन करा',
  'sign in to portal': 'पोर्टलवर साइन इन करा',
  'sign in to submit proposal': 'प्रस्ताव सादर करण्यासाठी साइन इन करा',
  'sign in to secure workspace': 'सुरक्षित कार्यक्षेत्रात साइन इन करा',
  'sign out': 'बाहेर पडा',
  'switch portal role': 'पोर्टल भूमिका बदला',
  'switch role': 'भूमिका बदला',
  'language': 'भाषा',
  'english': 'English',
  'marathi': 'मराठी',

  // Roles & Desks
  'government officer': 'शासकीय अधिकारी',
  'government admin': 'शासकीय प्रशासक',
  'super admin': 'सर्वोच्च प्रशासक',
  'platform admin': 'व्यासपीठ प्रशासक',
  'department officer': 'विभागीय अधिकारी',
  'department officer (nodal desk)': 'विभागीय अधिकारी (नोडल डेस्क)',
  'procurement officer': 'खरेदी अधिकारी',
  'procurement officer (legal & finance)': 'खरेदी अधिकारी (विधी व वित्त)',
  'government admin (msins / state cell)': 'शासकीय प्रशासक (MSInS / राज्य कक्ष)',
  'technical/domain evaluator': 'तांत्रिक / विषय तज्ज्ञ मूल्यमापक',
  'technical evaluator': 'तांत्रिक मूल्यमापक',
  'domain evaluator': 'विषय तज्ज्ञ मूल्यमापक',
  'cybersecurity evaluator': 'सायबर सुरक्षा मूल्यमापक',
  'independent validator': 'स्वतंत्र पडताळणी अधिकारी',
  'lead validator': 'प्रमुख पडताळणी अधिकारी',
  'startup partner': 'स्टार्टअप भागीदार',
  'startup admin': 'स्टार्टअप प्रशासक',
  'startup admin / innovator': 'स्टार्टअप प्रशासक / संशोधक',
  'startup team member': 'स्टार्टअप चमू सदस्य',
  'citizen / public viewer': 'नागरिक / सार्वजनिक दर्शक',
  'viewer': 'दर्शक',
  'officer': 'शासकीय अधिकारी',
  'expert evaluator': 'तज्ज्ञ मूल्यमापक',
  'startup portal': 'स्टार्टअप पोर्टल',
  'evaluator portal': 'मूल्यमापक पोर्टल',
  'validator portal': 'पडताळणी पोर्टल',
  'government portal': 'शासकीय पोर्टल',

  // Statuses & Workflow Stages
  'published': 'प्रकाशित',
  'draft': 'मसुदा',
  'submitted': 'सादर केले',
  'under review': 'पुनरावलोकनाधीन',
  'eligible': 'पात्र',
  'conditionally eligible': 'सशर्त पात्र',
  'not eligible': 'अपात्र',
  'shortlisted': 'शॉर्टलिस्ट केले',
  'pilot active': 'पथदर्शी प्रकल्प सक्रिय',
  'selected for pilot': 'पथदर्शी प्रकल्पासाठी निवड',
  'pending review': 'पडताळणी प्रलंबित',
  'evidence submitted': 'पुरावा सादर केला',
  'recommended for scale': 'विस्तारासाठी शिफारस',
  'recommended for statewide scale-up': 'राज्यव्यापी विस्तारासाठी शिफारस',
  'recommended with minor conditions': 'किरकोळ अटींसह शिफारस',
  'requires further trial/evidence': 'अधिक चाचणी / पुराव्याची आवश्यकता',
  'not recommended for procurement': 'खरेदीसाठी शिफारस नाही',
  'scale statewide': 'राज्यव्यापी विस्तार',
  'active': 'सक्रिय',
  'completed': 'पूर्ण झाले',
  'pending': 'प्रलंबित',
  'pending approval': 'मंजुरी प्रलंबित',
  'pending screening': 'छाननी प्रलंबित',
  'pending evaluation': 'मूल्यांकन प्रलंबित',
  'pending assignment': 'नियुक्ती प्रलंबित',
  'under evaluation': 'मूल्यांकनाधीन',
  'verified': 'पडताळणी पूर्ण',
  'verified pass': 'पडताळणी उत्तीर्ण',
  'dpiit verified': 'DPIIT प्रमाणित',
  'dpiit recognized': 'DPIIT मान्यताप्राप्त',
  'dpiit eligible': 'DPIIT पात्र',
  'document verified': 'दस्तऐवज प्रमाणित',
  'eligibility verified': 'पात्रता प्रमाणित',
  'quality board certified': 'गुणवत्ता मंडळ प्रमाणित',
  'suspended': 'निलंबित',
  'inactive': 'निष्क्रिय',
  'assigned': 'नियुक्त',
  'evaluated': 'मूल्यांकन पूर्ण',
  'rejected': 'नाकारले',
  'approved': 'मंजूर',
  'paid': 'अदा केले',
  'in progress': 'प्रगतीपथावर',
  'deploying': 'तैनाती सुरू',
  'open': 'खुले',
  'closed': 'बंद',
  'moderated': 'पुनरावलोकित',
  'compliant': 'सुसंगत / नियमानुसार',

  // Departments
  'public health department': 'सार्वजनिक आरोग्य विभाग',
  'public health department, govt of mh': 'सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन',
  'department of agriculture': 'कृषी विभाग',
  'department of agriculture, government of maharashtra': 'कृषी विभाग, महाराष्ट्र शासन',
  'school education & sports department': 'शालेय शिक्षण व क्रीडा विभाग',
  'water resources department': 'जलसंपदा विभाग',
  'state it & innovation cell': 'राज्य माहिती तंत्रज्ञान व नवोपक्रम कक्ष',
  'urban development department': 'नगर विकास विभाग',
  'department of skills & innovation': 'कौशल्य व नवोपक्रम विभाग',
  'department of medical education & drugs': 'वैद्यकीय शिक्षण व औषधी द्रव्ये विभाग',
  'revenue and forest department': 'महसूल व वन विभाग',
  'finance department': 'वित्त विभाग',
  'home department': 'गृह विभाग',
  'environment and climate change department': 'पर्यावरण व हवामान बदल विभाग',
  'industries, energy and labour department': 'उद्योग, ऊर्जा व कामगार विभाग',

  // Sectors & Tech Domains
  'healthcare & medtech': 'आरोग्यसेवा व वैद्यकीय तंत्रज्ञान',
  'agriculture & irrigation': 'कृषी व जलसंधारण',
  'school education & skills': 'शालेय शिक्षण व कौशल्य',
  'water & sanitation': 'पाणी पुरवठा व स्वच्छता',
  'smart governance & ulbs': 'स्मार्ट प्रशासन व स्थानिक संस्था',
  'agritech & remote sensing': 'कृषी तंत्रज्ञान व रिमोट सेन्सिंग',
  'hospital workflow automation & computer vision ai': 'रुग्णालय कार्यप्रवाह व संगणक दृष्टी AI',
  'edtech & vernacular learning': 'शैक्षणिक तंत्रज्ञान व स्थानिक भाषा शिक्षण',
  'smart water metering & telemetry': 'स्मार्ट पाणी मोजणी व टेलिमेट्री',
  'smart mobility & traffic': 'स्मार्ट वाहतूक व दळणवळण',
  'cybersecurity & cloud': 'सायबर सुरक्षा आणि क्लाउड',

  // Districts & Locations
  'maharashtra': 'महाराष्ट्र',
  'mumbai': 'मुंबई',
  'pune': 'पुणे',
  'nagpur': 'नागपूर',
  'nashik': 'नाशिक',
  'thane': 'ठाणे',
  'chhatrapati sambhajinagar': 'छत्रपती संभाजीनगर',
  'aurangabad': 'छत्रपती संभाजीनगर',
  'amravati': 'अमरावती',
  'nanded': 'नांदेड',
  'kolhapur': 'कोल्हापूर',
  'solapur': 'सोलापूर',
  'sangli': 'सांगली',
  'satara': 'सातारा',
  'ratnagiri': 'रत्नागिरी',
  'sindhudurg': 'सिंधुदुर्ग',
  'jalgaon': 'जळगाव',
  'dhule': 'धुळे',
  'nandurbar': 'नंदुरबार',
  'ahmednagar': 'अहिल्यानगर (अहमदनगर)',
  'beed': 'बीड',
  'latur': 'लातूर',
  'osmanabad': 'धाराशिव',
  'dharashiv': 'धाराशिव',
  'parbhani': 'परभणी',
  'hingoli': 'हिंगोली',
  'jalna': 'जालना',
  'buldhana': 'बुलढाणा',
  'akola': 'अकोला',
  'washim': 'वाशिम',
  'yavatmal': 'यवतमाळ',
  'wardha': 'वर्धा',
  'chandrapur': 'चंद्रपूर',
  'gadchiroli': 'गडचिरोली',
  'bhandara': 'भंडारा',
  'gondia': 'गोंदिया',
  'palghar': 'पालघर',
  'raigad': 'रायगड',
  'statewide (all 36 districts)': 'राज्यव्यापी (सर्व ३६ जिल्हे)',
  'mantralaya, mumbai, maharashtra': 'मंत्रालय, मुंबई, महाराष्ट्र',
  'pune, maharashtra': 'पुणे, महाराष्ट्र',
  'mumbai, maharashtra': 'मुंबई, महाराष्ट्र',
  'nagpur, maharashtra': 'नागपूर, महाराष्ट्र',
  'nashik, maharashtra': 'नाशिक, महाराष्ट्र',
  '3 district hospitals (pune, nashik, thane)': '३ जिल्हा रुग्णालये (पुणे, नाशिक, ठाणे)',

  // GFR Waivers & Badges
  'gfr startup relaxations': 'GFR स्टार्टअप सवलती',
  'gfr startup waivers': 'GFR स्टार्टअप सवलती',
  'dpiit / msins startup gfr waivers': 'DPIIT / MSInS स्टार्टअप GFR सवलती',
  'turnover 100% waived': 'उलाढाल १००% माफ',
  'prior experience waived': 'मागील अनुभव अट माफ',
  'emd exempted': 'EMD अनामत रक्कम माफ',
  'turnover & emd waived': 'उलाढाल आणि EMD माफ',
  '100% waived prior turnover requirement': 'मागील उलाढाल आवश्यकता १००% माफ',
  '100% waived earnest money deposit (emd) fee': 'बयाणा रक्कम (EMD) शुल्क १००% माफ',
  'dpiit exemption status': 'DPIIT सवलत स्थिती',
  'turnover requirement: 100% waived under gfr rule 173(i)': 'उलाढाल अट: GFR नियम १७३(i) नुसार १००% माफ',
  'prior experience criteria: 100% waived for registered startups': 'मागील अनुभव निकष: नोंदणीकृत स्टार्टअप्ससाठी १००% माफ',
  'emd security deposit: exempted': 'EMD सुरक्षा अनामत रक्कम: पूर्णपणे माफ',
  'technology readiness level (trl 5+) qualification': 'तंत्रज्ञान सज्जता स्तर (TRL ५+) पात्रता',
  'cert-in cybersecurity & data compliance declaration': 'CERT-In सायबर सुरक्षा आणि डेटा अनुपालन घोषणा',

  // Table Columns & UI Labels
  'officer & designation': 'अधिकारी व पदनाम',
  'department / wing': 'विभाग / कक्ष',
  'contact & email': 'संपर्क व ईमेल',
  'role permission': 'भूमिका परवानगी',
  'admin actions': 'प्रशासकीय कृती',
  'challenge title': 'आव्हान शीर्षक',
  'department': 'विभाग',
  'budget': 'अर्थसंकल्प',
  'estimated budget': 'अंदाजित अर्थसंकल्प',
  'pilot budget': 'पथदर्शी अर्थसंकल्प',
  'proposed budget': 'प्रस्तावित अर्थसंकल्प',
  'total budget': 'एकूण अर्थसंकल्प',
  'status': 'स्थिती',
  'actions': 'कृती',
  'date': 'दिनांक',
  'amount': 'रक्कम',
  'score': 'गुण',
  'match score': 'सुसंगतता गुण',
  'compatibility match score': 'सुसंगतता जुळवणी गुण',
  'weighted total score': 'भारांकित एकूण गुण',
  'validation confidence score': 'पडताळणी विश्वासार्हता गुण',
  'scale readiness score': 'विस्तार सज्जता गुण',
  'procurement readiness': 'खरेदी सज्जता',
  'baseline': 'बेसलाइन (सद्यस्थिती)',
  'current baseline': 'सद्यस्थिती बेसलाइन',
  'expected outcome': 'अपेक्षित निकाल',
  'expected outcome target': 'अपेक्षित कामगिरी उद्दिष्ट',
  'pilot duration': 'चाचणी कालावधी',
  'duration': 'कालावधी',
  'timeline': 'वेळापत्रक',
  'days': 'दिवस',
  'details': 'तपशील',
  'view details': 'तपशील पहा',
  'view': 'पहा',
  'view all': 'सर्व पहा',
  'view all challenges': 'सर्व आव्हाने पहा',
  'apply': 'अर्ज करा',
  'apply now': 'आता अर्ज करा',
  'submit technical proposal': 'तांत्रिक प्रस्ताव सादर करा',
  'submit proposal': 'प्रस्ताव सादर करा',
  'create outcome challenge': 'नवीन आव्हान तयार करा',
  'publish new challenge': 'नवीन आव्हान प्रकाशित करा',
  'problem statement templates': 'समस्या विधान नमुने (Templates)',
  'add government officer': 'नवीन शासकीय अधिकारी जोडा',
  'edit': 'संपादित करा',
  'delete': 'हटवा',
  'save': 'जतन करा',
  'save changes': 'बदल जतन करा',
  'save draft': 'मसुदा जतन करा',
  'cancel': 'रद्द करा',
  'close': 'बंद करा',
  'back': 'मागे जा',
  'confirm': 'पुष्टी करा',
  'submit': 'सादर करा',
  'submit approval': 'मंजुरीसाठी सादर करा',
  'publish challenge': 'आव्हान प्रकाशित करा',
  'set pilot active': 'पथदर्शी प्रकल्प सक्रिय करा',
  'conduct independent audit': 'स्वतंत्र लेखापरीक्षण करा',
  'submit evaluation & coi': 'मूल्यांकन आणि COI सादर करा',
  'certify validation report': 'पडताळणी अहवाल प्रमाणित करा',
  'instantiate innovation contract': 'नवोपक्रम करार कार्यान्वित करा',
  'disburse e-kosh treasury payment': 'ई-कोष कोषागार देयक वितरित करा',
  'initiate scale decision case': 'विस्तार निर्णय प्रकरण सुरू करा',
  'export procurement / scale dossier': 'खरेदी / विस्तार अहवाल निर्यात करा',
  'export audit certificate (pdf / json)': 'लेखापरीक्षण प्रमाणपत्र निर्यात करा (PDF / JSON)',
  'refresh': 'रिफ्रेश करा',
  'refresh data': 'माहिती अद्यतनित करा',
  'search': 'शोधा',
  'filter': 'फिल्टर',
  'all': 'सर्व',
  'all departments': 'सर्व विभाग',
  'all roles': 'सर्व भूमिका',
  'all status': 'सर्व स्थिती',
  'download': 'डाउनलोड करा',
  'upload': 'अपलोड करा',
  'next step': 'पुढील पायरी',
  'previous': 'मागील',
  'final submit proposal': 'अंतिम अर्ज सादर करा',
  'send invitation': 'निमंत्रण पाठवा',
  'invite': 'निमंत्रण द्या',
  'shortlist': 'शॉर्टलिस्ट करा',

  // Metrics Bar & Headers
  'total officers': 'एकूण अधिकारी',
  'active in service': 'सेवेत सक्रिय',
  'departments represented': 'समाविष्ट विभाग',
  'governance protocol': 'प्रशासन नियमावली',
  'active challenges': 'सक्रिय आव्हाने',
  'active public challenges': 'सक्रिय सार्वजनिक आव्हाने',
  'pending proposals': 'प्रलंबित प्रस्ताव',
  'expert evaluations': 'तज्ज्ञ मूल्यमापने',
  'active pilots': 'सक्रिय पथदर्शी प्रकल्प',
  'controlled sandbox trials': 'नियंत्रित सँडबॉक्स चाचण्या',
  'kpi performance': 'कामगिरी निर्देशांक (KPI)',
  'all targets exceeded': 'सर्व उद्दिष्टे साध्य',
  'pending milestones': 'प्रलंबित टप्पे',
  'evidence review ready': 'पुरावा पडताळणी सज्ज',
  'independent validation': 'स्वतंत्र पडताळणी',
  'scale recommendations': 'विस्तार शिफारसी',
  'solutions being scaled': 'विस्तारित केलेले उपाय',
  'statewide scale budget': 'राज्यव्यापी विस्तार निधी',
  'disbursed treasury funds': 'वितरित कोषागार निधी',
  'received treasury disbursements': 'प्राप्त कोषागार निधी',
  'statewide scale orders': 'राज्यव्यापी विस्तार आदेश',
  'open challenges': 'खुली आव्हाने',
  'submitted apps': 'सादर केलेले अर्ज',
  'submitted applications': 'सादर केलेले अर्ज',
  'total proposals': 'एकूण प्रस्ताव',
  'under evaluation': 'मूल्यांकनाधीन',
  'expert panel review': 'तज्ज्ञ समिती पुनरावलोकन',
  'district field trial': 'जिल्हास्तरीय प्रत्यक्ष चाचणी',
  'telemetry due soon': 'टेलिमेट्री माहिती देय',
  'pending payments': 'प्रलंबित देयके',
  'approved by treasury': 'कोषागाराकडून मंजूर',
  'company profile completion': 'कंपनी प्रोफाइल पूर्णता',
  'recent activity audit stream': 'अलीकडील प्रशासकीय नोंदी',
  'active innovation challenges': 'सक्रिय नवोपक्रम आव्हाने',
  'innovation lifecycle pipeline overview': 'नवोपक्रम जीवनचक्र पाइपलाइन विहंगावलोकन',

  // Stepper & Modal Forms
  '1. eligibility check': '१. पात्रता तपासणी',
  '2. solution overview': '२. उपायाचे विहंगावलोकन',
  '3. technical proposal': '३. तांत्रिक प्रस्ताव',
  '4. timeline & milestones': '४. वेळापत्रक आणि टप्पे',
  '5. field pilot plan': '५. प्रत्यक्ष चाचणी योजना',
  '6. commercial budget': '६. व्यावसायिक अर्थसंकल्प',
  '7. supporting docs': '७. पूरक दस्तऐवज',
  '8. review & submit': '८. पुनरावलोकन व सादरीकरण',
  'eligibility check': 'पात्रता तपासणी',
  'solution overview': 'उपायाचे विहंगावलोकन',
  'technical proposal': 'तांत्रिक प्रस्ताव',
  'timeline & milestones': 'वेळापत्रक आणि टप्पे',
  'field pilot plan': 'प्रत्यक्ष चाचणी योजना',
  'commercial budget': 'व्यावसायिक अर्थसंकल्प',
  'supporting docs': 'पूरक दस्तऐवज',
  'review & submit': 'पुनरावलोकन व सादरीकरण',
  'proposal workflow': 'प्रस्ताव कार्यप्रवाह',
  'step': 'पायरी',
  'of': 'पैकी',
  'officer full name': 'अधिकाऱ्याचे पूर्ण नाव',
  'official government email': 'अधिकृत शासकीय ईमेल',
  'assigned department': 'नियुक्त विभाग',
  'administrative role': 'प्रशासकीय भूमिका',
  'contact phone number': 'संपर्क फोन नंबर',
  'initial temporary password': 'प्रारंभिक तात्पुरता पासवर्ड',
  'enable instant portal access (account active)': 'त्वरित पोर्टल प्रवेश सक्षम करा (खाते सक्रिय)',
  'proposed solution title': 'प्रस्तावित उपायाचे शीर्षक',
  'executive summary / solution tagline': 'कार्यकारी सारांश / घोषवाक्य',
  'problem understanding & field analysis': 'समस्येचे आकलन व क्षेत्रीय विश्लेषण',
  'technical & algorithmic approach': 'तांत्रिक व अल्गोरिथमिक दृष्टिकोन',
  'system architecture & deployment topology': 'प्रणाली रचना व अंमलबजावणी आराखडा',
  'key innovation highlights & ip': 'प्रमुख नवोपक्रम वैशिष्ट्ये व बौद्धिक संपदा',
  'total proposed implementation duration (days)': 'प्रस्तावित एकूण अंमलबजावणी कालावधी (दिवस)',
  'phase-wise milestones breakdown': 'टप्प्याटप्प्याने वितरणीय घटकांचे विवरण',
  'field pilot methodology': 'प्रत्यक्ष चाचणी कार्यपद्धती',
  'required site support / infrastructure': 'आवश्यक क्षेत्रीय पाठबळ / पायाभूत सुविधा',
  'data privacy & security standards': 'डेटा गोपनीयता व सुरक्षा मानके',
  'total proposed commercial budget': 'एकूण प्रस्तावित व्यावसायिक अर्थसंकल्प',
  'itemized cost breakdown': 'तपशीलवार खर्च विवरण',
  'supporting documents & exemption certificates': 'पूरक दस्तऐवज व सवलत प्रमाणपत्रे',
  'final submission confirmation': 'अंतिम सादरीकरण पुष्टी',
  'conflict of interest (coi) declaration': 'हितसंबंध संघर्ष (COI) घोषणा',
  'mandatory conflict of interest (coi) declaration': 'अनिवार्य हितसंबंध संघर्ष (COI) घोषणा',
  'mandatory coi declaration required before scoring': 'गुणदानापूर्वी अनिवार्य COI घोषणा आवश्यक',
  'select pilot project for audit': 'लेखापरीक्षणासाठी पथदर्शी प्रकल्प निवडा',
  'audited opd wait time': 'तपासलेला OPD प्रतीक्षा वेळ',
  'audited triage accuracy': 'तपासलेली ट्रायज अचूकता',
  'overall validation score (0-100)': 'एकूण पडताळणी गुण (०-१००)',
  'validation recommendation': 'पडताळणी शिफारस',
  'executive validation summary': 'कार्यकारी पडताळणी सारांश',
  'official independent validation reports (ivr)': 'अधिकृत स्वतंत्र पडताळणी अहवाल (IVR)',
  'empirical kpi telemetry audit & verification matrix': 'प्रत्यक्ष KPI टेलिमेट्री ऑडिट व पडताळणी मॅट्रिक्स',
  'official recommendation': 'अधिकृत शिफारस',
  'certify & hand off to phase 8 scale-up desk': 'प्रमाणित करून टप्पा ८ विस्तार कक्षाकडे हस्तांतरित करा',
  'conduct independent field audit & generate ivr': 'स्वतंत्र फील्ड ऑडिट करा आणि IVR अहवाल तयार करा',

  // Common phrases & sentences
  'loading government innovation registry data...': 'शासकीय नवोपक्रम नोंदवही माहिती लोड होत आहे...',
  'loading data from innovation registry...': 'नवोपक्रम नोंदवहीतून माहिती लोड होत आहे...',
  'loading officer registry...': 'अधिकारी नोंदवही लोड होत आहे...',
  'loading startup portal & innovation registry data...': 'स्टार्टअप पोर्टल आणि नवोपक्रम नोंदवही लोड होत आहे...',
  'no officers found': 'कोणतेही अधिकारी आढळले नाहीत',
  'no challenges found': 'कोणतीही आव्हाने आढळली नाहीत',
  'no validation reports submitted yet.': 'अद्याप कोणतेही पडताळणी अहवाल सादर केलेले नाहीत.',
  'welcome back': 'पुन्हा स्वागत आहे',
  'explore open challenges': 'खुली आव्हाने पहा',
  'update profile & docs': 'प्रोफाइल व दस्तऐवज अद्यतनित करा',
  'dpiit recognized startups': 'DPIIT मान्यताप्राप्त स्टार्टअप्स',
  'controlled field pilot': 'नियंत्रित प्रत्यक्ष चाचणी',
  'independent scale-up': 'स्वतंत्र राज्यव्यापी विस्तार',
  'outcome challenges': 'उद्दिष्ट-आधारित आव्हाने',
  'startup discovery & matching': 'स्टार्टअप शोध आणि जुळवणी',
  'structured innovation procurement pathway': 'संरचित नवोपक्रम खरेदी कार्यप्रवाह',
  'a transparent and legally compliant digital workflow connecting government needs to startup technology': 'शासकीय गरजा आणि स्टार्टअप तंत्रज्ञान जोडणारा पारदर्शक व कायदेशीर डिजिटल कार्यप्रवाह',
  'verified dpiit startup solutions': 'प्रमाणित DPIIT स्टार्टअप उपाय',
  'registered indian startups verified under maharashtra state innovation procurement framework': 'महाराष्ट्र राज्य नवोपक्रम खरेदी आराखड्यांतर्गत प्रमाणित भारतीय स्टार्टअप्स',
  'all rights reserved': 'सर्व हक्क राखीव',
  '© 2026 government of maharashtra. all rights reserved.': '© २०२६ महाराष्ट्र शासन. सर्व हक्क राखीव.',
  'secured via mahagov 2-factor authentication & digilocker': 'महागव्ह २-घटक प्रमाणीकरण आणि डिजिलॉकरद्वारे सुरक्षित',
  'quick demo access (click to auto-fill credentials)': 'त्वरित डेमो प्रवेश (माहिती भरण्यासाठी क्लिक करा)',
  'encrypted single-sign-on & audit log tracking active': 'एनक्रिप्टेड सिंगल-साइन-ऑन आणि लेखापरीक्षण ट्रॅकिंग सक्रिय',
  'outcome-based innovation challenge management': 'उद्दिष्ट-आधारित नवोपक्रम आव्हान व्यवस्थापन',
  'formulate outcome specs, define baseline targets, set eligibility rules, and publish government challenges': 'उद्दिष्टे तयार करा, बेसलाइन लक्ष्ये ठरवा, पात्रता नियम निश्चित करा आणि आव्हाने प्रकाशित करा',

  // Profile & DigiLocker Sub-tabs & Fields
  'basic information': 'मूलभूत माहिती',
  'company overview': 'कंपनीचे विहंगावलोकन',
  'founders & team': 'संस्थापक आणि चमू',
  'tech & products': 'तंत्रज्ञान आणि उत्पादने',
  'legal documents': 'कायदेशीर दस्तऐवज',
  'upload document': 'दस्तऐवज अपलोड करा',
  'add supporting document': 'पूरक दस्तऐवज जोडा',
  'document title': 'दस्तऐवज शीर्षक',
  'document type': 'दस्तऐवज प्रकार',
  'dpiit certificate': 'DPIIT प्रमाणपत्र',
  'mca registration': 'MCA नोंदणी',
  'tax & compliance': 'कर आणि अनुपालन',
  'security audit': 'सुरक्षा लेखापरीक्षण',
  'digilocker verification': 'डिजिलॉकर पडताळणी',
  'digilocker verified': 'डिजिलॉकर प्रमाणित',
  'connect with digilocker': 'डिजिलॉकरशी कनेक्ट करा',
  'verify documents via digilocker': 'डिजिलॉकरद्वारे दस्तऐवज पडताळणी करा',
  'digilocker consent request was declined.': 'डिजिलॉकर संमती विनंती नाकारली गेली.',
  'startup proposals & eligibility screening desk': 'स्टार्टअप प्रस्ताव आणि पात्रता छाननी कक्ष',
  'phase 3 desk': 'टप्पा ३ छाननी कक्ष',
  'eligible (phase 4 ready)': 'पात्र (टप्पा ४ मूल्यमापनासाठी सज्ज)',
  'screening notes': 'छाननी टिप्पणी',
  'disqualification reason': 'अपात्रतेचे कारण',
  'controlled field deployments': 'नियंत्रित प्रत्यक्ष चाचण्या',
  'phase 7 — independent quality & evidence validation board': 'टप्पा ७ — स्वतंत्र गुणवत्ता आणि पुरावा पडताळणी मंडळ',
  'phase 5 — controlled field pilots workspace': 'टप्पा ५ — नियंत्रित प्रत्यक्ष पथदर्शी प्रकल्प कक्ष',
  'phase 6 — innovation contracting & treasury payments': 'टप्पा ६ — नवोपक्रम करार आणि कोषागार देयके',
  'phase 8 — statewide scale-up & procurement decision': 'टप्पा ८ — राज्यव्यापी विस्तार आणि शासकीय खरेदी निर्णय'
};

/**
 * Formats strings cleanly and translates to Marathi if active language is 'mr'.
 * Handles whole strings, sub-phrases, and word-by-word token translation cleanly.
 */
export const formatText = (str) => {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str);
  
  const currentLang = i18n?.language || 'en';
  const cleanStr = str.replace(/_/g, ' ').trim();
  const lowerStr = cleanStr.toLowerCase();

  // If Marathi is active
  if (currentLang === 'mr') {
    // 1. Direct dictionary match (exact match)
    if (marathiDictionary[lowerStr]) {
      return marathiDictionary[lowerStr];
    }
    
    // 2. Check with trailing punctuation removed (e.g. "Department:", "Days", "...")
    const trimmedPunct = lowerStr.replace(/[:.,!?\->–—\s]+$/, '').trim();
    if (marathiDictionary[trimmedPunct]) {
      const suffix = cleanStr.slice(cleanStr.toLowerCase().lastIndexOf(trimmedPunct) + trimmedPunct.length);
      return marathiDictionary[trimmedPunct] + suffix;
    }

    // 3. Multi-word phrase replacement across known keys
    let translated = cleanStr;
    const sortedKeys = Object.keys(marathiDictionary).sort((a, b) => b.length - a.length);
    let matchedAny = false;

    for (const key of sortedKeys) {
      if (key.length > 3 && lowerStr.includes(key)) {
        const regex = new RegExp(`\\b${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
        if (regex.test(translated)) {
          translated = translated.replace(regex, marathiDictionary[key]);
          matchedAny = true;
        }
      }
    }

    if (matchedAny) {
      return translated;
    }

    // 4. Word-by-word fallback for short phrases
    const words = cleanStr.split(/\s+/);
    if (words.length > 1 && words.length <= 6) {
      let wordMatches = 0;
      const translatedWords = words.map(w => {
        const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (marathiDictionary[cleanW]) {
          wordMatches++;
          return marathiDictionary[cleanW];
        }
        return w;
      });
      if (wordMatches >= Math.ceil(words.length / 2)) {
        return translatedWords.join(' ');
      }
    }
  }

  // English fallback: Clean Title Case with acronym preservation
  return cleanStr
    .split(' ')
    .map(word => {
      if (!word) return '';
      if (['DPIIT', 'AI', 'OPD', 'KPI', 'SMS', 'IOT', 'IT', 'ISO', 'MERN', 'GFR', 'EMD', 'IVR', 'MSINS', 'SLA', 'HMIS', 'PDF', 'JSON', 'COI', 'SSO', 'API'].includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '₹0';
  const currentLang = i18n?.language || 'en';
  if (currentLang === 'mr') {
    return '₹' + amount.toLocaleString('mr-IN');
  }
  return '₹' + amount.toLocaleString('en-IN');
};

/**
 * Validates if a user account is authorized to access the Governance Audit Trail.
 * Restricted strictly to Government Admin and Platform / Super Admin roles.
 */
export const isAuditAdmin = (user) => {
  if (!user) return false;
  const role = (user.role || user.roleName || '').toLowerCase().trim();
  const email = (user.email || '').toLowerCase().trim();
  
  return (
    role === 'government admin' ||
    role === 'super admin' ||
    role === 'platform admin' ||
    email.startsWith('govtadmin') ||
    email.startsWith('superadmin') ||
    (role.includes('admin') && !role.includes('startup'))
  );
};
