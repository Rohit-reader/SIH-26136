import React from 'react';

export const MaharashtraEmblem = ({ className = "h-12 w-auto" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#D97706" stroke="#FFFFFF" strokeWidth="4"/>
    <circle cx="60" cy="60" r="48" fill="#0A2540" stroke="#FF9933" strokeWidth="2"/>
    {/* Rajmudra Lotus & Inscription Graphic Representation */}
    <path d="M60 20 L75 35 L60 50 L45 35 Z" fill="#FF9933"/>
    <text x="60" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="serif">प्रतिपच्चंद्रलेखेव</text>
    <text x="60" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="serif">वर्धिष्णुर्विश्ववंदिता</text>
    <text x="60" y="90" textAnchor="middle" fill="#FF9933" fontSize="8" fontWeight="bold" fontFamily="serif">महाराष्ट्र शासन</text>
  </svg>
);

export const AshokaEmblem = ({ className = "h-12 w-auto" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="120" rx="8" fill="none"/>
    <path d="M50 15 L62 40 L38 40 Z" fill="#D97706"/>
    <circle cx="50" cy="55" r="18" fill="#0A2540" stroke="#D97706" strokeWidth="3"/>
    <circle cx="50" cy="55" r="6" fill="#138808"/>
    <path d="M50 78 L70 85 L30 85 Z" fill="#0A2540"/>
    <text x="50" y="105" textAnchor="middle" fill="#0A2540" fontSize="10" fontWeight="bold">सत्यमेव जयते</text>
  </svg>
);

export const StartupIndiaBadge = ({ className = "h-8 w-auto" }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-emerald-800 text-xs font-semibold ${className}`}>
    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
    <span>DPIIT Recognized Startup</span>
  </div>
);
