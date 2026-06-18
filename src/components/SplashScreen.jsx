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
        @keyframes bobRun    { from{left:-120px} to{left:calc(100% + 20px)} }
        @keyframes dustRun   { from{left:-100px} to{left:calc(100% - 20px)} }
        @keyframes armSwL    { from{transform:rotate(30deg)}  to{transform:rotate(-15deg)} }
        @keyframes armSwR    { from{transform:rotate(-30deg)} to{transform:rotate(15deg)}  }
        @keyframes legL      { from{transform:rotate(-18deg)} to{transform:rotate(14deg)}  }
        @keyframes legR      { from{transform:rotate(14deg)}  to{transform:rotate(-18deg)} }
        @keyframes puff      { 0%{opacity:.8;transform:scale(1)} 100%{opacity:0;transform:scale(2.4)} }
        @keyframes progBar   { from{width:0} to{width:100%} }
        @keyframes cloudDrift{ from{transform:translateX(0)} to{transform:translateX(18px)} }
        @keyframes rainbowShift {
          0%  { background-position: 0%   50% }
          50% { background-position: 100% 50% }
          100%{ background-position: 0%   50% }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(180deg,#1255a1 0%,#1a7fd4 55%,#4db8ff 100%)',
        overflow: 'hidden',
      }}>

        {/* Bande arc-en-ciel haut */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:'8px',
          background:'linear-gradient(90deg,#ff0000,#ff7700,#ffff00,#00cc00,#0066ff,#8800ff,#ff00cc)',
          backgroundSize:'200% 200%',
          animation:'rainbowShift 2s linear infinite',
        }} />

        {/* Soleil */}
        <div style={{
          position:'absolute', top:'18px', right:'50px',
          width:'48px', height:'48px', background:'#FFD700', borderRadius:'50%',
          boxShadow:'0 0 0 6px rgba(255,215,0,.2), 0 0 0 12px rgba(255,215,0,.1)',
        }} />

        {/* Nuage 1 */}
        <div style={{ position:'absolute', top:'18px', left:'70px', animation:'cloudDrift 3s ease-in-out infinite alternate' }}>
          <div style={{ position:'relative', width:'90px', height:'30px' }}>
            <div style={{ position:'absolute',width:'90px',height:'24px',background:'rgba(255,255,255,.22)',borderRadius:'40px',bottom:0 }} />
            <div style={{ position:'absolute',width:'44px',height:'36px',background:'rgba(255,255,255,.22)',borderRadius:'50%',bottom:0,left:'12px' }} />
            <div style={{ position:'absolute',width:'34px',height:'28px',background:'rgba(255,255,255,.22)',borderRadius:'50%',bottom:0,left:'36px' }} />
          </div>
        </div>

        {/* Nuage 2 */}
        <div style={{ position:'absolute', top:'44px', right:'100px', animation:'cloudDrift 4s ease-in-out infinite alternate-reverse' }}>
          <div style={{ position:'relative', width:'70px', height:'24px' }}>
            <div style={{ position:'absolute',width:'70px',height:'18px',background:'rgba(255,255,255,.18)',borderRadius:'40px',bottom:0 }} />
            <div style={{ position:'absolute',width:'34px',height:'28px',background:'rgba(255,255,255,.18)',borderRadius:'50%',bottom:0,left:'10px' }} />
          </div>
        </div>

        {/* Sol bleu foncé + bande arc-en-ciel au niveau du sol */}
        <div style={{ position:'absolute',bottom:'18px',left:0,right:0,height:'6px',
          background:'linear-gradient(90deg,#ff0000,#ff7700,#ffff00,#00cc00,#0066ff,#8800ff,#ff00cc)',
          backgroundSize:'200% 200%', animation:'rainbowShift 2s linear infinite', opacity:.7,
        }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'18px',background:'#0d47a1' }} />

        {/* Poussière */}
        <div style={{ position:'absolute', bottom:'24px', animation:'dustRun 3.4s linear forwards' }}>
          {[
            { w:12, h:12, l:0,   b:5,  d:.05 },
            { w:9,  h:9,  l:12,  b:12, d:.15 },
            { w:7,  h:7,  l:-5,  b:15, d:.25 },
          ].map((p,i) => (
            <div key={i} style={{
              position:'absolute', borderRadius:'50%',
              background:'rgba(255,255,255,.35)',
              width:p.w, height:p.h, left:p.l, bottom:p.b,
              animation:`puff .5s ease-out ${p.d}s infinite`,
            }} />
          ))}
        </div>

        {/* BOB L'ÉPONGE */}
        <div style={{ position:'absolute', bottom:'24px', animation:'bobRun 3.4s linear forwards' }}>
          <div style={{ position:'relative', width:'80px', height:'100px' }}>

            {/* Tête */}
            <div style={{
              position:'absolute', bottom:'76px', left:'8px',
              width:'64px', height:'52px',
              background:'#FFD700', borderRadius:'10px',
            }}>
              {/* Chapeau */}
              <div style={{ position:'absolute',top:'-26px',left:'14px',width:'36px',height:'20px',background:'#fff',borderRadius:'3px' }} />
              <div style={{ position:'absolute',top:'-8px',left:'6px',width:'52px',height:'9px',background:'#fff',borderRadius:'3px' }} />
              <div style={{ position:'absolute',top:'-8px',left:'6px',width:'52px',height:'4px',background:'#111' }} />
              {/* Œil gauche */}
              <div style={{ position:'absolute',width:'18px',height:'22px',background:'#fff',borderRadius:'50%',top:'8px',left:'8px' }}>
                <div style={{ position:'absolute',width:'10px',height:'10px',background:'#1a1a2e',borderRadius:'50%',top:'6px',left:'4px' }} />
                <div style={{ position:'absolute',width:'4px',height:'4px',background:'#fff',borderRadius:'50%',top:'7px',left:'8px' }} />
              </div>
              {/* Œil droit */}
              <div style={{ position:'absolute',width:'18px',height:'22px',background:'#fff',borderRadius:'50%',top:'8px',right:'8px' }}>
                <div style={{ position:'absolute',width:'10px',height:'10px',background:'#1a1a2e',borderRadius:'50%',top:'6px',left:'4px' }} />
                <div style={{ position:'absolute',width:'4px',height:'4px',background:'#fff',borderRadius:'50%',top:'7px',left:'8px' }} />
              </div>
              {/* Nez */}
              <div style={{ position:'absolute',width:'9px',height:'13px',background:'#E8A800',borderRadius:'3px',bottom:'14px',left:'50%',transform:'translateX(-50%)' }} />
              {/* Bouche */}
              <div style={{ position:'absolute',bottom:'5px',left:'10px',right:'10px',height:'11px',borderBottom:'3px solid #8B4513',borderRadius:'0 0 8px 8px' }}>
                <div style={{ position:'absolute',width:'8px',height:'8px',background:'#fff',border:'1.5px solid #ddd',bottom:0,left:'14px' }} />
                <div style={{ position:'absolute',width:'8px',height:'8px',background:'#fff',border:'1.5px solid #ddd',bottom:0,left:'24px' }} />
              </div>
            </div>

            {/* Corps éponge */}
            <div style={{ position:'absolute',bottom:'22px',left:'10px',width:'60px',height:'56px',background:'#FFD700',borderRadius:'8px' }}>
              {[
                { t:8,  l:8,  w:8, h:8 },
                { t:18, l:22, w:6, h:6 },
                { t:6,  r:10, w:9, h:9 },
                { b:10, l:14, w:5, h:5 },
                { b:8,  r:12, w:7, h:7 },
              ].map((p,i) => (
                <div key={i} style={{
                  position:'absolute', background:'#E8B800', borderRadius:'50%',
                  width:p.w, height:p.h, top:p.t, left:p.l, right:p.r, bottom:p.b,
                }} />
              ))}
              <div style={{ position:'absolute',bottom:'22px',left:0,right:0,height:'5px',background:'#5C2E00' }} />
              <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'22px',background:'#8B4513',borderRadius:'0 0 6px 6px' }} />
            </div>

            {/* Bras gauche */}
            <div style={{
              position:'absolute', width:'12px', height:'28px',
              background:'#FFD700', borderRadius:'5px',
              left:'-8px', bottom:'36px',
              transformOrigin:'top center',
              animation:'armSwL .35s ease-in-out infinite alternate',
            }} />

            {/* Bras droit + marteau */}
            <div style={{
              position:'absolute', width:'12px', height:'28px',
              background:'#FFD700', borderRadius:'5px',
              right:'-8px', bottom:'36px',
              transformOrigin:'top center',
              animation:'armSwR .35s ease-in-out infinite alternate',
            }}>
              <div style={{ position:'absolute', right:'-34px', top:'-8px' }}>
                <div style={{ width:'22px',height:'14px',background:'#444',borderRadius:'3px' }} />
                <div style={{ width:'4px',height:'20px',background:'#8B4513',borderRadius:'2px',margin:'0 auto' }} />
              </div>
            </div>

            {/* Jambe gauche */}
            <div style={{
              position:'absolute', width:'14px', height:'20px',
              background:'#111', borderRadius:'0 0 3px 3px',
              bottom:'2px', left:'16px',
              transformOrigin:'top center',
              animation:'legL .35s ease-in-out infinite alternate',
            }}>
              <div style={{ position:'absolute',width:'14px',height:'7px',background:'#fff',bottom:'15px',left:0 }} />
              <div style={{ position:'absolute',width:'20px',height:'8px',background:'#111',borderRadius:'2px 6px 6px 2px',bottom:0,left:'-3px' }} />
            </div>

            {/* Jambe droite */}
            <div style={{
              position:'absolute', width:'14px', height:'20px',
              background:'#111', borderRadius:'0 0 3px 3px',
              bottom:'2px', right:'16px',
              transformOrigin:'top center',
              animation:'legR .35s ease-in-out infinite alternate',
            }}>
              <div style={{ position:'absolute',width:'14px',height:'7px',background:'#fff',bottom:'15px',left:0 }} />
              <div style={{ position:'absolute',width:'20px',height:'8px',background:'#111',borderRadius:'6px 2px 2px 6px',bottom:0,right:'-3px' }} />
            </div>

          </div>
        </div>

        {/* Barre de progression arc-en-ciel */}
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'4px',background:'rgba(255,255,255,.15)' }}>
          <div style={{
            height:'100%',
            background:'linear-gradient(90deg,#ff0000,#ff7700,#ffff00,#00cc00,#0066ff,#8800ff)',
            animation:'progBar 3.4s linear forwards',
          }} />
        </div>

      </div>
    </>
  );
}
