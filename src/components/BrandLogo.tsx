import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BrandLogo({ className = "", size = 'md' }: BrandLogoProps) {
  const sizeMap = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 200 // Increased from 140 to accommodate the full design in login page
  };
  
  const s = sizeMap[size];
  
  const isLarge = size === 'lg' || size === 'xl';
  // Adjust viewBox so that we can fit text when it's large
  const viewBox = isLarge ? "0 -20 100 160" : "0 0 100 100";

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: s, height: isLarge ? s * 1.6 : s }}>
      <svg 
        viewBox={viewBox} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {isLarge && (
          <text x="50" y="-5" textAnchor="middle" className="fill-[#1C2C44] text-[4px] font-sans tracking-wide">
            GÜVEN | DENEYİM | SONUÇ
          </text>
        )}

        {/* Abacus Frame - Golden */}
        <rect x="25" y="25" width="50" height="50" rx="6" fill="none" className="stroke-[#B48B47]" strokeWidth="2.5" />
        
        {/* Abacus Lines - Navy */}
        <line x1="25" y1="36" x2="75" y2="36" className="stroke-[#1C2C44]" strokeWidth="1" />
        <line x1="25" y1="64" x2="75" y2="64" className="stroke-[#1C2C44]" strokeWidth="1" />
        
        {/* Abacus Top Beads */}
        <rect x="32" y="33" width="5" height="6" rx="2.5" className="fill-[#1C2C44]" />
        <rect x="42" y="33" width="5" height="6" rx="2.5" className="fill-[#1C2C44]" />
        <rect x="52" y="33" width="5" height="6" rx="2.5" className="fill-[#1C2C44]" />

        {/* Abacus Bottom Beads */}
        <rect x="62" y="61" width="5" height="6" rx="2.5" className="fill-[#1C2C44]" />
        <rect x="72" y="61" width="5" height="6" rx="2.5" className="fill-[#1C2C44]" />

        {/* P Stem - Navy */}
        <path d="M 55 35 L 55 65" className="stroke-[#1C2C44]" strokeWidth="7" strokeLinecap="square" />
        
        {/* O Shape - Navy */}
        <circle cx="42" cy="50" r="12" fill="none" className="stroke-[#1C2C44]" strokeWidth="7" />

        {/* P Loop - Navy */}
        <path d="M 55 35 C 75 35, 75 55, 55 55" fill="none" className="stroke-[#1C2C44]" strokeWidth="7" />

        {/* Shadow for Arrow - Navy to give 3D overlap effect */}
        <path d="M 15 65 L 35 48 L 48 62 L 76 22" fill="none" className="stroke-[#1C2C44]" strokeWidth="9" strokeLinecap="round" strokeLinejoin="miter" />
        {/* The Golden Arrow */}
        <path d="M 15 65 L 35 48 L 48 62 L 76 22" fill="none" className="stroke-[#B48B47]" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="miter" />
        
        {/* Arrow Head Shadow */}
        <polygon points="62,20 82,14 76,34" className="fill-[#1C2C44]" />
        {/* Arrow Head Golden */}
        <polygon points="65,20 80,16 75,31" className="fill-[#B48B47]" />

        {isLarge && (
          <>
            <text x="50" y="95" textAnchor="middle" className="fill-[#0f172a] text-[14px] font-sans font-bold tracking-tight">
              ORHAN POLAT
            </text>
            <text x="50" y="108" textAnchor="middle" className="fill-[#1e293b] text-[8px] font-sans font-medium">
              Mali Müşavir
            </text>
            <text x="50" y="117" textAnchor="middle" className="fill-[#475569] text-[5px] font-sans">
              Certified Public Accountant
            </text>
            <text x="50" y="132" textAnchor="middle" className="fill-[#64748b] text-[4px] font-sans tracking-widest">
              www.orhanpolat.com.tr
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
