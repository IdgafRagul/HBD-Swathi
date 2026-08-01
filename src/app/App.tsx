import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

/* ══════════════════════════════════════════
   CONFIGURATION — edit these to personalise
   ══════════════════════════════════════════ */
const BIRTHDAY_NAME   = "Swathi❤️";
const BIRTHDAY_DATE = new Date(2000, 7, 2); // Mar 15 2000, 6:30 AM
const BIRTHDAY_SENDER = "Ragul";

/* ══════════════════════════════════════════
   PALETTE CONSTANTS
   ══════════════════════════════════════════ */
const P = {
  bg:       "#06060f",
  navy:     "#0c0820",
  purple:   "#1e1040",
  deepPurp: "#2a1660",
  violet:   "#7c3aed",
  rose:     "#c9956e",
  roseLight:"#e0b896",
  champ:    "#f0dfc0",
  champDim: "rgba(240,223,192,0.55)",
  gold:     "#d4a040",
  border:   "rgba(201,149,110,0.22)",
  borderDim:"rgba(201,149,110,0.10)",
};

/* ══════════════════════════════════════════
   GLOBAL KEYFRAMES (injected once)
   ══════════════════════════════════════════ */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: ${P.bg}; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(201,149,110,0.25); border-radius: 4px; }

  .fd  { font-family: 'Bodoni Moda', 'Georgia', serif; }
  .fb  { font-family: 'DM Sans', system-ui, sans-serif; }
  .fsc { font-family: 'Great Vibes', cursive; }

  @keyframes twinkle {
    0%,100% { opacity:.15; transform:scale(1); }
    50%      { opacity:.9;  transform:scale(1.5); }
  }
  @keyframes drift {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); }
    33%  { transform: translateY(-14px) translateX(6px) rotate(4deg); }
    66%  { transform: translateY(-6px) translateX(-5px) rotate(-3deg); }
    100% { transform: translateY(0) translateX(0) rotate(0deg); }
  }
  @keyframes flicker {
    0%,100% { transform: scaleY(1)   scaleX(1)    rotate(-3deg); }
    20%      { transform: scaleY(1.1) scaleX(0.9)  rotate(3deg); opacity:.9; }
    40%      { transform: scaleY(.92) scaleX(1.08) rotate(-1deg); }
    60%      { transform: scaleY(1.12) scaleX(.88) rotate(4deg); opacity:.85; }
    80%      { transform: scaleY(.95) scaleX(1.05) rotate(-2deg); }
  }
  @keyframes smokeUp {
    0%   { opacity:.5; transform:scaleX(1) translateY(0); }
    100% { opacity:0;  transform:scaleX(2.5) translateY(-32px); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.85); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes shimText {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes spin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes spinRev {
    from { transform:rotate(0deg); }
    to   { transform:rotate(-360deg); }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 18px rgba(201,149,110,.35); }
    50%      { box-shadow: 0 0 42px rgba(201,149,110,.75), 0 0 80px rgba(201,149,110,.2); }
  }
  @keyframes letterFloat {
    0%,100% { transform:translateY(0) rotate(-.5deg); }
    50%      { transform:translateY(-10px) rotate(.5deg); }
  }
  @keyframes ripple {
    0%   { transform:scale(1);   opacity:.7; }
    100% { transform:scale(2.4); opacity:0; }
  }
  @keyframes popIn {
    0%  { transform:scale(0) rotate(-15deg); opacity:0; }
    70% { transform:scale(1.1) rotate(3deg); }
    100%{ transform:scale(1) rotate(0deg); opacity:1; }
  }
  @keyframes petalFall {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity:1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity:0; }
  }
  @keyframes wishBlast {
    0%   { letter-spacing: -0.08em; opacity:0; }
    60%  { letter-spacing:  0.04em; opacity:1; }
    100% { letter-spacing:  0.01em; opacity:1; }
  }
`;

/* ══════════════════════════════════════════
   CONFETTI
   ══════════════════════════════════════════ */
function Confetti({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const cv = ref.current;
    const ctx = cv.getContext("2d")!;
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;

    const cols = [P.rose, P.champ, "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#60a5fa", "#fb923c"];
    const shapes = ["rect", "circle", "star"];

    const pts = Array.from({ length: 300 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * -cv.height * 1.2,
      w: Math.random() * 13 + 4,
      h: Math.random() * 7  + 3,
      col: cols[Math.floor(Math.random() * cols.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rot: Math.random() * 360,
      rv: (Math.random() - .5) * 10,
      vy: Math.random() * 3.5 + 1.2,
      vx: (Math.random() - .5) * 2.5,
      alpha: .85 + Math.random() * .15,
    }));

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of pts) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.col;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? p.w / 2 : p.w / 4;
            ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
        p.y += p.vy; p.x += p.vx; p.rot += p.rv;
        if (p.y > cv.height) { p.y = -20; p.x = Math.random() * cv.width; }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}
    />
  );
}

/* ══════════════════════════════════════════
   STAR FIELD
   ══════════════════════════════════════════ */
function Stars() {
  const items = useRef(
    Array.from({ length: 110 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + .5,
      dur: Math.random() * 4 + 2,
      del: Math.random() * 6,
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {items.map(s => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top:  `${s.y}%`,
            width:  s.s,
            height: s.s,
            borderRadius: "50%",
            background: "#fff",
            animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MUSIC TOGGLE (floating)
   ══════════════════════════════════════════ */
function MusicBtn({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      style={{
        position: "fixed", bottom: 30, right: 30, zIndex: 1000,
        width: 58, height: 58, borderRadius: "50%",
        background: `linear-gradient(135deg, ${P.rose} 0%, #a0622a 100%)`,
        border: `1.5px solid rgba(201,149,110,.5)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "transform .25s",
        animation: "glowPulse 2.8s ease-in-out infinite",
        boxShadow: `0 0 28px rgba(201,149,110,.45)`,
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.13)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {playing
        ? <Volume2  size={22} color={P.bg} strokeWidth={2.2} />
        : <VolumeX  size={22} color={P.bg} strokeWidth={2.2} />}
      {playing && (
        <>
          <span style={{ position:"absolute", inset:-5,  borderRadius:"50%", border:"1.5px solid rgba(201,149,110,.35)", animation:"ripple 1.8s .0s ease-out infinite" }} />
          <span style={{ position:"absolute", inset:-12, borderRadius:"50%", border:"1px solid rgba(201,149,110,.18)",   animation:"ripple 1.8s .6s ease-out infinite" }} />
        </>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════
   SECTION DIVIDER
   ══════════════════════════════════════════ */
function Divider({ icon = "✦" }: { icon?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:20, padding:"0 10vw", margin:"8px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right, transparent, ${P.border}, transparent)` }} />
      <span style={{ color: P.rose, fontSize: 13, opacity:.7 }}>{icon}</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right, transparent, ${P.border}, transparent)` }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   § 1  ENVELOPE LANDING
   ══════════════════════════════════════════ */
function EnvelopeLanding({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<"idle"|"hover"|"opening"|"risen"|"exit">("idle");

  const handleClick = () => {
    if (phase !== "idle" && phase !== "hover") return;
    setPhase("opening");
    setTimeout(() => setPhase("risen"), 1600);
    setTimeout(() => { setPhase("exit"); setTimeout(onOpen, 800); }, 3000);
  };

  const flapped = phase === "opening" || phase === "risen" || phase === "exit";
  const letterUp = phase === "risen" || phase === "exit";

  return (
    <div
      className="fb"
      style={{
        minHeight: "100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        background: `radial-gradient(ellipse at 50% 40%, #1a0f35 0%, #0c0820 45%, ${P.bg} 100%)`,
        position:"relative", overflow:"hidden",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity .8s ease",
      }}
    >
      <Stars />

      {/* Ambient glows */}
      <div style={{ position:"absolute", top:"15%", left:"12%", width:320, height:320, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(124,58,237,.15), transparent 70%)", filter:"blur(50px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"18%", right:"10%", width:280, height:280, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(201,149,110,.1), transparent 70%)", filter:"blur(50px)", pointerEvents:"none" }} />

      {/* Pre-text */}
      <p className="fb" style={{
        color: P.champDim, letterSpacing:"0.38em", fontSize:11,
        textTransform:"uppercase", marginBottom: 52,
        animation: "fadeUp .9s .3s both",
      }}>
        ✦ &nbsp; You have received a special message &nbsp; ✦
      </p>

      {/* Envelope */}
      <div
        onClick={handleClick}
        onMouseEnter={() => phase === "idle" && setPhase("hover")}
        onMouseLeave={() => phase === "hover" && setPhase("idle")}
        style={{
          width: 400, height: 260, position:"relative",
          cursor: flapped ? "default" : "pointer",
          transform: phase === "hover" ? "translateY(-8px) scale(1.03)" : "none",
          transition: "transform .4s cubic-bezier(.25,.46,.45,.94)",
          perspective: 1400,
        }}
      >
        {/* Body */}
        <div style={{
          position:"absolute", inset:0, borderRadius:16,
          background:`linear-gradient(158deg, #261650 0%, #1a0f35 60%, #110b22 100%)`,
          border:`1.5px solid ${P.border}`,
          boxShadow:`0 30px 80px rgba(0,0,0,.7), 0 0 60px rgba(124,58,237,.06)`,
          overflow:"hidden",
        }}>
          {/* V-folds */}
          <div style={{ position:"absolute", bottom:0, left:0, borderLeft:"200px solid transparent", borderBottom:"130px solid rgba(201,149,110,.06)" }} />
          <div style={{ position:"absolute", bottom:0, right:0, borderRight:"200px solid transparent", borderBottom:"130px solid rgba(201,149,110,.09)" }} />
          {/* Horizontal line */}
          <div style={{ position:"absolute", top:"53%", left:0, right:0, height:1, background:`linear-gradient(to right, transparent, ${P.border}, transparent)` }} />
          {/* Address lines */}
          <div style={{ position:"absolute", bottom:40, left:36, display:"flex", flexDirection:"column", gap:5 }}>
            {[80,56,68].map((w,i) => (
              <div key={i} style={{ width:w, height:2, borderRadius:2, background:`rgba(201,149,110,${.12 + i*.04})` }} />
            ))}
          </div>
          {/* Wax seal */}
          <div style={{
            position:"absolute", bottom:24, right:36,
            width:54, height:54, borderRadius:"50%",
            background:"radial-gradient(circle at 38% 35%, #e8c090, #c9956e, #8a4a1a)",
            boxShadow:`0 0 28px rgba(201,149,110,.6), inset 0 2px 5px rgba(255,255,255,.22)`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span className="fd" style={{ color:P.bg, fontSize:20, fontWeight:900, lineHeight:1 }}>✦</span>
          </div>
        </div>

        {/* Flap (top half) — folds back */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:148,
          transformOrigin:"top center",
          transformStyle:"preserve-3d",
          transition:"transform 1.5s cubic-bezier(.4,0,.2,1)",
          transform: flapped
            ? "perspective(1400px) rotateX(-180deg)"
            : "perspective(1400px) rotateX(0deg)",
          zIndex: flapped ? 0 : 6,
        }}>
          {/* Front face */}
          <div style={{
            position:"absolute", inset:0, backfaceVisibility:"hidden",
            borderRadius:"16px 16px 0 0", overflow:"hidden",
            background:`linear-gradient(170deg, #362075 0%, #261650 60%, #1a0f35 100%)`,
            border:`1.5px solid ${P.border}`, borderBottom:"none",
          }}>
            <div style={{ width:0, height:0, margin:"0 auto",
              borderLeft:"200px solid transparent",
              borderRight:"200px solid transparent",
              borderTop:"138px solid rgba(201,149,110,.13)" }} />
          </div>
          {/* Back face (visible when flipped) */}
          <div style={{
            position:"absolute", inset:0, backfaceVisibility:"hidden",
            transform:"rotateX(180deg)",
            background:`linear-gradient(160deg, #261650 0%, #1a0f35 100%)`,
            borderRadius:"16px 16px 0 0",
          }} />
        </div>

        {/* Letter card rising from envelope */}
        <div style={{
          position:"absolute", left:20, right:20, height:210,
          borderRadius:10,
          background:"linear-gradient(160deg, #f5e8d0 0%, #ede0c2 55%, #e5d4b0 100%)",
          bottom: letterUp ? 80 : 14,
          opacity: flapped ? 1 : 0,
          transition:"bottom 1.3s cubic-bezier(.2,.8,.3,1) .4s, opacity .4s .2s",
          zIndex:4,
          boxShadow:"0 -12px 40px rgba(201,149,110,.35), 0 8px 24px rgba(0,0,0,.4)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          <p className="fd" style={{ color:"#1e1040", fontSize:13, fontWeight:400, letterSpacing:"0.2em", opacity:.6 }}>A message for you</p>
          <p className="fsc" style={{ color:"#1e1040", fontSize:32, lineHeight:1.2 }}>Happy Birthday, {BIRTHDAY_NAME}!</p>
          <p className="fb" style={{ color:"rgba(30,16,64,.45)", fontSize:11, letterSpacing:"0.18em" }}>✦ tap to celebrate ✦</p>
        </div>
      </div>

      {phase === "idle" || phase === "hover" ? (
        <p className="fb" style={{
          marginTop:36, color:"rgba(201,149,110,.35)", fontSize:12,
          letterSpacing:"0.28em", textTransform:"uppercase",
          animation:"fadeUp 1s .8s both",
        }}>
          Click the envelope to open
        </p>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════
   § 2  BIRTHDAY WISH HERO
   ══════════════════════════════════════════ */
function WishHero() {
  const floaters = ["🌸","✨","🎊","💜","🥂","⭐","🌹","🎀","💫","🪄"];

  return (
    <section style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"80px 24px", position:"relative", overflow:"hidden",
    }}>
      {/* Spinning rings */}
      {[520, 360, 220].map((d, i) => (
        <div key={i} style={{
          position:"absolute", width:d, height:d, borderRadius:"50%",
          border:`1px ${i===1 ? "solid" : "dashed"} rgba(201,149,110,${.07 + i*.03})`,
          animation:`${i%2===0 ? "spin" : "spinRev"} ${22 + i*10}s linear infinite`,
          pointerEvents:"none",
        }} />
      ))}

      {/* Ambient glow */}
      <div style={{
        position:"absolute", width:700, height:500, borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(124,58,237,.1) 0%, transparent 70%)",
        filter:"blur(70px)", pointerEvents:"none",
      }} />

      {/* Floating emoji */}
      {floaters.map((e, i) => (
        <div key={i} style={{
          position:"absolute", fontSize:20 + (i%3)*8,
          left:`${5 + i*9}%`, top:`${8 + (i%5)*16}%`,
          opacity:.25, userSelect:"none",
          animation:`drift ${4 + i*.5}s ${i*.4}s ease-in-out infinite`,
        }}>{e}</div>
      ))}

      <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:800 }}>
        <p className="fb" style={{
          color: P.rose, letterSpacing:"0.42em", fontSize:11, textTransform:"uppercase",
          marginBottom:32, animation:"fadeUp .8s .1s both", opacity:0,
        }}>
          ✦ &nbsp; A Very Special Occasion &nbsp; ✦
        </p>

        <h1
          className="fd"
          style={{
            fontSize:"clamp(40px,8vw,90px)", fontWeight:900, lineHeight:1.05,
            marginBottom:14, animation:"fadeUp .9s .25s both", opacity:0,
            background:`linear-gradient(135deg, ${P.champ} 0%, ${P.rose} 40%, #b07aff 75%, ${P.champ} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
          }}
        >
          Happy Birthday
        </h1>
        <h2
          className="fsc"
          style={{
            fontSize:"clamp(58px,12vw,130px)", lineHeight:.95,
            marginBottom:40, animation:"fadeUp 1s .4s both", opacity:0,
            backgroundSize:"200% auto",
            background:`linear-gradient(90deg, ${P.rose} 0%, ${P.champ} 25%, ${P.roseLight} 50%, #d4a0f0 75%, ${P.rose} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            animation2:"shimText 4s linear infinite",
          } as any}
        >
          {BIRTHDAY_NAME}!
        </h2>

        <p className="fb" style={{
          color: P.champDim, fontSize:"clamp(15px,2vw,18px)", lineHeight:1.85,
          fontWeight:300, letterSpacing:".03em", maxWidth:580, margin:"0 auto",
          animation:"fadeUp 1s .6s both", opacity:0,
        }}>
          WISHING YOU A VERY HAPPY BIRTHDAY ❤️
MAY YOUR LIFE BE FULL OF LOVE AND PEACE.
MAY EACH DAY BRING SOMETHING BEAUTIFUL.
🎀 STAY STRONG, STAY KIND, STAY HAPPY.
BEST WISHES FOR THE YEAR AHEAD 🎉
        </p>

        <div style={{
          marginTop:52, display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap",
          animation:"fadeUp 1s .8s both", opacity:0,
        }}>
          {["🌹 Cherished", "✨ Radiant", "🥂 Celebrated", "💜 Adored"].map(t => (
            <span key={t} className="fb" style={{
              padding:"9px 22px", borderRadius:40,
              border:`1px solid ${P.border}`,
              background:"rgba(201,149,110,.06)",
              color:P.rose, fontSize:13, letterSpacing:".08em",
              transition:"all .2s",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   § 3  COUNTDOWN
   ══════════════════════════════════════════ */
function getCountdown() {
  const now = new Date();
  const ms  = Math.max(0, now.getTime() - BIRTHDAY_DATE.getTime());

  const years = Math.floor(ms / 31557600000); // 365.25 days per year
  const rem   = ms % 31557600000;

  return {
    years,
    days:  Math.floor(rem / 86400000),
    hours: Math.floor((rem % 86400000) / 3600000),
    mins:  Math.floor((rem % 3600000) / 60000),
    secs:  Math.floor((rem % 60000) / 1000),
  };
}

function Countdown() {
  const [t, setT] = useState(getCountdown);
  useEffect(() => {
    const id = setInterval(() => setT(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
  { v: t.years, l: "Years" },
  { v: t.days,  l: "Days" },
  { v: t.hours, l: "Hours" },
  { v: t.mins,  l: "Minutes" },
];

  return (
    <section style={{ padding:"80px 24px", textAlign:"center", position:"relative" }}>
      {/* bg stripe */}
      <div style={{
        position:"absolute", inset:0,
        background:`linear-gradient(180deg, transparent 0%, rgba(30,16,64,.18) 50%, transparent 100%)`,
        pointerEvents:"none",
      }} />

      <p className="fb" style={{ color:P.rose, letterSpacing:".38em", fontSize:11, textTransform:"uppercase", marginBottom:16, position:"relative" }}>
        ✦ &nbsp; The Big Day Is Coming &nbsp; ✦
      </p>
      <h2 className="fd" style={{ fontSize:"clamp(24px,4vw,38px)", color:P.champ, marginBottom:64, fontWeight:700, position:"relative" }}>
        Celebrating Every Moment Since You Arrived
      </h2>

      <div style={{ display:"flex", gap:"clamp(10px,3vw,32px)", justifyContent:"center", flexWrap:"wrap", position:"relative" }}>
        {units.map(({ v, l }, i) => (
          <div key={l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            {/* Outer glow ring */}
            <div style={{
              padding:3, borderRadius:22,
              background:`conic-gradient(from ${i*90}deg, ${P.rose}44, ${P.violet}44, transparent)`,
              animation:`spin ${8 + i*2}s linear infinite`,
            }}>
              <div style={{
                width:"clamp(90px,14vw,126px)",
                height:"clamp(90px,14vw,126px)",
                borderRadius:18,
                background:`linear-gradient(145deg, #261650 0%, #160e30 100%)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                position:"relative", overflow:"hidden",
              }}>
                {/* Inner shine */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"45%", background:"rgba(255,255,255,.03)", borderRadius:"18px 18px 50% 50%" }} />
                <span
                  className="fd"
                  key={v}
                  style={{
                    fontSize:"clamp(32px,5.5vw,54px)", fontWeight:900,
                    color: P.roseLight, letterSpacing:"-.02em",
                    fontVariantNumeric:"tabular-nums",
                    animation:"scaleIn .25s ease",
                  }}
                >
                  {String(v).padStart(2,"0")}
                </span>
              </div>
            </div>
            <span className="fb" style={{ color:"rgba(240,223,192,.38)", fontSize:11, letterSpacing:".25em", textTransform:"uppercase" }}>
              {l}
            </span>
          </div>
        ))}
      </div>

      {/* Inspirational line */}
      <p className="fd" style={{
        marginTop:52, color:"rgba(201,149,110,.4)", fontSize:"clamp(14px,2vw,18px)",
        fontStyle:"italic", position:"relative",
      }}>
        "Every day is a step closer to celebrating you."
      </p>
    </section>
  );
}

/* ══════════════════════════════════════════
   § 4  PHOTO MEMORIES — TAP TO REVEAL FLIP CARDS
   ══════════════════════════════════════════ */
const PHOTOS = [
  { src:"/photos/image1.jpeg", cap:"Playful Days",  sub:"Making ordinary moments count" },
  { src:"/photos/image4.jpeg", cap:"Candid & Carefree",  sub:"My favorite kind of moment" },
  { src:"/photos/image3.jpeg", cap:"Simple Joys",  sub:"Good food, Better company"  },
  { src:"/photos/image2.jpeg", cap:"Beautiful Journey",   sub:"Every step a blessing" },
];

function PhotoMemories() {
  const [revealed, setRevealed] = useState<number | null>(null);

  const handleTap = (i: number) => {
    setRevealed(prev => (prev === i ? null : i));
  };

  return (
    <section style={{ padding:"80px 24px", position:"relative" }}>
      <div style={{ textAlign:"center", marginBottom:56 }}>
        <p className="fb" style={{ color:P.rose, letterSpacing:".38em", fontSize:11, textTransform:"uppercase", marginBottom:14 }}>
          ✦ &nbsp; Memories &nbsp; ✦
        </p>
        <h2 className="fd" style={{ fontSize:"clamp(24px,4vw,38px)", color:P.champ, fontWeight:700 }}>
          A Walk Through Time
        </h2>
        <p className="fb" style={{ color:"rgba(201,149,110,.4)", fontSize:12, letterSpacing:".1em", marginTop:14 }}>
          ✦ tap a card to reveal ✦
        </p>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(4, 1fr)",
        gap:10,
        maxWidth:1140,
        margin:"0 auto",
      }}>
        {PHOTOS.map((p, i) => {
          const isRevealed = revealed === i;
          return (
            <div
              key={i}
              onClick={() => handleTap(i)}
              style={{
                position:"relative", aspectRatio:"3/4",
                cursor:"pointer",
                perspective: 1200,
              }}
            >
              <div style={{
                position:"relative", width:"100%", height:"100%",
                transformStyle:"preserve-3d",
                transition:"transform .8s cubic-bezier(.4,.2,.2,1)",
                transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
              }}>

                {/* FRONT — Tap to Reveal */}
                <div style={{
                  position:"absolute", inset:0, borderRadius:18,
                  backfaceVisibility:"hidden",
                  overflow:"hidden",
                  border:`1.5px solid ${P.border}`,
                  background:`linear-gradient(155deg, #362278 0%, #261650 60%, #1a0f35 100%)`,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  gap:10,
                  boxShadow:"0 8px 24px rgba(0,0,0,.4)",
                }}>
                  <span className="fd" style={{ color:P.rose, fontSize:26 }}>✦</span>
                  <p className="fb" style={{ color:"rgba(240,223,192,.55)", fontSize:11, letterSpacing:".2em", textTransform:"uppercase", textAlign:"center", padding:"0 12px" }}>
                    Tap to<br/>Reveal
                  </p>
                  <div style={{
                    position:"absolute", top:14, right:14,
                    width:28, height:28, borderRadius:"50%",
                    background:"rgba(201,149,110,.15)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border:`1px solid ${P.borderDim}`,
                  }}>
                    <span className="fd" style={{ color:P.rose, fontSize:11, fontWeight:700 }}>
                      {String(i+1).padStart(2,"0")}
                    </span>
                  </div>
                </div>

                {/* BACK — Actual Photo */}
                <div style={{
                  position:"absolute", inset:0, borderRadius:18,
                  backfaceVisibility:"hidden",
                  transform:"rotateY(180deg)",
                  overflow:"hidden",
                  border:`1.5px solid ${P.border}`,
                  boxShadow:"0 24px 48px rgba(0,0,0,.5), 0 0 30px rgba(201,149,110,.12)",
                }}>
                  <img
                    src={p.src}
                    alt={p.cap}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  />
                  <div style={{
                    position:"absolute", inset:0,
                    background:"linear-gradient(to top, rgba(6,6,15,.88) 0%, rgba(6,6,15,.2) 50%, transparent 100%)",
                  }} />
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0, padding:"20px 18px",
                  }}>
                    <p className="fd" style={{ color:P.champ, fontSize:15, fontWeight:600, marginBottom:3 }}>{p.cap}</p>
                    <p className="fb" style={{ color:"rgba(201,149,110,.65)", fontSize:11, letterSpacing:".12em" }}>{p.sub}</p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   § 5  BIRTHDAY CAKE
   ══════════════════════════════════════════ */
const CANDLE_PALETTE = [
  { top:"#c084fc", bot:"#7c3aed", flame:"#e879f9" },
  { top:"#f9a8d4", bot:"#ec4899", flame:"#fda4af" },
  { top:"#fde68a", bot:"#f59e0b", flame:"#fef08a" },
  { top:"#86efac", bot:"#22c55e", flame:"#bbf7d0" },
  { top:"#93c5fd", bot:"#3b82f6", flame:"#bfdbfe" },
  { top:"#fca5a5", bot:"#ef4444", flame:"#fecaca" },
];

function CandleEl({ blown, colors, onClick }: {
  blown: boolean;
  colors: typeof CANDLE_PALETTE[0];
  onClick: () => void;
}) {
  return (
    <div
      onClick={() => !blown && onClick()}
      title={blown ? "Blown out ✓" : "Click to blow!"}
      style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        cursor: blown ? "default" : "pointer",
        userSelect:"none", gap:0,
      }}
    >
      {/* Flame zone */}
      <div style={{ width:18, height:32, position:"relative", marginBottom:3 }}>
        {!blown ? (
          <>
            {/* Outer glow */}
            <div style={{
              position:"absolute", left:"50%", bottom:0,
              transform:"translateX(-50%)",
              width:16, height:30, borderRadius:"50% 50% 35% 35%",
              background:`radial-gradient(ellipse at 50% 85%, #fff 0%, ${colors.flame} 30%, #ff8c00 65%, transparent 90%)`,
              filter:"blur(.8px)",
              transformOrigin:"50% 100%",
              animation:"flicker .75s ease-in-out infinite",
            }} />
            {/* Inner bright core */}
            <div style={{
              position:"absolute", left:"50%", bottom:5,
              transform:"translateX(-50%)",
              width:6, height:12, borderRadius:"50%",
              background:"radial-gradient(ellipse, #fff 0%, rgba(255,250,200,.8) 100%)",
            }} />
            {/* Glow halo */}
            <div style={{
              position:"absolute", left:"50%", bottom:0,
              transform:"translateX(-50%)",
              width:28, height:28, borderRadius:"50%",
              background:`radial-gradient(circle, ${colors.flame}44 0%, transparent 70%)`,
              filter:"blur(4px)",
            }} />
          </>
        ) : (
          /* Smoke wisps */
          <div style={{
            position:"absolute", left:"50%", bottom:0,
            transform:"translateX(-50%)",
            width:3, height:"90%", borderRadius:4,
            background:`linear-gradient(to top, rgba(240,223,192,.35), transparent)`,
            animation:"smokeUp 1.4s ease-out infinite",
          }} />
        )}
      </div>

      {/* Candle body */}
      <div style={{
        width:17, height:66, borderRadius:"4px 4px 2px 2px",
        background:`linear-gradient(to right, ${colors.top}, ${colors.bot})`,
        position:"relative",
        boxShadow: blown ? "none" : `0 0 14px ${colors.top}66`,
        transition:"box-shadow .6s",
      }}>
        {/* Wick */}
        <div style={{ position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)", width:2, height:8, background:"#1a0f35", borderRadius:2, opacity:.9 }} />
        {/* Wax drip */}
        <div style={{ position:"absolute", top:0, left:"28%", width:4, height:12, borderRadius:"0 0 4px 4px", background:colors.top, opacity:.65 }} />
        {/* Horizontal bands */}
        {[22,42].map(y => (
          <div key={y} style={{ position:"absolute", top:y, left:0, right:0, height:1, background:"rgba(255,255,255,.18)" }} />
        ))}
      </div>
    </div>
  );
}

function CakeSection() {
  const [blown, setBlown]     = useState(Array(6).fill(false));
  const [confetti, setConfetti] = useState(false);
  const [popped, setPopped]   = useState(false);
  const allBlown = blown.every(Boolean);
  const count    = blown.filter(Boolean).length;

  const fireConfetti = useCallback(() => {
    setPopped(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 6500);
  }, []);

  const blowOne = (i: number) => {
    const next = [...blown]; next[i] = true; setBlown(next);
    if (next.every(Boolean)) fireConfetti();
  };

  const blowAll = () => {
    setBlown(Array(6).fill(true));
    fireConfetti();
  };

  const relight = () => { setBlown(Array(6).fill(false)); setPopped(false); };

  return (
    <section style={{ padding:"80px 24px 100px", textAlign:"center", position:"relative" }}>
      <Confetti active={confetti} />

      {/* bg glow */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:400,
        borderRadius:"50%", background:"radial-gradient(ellipse, rgba(124,58,237,.09) 0%, transparent 70%)",
        filter:"blur(80px)", pointerEvents:"none" }} />

      <p className="fb" style={{ color:P.rose, letterSpacing:".38em", fontSize:11, textTransform:"uppercase", marginBottom:14, position:"relative" }}>
        ✦ &nbsp; Make A Wish &nbsp; ✦
      </p>
      <h2 className="fd" style={{ fontSize:"clamp(24px,4vw,38px)", color:P.champ, marginBottom:12, fontWeight:700, position:"relative" }}>
        {allBlown ? "Your Wish Has Been Granted! ✨" : "Blow Out the Candles"}
      </h2>
      <p className="fb" style={{ color:"rgba(201,149,110,.45)", fontSize:13, letterSpacing:".06em", marginBottom:60, position:"relative" }}>
        {allBlown
          ? "May every dream bloom into reality 🌸"
          : `${count} of ${blown.length} candles blown · click each candle or use the button`}
      </p>

      {/* ── Cake assembly ── */}
      <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", position:"relative" }}>

        {/* Candles row */}
        <div style={{ display:"flex", gap:16, alignItems:"flex-end", marginBottom:0, position:"relative", zIndex:6 }}>
          {CANDLE_PALETTE.map((col, i) => (
            <CandleEl key={i} blown={blown[i]} colors={col} onClick={() => blowOne(i)} />
          ))}
        </div>

        {/* Tier 1 — top */}
        <div style={{
          width:230, height:68,
          background:`linear-gradient(155deg, #3d2880 0%, #2a1a60 60%, #1e1040 100%)`,
          borderRadius:"12px 12px 0 0",
          border:`1.5px solid ${P.border}`, borderBottom:"none",
          position:"relative", overflow:"hidden",
          boxShadow:"inset 0 -3px 12px rgba(0,0,0,.3)",
        }}>
          {/* Shine */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:"rgba(255,255,255,.04)", borderRadius:"12px 12px 40% 40%" }} />
          {/* Frosting drips */}
          {[.08,.2,.35,.52,.67,.8,.93].map((x,i) => (
            <div key={i} style={{ position:"absolute", top:-1, left:`${x*100}%`, width:9+i%3*4, height:12+i%3*6, borderRadius:"0 0 6px 6px", background:"rgba(240,223,192,.14)" }} />
          ))}
          {/* Decoration */}
          <div style={{ display:"flex", gap:16, justifyContent:"center", alignItems:"center", height:"100%", paddingTop:6 }}>
            {["✦","✦","✦"].map((c,i) => <span key={i} style={{ color:P.rose, fontSize:16, opacity:.75 }}>{c}</span>)}
          </div>
        </div>

        {/* Tier 2 — middle */}
        <div style={{
          width:300, height:80,
          background:`linear-gradient(155deg, #4a3090 0%, #362270 60%, #2a1a60 100%)`,
          border:`1.5px solid ${P.border}`, borderTop:"none", borderBottom:"none",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,.03)" }} />
          {[.05,.18,.32,.46,.6,.74,.88,.97].map((x,i) => (
            <div key={i} style={{ position:"absolute", top:-1, left:`${x*100}%`, width:10+i%4*3, height:14+i%4*5, borderRadius:"0 0 7px 7px", background:"rgba(240,223,192,.13)" }} />
          ))}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", paddingTop:4 }}>
            <p className="fd" style={{ color:"rgba(240,223,192,.75)", fontSize:17, letterSpacing:".22em", textTransform:"uppercase", fontWeight:600 }}>
              Happy Birthday
            </p>
          </div>
          {/* Pearls */}
          {Array.from({length:12}).map((_,i) => (
            <div key={i} style={{
              position:"absolute", bottom:10, left:`${4 + i*8.5}%`,
              width:7, height:7, borderRadius:"50%",
              background:"radial-gradient(circle at 35% 35%, #f5e8d0, #c9956e)",
              boxShadow:"0 0 4px rgba(201,149,110,.4)",
            }} />
          ))}
        </div>

        {/* Tier 3 — base */}
        <div style={{
          width:380, height:96,
          background:`linear-gradient(155deg, #5a3aa0 0%, #462c88 60%, #362278 100%)`,
          borderRadius:"0 0 0 0",
          border:`1.5px solid ${P.border}`, borderTop:"none",
          position:"relative", overflow:"hidden",
          boxShadow:"0 24px 60px rgba(0,0,0,.55)",
        }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,.025)" }} />
          {[.04,.16,.29,.42,.55,.68,.81,.94].map((x,i) => (
            <div key={i} style={{ position:"absolute", top:-1, left:`${x*100}%`, width:12+i%3*4, height:16+i%3*7, borderRadius:"0 0 8px 8px", background:"rgba(240,223,192,.12)" }} />
          ))}
          {/* Name */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", paddingTop:4 }}>
            <p className="fsc" style={{
              fontSize:44, lineHeight:1,
              background:`linear-gradient(135deg, ${P.champ}, ${P.roseLight}, ${P.champ})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              {BIRTHDAY_NAME}
            </p>
          </div>
          {/* Bottom pearl border */}
          {Array.from({length:16}).map((_,i) => (
            <div key={i} style={{
              position:"absolute", bottom:10, left:`${2 + i*6.3}%`,
              width:8, height:8, borderRadius:"50%",
              background:"radial-gradient(circle at 35% 35%, #f5e8d0, #b07030)",
              boxShadow:"0 0 5px rgba(212,160,64,.45)",
            }} />
          ))}
        </div>

        {/* Plate */}
        <div style={{ width:420, height:20, borderRadius:"0 0 10px 10px", background:`linear-gradient(to right, ${P.navy}, #2a1a60, ${P.navy})`, border:`1px solid ${P.borderDim}`, borderTop:"none" }} />
        <div style={{ width:460, height:12, borderRadius:"0 0 8px 8px", background:`linear-gradient(to right, ${P.bg}, #1a0f35, ${P.bg})`, border:`1px solid ${P.borderDim}`, borderTop:"none", opacity:.8 }} />
      </div>

      {/* Blow button / reset */}
      <div style={{ marginTop:52, display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
        {!allBlown ? (
          <button
            onClick={blowAll}
            style={{
              padding:"15px 42px", borderRadius:50, border:"none",
              background:`linear-gradient(135deg, ${P.rose} 0%, #8a4a1a 100%)`,
              color:P.bg, fontFamily:"'DM Sans', sans-serif",
              fontSize:14, fontWeight:600, letterSpacing:".18em", textTransform:"uppercase",
              cursor:"pointer", transition:"transform .2s, box-shadow .2s",
              boxShadow:`0 0 40px rgba(201,149,110,.55)`,
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform="scale(1.07)"; el.style.boxShadow="0 0 64px rgba(201,149,110,.75)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=""; el.style.boxShadow=`0 0 40px rgba(201,149,110,.55)`; }}
          >
            🎂 &nbsp;Blow All Candles!
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
            <div style={{ animation:"popIn .6s ease" }}>
              <p className="fsc" style={{ fontSize:46, color:P.roseLight, lineHeight:1 }}>Your wish is granted!</p>
              <p className="fb" style={{ color:"rgba(201,149,110,.5)", fontSize:13, marginTop:8, letterSpacing:".08em" }}>
                🎊 &nbsp; May every dream come true &nbsp; 🎊
              </p>
            </div>
            <button
              onClick={relight}
              style={{
                padding:"10px 28px", borderRadius:40,
                border:`1.5px solid ${P.border}`,
                background:"transparent", color:"rgba(201,149,110,.65)",
                fontFamily:"'DM Sans', sans-serif", fontSize:13,
                fontWeight:500, letterSpacing:".1em", cursor:"pointer",
                transition:"all .2s",
              }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=P.rose; el.style.color=P.rose; }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=P.border; el.style.color="rgba(201,149,110,.65)"; }}
            >
              ↺ &nbsp; Relight Candles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   § 6  MESSAGE LETTER
   ══════════════════════════════════════════ */
function MessageLetter() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section style={{ padding:"60px 24px 130px", display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
      <p className="fb" style={{ color:P.rose, letterSpacing:".38em", fontSize:11, textTransform:"uppercase", marginBottom:14 }}>
        ✦ &nbsp; A Letter From The Heart &nbsp; ✦
      </p>
      <h2 className="fd" style={{ fontSize:"clamp(24px,4vw,38px)", color:P.champ, marginBottom:60, fontWeight:700 }}>
        Words Written Just for You
      </h2>

      {/* Letter card */}
      <div
        style={{
          maxWidth:700, width:"100%", position:"relative",
          animation:"letterFloat 6s ease-in-out infinite",
        }}
      >
        {/* Shadow layer */}
        <div style={{ position:"absolute", inset:8, borderRadius:24, background:"rgba(201,149,110,.07)", filter:"blur(20px)", transform:"translateY(20px)" }} />

        {/* Paper */}
        <div style={{
          position:"relative",
          borderRadius:22,
          background:"linear-gradient(160deg, #f6ead4 0%, #eeddbc 45%, #e7d4a8 100%)",
          padding:"clamp(36px,7vw,68px) clamp(32px,6vw,64px)",
          boxShadow:`0 2px 0 rgba(255,255,255,.6) inset, 0 40px 80px rgba(0,0,0,.55), 0 0 60px rgba(201,149,110,.2)`,
          border:`1px solid rgba(201,149,110,.55)`,
        }}>
          {/* Paper lines */}
          {Array.from({length:14}).map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:80, right:36,
              top: 130 + i * 31,
              height:1,
              background:"rgba(30,16,64,.07)",
            }} />
          ))}

          {/* Corner ornaments */}
          {[["top",8,"left",20],["top",8,"right",20],["bottom",20,"left",20],["bottom",20,"right",20]].map(([yt,yv,xt,xv],i) => (
            <div key={i} style={{ position:"absolute", [yt as string]:yv, [xt as string]:xv, color:P.rose, fontSize:18, opacity:.4 }}>✦</div>
          ))}

          {/* Letterhead */}
          <div style={{ textAlign:"center", marginBottom:36, paddingBottom:24, borderBottom:"1px solid rgba(30,16,64,.1)" }}>
            <p className="fb" style={{ color:"rgba(30,16,64,.38)", fontSize:10, letterSpacing:".38em", textTransform:"uppercase", marginBottom:10 }}>
              Personal · Private · With Love
            </p>
            <p className="fd" style={{ color:"rgba(30,16,64,.45)", fontSize:13, fontStyle:"italic" }}>
              {BIRTHDAY_DATE.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
            </p>
          </div>

          {/* Salutation */}
          <p className="fsc" style={{ color:"#1e1040", fontSize:36, lineHeight:1.2, marginBottom:28 }}>
            My Dearest {BIRTHDAY_NAME},
          </p>

          {/* Body */}
          <div className="fb" style={{ color:"rgba(30,16,64,.78)", lineHeight:1.95, fontSize:16, display:"flex", flexDirection:"column", gap:20 }}>
            <p>

Happy Birthday!!

Today is all about celebrating you—the wonderful person who fills every room with warmth, kindness, and happiness. I hope this new chapter of your life brings you endless smiles, good health, peace, and all the success you've ever dreamed of.
            </p>
            <p>
I don't know what the future holds for us, but I know one thing with all my heart: the moments we've shared have become some of the most precious parts of my life.
They remind me that the most beautiful people often arrive unexpectedly and change my lives without even realizing it.
and I am truly grateful for you every single day. If life grants me one wish beyond today, it is this: I hope that when I reach the very last moments of my life, my heart will still be filled with the memories of you. Those memories will always be among the greatest blessings I have ever received.
            </p>

            <p>
On your special day, I wish you a lifetime of laughter, a heart full of peace, countless unforgettable adventures, and people who love and cherish you just as you deserve. May every sunrise bring you hope, every sunset bring you peace, and every dream lead you closer to happiness.

Once again,

Happy Birthday!!, Swathi.❤️🫂
            </p>
          </div>

          {/* Sign-off */}
          <div style={{ marginTop:44, paddingTop:28, borderTop:"1px solid rgba(30,16,64,.09)", textAlign:"right" }}>
            <p className="fd" style={{ color:"rgba(30,16,64,.5)", fontSize:15, fontStyle:"italic" }}>
              Yours, now and always —
            </p>
            <p className="fsc" style={{
              fontSize:40, marginTop:6, lineHeight:1.1,
              background:`linear-gradient(135deg, #8a4a1a, ${P.rose}, #c9956e)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              {BIRTHDAY_SENDER}
            </p>
          </div>

          {/* Wax seal */}
          <div style={{
            position:"absolute", bottom:-30, left:"50%", transform:"translateX(-50%)",
            width:60, height:60, borderRadius:"50%",
            background:"radial-gradient(circle at 38% 35%, #e8c090, #c9956e, #8a4a1a)",
            boxShadow:`0 0 30px rgba(201,149,110,.65), inset 0 2px 6px rgba(255,255,255,.25)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:`2px solid rgba(255,255,255,.18)`,
          }}>
            <span className="fd" style={{ color:P.bg, fontSize:22, fontWeight:900, lineHeight:1 }}>✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
   ══════════════════════════════════════════ */
export default function App() {
  const [scene, setScene]   = useState<"envelope"|"main">("envelope");
  const [muted, setMuted]   = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(m => !m);
  };

  const handleEnvelopeOpen = () => {
    setScene("main");
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(console.error);
    }
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Background music */}
      <audio ref={audioRef} src="/music.mp3" loop preload="none" />

      {/* Floating music toggle — only shown once landed on the main page,
          since music can't reliably play before that user interaction */}
      {scene === "main" && (
        <MusicBtn playing={!muted} onToggle={toggleMusic} />
      )}

      {scene === "envelope" ? (
        <EnvelopeLanding onOpen={handleEnvelopeOpen} />
      ) : (
        <div
          className="fb"
          style={{
            minHeight:"100vh", position:"relative",
            background:`radial-gradient(ellipse at 50% 0%, #1a0f35 0%, #0c0820 35%, ${P.bg} 70%)`,
          }}
        >
          <Stars />

          {/* Global ambient orbs */}
          <div style={{ position:"fixed", top:"8%",  right:"4%",  width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,.05) 0%, transparent 70%)", filter:"blur(80px)", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"fixed", bottom:"15%", left:"4%", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,149,110,.04) 0%, transparent 70%)", filter:"blur(80px)", pointerEvents:"none", zIndex:0 }} />

          <div style={{ position:"relative", zIndex:1 }}>
            <WishHero />
            <Divider />
            <Countdown />
            <Divider icon="🎂" />
            <PhotoMemories />
            <Divider icon="📸" />
            <CakeSection />
            <Divider icon="✉️" />
            <MessageLetter />

            <footer style={{ padding:"60px 24px 44px", textAlign:"center" }}>
              <p className="fb" style={{ color:"rgba(240,223,192,.15)", fontSize:11, letterSpacing:".32em", textTransform:"uppercase" }}>
                Made with love &nbsp;✦&nbsp; {new Date().getFullYear()}
              </p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}