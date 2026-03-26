import { useState, useEffect, useRef, useCallback } from "react";

/*
  THEME: "Data Canvas"
  Concept: Clean, professional light-leaning dark portfolio with a data/analytics feel.
  - Hero: animated counting numbers + subtle chart-line background
  - Accent: teal/cyan (#0d9488) — data, charts, dashboards energy
  - Cards: smooth 3D tilt on hover
  - Scroll reveals: clean fade+lift
  - Sections: numbered like a report/notebook
  - Mouse parallax on hero
*/

const A  = "#0d9488";          // teal-600 — primary accent
const A1 = "rgba(13,148,136,0.1)";
const A2 = "rgba(13,148,136,0.22)";
const A3 = "rgba(13,148,136,0.45)";
const FG  = "#f0fdfa";
const FG2 = "rgba(240,253,250,0.58)";
const FG3 = "rgba(240,253,250,0.28)";
const BG0 = "#040d0c";
const BG1 = "#071210";
const BD  = "rgba(240,253,250,0.07)";
const BDH = "rgba(13,148,136,0.4)";
const SANS = "'Plus Jakarta Sans',system-ui,sans-serif";
const MONO = "'JetBrains Mono',monospace";

/* ── DATA ───────────────────────────────────────────────────── */
const ROLES = ["Data Analyst","Junior Data Analyst","Analyst"];

const SKILLS = [
  { cat:"Programming & Analysis", items:["Python","Pandas","NumPy","Matplotlib","Data Cleaning","EDA"] },
  { cat:"Databases",              items:["SQL","SELECT","WHERE","JOIN","GROUP BY","Sub Queries"] },
  { cat:"Data Visualization",     items:["Power BI","Interactive Dashboards","Charts","KPIs","Power Query","DAX"] },
  { cat:"Data Analysis",          items:["Exploratory Data Analysis","Business Insights","RFM Analysis","Time-Series Analysis","Customer Segmentation"] },
  { cat:"Tools",                  items:["MS Excel","Power BI Desktop","Jupyter Notebook","VS Code"] },
  { cat:"Soft Skills",            items:["Analytical Thinking","Problem Solving","Communication","Time Management","Attention to Detail"] },
];

const PROJECT = {
  title: "Retail Sales Analysis",
  sub: "Excel · Python · SQL · Power BI",
  desc: "Conductd end-to-end analysis of a global retail sales dataset covering 50+ countries — from data cleaning and exploratory analysis tobuilding interactive dashboards and generating actionable business insights.",
  stack: ["Excel","Python","Pandas","NumPy","SQL","Power BI","DAX","Power Query"],
  highlights: [
    { label:"Countries Covered", value:"50+", color: A },
    { label:"Analysis Type",     value:"EDA & RFM", color:"#6366f1" },
    { label:"Segments Built",    value:"4", color:"#f59e0b" },
    { label:"Interactive Dashboard",       value:"Dashboard", color:"#10b981" },
  ],
  work: [
    ["Time-Series EDA","Performed exploratory data analysis on a global retail dataset spanning 50+ countries to identify sales trends over time."],
    ["Data Cleaning","Cleaned, transformed and validated raw sales data using Python (Pandas and NumPy) ensuring analysis-ready quality."],
    ["RFM Segmentation","Developed Python scripts to calculate Recency, Frequency, and Monetary scores and classify customers into segments: Champions, Loyal, Potential, and Hibernating."],
    ["Power BI Dashboard","Designed interactive Power BI dashboard tracking Month-over-Month Growth and sales performance trends with drill-through capability."],
    ["Business Insights","Generated actionable insights from data patterns to support business and sales decision-making across regions."],
  ],
};

const EDUCATION = [
  { degree:"B.Sc. (MPCS)", college:"Nishitha Degree College, Nizamabad", period:"2022 – 2025", grade:"CGPA 9.46" },
  { degree:"Intermediate (MPC)", college:"SR Junior College, Nizamabad", period:"2020 – 2022", grade:"CGPA 9.72" },
  { degree:"SSC", college:"Orchid High School, Nizamabad", period:"2020", grade:"CGPA 10.0" },
];

/* ── HOOKS ──────────────────────────────────────────────────── */
function useInView(t = 0.08) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function useMouse() {
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = e => setM({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return m;
}

/* ── ANIMATED COUNTER ───────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseFloat(to);
    const dur = 1400;
    const step = dur / 60;
    const inc = end / (dur / step);
    const t = setInterval(() => {
      start += inc;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(parseFloat(start.toFixed(2)));
    }, step);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{Number.isInteger(parseFloat(to)) ? Math.floor(val) : val.toFixed(2)}{suffix}</span>;
}

/* ── TYPEWRITER ─────────────────────────────────────────────── */
function Typer() {
  const [txt, setTxt] = useState(""); const [ri, setRi] = useState(0); const [ph, setPh] = useState("t");
  useEffect(() => {
    const w = ROLES[ri % ROLES.length]; let t;
    if (ph === "t") { if (txt.length < w.length) t = setTimeout(() => setTxt(w.slice(0, txt.length + 1)), 55); else t = setTimeout(() => setPh("p"), 2000); }
    else if (ph === "p") t = setTimeout(() => setPh("d"), 60);
    else { if (txt.length > 0) t = setTimeout(() => setTxt(s => s.slice(0, -1)), 28); else { setRi(i => i + 1); setPh("t"); } }
    return () => clearTimeout(t);
  }, [txt, ph, ri]);
  return <span style={{ color: A, fontWeight: 600 }}>{txt}<span style={{ animation: "blink .9s step-end infinite", borderLeft: `1.5px solid ${A}`, marginLeft: 1 }}> </span></span>;
}

/* ── 3D TILT ────────────────────────────────────────────────── */
function Tilt({ children, style = {}, depth = 8, glow = A1 }) {
  const r = useRef(null);
  const onMove = useCallback(e => {
    const el = r.current; if (!el) return;
    const b = el.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width - 0.5) * 2;
    const y = ((e.clientY - b.top) / b.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * depth}deg) rotateY(${x * depth}deg) translateZ(6px)`;
    el.style.boxShadow = `0 20px 60px ${glow}, 0 0 0 1px ${BDH}`;
  }, [depth, glow]);
  const onLeave = useCallback(() => {
    const el = r.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    el.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${BD}`;
  }, []);
  return (
    <div ref={r} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform 0.18s ease, box-shadow 0.3s ease", transformStyle: "preserve-3d", willChange: "transform", boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${BD}`, ...style }}>
      {children}
    </div>
  );
}

/* ── REVEAL ─────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── SECTION LABEL ──────────────────────────────────────────── */
function SL({ tag, title }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <p style={{ fontFamily: MONO, fontSize: "0.62rem", color: A, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 0.5rem", opacity: .85 }}>{tag}</p>
      <h2 style={{ fontFamily: SANS, fontSize: "clamp(1.35rem,3vw,1.85rem)", fontWeight: 700, color: FG, margin: 0, letterSpacing: "-0.025em", lineHeight: 1.15 }}>{title}</h2>
    </div>
  );
}

/* ── ANIMATED CHART LINES (hero bg) ────────────────────────── */
function ChartBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", resize);

    // Generate smooth chart-like paths
    const lines = Array.from({ length: 4 }, (_, i) => ({
      points: Array.from({ length: 12 }, (_, j) => ({
        x: (j / 11) * W,
        y: H * 0.3 + Math.random() * H * 0.4,
      })),
      color: i === 0 ? A : i === 1 ? "#6366f1" : i === 2 ? "#f59e0b" : "#10b981",
      offset: Math.random() * 1000,
      speed: 0.0004 + Math.random() * 0.0003,
    }));

    let t = 0, frame;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 1;
      lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y + Math.sin(t * line.speed + line.offset) * 30);
        for (let i = 1; i < line.points.length; i++) {
          const p = line.points[i];
          const yWave = p.y + Math.sin(t * line.speed + line.offset + i * 0.8) * 30;
          ctx.lineTo(p.x, yWave);
        }
        ctx.strokeStyle = line.color + "22";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Dot on last point
        const last = line.points[line.points.length - 1];
        const lastY = last.y + Math.sin(t * line.speed + line.offset + 11 * 0.8) * 30;
        ctx.beginPath();
        ctx.arc(last.x - 10, lastY, 3, 0, Math.PI * 2);
        ctx.fillStyle = line.color + "66";
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ── NAVBAR ─────────────────────────────────────────────────── */
function Nav({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = ["Home", "About", "Skills", "Project", "Education", "Contact"];
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = id => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setActive(id); setOpen(false); };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(1.5rem,4vw,3rem)", background: scrolled ? "rgba(4,13,12,0.9)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${BD}` : "none", transition: "all .4s" }}>
      <div style={{ fontFamily: MONO, fontSize: ".9rem", fontWeight: 700, color: FG, letterSpacing: "-.01em" }}>
        DS<span style={{ color: A }}>.</span>
      </div>
      <div className="dnav" style={{ display: "flex", gap: "2rem" }}>
        {links.map(l => (
          <button key={l} onClick={() => go(l)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: SANS, fontSize: ".78rem", fontWeight: 500, color: active === l ? FG : FG3, transition: "color .25s", padding: 0, letterSpacing: "-.01em" }}>{l}</button>
        ))}
      </div>
      <a href="mailto:dablipuramsanjana@gmail.com" className="dnav"
        style={{ fontFamily: SANS, fontSize: ".75rem", fontWeight: 600, color: "#fff", background: A, textDecoration: "none", padding: "7px 18px", borderRadius: 7, transition: "all .25s", letterSpacing: "-.01em" }}
        onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
        Hire Me
      </a>
      <button className="ham" onClick={() => setOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: FG, fontSize: "1.2rem", padding: 4 }}>{open ? "✕" : "☰"}</button>
      {open && (
        <div style={{ position: "fixed", top: 58, left: 0, right: 0, bottom: 0, background: "rgba(4,13,12,.97)", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem", zIndex: 199 }}>
          {links.map(l => <button key={l} onClick={() => go(l)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: SANS, fontSize: "1.1rem", fontWeight: 500, color: active === l ? A : FG, letterSpacing: "-.02em" }}>{l}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ───────────────────────────────────────────────────── */
function Hero({ mouse }) {
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse 100% 65% at 50% -10%, rgba(13,148,136,.14) 0%, transparent 65%), ${BG0}`, padding: "7rem 2rem 5rem" }}>
      <ChartBg />

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "40%", background: `linear-gradient(${A3},transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "20%", height: 1, background: `linear-gradient(90deg,${A3},transparent)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720, width: "100%", transform: `translate(${mouse.x * -5}px,${mouse.y * -3}px)`, transition: "transform .12s ease" }}>

        {/* Status badge */}
        <div style={{ opacity: 0, animation: "fadeUp .7s ease .1s forwards" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: ".62rem", color: "#4ade80", letterSpacing: ".15em", textTransform: "uppercase", border: "1px solid rgba(74,222,128,.22)", borderRadius: 100, padding: "5px 14px", marginBottom: "2rem", background: "rgba(74,222,128,.05)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "glow 1.8s ease-in-out infinite", display: "inline-block" }} />
            Open to Opportunities
          </div>
        </div>

        {/* Name */}
        <div style={{ opacity: 0, animation: "fadeUp .7s ease .2s forwards" }}>
          <h1 style={{ fontFamily: SANS, fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 800, color: FG, letterSpacing: "-.04em", lineHeight: 1.05, margin: "0 0 .3rem", textShadow: `0 1px 0 rgba(13,148,136,.3), 0 4px 0 rgba(13,148,136,.1), 0 8px 20px rgba(0,0,0,.5)`, transform: `perspective(600px) rotateX(${mouse.y * 2}deg) rotateY(${mouse.x * -2}deg)`, transition: "transform .15s ease" }}>
            Dablipuram Sanjanastuthi
          </h1>
        </div>

        {/* Role */}
        <div style={{ opacity: 0, animation: "fadeUp .7s ease .3s forwards" }}>
          <p style={{ fontFamily: SANS, fontSize: "clamp(.95rem,2.5vw,1.2rem)", color: FG2, margin: "0 0 1.6rem", lineHeight: 1.5, fontWeight: 400 }}>
            <Typer />
          </p>
        </div>

        {/* Description */}
        <div style={{ opacity: 0, animation: "fadeUp .7s ease .4s forwards" }}>
          <p style={{ fontFamily: SANS, fontSize: ".93rem", lineHeight: 1.88, color: FG3, maxWidth: 500, margin: "0 auto 2.8rem" }}>
            Turning raw data into clear insights — skilled in Python, SQL, and Power BI with a sharp eye for patterns that drive business decisions.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ opacity: 0, animation: "fadeUp .7s ease .5s forwards" }}>
          <div style={{ display: "flex", gap: ".9rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.8rem" }}>
            <button onClick={() => document.getElementById("project")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: SANS, fontSize: ".82rem", fontWeight: 600, color: "#fff", background: A, border: "none", cursor: "pointer", padding: "12px 30px", borderRadius: 8, letterSpacing: "-.01em", transition: "all .25s", boxShadow: `0 0 0 0 ${A2}` }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 10px 40px ${A2}`; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 0 0 transparent"; }}>
              View Project
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: SANS, fontSize: ".82rem", fontWeight: 500, color: FG2, background: "transparent", border: `1px solid ${BDH}`, cursor: "pointer", padding: "12px 30px", borderRadius: 8, letterSpacing: "-.01em", transition: "all .25s" }}
              onMouseEnter={e => { e.target.style.color = FG; e.target.style.borderColor = A3; e.target.style.background = A1; }}
              onMouseLeave={e => { e.target.style.color = FG2; e.target.style.borderColor = BDH; e.target.style.background = "transparent"; }}>
              Contact Me
            </button>
          </div>
        </div>

        {/* Social */}
        <div style={{ opacity: 0, animation: "fadeUp .7s ease .6s forwards" }}>
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
            {[{ l: "Email", u: "mailto:dablipuramsanjana@gmail.com" }, { l: "Phone", u: "tel:9063478954" }].map(s => (
              <a key={s.l} href={s.u} style={{ fontFamily: MONO, fontSize: ".6rem", color: FG3, textDecoration: "none", letterSpacing: ".1em", textTransform: "uppercase", transition: "color .25s" }}
                onMouseEnter={e => e.target.style.color = FG} onMouseLeave={e => e.target.style.color = FG3}>{s.l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2, animation: "bob 2.5s ease-in-out infinite" }}>
        <span style={{ fontFamily: MONO, fontSize: ".55rem", color: FG3, letterSpacing: ".15em", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(${A3},transparent)` }} />
      </div>
    </section>
  );
}

/* ── ABOUT ──────────────────────────────────────────────────── */
function About() {
  const stats = [
    { n: "9.46", suf: "", label: "B.Sc. CGPA" },
    { n: "9.72", suf: "", label: "Intermediate" },
    { n: "10",   suf: ".0", label: "SSC CGPA" },
    { n: "50",   suf: "+", label: "Countries Analysed" },
  ];
  return (
    <section id="about" style={{ padding: "8rem clamp(1.5rem,4vw,3rem)", background: BG1, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: "8%", width: 1, height: 120, background: `linear-gradient(${BD},transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: "8%", width: 80, height: 1, background: `linear-gradient(270deg,${BD},transparent)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div className="a2col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }}>
          <Reveal>
            <SL tag="01 — About" title="Who I Am" />
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {[["Hyderabad, Telangana"], ["Data Analytics"], ["Open to Work"]].map(([v]) => (
                <span key={v} style={{ fontFamily: SANS, fontSize: ".73rem", color: FG2, background: `rgba(240,253,250,.04)`, border: `1px solid ${BD}`, borderRadius: 6, padding: "4px 11px" }}>{v}</span>
              ))}
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <Reveal delay={60}>
              <p style={{ fontFamily: SANS, fontSize: ".95rem", lineHeight: 1.88, color: FG2, margin: 0 }}>
                I'm a <span style={{ color: FG, fontWeight: 600 }}>Data Analyst</span> with a strong academic foundation and hands-on experience in Python, SQL, and Power BI. I specialize in transforming complex datasets into meaningful insights that drive data-informed business decisions.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p style={{ fontFamily: SANS, fontSize: ".95rem", lineHeight: 1.88, color: FG2, margin: 0 }}>
                My project work spans the entire data pipeline — from data cleaning and exploratory analysis to developing interactive dashboards and customer segmentation models. I am Detail-oriented, analytical, and driven by curiosity to uncover actionable insights.
              </p>
            </Reveal>

            {/* Stats grid */}
            <Reveal delay={200}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: BD, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden", marginTop: ".8rem" }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: BG1, padding: "1.2rem .8rem", textAlign: "center" }}>
                    <div style={{ fontFamily: SANS, fontSize: "1.5rem", fontWeight: 700, color: A, letterSpacing: "-.03em", marginBottom: 3 }}>
                      <Counter to={s.n} suffix={s.suf} />
                    </div>
                    <div style={{ fontFamily: SANS, fontSize: ".62rem", color: FG3, textTransform: "uppercase", letterSpacing: ".08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap", marginTop: ".5rem" }}>
                <a href="mailto:dablipuramsanjana@gmail.com" style={{ fontFamily: SANS, fontSize: ".82rem", fontWeight: 600, color: "#fff", background: A, textDecoration: "none", padding: "10px 22px", borderRadius: 8, transition: "all .25s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Hire Me
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ─────────────────────────────────────────────────── */
function Skills() {
  return (
    <section id="skills" style={{ padding: "8rem clamp(1.5rem,4vw,3rem)", background: BG0, position: "relative" }}>
      <div style={{ position: "absolute", top: "30%", right: "-5%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle,${A1},transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <Reveal><SL tag="02 — Skills" title="Technical Skills" /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1px", background: BD, border: `1px solid ${BD}`, borderRadius: 12, overflow: "hidden" }}>
          {SKILLS.map((s, i) => (
            <Reveal key={i} delay={i * 50}>
              <Tilt depth={6} glow={A1} style={{ background: BG0, borderRadius: 0, boxShadow: "none", border: "none", height: "100%" }}>
                <div style={{ padding: "1.8rem", height: "100%", transition: "background .25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = A1}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <h3 style={{ fontFamily: SANS, fontSize: ".78rem", fontWeight: 600, color: A, margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: ".08em" }}>{s.cat}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".38rem" }}>
                    {s.items.map((item, j) => (
                      <span key={j} style={{ fontFamily: MONO, fontSize: ".65rem", color: FG2, background: "rgba(240,253,250,.04)", border: `1px solid ${BD}`, borderRadius: 4, padding: "3px 8px", lineHeight: 1.5 }}>{item}</span>
                    ))}
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECT ────────────────────────────────────────────────── */
function Project() {
  const p = PROJECT;
  return (
    <section id="project" style={{ padding: "8rem clamp(1.5rem,4vw,3rem)", background: BG1 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Reveal><SL tag="03 — Project" title="What I've Built" /></Reveal>

        <Reveal>
          <Tilt depth={4} glow={A1} style={{ background: BG0, borderRadius: 14, overflow: "hidden" }}>
            {/* Accent bar */}
            <div style={{ height: 2, background: `linear-gradient(90deg,${A},transparent 55%)` }} />
            <div style={{ padding: "2.5rem" }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontFamily: MONO, fontSize: ".58rem", color: A, letterSpacing: ".14em", opacity: .8 }}>Featured Project</span>
                  <h3 style={{ fontFamily: SANS, fontSize: "1.3rem", fontWeight: 700, color: FG, margin: ".3rem 0 .3rem", letterSpacing: "-.025em", lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontFamily: MONO, fontSize: ".6rem", color: FG3, margin: 0 }}>{p.sub}</p>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontFamily: SANS, fontSize: ".9rem", lineHeight: 1.88, color: FG2, marginBottom: "2rem", paddingBottom: "2rem", borderBottom: `1px solid ${BD}` }}>{p.desc}</p>

              {/* Highlight stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1px", background: BD, borderRadius: 10, overflow: "hidden", marginBottom: "2rem", border: `1px solid ${BD}` }}>
                {p.highlights.map((h, i) => (
                  <div key={i} style={{ background: BG0, padding: "1.2rem 1.4rem", textAlign: "center" }}>
                    <div style={{ fontFamily: SANS, fontSize: "1.35rem", fontWeight: 700, color: h.color, letterSpacing: "-.02em", marginBottom: 4 }}>{h.value}</div>
                    <div style={{ fontFamily: SANS, fontSize: ".65rem", color: FG3, textTransform: "uppercase", letterSpacing: ".08em" }}>{h.label}</div>
                  </div>
                ))}
              </div>

              {/* Stack */}
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontFamily: MONO, fontSize: ".58rem", color: FG3, letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 .7rem" }}>Stack</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {p.stack.map((s, j) => <span key={j} style={{ fontFamily: MONO, fontSize: ".63rem", color: FG2, background: "rgba(240,253,250,.04)", border: `1px solid ${BD}`, borderRadius: 4, padding: "3px 9px" }}>{s}</span>)}
                </div>
              </div>

              {/* Work done */}
              <div>
                <p style={{ fontFamily: MONO, fontSize: ".58rem", color: FG3, letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 1rem" }}>What I Did</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden" }}>
                  {p.work.map(([title, desc], i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 0, borderBottom: i < p.work.length - 1 ? `1px solid ${BD}` : "none", transition: "background .25s" }}
                      onMouseEnter={e => e.currentTarget.style.background = A1}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ padding: "1rem 1.2rem", borderRight: `1px solid ${BD}`, display: "flex", alignItems: "center" }}>
                        <span style={{ fontFamily: MONO, fontSize: ".65rem", color: A, letterSpacing: ".05em", fontWeight: 700 }}>{title}</span>
                      </div>
                      <div style={{ padding: "1rem 1.4rem" }}>
                        <span style={{ fontFamily: SANS, fontSize: ".85rem", lineHeight: 1.78, color: FG2 }}>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
}

/* ── EDUCATION ──────────────────────────────────────────────── */
function Education() {
  return (
    <section id="education" style={{ padding: "8rem clamp(1.5rem,4vw,3rem)", background: BG0, position: "relative" }}>
      <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${A1},transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <div className="a2col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }}>
          <Reveal><SL tag="04 — Education" title="Academic Background" /></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${BD}`, borderRadius: 12, overflow: "hidden" }}>
            {EDUCATION.map((e, i) => (
              <Reveal key={i} delay={i * 80}>
                <Tilt depth={5} glow={A1} style={{ background: BG0, borderRadius: 0, boxShadow: "none", borderBottom: i < EDUCATION.length - 1 ? `1px solid ${BD}` : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1.6rem 1.8rem", alignItems: "center", transition: "background .25s" }}
                    onMouseEnter={e => e.currentTarget.style.background = A1}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".3rem" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: A, flexShrink: 0 }} />
                        <h3 style={{ fontFamily: SANS, fontSize: ".95rem", fontWeight: 700, color: FG, margin: 0, letterSpacing: "-.015em" }}>{e.degree}</h3>
                      </div>
                      <p style={{ fontFamily: SANS, fontSize: ".8rem", color: FG3, margin: "0 0 .15rem", paddingLeft: "1rem" }}>{e.college}</p>
                      <p style={{ fontFamily: MONO, fontSize: ".62rem", color: FG3, margin: 0, paddingLeft: "1rem" }}>{e.period}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: SANS, fontSize: "1.1rem", fontWeight: 700, color: A, letterSpacing: "-.02em" }}>{e.grade}</span>
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ────────────────────────────────────────────────── */
function Contact() {
  const contacts = [
    { l: "Email",    v: "dablipuramsanjana@gmail.com", href: "mailto:dablipuramsanjana@gmail.com" },
    { l: "Phone",    v: "9063478954",                  href: "tel:9063478954" },
    { l: "Location", v: "Hyderabad, Telangana, India", href: "#" },
  ];
  return (
    <section id="contact" style={{ padding: "8rem clamp(1.5rem,4vw,3rem) 6rem", background: BG1, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 200, background: `radial-gradient(ellipse,${A1},transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <div className="a2col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }}>
          <Reveal>
            <SL tag="05 — Contact" title="Get in Touch" />
            <p style={{ fontFamily: SANS, fontSize: ".92rem", lineHeight: 1.85, color: FG2, marginBottom: "1.5rem" }}>Open to entry-level Data Analyst roles. I'd love to connect and discuss how I can contribute to your team.</p>
            <a href="mailto:dablipuramsanjana@gmail.com" style={{ fontFamily: SANS, fontSize: ".82rem", fontWeight: 600, color: "#fff", background: A, textDecoration: "none", padding: "10px 22px", borderRadius: 8, transition: "all .25s", display: "inline-block" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Send Email
            </a>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
            {contacts.map((c, i) => (
              <Reveal key={i} delay={i * 55}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.4rem", background: BG0, border: `1px solid ${BD}`, borderRadius: 8, textDecoration: "none", transition: "all .25s", gap: "1rem" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = BDH; e.currentTarget.style.background = A1; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BD; e.currentTarget.style.background = BG0; }}>
                  <span style={{ fontFamily: MONO, fontSize: ".58rem", color: A, letterSpacing: ".1em", textTransform: "uppercase", minWidth: 68 }}>{c.l}</span>
                  <span style={{ fontFamily: SANS, fontSize: ".85rem", color: FG2, flex: 1 }}>{c.v}</span>
                  <span style={{ color: FG3, fontSize: ".72rem" }}>→</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: MONO, fontSize: ".58rem", color: FG3, letterSpacing: ".08em" }}>DS. · Data Analyst · {new Date().getFullYear()}</span>
          <span style={{ fontFamily: MONO, fontSize: ".58rem", color: FG3, letterSpacing: ".08em" }}>Hyderabad, Telangana</span>
        </div>
      </div>
    </section>
  );
}

/* ── APP ────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("Home");
  const mouse = useMouse();

  useEffect(() => {
    const ids = ["home", "about", "skills", "project", "education", "contact"];
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1)); });
    }, { rootMargin: "-40% 0px -40% 0px" });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:${BG0};color:${FG};overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${BG0};}
        ::-webkit-scrollbar-thumb{background:rgba(13,148,136,.45);border-radius:2px;}

        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes blink   { 0%,100%{opacity:1;}50%{opacity:0;} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5);}50%{box-shadow:0 0 0 5px rgba(74,222,128,0);} }
        @keyframes bob     { 0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(8px);} }

        .dnav{display:flex!important;}
        .ham{display:none!important;}
        @media(max-width:820px){
          .dnav{display:none!important;}
          .ham{display:block!important;}
          .a2col{grid-template-columns:1fr!important;gap:2.5rem!important;}
          h1{font-size:clamp(1.8rem,8vw,3rem)!important;}
        }
      `}</style>
      <Nav active={active} setActive={setActive} />
      <Hero mouse={mouse} />
      <About />
      <Skills />
      <Project />
      <Education />
      <Contact />
    </>
  );
}
