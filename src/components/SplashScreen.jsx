import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 3800);
    return () => clearTimeout(t);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Comfortaa:wght@700&display=swap');

        @keyframes bobRun    { from { left: -160px } to { left: calc(100% + 30px) } }
        @keyframes dustRun   { from { left: -120px } to { left: calc(100% + 10px) } }
        @keyframes armSwL    { from { transform: rotate(25deg) } to { transform: rotate(-12deg) } }
        @keyframes armSwR    { from { transform: rotate(-25deg) } to { transform: rotate(12deg) } }
        @keyframes legL      { from { transform: rotate(-18deg) } to { transform: rotate(14deg) } }
        @keyframes legR      { from { transform: rotate(14deg) } to { transform: rotate(-18deg) } }
        @keyframes puff      { 0% { opacity: .65; transform: scale(1) } 100% { opacity: 0; transform: scale(2.4) } }
        @keyframes progBar   { from { width: 0 } to { width: 100% } }
        @keyframes cloudDrift{ from { transform: translateX(0) } to { transform: translateX(18px) } }
        @keyframes fadeSlide { from { opacity: 0; transform: translate(-50%, -46%) } to { opacity: 1; transform: translate(-50%, -54%) } }
        @keyframes pulse     { 0%, 100% { opacity: 1 } 50% { opacity: .45 } }
        @keyframes bodyBounce{ 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
        @keyframes blinkEye  { 0%, 90%, 100% { transform: scaleY(1) } 95% { transform: scaleY(0.08) } }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(180deg, #c9e8f8 0%, #e8f6ff 55%, #f0faff 100%)',
        overflow: 'hidden',
      }}>

        {/* ── SOLEIL ── */}
        <div style={{
          position: 'absolute', top: '22px', right: '64px',
          width: '46px', height: '46px',
          background: '#ffe066',
          borderRadius: '50%',
          boxShadow: '0 0 0 7px rgba(255,224,0,.16), 0 0 0 14px rgba(255,224,0,.07)',
        }} />

        {/* ── NUAGE 1 ── */}
        <div style={{ position: 'absolute', top: '20px', left: '72px', animation: 'cloudDrift 3.2s ease-in-out infinite alternate' }}>
          <div style={{ position: 'relative', width: '92px', height: '36px' }}>
            <div style={{ position: 'absolute', width: '92px', height: '22px', background: 'rgba(255,255,255,.85)', borderRadius: '40px', bottom: 0 }} />
            <div style={{ position: 'absolute', width: '46px', height: '38px', background: 'rgba(255,255,255,.85)', borderRadius: '50%', bottom: 0, left: '14px' }} />
            <div style={{ position: 'absolute', width: '34px', height: '28px', background: 'rgba(255,255,255,.85)', borderRadius: '50%', bottom: 0, left: '44px' }} />
          </div>
        </div>

        {/* ── NUAGE 2 ── */}
        <div style={{ position: 'absolute', top: '48px', right: '120px', animation: 'cloudDrift 4.1s ease-in-out infinite alternate-reverse' }}>
          <div style={{ position: 'relative', width: '68px', height: '26px' }}>
            <div style={{ position: 'absolute', width: '68px', height: '18px', background: 'rgba(255,255,255,.75)', borderRadius: '40px', bottom: 0 }} />
            <div style={{ position: 'absolute', width: '34px', height: '28px', background: 'rgba(255,255,255,.75)', borderRadius: '50%', bottom: 0, left: '10px' }} />
          </div>
        </div>

        {/* ── HORIZON / SOL ── */}
        <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, height: '22%', background: '#daeeff', borderTop: '2px solid #b8d8f0' }} />

        {/* ── TITRE SMARTBUILD ── */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -54%)',
          textAlign: 'center',
          animation: 'fadeSlide .7s ease .25s both',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <div style={{
            fontFamily: "'Comfortaa', cursive",
            fontSize: '48px', fontWeight: 700,
            color: '#1565c0',
            letterSpacing: '-1px', lineHeight: 1,
          }}>Smart</div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '48px', fontWeight: 700,
            color: '#0288d1',
            letterSpacing: '4px', lineHeight: 1,
            marginTop: '-4px',
          }}>BUILD</div>
          <div style={{
            fontSize: '11px', color: '#5b8db8',
            letterSpacing: '3.5px', marginTop: '8px',
            fontWeight: 500, textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}>Construction intelligence</div>
        </div>

        {/* ── POUSSIÈRE ── */}
        <div style={{ position: 'absolute', bottom: '44px', animation: 'dustRun 3.4s linear forwards' }}>
          {[
            { w: 12, h: 12, l: 0,   b: 5,  d: '.05s' },
            { w: 9,  h: 9,  l: 14,  b: 13, d: '.16s' },
            { w: 7,  h: 7,  l: -5,  b: 18, d: '.28s' },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%',
              background: 'rgba(150,200,230,.55)',
              width: p.w, height: p.h, left: p.l, bottom: p.b,
              animation: `puff .52s ease-out ${p.d} infinite`,
            }} />
          ))}
        </div>

        {/* ── BOB SVG ── */}
        <div style={{ position: 'absolute', bottom: '44px', animation: 'bobRun 3.4s linear forwards' }}>
          <svg
            width="100" height="148"
            viewBox="0 0 100 148"
            xmlns="http://www.w3.org/2000/svg"
            overflow="visible"
            style={{ display: 'block' }}
          >
            {/* === BRAS GAUCHE === */}
            <g style={{ animation: 'armSwL .34s ease-in-out infinite alternate', transformOrigin: '18px 72px' }}>
              <rect x="8" y="72" width="13" height="32" rx="6" fill="#FFD700" />
              <ellipse cx="14" cy="106" rx="7" ry="5.5" fill="#FFD700" />
            </g>

            {/* === BRAS DROIT === */}
            <g style={{ animation: 'armSwR .34s ease-in-out infinite alternate', transformOrigin: '82px 72px' }}>
              <rect x="79" y="72" width="13" height="32" rx="6" fill="#FFD700" />
              <ellipse cx="86" cy="106" rx="7" ry="5.5" fill="#FFD700" />
            </g>

            {/* === CORPS ÉPONGE === */}
            <g style={{ animation: 'bodyBounce .34s ease-in-out infinite' }}>
              <rect x="20" y="68" width="60" height="58" rx="9" fill="#FFD700" />
              {[
                { cx: 32, cy: 77, r: 5 },
                { cx: 54, cy: 82, r: 4 },
                { cx: 70, cy: 74, r: 5.5 },
                { cx: 27, cy: 98, r: 3.5 },
                { cx: 62, cy: 104, r: 4 },
                { cx: 44, cy: 96, r: 3 },
                { cx: 75, cy: 95, r: 3.5 },
              ].map((h, i) => (
                <ellipse key={i} cx={h.cx} cy={h.cy} rx={h.r} ry={h.r * .95} fill="#E8B800" opacity=".55" />
              ))}
              <line x1="20" y1="106" x2="80" y2="106" stroke="#5C2E00" strokeWidth="5" />
              <rect x="20" y="107" width="60" height="19" rx="0" fill="#7B3F10" />
              <rect x="20" y="119" width="60" height="7" rx="0" fill="#5e2e08" />
              <polygon points="50,74 45,85 50,82 55,85" fill="#cc0000" />
              <rect x="47" y="82" width="6" height="8" rx="2" fill="#cc0000" />
            </g>

            {/* === JAMBE GAUCHE === */}
            <g style={{ animation: 'legL .34s ease-in-out infinite alternate', transformOrigin: '34px 126px' }}>
              <rect x="25" y="126" width="16" height="18" rx="2" fill="#222" />
              <rect x="25" y="126" width="16" height="6" fill="white" />
              <rect x="20" y="138" width="24" height="8" rx="3" fill="#222" />
            </g>

            {/* === JAMBE DROITE === */}
            <g style={{ animation: 'legR .34s ease-in-out infinite alternate', transformOrigin: '66px 126px' }}>
              <rect x="59" y="126" width="16" height="18" rx="2" fill="#222" />
              <rect x="59" y="126" width="16" height="6" fill="white" />
              <rect x="56" y="138" width="24" height="8" rx="3" fill="#222" />
            </g>

            {/* === TÊTE === */}
            <rect x="18" y="18" width="64" height="54" rx="12" fill="#FFD700" />

            <ellipse cx="26" cy="56" rx="8" ry="5" fill="#ffb3b3" opacity=".6" />
            <ellipse cx="74" cy="56" rx="8" ry="5" fill="#ffb3b3" opacity=".6" />

            <g style={{ animation: 'blinkEye 3.5s ease-in-out infinite', transformOrigin: '37px 38px' }}>
              <ellipse cx="37" cy="38" rx="11" ry="14" fill="white" />
              <ellipse cx="40" cy="40" rx="7" ry="7" fill="#1a1a2e" />
              <ellipse cx="43" cy="37" rx="3" ry="3" fill="white" />
              <ellipse cx="34" cy="44" rx="2" ry="2" fill="white" opacity=".6" />
            </g>

            <g style={{ animation: 'blinkEye 3.5s ease-in-out infinite', animationDelay: '.12s', transformOrigin: '63px 38px' }}>
              <ellipse cx="63" cy="38" rx="11" ry="14" fill="white" />
              <ellipse cx="66" cy="40" rx="7" ry="7" fill="#1a1a2e" />
              <ellipse cx="69" cy="37" rx="3" ry="3" fill="white" />
              <ellipse cx="60" cy="44" rx="2" ry="2" fill="white" opacity=".6" />
            </g>

            <ellipse cx="50" cy="50" rx="5" ry="7" fill="#E8A800" />

            <path d="M30 61 Q50 74 70 61" stroke="#7B3F10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="39" y="62" width="9" height="8" rx="1.5" fill="white" stroke="#ddd" strokeWidth=".8" />
            <rect x="50" y="62" width="9" height="8" rx="1.5" fill="white" stroke="#ddd" strokeWidth=".8" />

            {/* === CASQUE D'INGÉNIEUR === */}
            <path d="M10 30 Q10 -4 50 -8 Q90 -4 90 30 Z" fill="#FF8C00" />
            <path d="M10 30 Q10 2 50 -2 Q90 2 90 30 Q70 24 50 22 Q30 24 10 30 Z" fill="#FFA726" />
            <rect x="6" y="26" width="88" height="10" rx="5" fill="#E65100" />
            <rect x="3" y="28" width="20" height="6" rx="3" fill="#BF360C" />
            <rect x="77" y="28" width="20" height="6" rx="3" fill="#BF360C" />
            <rect x="38" y="27" width="24" height="9" rx="3" fill="#FFD600" />
            <text x="50" y="34.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#BF360C" fontFamily="sans-serif">SB</text>
            <path d="M18 12 Q30 4 46 6" stroke="rgba(255,255,255,.45)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q10 -4 50 -8 Q90 -4 90 30" fill="none" stroke="#5D2E00" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ── POINTS DE CHARGEMENT ── */}
        <div style={{
          position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '11px', color: '#5b8db8', letterSpacing: '1.5px',
          whiteSpace: 'nowrap', fontFamily: 'sans-serif',
        }}>
          {[0, .2, .4].map((d, i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#0288d1',
              animation: `pulse 1s ease-in-out ${d}s infinite`,
            }} />
          ))}
          <span style={{ marginLeft: '4px' }}>Chargement en cours</span>
        </div>

        {/* ── BARRE DE PROGRESSION ── */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(2,136,209,.12)' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #0288d1, #29b6f6)',
            animation: 'progBar 3.4s linear forwards',
          }} />
        </div>

      </div>
    </>
  );
}
