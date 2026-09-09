import React from 'react';

export function KiteLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="kite-top" x1="15" y1="5" x2="85" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset="1" stopColor="#DDA15E" />
        </linearGradient>
        <linearGradient id="kite-bottom" x1="15" y1="40" x2="85" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14161D" />
          <stop offset="1" stopColor="#0E0E10" />
        </linearGradient>
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <g filter="url(#neon-glow)">
        {/* Top Left Facet */}
        <polygon points="50,10 50,45 20,45" fill="url(#kite-top)" opacity="1" />
        {/* Top Right Facet */}
        <polygon points="50,10 80,45 50,45" fill="url(#kite-top)" opacity="0.8" />
        
        {/* Bottom Left Facet */}
        <polygon points="20,45 50,45 50,90" fill="url(#kite-bottom)" opacity="1" />
        {/* Bottom Right Facet */}
        <polygon points="50,45 80,45 50,90" fill="url(#kite-bottom)" opacity="0.9" />
        
        {/* Geometric Framework Lines */}
        <line x1="20" y1="45" x2="80" y2="45" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        
        {/* Central Core */}
        <circle cx="50" cy="45" r="3.5" fill="#FF6B00" />
        <circle cx="50" cy="45" r="1.5" fill="#0E0E10" />
      </g>
    </svg>
  );
}
