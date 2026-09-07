import React from 'react';
import maharashtraLogo from '../assets/Government-of-Maharashtra.jpg';

export const MaharashtraEmblem = ({ className = "h-12 w-auto", style = {}, ...props }) => (
  <img 
    src={maharashtraLogo} 
    alt="Government of Maharashtra Official Seal" 
    className={`govt-emblem-img ${className}`}
    style={{
      objectFit: 'contain',
      borderRadius: '50%',
      display: 'inline-block',
      ...style
    }}
    {...props}
  />
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
