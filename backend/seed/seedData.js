const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Department = require('../models/Department');
const Challenge = require('../models/Challenge');
const Startup = require('../models/Startup');
const Proposal = require('../models/Proposal');
const Evaluation = require('../models/Evaluation');
const Pilot = require('../models/Pilot');
const Contract = require('../models/Contract');
const Validation = require('../models/Validation');
const ScaleUp = require('../models/ScaleUp');
const ScaleUpDecisionCase = require('../models/ScaleUpDecisionCase');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const seedPhase8 = require('./seedPhase8');

const seedDB = async (standalone = true) => {
  try {
    await connectDB();

    console.log('Clearing existing database collections across all 13 entities...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Challenge.deleteMany({});
    await Startup.deleteMany({});
    await Proposal.deleteMany({});
    await Evaluation.deleteMany({});
    await Pilot.deleteMany({});
    await Contract.deleteMany({});
    await Validation.deleteMany({});
    await ScaleUp.deleteMany({});
    await ScaleUpDecisionCase.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('1. Seeding Users (All 10 RBAC Roles across 5 Categories)...');
    const users = await User.insertMany([
      // Platform Role
      {
        name: 'Rajesh V. Sharma',
        email: 'superadmin@govinnovate.maharashtra.gov.in',
        role: 'Super Admin',
        department: 'State IT & Innovation Cell',
        organization: 'Government of Maharashtra',
        phone: '+91 98200 11001'
      },
      // Government Roles
      {
        name: 'Sanjay Khandare, IAS',
        email: 'govtadmin@maharashtra.gov.in',
        role: 'Government Admin',
        department: 'Maharashtra State Innovation Society',
        organization: 'Department of Skills & Innovation',
        phone: '+91 98200 22001'
      },
      {
        name: 'Dr. Radhakishan Pawar',
        email: 'health.officer@maharashtra.gov.in',
        role: 'Department Officer',
        department: 'Public Health Department',
        organization: 'Government of Maharashtra',
        phone: '+91 98200 22002'
      },
      {
        name: 'Smt. Suraj Mandhare, IAS',
        email: 'edu.officer@maharashtra.gov.in',
        role: 'Department Officer',
        department: 'School Education & Sports Department',
        organization: 'Government of Maharashtra',
        phone: '+91 98200 22003'
      },
      {
        name: 'Shri Vikas Patil',
        email: 'agri.officer@maharashtra.gov.in',
        role: 'Department Officer',
        department: 'Department of Agriculture',
        organization: 'Government of Maharashtra',
        phone: '+91 98200 22004'
      },
      {
        name: 'Milind Deshmukh',
        email: 'procurement.health@maharashtra.gov.in',
        role: 'Procurement Officer',
        department: 'Public Health Department',
        organization: 'State Finance & Procurement Desk',
        phone: '+91 98200 22005'
      },
      {
        name: 'Sunita Kulkarni',
        email: 'procurement.agri@maharashtra.gov.in',
        role: 'Procurement Officer',
        department: 'Department of Agriculture',
        organization: 'Agri Procurement Cell',
        phone: '+91 98200 22006'
      },
      // Evaluation Roles
      {
        name: 'Dr. Anand Sharma',
        email: 'anand.eval@iitb.ac.in',
        role: 'Technical/Domain Evaluator',
        organization: 'IIT Bombay / HealthTech Specialist',
        phone: '+91 98200 33001'
      },
      {
        name: 'Dr. Sneha Joshi',
        email: 'sneha.eval@vjti.ac.in',
        role: 'Technical/Domain Evaluator',
        organization: 'VJTI Mumbai / AgriTech & Sensor Specialist',
        phone: '+91 98200 33002'
      },
      {
        name: 'Vikramaditya Mane',
        email: 'vikram.cyber@cert-in-auditors.org',
        role: 'Cybersecurity Evaluator',
        organization: 'CERT-In Empaneled Auditor',
        phone: '+91 98200 33003'
      },
      {
        name: 'Dr. Rameshwar Naik',
        email: 'validator@msins.in',
        role: 'Independent Validator',
        organization: 'Maharashtra Quality Control Board',
        phone: '+91 98200 33004'
      },
      // Startup Roles (5 Admins + 5 Team Members)
      {
        name: 'Dr. Vikram Deshmukh',
        email: 'admin@healthai.in',
        role: 'Startup Admin',
        startupName: 'HealthAI Solutions Pvt Ltd',
        organization: 'HealthAI Solutions',
        phone: '+91 98200 44001'
      },
      {
        name: 'Aarti Patil',
        email: 'admin@mediflow.io',
        role: 'Startup Admin',
        startupName: 'MediFlow Systems',
        organization: 'MediFlow Systems',
        phone: '+91 98200 44002'
      },
      {
        name: 'Amitabh Roy',
        email: 'admin@agrisense.co.in',
        role: 'Startup Admin',
        startupName: 'AgriSense Technologies',
        organization: 'AgriSense Technologies',
        phone: '+91 98200 44003'
      },
      {
        name: 'Priya Shinde',
        email: 'admin@edusmart.in',
        role: 'Startup Admin',
        startupName: 'EduSmart Learning Labs',
        organization: 'EduSmart Learning Labs',
        phone: '+91 98200 44004'
      },
      {
        name: 'Rohan Kadam',
        email: 'admin@cropguard.co',
        role: 'Startup Admin',
        startupName: 'CropGuard Aero Solutions',
        organization: 'CropGuard Aero Solutions',
        phone: '+91 98200 44005'
      },
      {
        name: 'Neha Gupta',
        email: 'neha@healthai.in',
        role: 'Startup Team Member',
        startupName: 'HealthAI Solutions Pvt Ltd',
        organization: 'HealthAI Solutions',
        phone: '+91 98200 44006'
      },
      {
        name: 'Karan Malhotra',
        email: 'karan@mediflow.io',
        role: 'Startup Team Member',
        startupName: 'MediFlow Systems',
        organization: 'MediFlow Systems',
        phone: '+91 98200 44007'
      },
      {
        name: 'Siddharth Jadhav',
        email: 'siddharth@agrisense.co.in',
        role: 'Startup Team Member',
        startupName: 'AgriSense Technologies',
        organization: 'AgriSense Technologies',
        phone: '+91 98200 44008'
      },
      {
        name: 'Ananya More',
        email: 'ananya@edusmart.in',
        role: 'Startup Team Member',
        startupName: 'EduSmart Learning Labs',
        organization: 'EduSmart Learning Labs',
        phone: '+91 98200 44009'
      },
      {
        name: 'Gaurav Bhosale',
        email: 'gaurav@cropguard.co',
        role: 'Startup Team Member',
        startupName: 'CropGuard Aero Solutions',
        organization: 'CropGuard Aero Solutions',
        phone: '+91 98200 44010'
      },
      // Viewer Role
      {
        name: 'Pooja Chhabra',
        email: 'viewer@publicpolicy.org',
        role: 'Viewer',
        department: 'Public Policy Observer',
        organization: 'Center for Governance Studies',
        phone: '+91 98200 55001'
      }
    ]);

    console.log('2. Seeding 3 Government Departments...');
    const departments = await Department.insertMany([
      {
        name: 'Public Health Department, Government of Maharashtra',
        code: 'HEALTH',
        nodalOfficer: 'Dr. Radhakishan Pawar',
        contactEmail: 'health.officer@maharashtra.gov.in',
        annualInnovationBudget: 15000000,
        focusAreas: ['Hospital OPD Optimization', 'Tele-ICU Remote Diagnostics', 'AI Patient Triage', 'Supply Chain Tracking'],
        activeChallengesCount: 2
      },
      {
        name: 'Department of Agriculture, Government of Maharashtra',
        code: 'AGRI',
        nodalOfficer: 'Shri Vikas Patil',
        contactEmail: 'agri.officer@maharashtra.gov.in',
        annualInnovationBudget: 20000000,
        focusAreas: ['Smart Soil Health Testing', 'Drone Crop Pest Surveillance', 'Yield Forecasting', 'Water Management'],
        activeChallengesCount: 2
      },
      {
        name: 'School Education & Sports Department, Government of Maharashtra',
        code: 'EDU',
        nodalOfficer: 'Smt. Suraj Mandhare, IAS',
        contactEmail: 'edu.officer@maharashtra.gov.in',
        annualInnovationBudget: 12000000,
        focusAreas: ['Vernacular Marathi Adaptive AI Learning', 'Smart Classroom Analytics', 'Teacher Training Portals'],
        activeChallengesCount: 1
      }
    ]);

    console.log('3. Seeding 5 Realistic Startups with Profiles & Documents...');
    const startups = await Startup.insertMany([
      {
        name: 'HealthAI Solutions Pvt Ltd',
        dpiitNumber: 'DPIIT984321',
        dpiitRecognized: true,
        industryDomain: 'Healthcare & AI Diagnostics',
        technologies: ['Artificial Intelligence', 'Queue Optimization', 'Computer Vision', 'IoT Sensors'],
        foundingYear: 2021,
        teamSize: 28,
        location: 'Pune, Maharashtra',
        certifications: ['ISO 27001', 'HIPAA Compliant', 'CERT-In Audited'],
        previousGovtProjects: ['Pune Municipal Hospital OPD Trial', 'NHM Token Pilot'],
        matchScore: 94,
        matchJustification: [
          'Direct match for Healthcare domain and AI queue prediction requirement',
          'Proven OPD queue optimization technology deployed in 2 pilot sites',
          'Valid ISO 27001 and CERT-In cybersecurity audit certifications',
          'DPIIT Recognized startup eligible for public procurement relaxation'
        ],
        verificationStatus: 'DPIIT Verified',
        contactEmail: 'contact@healthai.in',
        documents: [
          { title: 'DPIIT Recognition Certificate', type: 'DPIIT Certificate', url: 'https://govinnovate.maharashtra.gov.in/docs/healthai_dpiit.pdf' },
          { title: 'CERT-In Cybersecurity Audit Certificate', type: 'Cyber Audit Report', url: 'https://govinnovate.maharashtra.gov.in/docs/healthai_cyberaudit.pdf' },
          { title: 'Income Tax Exemption 80-IAC Certificate', type: 'Tax Compliance', url: 'https://govinnovate.maharashtra.gov.in/docs/healthai_80iac.pdf' }
        ]
      },
      {
        name: 'MediFlow Systems',
        dpiitNumber: 'DPIIT772109',
        dpiitRecognized: true,
        industryDomain: 'HealthTech & Operations',
        technologies: ['Cloud Queue Management', 'SMS Alerts', 'Analytics', 'Patient Mobile App'],
        foundingYear: 2020,
        teamSize: 18,
        location: 'Mumbai, Maharashtra',
        certifications: ['ISO 9001', 'NABH IT Compliant'],
        previousGovtProjects: ['BMC Clinic Appointment System'],
        matchScore: 89,
        matchJustification: [
          'High match in patient workflow and queue management',
          'Strong mobile notification & SMS integration',
          'DPIIT Recognized startup'
        ],
        verificationStatus: 'DPIIT Verified',
        contactEmail: 'info@mediflow.io',
        documents: [
          { title: 'DPIIT Certificate of Recognition', type: 'DPIIT Certificate', url: 'https://govinnovate.maharashtra.gov.in/docs/mediflow_dpiit.pdf' },
          { title: 'ISO 9001 Quality Certification', type: 'Quality Certification', url: 'https://govinnovate.maharashtra.gov.in/docs/mediflow_iso.pdf' }
        ]
      },
      {
        name: 'AgriSense Technologies',
        dpiitNumber: 'DPIIT554312',
        dpiitRecognized: true,
        industryDomain: 'AgriTech & Remote Sensing',
        technologies: ['Satellite Imagery', 'AI Soil Testing', 'IoT Sensors', 'NIR Spectroscopy'],
        foundingYear: 2022,
        teamSize: 15,
        location: 'Nagpur, Maharashtra',
        certifications: ['ICAR Certified Soil Kit', 'NABL Accredited Test Lab'],
        previousGovtProjects: ['Mahagrid Soil Pilot'],
        matchScore: 95,
        matchJustification: [
          'Direct match for Soil Quality Monitoring Challenge',
          'Portable NIR spectroscopy hardware delivering soil test reports in under 15 minutes',
          'DPIIT Recognized startup'
        ],
        verificationStatus: 'DPIIT Verified',
        contactEmail: 'support@agrisense.co.in',
        documents: [
          { title: 'DPIIT Certificate', type: 'DPIIT Certificate', url: 'https://govinnovate.maharashtra.gov.in/docs/agrisense_dpiit.pdf' },
          { title: 'ICAR Evaluation & Soil Testing Approval', type: 'Technical Approval', url: 'https://govinnovate.maharashtra.gov.in/docs/agrisense_icar.pdf' },
          { title: 'Patent Grant — Portable NIR Soil Scanner', type: 'Intellectual Property', url: 'https://govinnovate.maharashtra.gov.in/docs/agrisense_patent.pdf' }
        ]
      },
      {
        name: 'EduSmart Learning Labs',
        dpiitNumber: 'DPIIT331908',
        dpiitRecognized: true,
        industryDomain: 'EdTech & Vernacular AI',
        technologies: ['NLP Speech Recognition', 'Marathi AI Voice Tutor', 'Adaptive Learning Engine'],
        foundingYear: 2021,
        teamSize: 22,
        location: 'Nashik, Maharashtra',
        certifications: ['NCERT Alignment Audit', 'ISO 27001'],
        previousGovtProjects: ['Zilla Parishad School Digital Literacy Pilot'],
        matchScore: 91,
        matchJustification: [
          'Tailored for Marathi language vernacular learning algorithms',
          'Proven deployment across 50 rural schools in Nashik district',
          'DPIIT Recognized startup'
        ],
        verificationStatus: 'DPIIT Verified',
        contactEmail: 'contact@edusmart.in',
        documents: [
          { title: 'DPIIT Certificate of Recognition', type: 'DPIIT Certificate', url: 'https://govinnovate.maharashtra.gov.in/docs/edusmart_dpiit.pdf' },
          { title: 'NCERT Curriculum Alignment Certificate', type: 'Domain Certificate', url: 'https://govinnovate.maharashtra.gov.in/docs/edusmart_ncert.pdf' }
        ]
      },
      {
        name: 'CropGuard Aero Solutions',
        dpiitNumber: 'DPIIT667432',
        dpiitRecognized: true,
        industryDomain: 'Agri-Drone & Precision Farming',
        technologies: ['Autonomous Drone Swarm', 'Thermal Hyperspectral AI', 'Edge Drone Compute'],
        foundingYear: 2023,
        teamSize: 12,
        location: 'Chhatrapati Sambhajinagar, Maharashtra',
        certifications: ['DGCA Drone Type Certified', 'QCI Empaneled'],
        previousGovtProjects: ['State Pest Survey Trial'],
        matchScore: 88,
        matchJustification: [
          'High precision crop pest identification via aerial hyperspectral imagery',
          'DGCA Type Certification held for agricultural drone operations',
          'DPIIT Recognized startup'
        ],
        verificationStatus: 'DPIIT Verified',
        contactEmail: 'info@cropguard.co',
        documents: [
          { title: 'DPIIT Certificate of Recognition', type: 'DPIIT Certificate', url: 'https://govinnovate.maharashtra.gov.in/docs/cropguard_dpiit.pdf' },
          { title: 'DGCA Agricultural Drone Type Approval', type: 'Regulatory Approval', url: 'https://govinnovate.maharashtra.gov.in/docs/cropguard_dgca.pdf' }
        ]
      }
    ]);

    console.log('4. Seeding 5 Innovation Challenges...');
    const challenges = await Challenge.insertMany([
      {
        title: 'AI Based Hospital OPD Queue Optimization',
        department: 'Public Health Department, Government of Maharashtra',
        problemDescription: 'High patient overcrowding and excessive waiting times at Outpatient Departments (OPD) in government district hospitals across Maharashtra, causing patient distress and staff burnout.',
        currentSituation: 'Average patient wait time from token generation to doctor consultation is 45 minutes.',
        targetBeneficiaries: 'Over 25,000 daily OPD patients across Maharashtra District Hospitals',
        expectedOutcome: 'Drastically lower patient waiting times, optimize doctor availability, and provide real-time patient queue updates on public LED displays & mobile alerts.',
        kpiMetrics: [
          { name: 'Average OPD Waiting Time', baselineValue: '45 minutes', targetValue: '< 20 minutes', currentValue: '18 minutes' },
          { name: 'Patient Satisfaction Rating', baselineValue: '42%', targetValue: '> 85%', currentValue: '89%' },
          { name: 'Daily OPD Patient Throughput', baselineValue: '120 patients/dr', targetValue: '> 200 patients/dr', currentValue: '215 patients/dr' }
        ],
        requiredTechnology: ['Artificial Intelligence', 'Real-Time Queue Analytics', 'Kiosk Integration', 'Cybersecurity Audit'],
        estimatedBudget: 1500000,
        pilotDurationDays: 90,
        eligibilityRequirements: ['DPIIT Recognized Startup', 'Healthcare Domain Experience', 'ISO 27001 or Security Certification'],
        status: 'Pilot Active',
        aiGeneratedPrompt: 'Outcome-based challenge aimed at reducing OPD queue waiting time below 20 minutes using non-invasive AI token prediction and live triage allocation.',
        securityRequirements: ['Patient Data Encryption (AES-256)', 'Local On-Premises/MeitY Cloud Deployment', 'CERT-In Empaneled Audit'],
        location: 'District Hospitals - Chhatrapati Sambhajinagar & Nashik'
      },
      {
        title: 'Smart Soil Health & Real Time Advisory for Farmers',
        department: 'Department of Agriculture, Government of Maharashtra',
        problemDescription: 'Delayed soil testing results preventing farmers from making timely fertilizer application decisions during sowing season.',
        currentSituation: 'Soil lab testing takes 14 to 21 days for paper report delivery.',
        targetBeneficiaries: '1.2 Million Cotton and Sugarcane Farmers in Marathwada & Vidarbha',
        expectedOutcome: 'Provide instant on-farm soil nutrition report within 15 minutes via portable IoT scanner.',
        kpiMetrics: [
          { name: 'Soil Test Turnaround Time', baselineValue: '14 days', targetValue: '< 30 minutes', currentValue: '12 minutes' },
          { name: 'Farmer Yield Increase', baselineValue: 'Baseline', targetValue: '+ 15%', currentValue: '+ 18%' }
        ],
        requiredTechnology: ['Spectroscopy', 'IoT Sensor', 'Vernacular Voice Advisory'],
        estimatedBudget: 2000000,
        pilotDurationDays: 120,
        eligibilityRequirements: ['DPIIT Recognized', 'AgriTech Product Traction'],
        status: 'Completed',
        aiGeneratedPrompt: 'Deploy instant soil testing hardware with crop advisory algorithms tuned for Maharashtra agro-climatic zones.',
        securityRequirements: ['Farmer Data Privacy', 'Offline Cloud Sync'],
        location: 'Yavatmal & Nanded Districts'
      },
      {
        title: 'AI Smart Classroom Analytics & Vernacular Learning',
        department: 'School Education & Sports Department, Government of Maharashtra',
        problemDescription: 'High student drop-out rate in rural primary schools due to language barriers and lack of adaptive learning tools.',
        currentSituation: 'Traditional rote learning without vernacular Marathi speech AI feedback.',
        targetBeneficiaries: '150,000 Students in Zilla Parishad Schools across Rural Maharashtra',
        expectedOutcome: 'Improve Marathi reading fluency and STEM comprehension through adaptive AI tutors on low-cost tablets.',
        kpiMetrics: [
          { name: 'Vernacular Reading Fluency', baselineValue: '48%', targetValue: '> 80%', currentValue: 'Not Started' },
          { name: 'Student Attendance Rate', baselineValue: '72%', targetValue: '> 90%', currentValue: 'Not Started' }
        ],
        requiredTechnology: ['NLP Speech Recognition', 'Marathi AI Engine', 'Tablet App'],
        estimatedBudget: 1200000,
        pilotDurationDays: 90,
        eligibilityRequirements: ['DPIIT Recognized Startup', 'EdTech Expertise'],
        status: 'Published',
        aiGeneratedPrompt: 'Develop tablet-based Marathi interactive learning tool with real-time pronunciation scoring.',
        securityRequirements: ['DPDP Act 2023 Child Privacy Compliance', 'Encrypted Student Metrics'],
        location: 'Zilla Parishad Schools - Satara & Pune'
      },
      {
        title: 'Tele-ICU Remote Vital Diagnostics for Rural Hospitals',
        department: 'Public Health Department, Government of Maharashtra',
        problemDescription: 'Shortage of specialized intensivists in rural sub-district hospitals leading to high emergency transfer delays.',
        currentSituation: 'Emergency patients wait 4-6 hours for specialist consultation during critical hours.',
        targetBeneficiaries: 'Rural populations in tribal & remote districts (Gadchiroli, Nandurbar)',
        expectedOutcome: 'Real-time multi-para monitor streaming to central command center with AI early warning alerts.',
        kpiMetrics: [
          { name: 'ICU Transfer Consultation Delay', baselineValue: '4 hours', targetValue: '< 15 minutes', currentValue: 'Pending Pilot' },
          { name: 'Critical Care Response Rate', baselineValue: '55%', targetValue: '> 95%', currentValue: 'Pending Pilot' }
        ],
        requiredTechnology: ['Tele-ICU Monitoring', 'Edge AI Diagnostics', '5G Video Gateway'],
        estimatedBudget: 2500000,
        pilotDurationDays: 90,
        eligibilityRequirements: ['DPIIT Recognized', 'Medical Device ISO 13485'],
        status: 'Pending Approval',
        aiGeneratedPrompt: 'Deploy remote ICU vitals streaming with predictive arrhythmia alert algorithm.',
        securityRequirements: ['HIPAA / DISHA Data Privacy', 'ISO 27001'],
        location: 'Sub-District Hospitals - Gadchiroli & Nandurbar'
      },
      {
        title: 'Drone-Based Crop Pest & Disease Early Warning System',
        department: 'Department of Agriculture, Government of Maharashtra',
        problemDescription: 'Pink Bollworm infestation in cotton crops identified after severe damage has occurred.',
        currentSituation: 'Manual field inspection covers less than 5% of cultivated acreage.',
        targetBeneficiaries: 'Cotton & Soybean Farmers in Akola & Amravati districts',
        expectedOutcome: 'Early detection of crop infestation 10 days prior to visible foliage destruction.',
        kpiMetrics: [
          { name: 'Pest Outbreak Early Detection Accuracy', baselineValue: '30%', targetValue: '> 90%', currentValue: 'Pending' },
          { name: 'Pesticide Usage Reduction', baselineValue: 'Baseline', targetValue: '- 40%', currentValue: 'Pending' }
        ],
        requiredTechnology: ['Drone Multispectral Camera', 'Computer Vision AI', 'Geospatial Heatmaps'],
        estimatedBudget: 1800000,
        pilotDurationDays: 60,
        eligibilityRequirements: ['DPIIT Recognized', 'DGCA Drone Clearance'],
        status: 'Published',
        aiGeneratedPrompt: 'Aerial multispectral drone survey paired with automated pest risk mapping dashboard.',
        securityRequirements: ['Geospatial Data Compliance', 'Secure Cloud Portal'],
        location: 'Cotton & Soybean Belt - Akola & Amravati'
      }
    ]);

    console.log('5. Seeding Applications & Proposals linking Startups to Challenges...');
    const proposals = await Proposal.insertMany([
      {
        challengeId: challenges[0]._id, // OPD Optimization
        startupId: startups[0]._id,   // HealthAI Solutions
        solutionTitle: 'SmartOPD — AI Triage and Computer Vision Queue Platform',
        technicalApproach: 'Deploys edge-AI cameras and smart kiosk tokens to dynamically estimate patient wait times, auto-route priority emergency cases, and broadcast queue status via WhatsApp and local hospital screens.',
        architectureSummary: 'Microservices architecture with local hospital server fallback, encrypted API gateways, and MeitY-approved cloud sync.',
        implementationTimelineDays: 75,
        proposedBudget: 1420000,
        teamOverview: 'Lead by Dr. V. Deshmukh (Ex-AIIMS Health Tech Specialist) and 5 Senior AI Engineers.',
        securityApproach: 'End-to-end AES-256 encryption, zero PII exposure to public APIs, compliance with Digital Personal Data Protection Act 2023.',
        aiSummary: 'SmartOPD leverages computer vision and predictive queue algorithms to cut hospital wait times by 60%. Meets all healthcare compliance standards.',
        aiRiskFlags: ['Requires stable local LAN connectivity in district hospital OPD blocks'],
        status: 'Selected for Pilot'
      },
      {
        challengeId: challenges[0]._id, // OPD Optimization
        startupId: startups[1]._id,   // MediFlow Systems
        solutionTitle: 'MediFlow Queue Cloud — Mobile Appointment & Token Stream',
        technicalApproach: 'Cloud-first token ticketing system with SMS updates and NABH compliant patient record integration.',
        architectureSummary: 'AWS MeitY cloud hosted Express API with Redis queue management.',
        implementationTimelineDays: 60,
        proposedBudget: 1380000,
        teamOverview: 'Lead developer Aarti Patil with 4 full stack engineers.',
        securityApproach: 'TLS 1.3 in transit, AES-256 at rest, OAuth2 user authentication.',
        aiSummary: 'Solid cloud queue manager with mobile SMS notifications. Lacks on-prem computer vision triage.',
        aiRiskFlags: ['Relies heavily on patient mobile SMS reception in hospital basements'],
        status: 'Shortlisted'
      },
      {
        challengeId: challenges[1]._id, // Soil Health
        startupId: startups[2]._id,   // AgriSense Technologies
        solutionTitle: 'AgriScan Instant Soil NIR Spectroscopy Kit',
        technicalApproach: 'Portable handheld NIR spectrograph paired with mobile AI model providing N-P-K and pH analysis in 12 minutes.',
        architectureSummary: 'Edge NIR hardware sensor connecting via Bluetooth BLE to offline mobile app with periodic cloud sync.',
        implementationTimelineDays: 90,
        proposedBudget: 1950000,
        teamOverview: 'Lead by Amitabh Roy (IIT Bombay Agri Alum) & 3 Agronomist specialists.',
        securityApproach: 'Encrypted BLE pairing, anonymous GPS plot tag data storage.',
        aiSummary: 'Revolutionary rapid soil testing device. Reduces testing time from 14 days to 12 minutes.',
        aiRiskFlags: ['Requires periodic sensor calibration against lab benchmark standards'],
        status: 'Selected for Pilot'
      },
      {
        challengeId: challenges[2]._id, // AI Smart Classroom
        startupId: startups[3]._id,   // EduSmart Learning Labs
        solutionTitle: 'BhashaAI — Marathi Vernacular Adaptive Tutor',
        technicalApproach: 'On-device speech recognition fine-tuned for regional Marathi dialects (Marathwada, Varhadi) offering real-time pronunciation scoring.',
        architectureSummary: 'Android app running ONNX quantized speech model locally without internet requirement.',
        implementationTimelineDays: 60,
        proposedBudget: 1150000,
        teamOverview: 'Priya Shinde with 6 NLP researchers and curriculum designers.',
        securityApproach: 'Strict DPDP compliance: no audio files uploaded to server; scoring metadata only.',
        aiSummary: 'Highly tailored vernacular speech engine ideal for rural Zilla Parishad schools.',
        aiRiskFlags: ['Requires hardware tablets with dual-array microphones for noisy classrooms'],
        status: 'Under Review'
      },
      {
        challengeId: challenges[4]._id, // Drone Crop Pest
        startupId: startups[4]._id,   // CropGuard Aero Solutions
        solutionTitle: 'AeroPest — Drone Swarm Multispectral Early Pest Scanner',
        technicalApproach: 'Autonomous multispectral drone flights capturing red-edge vegetation index to detect Pink Bollworm stress prior to leaf necrosis.',
        architectureSummary: 'Edge drone GPU image processing with automatic upload to Maharashtra AgriGIS portal.',
        implementationTimelineDays: 45,
        proposedBudget: 1750000,
        teamOverview: 'Rohan Kadam with DGCA certified pilots and geospatial data analysts.',
        securityApproach: 'Geofenced flight paths compliant with DGCA DigitalSky requirements.',
        aiSummary: 'Strong aerial computer vision pipeline with pre-calculated pest risk index maps.',
        aiRiskFlags: ['Flights restricted during heavy monsoon rainfall periods'],
        status: 'Submitted'
      }
    ]);

    console.log('6. Seeding Evaluations with Scores, Comments & COI Status...');
    const evaluations = await Evaluation.insertMany([
      {
        proposalId: proposals[0]._id, // SmartOPD
        evaluatorName: 'Dr. Anand Sharma',
        evaluatorRole: 'Technical/Domain Evaluator',
        coiDeclared: true,
        scores: {
          technicalFeasibility: 94,
          innovation: 95,
          expectedImpact: 96,
          scalability: 90,
          costEffectiveness: 88,
          security: 92,
          teamCapability: 95
        },
        weightedTotalScore: 92.5,
        comments: 'Exceptional technical proposal. Computer vision triage combined with hardware token kiosks addresses the core hospital bottleneck effectively.',
        recommendation: 'Recommend for Pilot'
      },
      {
        proposalId: proposals[0]._id, // SmartOPD Cyber Review
        evaluatorName: 'Vikramaditya Mane',
        evaluatorRole: 'Cybersecurity Evaluator',
        coiDeclared: true,
        scores: {
          technicalFeasibility: 92,
          innovation: 90,
          expectedImpact: 94,
          scalability: 92,
          costEffectiveness: 90,
          security: 98,
          teamCapability: 94
        },
        weightedTotalScore: 94.0,
        comments: 'Outstanding security architecture. AES-256 encryption with zero PII leakage meets all CERT-In guidelines.',
        recommendation: 'Recommend for Pilot'
      },
      {
        proposalId: proposals[1]._id, // MediFlow
        evaluatorName: 'Dr. Anand Sharma',
        evaluatorRole: 'Technical/Domain Evaluator',
        coiDeclared: true,
        scores: {
          technicalFeasibility: 86,
          innovation: 82,
          expectedImpact: 88,
          scalability: 85,
          costEffectiveness: 84,
          security: 86,
          teamCapability: 88
        },
        weightedTotalScore: 85.0,
        comments: 'Good cloud system, but lacks on-premises computer vision triage for illiterate patients who cannot use SMS.',
        recommendation: 'Recommend for Pilot'
      },
      {
        proposalId: proposals[2]._id, // AgriSense Soil
        evaluatorName: 'Dr. Sneha Joshi',
        evaluatorRole: 'Technical/Domain Evaluator',
        coiDeclared: true,
        scores: {
          technicalFeasibility: 95,
          innovation: 96,
          expectedImpact: 98,
          scalability: 92,
          costEffectiveness: 90,
          security: 90,
          teamCapability: 94
        },
        weightedTotalScore: 93.5,
        comments: 'Game-changer for Maharashtra farmers. ICAR validated NIR technology cuts testing turnaround from 14 days to 12 minutes.',
        recommendation: 'Recommend for Pilot'
      },
      {
        proposalId: proposals[3]._id, // EduSmart BhashaAI
        evaluatorName: 'Dr. Sneha Joshi',
        evaluatorRole: 'Technical/Domain Evaluator',
        coiDeclared: true,
        scores: {
          technicalFeasibility: 88,
          innovation: 90,
          expectedImpact: 92,
          scalability: 86,
          costEffectiveness: 85,
          security: 88,
          teamCapability: 90
        },
        weightedTotalScore: 88.0,
        comments: 'Strong vernacular speech processing. Offline tablet model ensures usability in rural areas without 4G connectivity.',
        recommendation: 'Recommend for Pilot'
      }
    ]);

    console.log('7. Seeding Active Pilot with Milestones, KPIs, and Evidence...');
    const activePilot = await Pilot.create({
      challengeId: challenges[0]._id, // OPD Optimization
      startupId: startups[0]._id,   // HealthAI Solutions
      proposalId: proposals[0]._id, // SmartOPD Proposal
      pilotTitle: 'Pilot Project: SmartOPD Queue Optimization in Chhatrapati Sambhajinagar District Hospital',
      location: 'District Hospital, Chhatrapati Sambhajinagar',
      startDate: '2026-06-01',
      endDate: '2026-08-30',
      totalBudget: 1420000,
      milestones: [
        {
          milestoneNumber: 1,
          title: 'Infrastructure & AI Kiosk Setup',
          deliverables: 'Installation of 4 Smart Token Kiosks, 2 OPD Display Screens, and Edge AI Gateway',
          dueDate: '2026-06-20',
          amount: 426000,
          status: 'Paid',
          evidenceUrl: 'https://govinnovate.maharashtra.gov.in/evidence/ms1_receipt.pdf',
          approvedBy: 'District Civil Surgeon, Sambhajinagar'
        },
        {
          milestoneNumber: 2,
          title: 'Controlled Live Trial (30 Days)',
          deliverables: 'Process 15,000 OPD patient tokens with waiting time target <25 minutes',
          dueDate: '2026-07-25',
          amount: 568000,
          status: 'Paid',
          evidenceUrl: 'https://govinnovate.maharashtra.gov.in/evidence/ms2_report.pdf',
          approvedBy: 'District Medical Officer'
        },
        {
          milestoneNumber: 3,
          title: 'Final Performance Target & Audit',
          deliverables: 'Demonstrate <20 minutes OPD wait time across 30 consecutive days with CERT-In cybersecurity audit clear certificate',
          dueDate: '2026-08-28',
          amount: 426000,
          status: 'Evidence Submitted',
          evidenceUrl: 'https://govinnovate.maharashtra.gov.in/evidence/ms3_audit.pdf',
          approvedBy: ''
        }
      ],
      kpiTracking: [
        { metricName: 'Average OPD Waiting Time', baseline: '45 minutes', target: '< 20 minutes', currentLive: '18 minutes', status: 'Target Achieved' },
        { metricName: 'Patient Satisfaction Score', baseline: '42%', target: '> 85%', currentLive: '89%', status: 'Target Achieved' },
        { metricName: 'Daily OPD Patient Throughput', baseline: '120 patients/dr', target: '> 200 patients/dr', currentLive: '215 patients/dr', status: 'Target Achieved' }
      ],
      pilotSuccessScore: 90.2,
      scoreBreakdown: {
        kpiAchievement: 95,
        technicalPerformance: 92,
        costEfficiency: 84,
        security: 90,
        scalability: 88
      },
      validationStatus: 'Pending Review',
      procurementRecommendation: 'Pending Decision',
      validatorNotes: 'Live pilot running in Chhatrapati Sambhajinagar District Hospital. Initial data demonstrates 60% reduction in OPD wait times.'
    });

    console.log('8. Seeding Completed Pilot with Validation Result & Scale Decision...');
    const completedPilot = await Pilot.create({
      challengeId: challenges[1]._id, // Soil Health
      startupId: startups[2]._id,   // AgriSense Technologies
      proposalId: proposals[2]._id, // AgriScan Soil Proposal
      pilotTitle: 'Pilot Project: Smart Soil Instant Scanner in Yavatmal & Nanded Districts',
      location: 'Yavatmal & Nanded Districts',
      startDate: '2026-03-01',
      endDate: '2026-06-30',
      totalBudget: 2000000,
      milestones: [
        {
          milestoneNumber: 1,
          title: 'Device Deployment & Field Training',
          deliverables: 'Deploy 50 NIR Portable Soil Scanners and train 100 Krishi Sevaks',
          dueDate: '2026-03-25',
          amount: 600000,
          status: 'Paid',
          evidenceUrl: 'https://govinnovate.maharashtra.gov.in/evidence/agri_ms1_deployment.pdf',
          approvedBy: 'District Agriculture Officer, Yavatmal'
        },
        {
          milestoneNumber: 2,
          title: '5,000 On-Farm Soil Tests Executed',
          deliverables: 'Conduct 5,000 instant soil tests with localized Marathi crop advisory',
          dueDate: '2026-05-15',
          amount: 800000,
          status: 'Paid',
          evidenceUrl: 'https://govinnovate.maharashtra.gov.in/evidence/agri_ms2_5000tests.pdf',
          approvedBy: 'Superintending Agriculturist, Marathwada Zone'
        },
        {
          milestoneNumber: 3,
          title: 'Final Impact Evaluation & ICAR Audit',
          deliverables: 'ICAR independent verification report confirming yield increase & cost savings',
          dueDate: '2026-06-25',
          amount: 600000,
          status: 'Paid',
          evidenceUrl: 'https://govinnovate.maharashtra.gov.in/evidence/agri_ms3_icar_audit.pdf',
          approvedBy: 'Maharashtra Quality Control Board'
        }
      ],
      kpiTracking: [
        { metricName: 'Soil Test Turnaround Time', baseline: '14 days', target: '< 30 minutes', currentLive: '12 minutes', status: 'Target Achieved' },
        { metricName: 'Farmer Yield Increase', baseline: 'Baseline', target: '+ 15%', currentLive: '+ 18%', status: 'Target Achieved' }
      ],
      pilotSuccessScore: 94.8,
      scoreBreakdown: {
        kpiAchievement: 98,
        technicalPerformance: 96,
        costEfficiency: 92,
          scalability: 96
        },
        validationStatus: 'Validated',
        procurementRecommendation: 'Scale Statewide',
        validatorNotes: 'Independent validation by Maharashtra Quality Control Board confirms soil test turnaround cut from 14 days to 12 minutes with 18% yield improvement across 5,000 test farms. Recommended for immediate statewide scaling via GeM Innovation Contract.'
      });

    console.log('9. Seeding Innovation Procurement Contracts (Phase 4 / Phase 8)...');
    const contracts = await Contract.insertMany([
      {
        contractNumber: 'CTR-MH-2026-HLTH-001',
        contractTitle: 'Innovation Procurement Agreement: SmartOPD Queue Optimization System',
        pilotId: activePilot._id,
        proposalId: proposals[0]._id,
        startupId: startups[0]._id,
        challengeId: challenges[0]._id,
        templateType: 'Standard Innovation Procurement Agreement',
        totalValue: 1420000,
        startDate: '2026-06-01',
        endDate: '2026-08-30',
        status: 'Milestones In Progress',
        milestones: activePilot.milestones.map(m => ({
          milestoneNumber: m.milestoneNumber,
          title: m.title,
          deliverables: m.deliverables,
          dueDate: m.dueDate,
          amount: m.amount,
          status: m.status === 'Paid' ? 'Disbursed' : (m.status === 'Evidence Submitted' ? 'Deliverable Submitted' : 'Pending'),
          evidenceUrl: m.evidenceUrl,
          approvedBy: m.approvedBy
        })),
        slaTerms: {
          uptimeSlaPct: 99.5,
          performanceTargetThreshold: '75% OPD wait time reduction (<20 mins)',
          penaltyClause: '0.5% deduction per 24h delay beyond milestone target'
        },
        dataGovernance: {
          governmentDataOwnership: '100% Patient logs & telemetry belong to Govt of Maharashtra.',
          startupIpProtection: 'Proprietary AI code & computer vision IP belong exclusively to Startup.',
          certInMandatory: true
        },
        amendmentHistory: []
      },
      {
        contractNumber: 'CTR-MH-2026-AGRI-002',
        contractTitle: 'Pilot Sandbox Scale Agreement: Smart Soil Instant Scanner',
        pilotId: completedPilot._id,
        proposalId: proposals[2]._id,
        startupId: startups[2]._id,
        challengeId: challenges[1]._id,
        templateType: 'Sandbox Pilot Scale Contract',
        totalValue: 2000000,
        startDate: '2026-03-01',
        endDate: '2026-06-30',
        status: 'Completed',
        milestones: completedPilot.milestones.map(m => ({
          milestoneNumber: m.milestoneNumber,
          title: m.title,
          deliverables: m.deliverables,
          dueDate: m.dueDate,
          amount: m.amount,
          status: 'Disbursed',
          evidenceUrl: m.evidenceUrl,
          approvedBy: m.approvedBy
        })),
        slaTerms: {
          uptimeSlaPct: 99.8,
          performanceTargetThreshold: '<15 min soil report turnaround',
          penaltyClause: 'Standard GFR SLA penalty'
        },
        dataGovernance: {
          governmentDataOwnership: '100% Soil telemetry data belongs to Maharashtra Agri Dept.',
          startupIpProtection: 'Proprietary NIR spectroscopy algorithm belongs to Startup.',
          certInMandatory: true
        },
        amendmentHistory: []
      }
    ]);

    console.log('10. Seeding Scale-Up Record...');
    const scaleUp = await ScaleUp.create({
      pilotId: completedPilot._id,
      challengeId: challenges[1]._id,
      startupId: startups[2]._id,
      departmentName: 'Department of Agriculture, Government of Maharashtra',
      scaleScope: 'Statewide 36 Districts Rollout for Cotton & Sugarcane Farmers',
      targetDistrictsCount: 36,
      targetBeneficiaries: '1.2 Million Farmers across Maharashtra',
      scalableUnits: 1500,
      totalApprovedBudget: 45000000,
      procurementMechanism: 'GeM Innovation Portal / MSINS State Sanction Order',
      gemIntegrationRef: 'GEM-MSINS-2026-AGRI-00982',
      approvalStatus: 'Sanctioned',
      sanctionedDate: '2026-08-30'
    });

    console.log('11. Seeding Notifications across Roles...');
    await Notification.insertMany([
      {
        recipientRole: 'Startup Admin',
        recipientEmail: 'admin@healthai.in',
        title: 'Pilot Milestone #2 Approved & Paid',
        message: 'Payment of ₹5,68,000 for Milestone #2 (Controlled Live Trial) has been credited to your bank account.',
        type: 'Milestone',
        entityId: activePilot._id.toString()
      },
      {
        recipientRole: 'Government Admin',
        recipientEmail: 'govtadmin@maharashtra.gov.in',
        title: 'New Innovation Challenge Published',
        message: 'School Education Department published "AI Smart Classroom Analytics & Vernacular Learning".',
        type: 'Challenge',
        entityId: challenges[2]._id.toString()
      },
      {
        recipientRole: 'Independent Validator',
        recipientEmail: 'validator@msins.in',
        title: 'Pilot Milestone #3 Evidence Ready for Review',
        message: 'HealthAI Solutions submitted final evidence for Milestone #3 in Sambhajinagar District Hospital pilot.',
        type: 'Evaluation',
        entityId: activePilot._id.toString()
      },
      {
        recipientRole: 'Technical Evaluator',
        recipientEmail: 'anand.eval@iitb.ac.in',
        title: 'Evaluation Assigned: Smart Traffic Optimization',
        message: 'Urban Development Department assigned proposal "FlowMatrix Adaptive Traffic" for Stage 2 Technical Scoring.',
        type: 'Evaluation',
        entityId: proposals[3]._id.toString()
      },
      {
        recipientRole: 'Procurement Officer',
        recipientEmail: 'procurement.health@maharashtra.gov.in',
        title: 'Scale-Up Sanction Order Dispatched',
        message: 'State Finance Cell sanctioned ₹4.50 Cr for Statewide Soil Scanner Rollout (AgriSense).',
        type: 'ScaleUp',
        entityId: scaleUp._id.toString()
      }
    ]);

    console.log('12. Seeding Audit Logs (Immutable Governance Trail)...');
    await AuditLog.insertMany([
      {
        action: 'CHALLENGE_CREATED',
        actorRole: 'Department Officer',
        actorName: 'Dr. Radhakishan Pawar (Public Health)',
        details: 'Created innovation challenge: AI-Driven Patient Triage & OPD Queue Management System',
        entityId: challenges[0]._id.toString()
      },
      {
        action: 'CHALLENGE_APPROVED',
        actorRole: 'Government Admin',
        actorName: 'Sanjay Khandare, IAS',
        details: 'Approved and published challenge with sandbox budget of ₹15,00,000',
        entityId: challenges[0]._id.toString()
      },
      {
        action: 'PROPOSAL_SUBMITTED',
        actorRole: 'Startup Admin',
        actorName: 'HealthAI Solutions Private Limited',
        details: 'Submitted technical proposal and pilot blueprint for SmartOPD Queue System',
        entityId: proposals[0]._id.toString()
      },
      {
        action: 'EVALUATION_COMPLETED',
        actorRole: 'Technical Evaluator',
        actorName: 'Dr. Anand Sharma (IIT Bombay)',
        details: 'Scored HealthAI Proposal: Technical Merit (29/30), Feasibility (23/25), Innovation (19/20). Total: 93/100',
        entityId: evaluations[0]._id.toString()
      },
      {
        action: 'PILOT_SANCTIONED',
        actorRole: 'Government Admin',
        actorName: 'Sanjay Khandare, IAS',
        details: 'Approved pilot sandbox deployment at Chhatrapati Sambhajinagar District Hospital for 90 days',
        entityId: activePilot._id.toString()
      },
      {
        action: 'MILESTONE_VERIFIED',
        actorRole: 'Department Officer',
        actorName: 'District Civil Surgeon, Sambhajinagar',
        details: 'Verified physical setup of 4 AI kiosks and display systems for Milestone #1',
        entityId: activePilot._id.toString()
      },
      {
        action: 'MILESTONE_PAID',
        actorRole: 'Procurement Officer',
        actorName: 'Milind Deshmukh (Finance Desk)',
        details: 'Approved Milestone #1 payment of ₹4,26,000 for HealthAI Solutions',
        entityId: activePilot._id.toString()
      },
      {
        action: 'SCALE_UP_SANCTIONED',
        actorRole: 'Procurement Officer',
        actorName: 'Sunita Kulkarni (Agri Procurement Cell)',
        details: 'Sanctioned statewide rollout order of ₹4,50,00,000 for 1,500 soil scanner units linked to GeM Ref: GEM-MSINS-2026-AGRI-00982',
        entityId: scaleUp._id.toString()
      }
    ]);

    console.log('\n13. Seeding Phase 7 Validation Reports & Phase 8 Scale-Up Decision Intelligence Cases...');
    await seedPhase8(false);

    const validationCount = await Validation.countDocuments();
    const caseCount = await ScaleUpDecisionCase.countDocuments();

    console.log('\n======================================================');
    console.log('   GovInnovate Database Seeding Completed Successfully!');
    console.log('======================================================');
    console.log(`Seeded Records Summary (All 13 Collections):`);
    console.log(`1.  Users: ${users.length} (Super Admin: 1, Govt: 6, Evaluators: 4, Startups: 10, Viewer: 1)`);
    console.log(`2.  Departments: ${departments.length}`);
    console.log(`3.  Startups: ${startups.length}`);
    console.log(`4.  Challenges: ${challenges.length}`);
    console.log(`5.  Proposals: ${proposals.length}`);
    console.log(`6.  Evaluations: ${evaluations.length}`);
    console.log(`7.  Pilots: 2 (Active: 1, Completed & Validated: 1)`);
    console.log(`8.  Contracts: ${contracts.length}`);
    console.log(`9.  Independent Validations: ${validationCount}`);
    console.log(`10. Scale-Up Sanctions: 1`);
    console.log(`11. Scale-Up Decision Cases (Phase 8): ${caseCount}`);
    console.log(`12. Notifications: 5`);
    console.log(`13. Audit Logs: 11`);
    console.log('------------------------------------------------------');
    console.log('Demo Account Credentials (Common Password: GovInnovate@2026):');
    console.log('1. Super Admin: superadmin@govinnovate.maharashtra.gov.in');
    console.log('2. Govt Admin: govtadmin@maharashtra.gov.in');
    console.log('3. Health Dept Officer: health.officer@maharashtra.gov.in');
    console.log('4. Agri Dept Officer: agri.officer@maharashtra.gov.in');
    console.log('5. Edu Dept Officer: edu.officer@maharashtra.gov.in');
    console.log('6. Health Procurement Officer: procurement.health@maharashtra.gov.in');
    console.log('7. Tech Evaluator: anand.eval@iitb.ac.in');
    console.log('8. Cyber Evaluator: vikram.cyber@cert-in-auditors.org');
    console.log('9. Independent Validator: validator@msins.in');
    console.log('10. Startup Admin (HealthAI): admin@healthai.in');
    console.log('11. Startup Admin (AgriSense): admin@agrisense.co.in');
    console.log('12. Viewer: viewer@publicpolicy.org');
    console.log('======================================================\n');

    if (standalone) {
      process.exit(0);
    }
    return {
      users: users.length,
      departments: departments.length,
      startups: startups.length,
      challenges: challenges.length,
      proposals: proposals.length,
      evaluations: evaluations.length,
      pilots: 2,
      contracts: contracts.length,
      validations: validationCount,
      scaleUps: 1,
      scaleDecisions: caseCount,
      notifications: 5,
      auditLogs: 11
    };
  } catch (error) {
    console.error('Database Seeding Error:', error);
    if (standalone) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  seedDB(true);
}

module.exports = seedDB;
