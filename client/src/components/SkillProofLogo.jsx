import React from 'react';

/**
 * SkillProof AI — Official Brand Identity Logo
 * 
 * An original geometric emblem combining:
 * 1. Verified Skill Foundation (Terracotta dynamic rising facet)
 * 2. Career Growth & Elevation (Muted Gold ascending chevron)
 * 3. Cryptographic Verification & Proof (Warm Ivory center crest checkmark)
 * 4. Charcoal base structure (#252525)
 */
export const SkillProofSymbol = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-label="SkillProof AI Brand Symbol"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="sp_terracotta" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#D97A53" />
          <stop offset="100%" stopColor="#A8522E" />
        </linearGradient>

        <linearGradient id="sp_gold" x1="15%" y1="85%" x2="85%" y2="15%">
          <stop offset="0%" stopColor="#9C7E4A" />
          <stop offset="50%" stopColor="#B89B6A" />
          <stop offset="100%" stopColor="#D4BC91" />
        </linearGradient>

        <linearGradient id="sp_crest_border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C46A45" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#B89B6A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C46A45" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Outer Squircle Container in Charcoal Black #252525 */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="22"
        fill="#252525"
        stroke="#E8E1D7"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="21"
        stroke="url(#sp_crest_border)"
        strokeWidth="1.5"
      />

      {/* Left Rising Facet (Verifiable Skill Building - Terracotta) */}
      <path
        d="M24 68 L24 42 C24 35.5 28.5 31 35 31 L44 31 L34 51 L47 51 L24 68 Z"
        fill="url(#sp_terracotta)"
      />

      {/* Right Ascending Chevron (Career Growth Trajectory - Muted Gold) */}
      <path
        d="M76 32 L76 58 C76 64.5 71.5 69 65 69 L56 69 L66 49 L53 49 L76 32 Z"
        fill="url(#sp_gold)"
      />

      {/* Central Diamond Nexus & Sharp Verification Proof Check (Warm Ivory & Charcoal) */}
      <polygon
        points="50,22 64,39 50,56 36,39"
        fill="#FAF6EF"
        opacity="0.96"
      />
      <path
        d="M43 39 L48 44 L57 33"
        stroke="#252525"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SkillProofLogo = ({
  size = 36,
  theme = 'dark', // 'dark' (for dark sidebar / navy hero) or 'light' (for white topbar / light auth)
  subtitle = '',
  className = '',
}) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`skillproof-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <SkillProofSymbol size={size} />

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <div
          style={{
            fontSize: size >= 36 ? '1.25rem' : '1.1rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: isLight ? '#252525' : '#FFFFFF',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>SkillProof</span>
          <span style={{ color: '#C46A45' }}>AI</span>
        </div>

        {subtitle && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: isLight ? '#77736D' : '#B89B6A',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default SkillProofLogo;
