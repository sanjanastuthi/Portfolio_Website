import { useState, useEffect, useRef } from "react";

/* ─── BOOTSTRAP CDN ─── */
const BootstrapLink = () => (
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.2/css/bootstrap.min.css" />
);

/* ─── STYLES ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg-deep:     #08090e;
    --bg-card:     #11121a;
    --bg-card-h:   #181928;
    --accent:      #5eead4;
    --accent-dim:  rgba(94,234,212,.13);
    --accent-glow: rgba(94,234,212,.30);
    --text-light:  #e2e0db;
    --text-muted:  #6b6b7b;
    --border:      rgba(94,234,212,.12);
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg-deep);
    color: var(--text-light);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* noise */
  body::before {
    content:''; position:fixed; inset:0; z-index:9999; pointer-events:none; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }

  /* ── NAV ── */
  .pf-nav {
    position:fixed; top:0; width:100%; z-index:100;
    padding:1.3rem 0;
    transition:background .4s, padding .4s, box-shadow .4s;
  }
  .pf-nav.scrolled {
    background:rgba(8,9,14,.82);
    backdrop-filter:blur(14px);
    padding:.65rem 0;
    box-shadow:0 1px 0 var(--border);
  }
  .pf-nav .logo {
    font-family:'Playfair Display',serif;
    font-size:1.25rem; color:var(--accent);
    text-decoration:none; letter-spacing:.03em;
  }
  .pf-nav .nav-link {
    color:var(--text-muted); font-size:.78rem;
    letter-spacing:.14em; text-transform:uppercase;
    text-decoration:none; padding:.4rem .65rem;
    position:relative; transition:color .3s;
  }
  .pf-nav .nav-link::after {
    content:''; position:absolute; bottom:0; left:50%;
    transform:translateX(-50%);
    width:0; height:1px; background:var(--accent);
    transition:width .35s;
  }
  .pf-nav .nav-link:hover { color:var(--accent); }
  .pf-nav .nav-link:hover::after { width:65%; }

  /* hamburger */
  .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:.5rem; }
  .hamburger span { display:block; width:22px; height:2px; background:var(--accent); border-radius:2px; transition:.3s; }
  .hamburger.active span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
  .hamburger.active span:nth-child(2) { opacity:0; }
  .hamburger.active span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

  /* mobile overlay */
  .mobile-nav-overlay {
    display:none; position:fixed; inset:0; z-index:99;
    background:rgba(8,9,14,.96); backdrop-filter:blur(16px);
    flex-direction:column; align-items:center; justify-content:center; gap:1.8rem;
  }
  .mobile-nav-overlay.open { display:flex; }
  .mobile-nav-overlay .nav-link { font-size:1.05rem; letter-spacing:.22em; color:var(--text-light); text-decoration:none; transition:color .3s; }
  .mobile-nav-overlay .nav-link:hover { color:var(--accent); }

  /* ── HERO ── */
  .pf-hero {
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    position:relative; padding:6rem 1rem 3rem;
  }
  .hero-glow {
    position:absolute; width:560px; height:560px; border-radius:50%;
    background:radial-gradient(circle, rgba(94,234,212,.07) 0%, transparent 70%);
    top:50%; left:50%; transform:translate(-50%,-50%);
    pointer-events:none;
    animation:pulse 9s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.6; }
    50%     { transform:translate(-50%,-50%) scale(1.18); opacity:1; }
  }
  .hero-content { position:relative; z-index:1; text-align:center; }
  .hero-tag {
    display:inline-block; font-size:.72rem;
    letter-spacing:.28em; text-transform:uppercase;
    color:var(--accent); border:1px solid var(--border);
    padding:.32rem 1rem; border-radius:50px;
    margin-bottom:1.6rem;
    animation:fadeDown .8s .2s both;
  }
  .hero-name {
    font-family:'Playfair Display',serif;
    font-size:clamp(2.6rem,6.5vw,5rem);
    font-weight:700; line-height:1.1; color:var(--text-light);
    animation:fadeUp .9s .35s both;
  }
  .hero-name em { font-style:italic; color:var(--accent); }
  .hero-role {
    margin-top:.8rem;
    font-size:clamp(.95rem,2vw,1.15rem);
    color:var(--accent); font-weight:400;
    letter-spacing:.08em;
    animation:fadeUp .9s .48s both;
  }
  .hero-subtitle {
    margin-top:.9rem; font-size:.95rem;
    color:var(--text-muted); font-weight:300;
    max-width:500px; margin-left:auto; margin-right:auto;
    line-height:1.7;
    animation:fadeUp .9s .6s both;
  }
  .hero-cta {
    margin-top:2.2rem;
    display:flex; gap:.9rem; justify-content:center; flex-wrap:wrap;
    animation:fadeUp .9s .72s both;
  }

  /* buttons */
  .btn-primary-custom {
    background:var(--accent); color:#08090e; border:none;
    padding:.68rem 1.7rem; border-radius:50px;
    font-size:.78rem; font-weight:500;
    letter-spacing:.12em; text-transform:uppercase;
    text-decoration:none; cursor:pointer;
    transition:box-shadow .3s, transform .25s;
  }
  .btn-primary-custom:hover { box-shadow:0 0 22px var(--accent-glow); transform:translateY(-2px); }
  .btn-outline-custom {
    background:transparent; color:var(--text-light);
    border:1px solid var(--border);
    padding:.68rem 1.7rem; border-radius:50px;
    font-size:.78rem; font-weight:500;
    letter-spacing:.12em; text-transform:uppercase;
    text-decoration:none; cursor:pointer;
    transition:border-color .3s, color .3s, transform .25s;
  }
  .btn-outline-custom:hover { border-color:var(--accent); color:var(--accent); transform:translateY(-2px); }

  /* scroll hint */
  .scroll-hint {
    position:absolute; bottom:2rem; left:50%;
    transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:.35rem;
    color:var(--text-muted); font-size:.68rem;
    letter-spacing:.18em; text-transform:uppercase;
    animation:fadeUp 1s .95s both;
  }
  .scroll-hint .line {
    width:1px; height:0;
    background:linear-gradient(to bottom, var(--accent), transparent);
    animation:scrollLine 2s ease-in-out infinite;
  }
  @keyframes scrollLine { 0%{height:0;opacity:1} 100%{height:34px;opacity:0} }

  /* ── SECTION COMMONS ── */
  .pf-section { padding:6.5rem 0; }
  .section-label { font-size:.7rem; letter-spacing:.32em; text-transform:uppercase; color:var(--accent); margin-bottom:.5rem; }
  .section-title { font-family:'Playfair Display',serif; font-size:clamp(1.7rem,3.8vw,2.4rem); font-weight:700; color:var(--text-light); margin-bottom:.8rem; }
  .section-desc { color:var(--text-muted); font-size:.9rem; font-weight:300; max-width:500px; line-height:1.75; }
  .accent-line { width:38px; height:2px; background:var(--accent); margin-bottom:1rem; }

  /* reveal */
  .reveal { opacity:0; transform:translateY(30px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ── ABOUT ── */
  .about-ring {
    width:160px; height:160px; border-radius:50%;
    position:relative; margin:0 auto 1.8rem;
  }
  .about-ring-inner {
    position:absolute; inset:3px; border-radius:50%;
    background:var(--bg-card-h);
    display:flex; align-items:center; justify-content:center;
    font-size:3.2rem; z-index:1;
  }
  .about-ring-border {
    position:absolute; inset:0; border-radius:50%;
    background:conic-gradient(var(--accent), transparent 70%, var(--accent));
    animation:spin 5s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  .stat-row { display:flex; justify-content:center; gap:2rem; flex-wrap:wrap; margin-top:.6rem; }
  .stat-card { text-align:center; padding:1rem .6rem; }
  .stat-number { font-family:'Playfair Display',serif; font-size:1.7rem; color:var(--accent); font-weight:700; }
  .stat-label { font-size:.7rem; color:var(--text-muted); letter-spacing:.1em; text-transform:uppercase; margin-top:.2rem; }

  /* ── SKILLS ── */
  .skill-card {
    background:var(--bg-card); border:1px solid var(--border);
    border-radius:14px; padding:1.6rem 1.2rem;
    transition:transform .3s, border-color .3s, box-shadow .3s;
    height:100%;
  }
  .skill-card:hover { transform:translateY(-4px); border-color:var(--accent); box-shadow:0 8px 28px rgba(94,234,212,.08); }
  .skill-icon { font-size:1.5rem; margin-bottom:.6rem; }
  .skill-card h5 { font-family:'Playfair Display',serif; color:var(--text-light); margin-bottom:.35rem; font-size:1rem; }
  .skill-card p { color:var(--text-muted); font-size:.8rem; line-height:1.6; margin:0; }
  .skill-tags { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.8rem; }
  .skill-tag { background:var(--accent-dim); color:var(--accent); font-size:.68rem; padding:.22rem .6rem; border-radius:50px; letter-spacing:.04em; }

  /* ── PROJECTS ── */
  .project-card {
    background:var(--bg-card); border:1px solid var(--border);
    border-radius:16px; overflow:hidden;
    transition:transform .35s, box-shadow .35s;
    display:flex; flex-direction:column; height:100%;
  }
  .project-card:hover { transform:translateY(-5px); box-shadow:0 14px 40px rgba(0,0,0,.28); }
  .project-img {
    height:160px; background:var(--bg-card-h);
    display:flex; align-items:center; justify-content:center;
    font-size:2.4rem; position:relative; overflow:hidden;
  }
  .project-img::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom, transparent 40%, var(--bg-card)); }
  .project-body { padding:1.3rem; flex:1; display:flex; flex-direction:column; }
  .project-body h5 { font-family:'Playfair Display',serif; color:var(--text-light); font-size:1rem; margin-bottom:.3rem; }
  .project-body p { color:var(--text-muted); font-size:.8rem; line-height:1.6; margin:0; flex:1; }
  .project-links { margin-top:.9rem; display:flex; gap:.7rem; }
  .project-link { color:var(--accent); font-size:.72rem; letter-spacing:.07em; text-transform:uppercase; text-decoration:none; border-bottom:1px solid transparent; transition:border-color .3s; cursor:pointer; }
  .project-link:hover { border-color:var(--accent); }

  /* filter pills */
  .filter-pill {
    background:var(--bg-card); color:var(--text-muted);
    border:1px solid var(--border);
    border-radius:50px; padding:.3rem .85rem;
    font-size:.72rem; letter-spacing:.07em;
    text-transform:uppercase; cursor:pointer;
    transition:all .25s; font-family:'DM Sans',sans-serif;
  }
  .filter-pill:hover { border-color:var(--accent); color:var(--accent); }
  .filter-pill.active { background:var(--accent); color:#08090e; border-color:var(--accent); }

  /* ── EXPERIENCE / TIMELINE ── */
  .timeline { position:relative; padding-left:2rem; }
  .timeline::before { content:''; position:absolute; left:6px; top:0; bottom:0; width:1px; background:linear-gradient(to bottom, var(--accent), transparent); }
  .timeline-item { position:relative; margin-bottom:2.2rem; }
  .timeline-dot {
    position:absolute; left:-2rem; top:.38rem;
    width:14px; height:14px; border-radius:50%;
    background:var(--bg-deep); border:2px solid var(--accent);
    transition:box-shadow .3s;
  }
  .timeline-item:hover .timeline-dot { box-shadow:0 0 10px var(--accent-glow); }
  .timeline-date { font-size:.7rem; color:var(--accent); letter-spacing:.1em; text-transform:uppercase; margin-bottom:.25rem; }
  .timeline-title { font-family:'Playfair Display',serif; color:var(--text-light); font-size:1.05rem; margin-bottom:.1rem; }
  .timeline-company { color:var(--text-muted); font-size:.8rem; margin-bottom:.4rem; }
  .timeline-desc { color:var(--text-muted); font-size:.8rem; line-height:1.7; }
  .timeline-desc li { margin-bottom:.28rem; padding-left:.3rem; }

  /* ── CERTS ── */
  .cert-card {
    background:var(--bg-card); border:1px solid var(--border);
    border-radius:14px; padding:1.4rem 1.5rem;
    display:flex; align-items:center; justify-content:space-between;
    gap:1rem; flex-wrap:wrap;
    transition:transform .3s, border-color .3s;
  }
  .cert-card:hover { transform:translateY(-3px); border-color:var(--accent); }
  .cert-card h6 { font-family:'Playfair Display',serif; color:var(--text-light); font-size:.95rem; margin:0; }
  .cert-card p { color:var(--text-muted); font-size:.78rem; margin:0; }
  .cert-link { color:var(--accent); font-size:.75rem; letter-spacing:.07em; text-transform:uppercase; text-decoration:none; border-bottom:1px solid transparent; transition:border-color .3s; white-space:nowrap; }
  .cert-link:hover { border-color:var(--accent); }

  /* ── CONTACT ── */
  .contact-wrapper {
    background:var(--bg-card); border:1px solid var(--border);
    border-radius:20px; padding:3rem 2rem;
    max-width:580px; margin:0 auto;
    position:relative; overflow:hidden;
  }
  .contact-wrapper::before {
    content:''; position:absolute; top:-70px; right:-70px;
    width:210px; height:210px; border-radius:50%;
    background:radial-gradient(circle, var(--accent-dim), transparent 70%);
    pointer-events:none;
  }
  .contact-input {
    width:100%; background:var(--bg-deep);
    border:1px solid var(--border); border-radius:10px;
    padding:.7rem .95rem; color:var(--text-light);
    font-family:'DM Sans',sans-serif; font-size:.86rem;
    margin-bottom:.9rem; transition:border-color .3s, box-shadow .3s; outline:none;
  }
  .contact-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
  .contact-input::placeholder { color:var(--text-muted); }
  textarea.contact-input { resize:vertical; min-height:100px; }
  .success-toast {
    background:var(--accent-dim); border:1px solid var(--accent);
    border-radius:10px; padding:.6rem 1rem;
    margin-bottom:1rem; color:var(--accent);
    font-size:.82rem; text-align:center;
  }

  /* social */
  .social-row { display:flex; gap:.8rem; justify-content:center; flex-wrap:wrap; margin-top:2rem; }
  .social-btn {
    width:40px; height:40px; border-radius:50%;
    border:1px solid var(--border); background:var(--bg-card);
    color:var(--text-muted); display:flex; align-items:center; justify-content:center;
    text-decoration:none; font-size:.9rem;
    transition:border-color .3s, color .3s, transform .25s, box-shadow .3s;
  }
  .social-btn:hover { border-color:var(--accent); color:var(--accent); transform:translateY(-3px); box-shadow:0 4px 14px var(--accent-dim); }

  /* ── FOOTER ── */
  .pf-footer { padding:1.8rem 0; text-align:center; border-top:1px solid var(--border); }
  .pf-footer p { color:var(--text-muted); font-size:.76rem; }
  .pf-footer a { color:var(--accent); text-decoration:none; }
  .pf-footer a:hover { text-decoration:underline; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }

  /* responsive */
  @media(max-width:768px){
    .pf-nav .desktop-links{display:none!important;}
    .hamburger{display:flex;}
    .pf-hero{padding-top:5.5rem;}
    .contact-wrapper{padding:2rem 1.1rem;}
    .timeline{padding-left:1.5rem;}
    .timeline::before{left:5px;}
    .timeline-dot{left:-1.5rem;width:12px;height:12px;}
    .cert-card{flex-direction:column;align-items:flex-start;}
  }
  @media(min-width:769px){
    .hamburger{display:none!important;}
  }
`;

/* ─── DATA ─── */
const projects = [
  {
    emoji: "⚡", title: "React App Deployment – Nginx & HTTPS",
    desc: "Deployed a React SPA on Ubuntu EC2 behind Nginx, wired Cloudflare + Certbot for 100 % HTTPS, and tuned configs for fast page loads and basic security.",
    tags: ["React", "AWS EC2", "Nginx", "Cloudflare", "Certbot"]
  },
  {
    emoji: "🏗️", title: "Infrastructure Automation – Terraform & Ansible",
    desc: "Provisioned scalable AWS infra with Terraform and automated server config via Ansible playbooks, all version-controlled in VS Code.",
    tags: ["Terraform", "Ansible", "AWS", "IaC"]
  },
  {
    emoji: "📊", title: "Infra Monitoring – Prometheus & Grafana",
    desc: "Set up system & CI/CD monitoring with Prometheus + Node Exporter, then built Grafana dashboards for real-time server and Jenkins metrics.",
    tags: ["Prometheus", "Grafana", "Node Exporter", "Jenkins"]
  },
];

const skills = [
  { icon: "☁️", title: "Cloud Platforms", desc: "Architecting and managing cloud resources at scale.", tags: ["AWS EC2", "S3", "IAM", "Auto Scaling", "Route 53", "CloudWatch"] },
  { icon: "🔄", title: "DevOps & CI/CD", desc: "End-to-end pipeline design from code commit to production.", tags: ["Jenkins", "Docker", "GitHub", "CI/CD"] },
  { icon: "🏗️", title: "Infrastructure as Code", desc: "Declarative infra provisioning and config management.", tags: ["Terraform", "Ansible", "Prometheus", "Grafana"] },
  { icon: "🐚", title: "Scripting & OS", desc: "Automating workflows and managing Linux environments.", tags: ["Linux", "Bash", "Shell Scripting"] },
  { icon: "📦", title: "Containerisation", desc: "Building, shipping, and orchestrating containerised apps.", tags: ["Docker", "Container Ops"] },
  { icon: "📈", title: "Monitoring & Observability", desc: "Visibility into system health, CI pipelines, and performance.", tags: ["Prometheus", "Grafana", "Node Exporter"] },
];

const experience = [
  {
    date: "Sep 2025 – Present",
    title: "Cloud & DevOps Intern",
    company: "Visys Cloud Technologies · Hyderabad, Telangana",
    bullets: [
      "Designed & automated CI/CD pipelines with Jenkins + Docker, cutting manual deployment steps by 60 %.",
      "Provisioned and managed AWS infrastructure — EC2, S3, IAM, Route 53, Load Balancers, Auto Scaling.",
      "Built Docker-based containerised apps ensuring environment consistency across dev, staging, and prod.",
      "Configured Prometheus & Grafana dashboards for real-time system and pipeline monitoring.",
    ]
  },
];

const education = {
  college: "MVSR Engineering College, Hyderabad",
  degree: "Bachelor of Engineering – Automobile Engineering",
  cgpa: "7.26",
  duration: "Oct 2020 – Jun 2024",
};

const certs = [
  { title: "Oracle Certified Foundations Associate", issuer: "Oracle" },
  { title: "Solutions Architecture – Job Simulation", issuer: "Virtual Experience" },
];

/* ─── HOOK ─── */
function useReveal() {
  const refs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.13 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const addRef = (el) => { if (el && !refs.current.includes(el)) refs.current.push(el); };
  return addRef;
}

/* ─── NAV ─── */
function Navbar({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Skills", "Projects", "Experience", "Contact"];
  const go = (id) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <>
      <nav className={`pf-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container d-flex align-items-center justify-content-between">
        <button className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>KB</button>
          {links.map((l) => (
            <button key={l} className="nav-link" onClick={() => go(l)}>
              {l}
            </button>
          ))}
          </div>
          <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </div>
      </nav>
      {menuOpen && (
        <div className="mobile-nav-overlay open">
          <div className="hamburger active" style={{ position: "absolute", top: "1.1rem", right: "1.4rem" }} onClick={() => setMenuOpen(false)}>
            <span /><span /><span />
          </div>
          {links.map((l) => <a key={l} href="#" className="nav-link" onClick={(e) => { e.preventDefault(); go(l); }}>{l}</a>)}
        </div>
      )}
    </>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="pf-hero" id="home">
      <div className="hero-glow" />
      <div className="hero-content">
        <div className="hero-tag">Welcome to my portfolio</div>
        <h1 className="hero-name">Hi, I'm <em>Koushik Bijili</em></h1>
        <div className="hero-role">Cloud & DevOps Engineer</div>
        <p className="hero-subtitle">Hands-on with AWS, CI/CD, Docker, and IaC. I build reliable, automated cloud infrastructure and keep systems observable end-to-end.</p>
        <div className="hero-cta">
          <button className="btn-primary-custom" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            View Projects
          </button>

          <button className="btn-outline-custom" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Contact Me
          </button>

        </div>
      </div>
      <div className="scroll-hint"><span>Scroll</span><div className="line" /></div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About({ addRef }) {
  return (
    <section className="pf-section" id="about">
      <div className="container">
        <div className="row align-items-center">
          {/* left col */}
          <div className="col-lg-5 text-center mb-5 mb-lg-0 reveal" ref={addRef}>
            <div className="about-ring">
              <div className="about-ring-border" />
              <div className="about-ring-inner">👨‍💻</div>
            </div>
            <div className="stat-row">
              {[["1+", "Year Exp"], ["3+", "Projects"], ["2", "Certs"]].map(([n, l]) => (
                <div className="stat-card" key={l}><div className="stat-number">{n}</div><div className="stat-label">{l}</div></div>
              ))}
            </div>
          </div>

          {/* right col */}
          <div className="col-lg-7 reveal" ref={addRef} style={{ transitionDelay: ".14s" }}>
            <div className="section-label">About Me</div>
            <div className="accent-line" />
            <h2 className="section-title">Building reliable cloud<br />infrastructure at scale</h2>
            <p className="section-desc">
              I'm a Cloud & DevOps Engineer based in Hyderabad with hands-on experience deploying and managing AWS infrastructure. I work daily with CI/CD pipelines, Docker, and monitoring tools like Prometheus and Grafana to keep deployments automated and reliable.
            </p>
            <p className="section-desc" style={{ marginTop: ".9rem" }}>
              Strong interest in cloud automation, DevOps best-practices, and building stable, scalable systems. Always looking to sharpen skills and ship better software.
            </p>
            {/* education chip */}
            <div style={{ marginTop: "1.6rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem 1.2rem", display: "inline-block" }}>
              <div style={{ fontSize: ".68rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: ".25rem" }}>Education</div>
              <div style={{ color: "var(--text-light)", fontSize: ".88rem", fontFamily: "'Playfair Display',serif" }}>{education.college}</div>
              <div style={{ color: "var(--text-muted)", fontSize: ".78rem", marginTop: ".15rem" }}>{education.degree} &nbsp;|&nbsp; CGPA: <strong style={{ color: "var(--accent)" }}>{education.cgpa}</strong></div>
              <div style={{ color: "var(--text-muted)", fontSize: ".72rem", marginTop: ".1rem" }}>{education.duration}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─── */
function Skills({ addRef }) {
  return (
    <section className="pf-section" id="skills" style={{ background: "linear-gradient(180deg, var(--bg-deep) 0%, #0e0f15 100%)" }}>
      <div className="container">
        <div className="text-center mb-5 reveal" ref={addRef}>
          <div className="section-label">Expertise</div>
          <div className="accent-line mx-auto" />
          <h2 className="section-title">Technical Skills</h2>
        </div>
        <div className="row g-4">
          {skills.map((s, i) => (
            <div className="col-md-6 col-lg-4 reveal" ref={addRef} key={s.title} style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="skill-card">
                <div className="skill-icon">{s.icon}</div>
                <h5>{s.title}</h5>
                <p>{s.desc}</p>
                <div className="skill-tags">{s.tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ─── */
function Projects({ addRef }) {
  const [filter, setFilter] = useState("All");
  const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <section className="pf-section" id="projects">
      <div className="container">
        <div className="text-center mb-4 reveal" ref={addRef}>
          <div className="section-label">Portfolio</div>
          <div className="accent-line mx-auto" />
          <h2 className="section-title">Projects</h2>
        </div>
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5 reveal" ref={addRef}>
          {allTags.map((t) => (
            <button key={t} className={`filter-pill ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>
        <div className="row g-4">
          {filtered.map((p, i) => (
            <div className="col-md-6 col-lg-4 reveal" ref={addRef} key={p.title} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="project-card">
                <div className="project-img">{p.emoji}</div>
                <div className="project-body">
                  <h5>{p.title}</h5>
                  <p>{p.desc}</p>
                  <div className="skill-tags">{p.tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}</div>
                  <div className="project-links">
                    <span className="project-link">Live Demo →</span>
                    <span className="project-link">GitHub →</span>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ─── */
function Experience({ addRef }) {
  return (
    <section className="pf-section" id="experience" style={{ background: "linear-gradient(180deg, #0e0f15 0%, var(--bg-deep) 100%)" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-5 mb-5 mb-lg-0 reveal" ref={addRef}>
            <div className="section-label">Career</div>
            <div className="accent-line" />
            <h2 className="section-title">Experience &<br />Education</h2>
            <p className="section-desc">The roles and environments that shaped how I build and deploy cloud infrastructure today.</p>
          </div>
          <div className="col-lg-7">
            <div className="timeline">
              {experience.map((e, i) => (
                <div className="timeline-item reveal" ref={addRef} key={e.title} style={{ transitionDelay: `${i * 0.14}s` }}>
                  <div className="timeline-dot" />
                  <div className="timeline-date">{e.date}</div>
                  <div className="timeline-title">{e.title}</div>
                  <div className="timeline-company">{e.company}</div>
                  <ul className="timeline-desc" style={{ paddingLeft: "1.1rem" }}>
                    {e.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              ))}

              {/* Education as timeline item */}
              <div className="timeline-item reveal" ref={addRef} style={{ transitionDelay: ".28s" }}>
                <div className="timeline-dot" />
                <div className="timeline-date">{education.duration}</div>
                <div className="timeline-title">{education.degree}</div>
                <div className="timeline-company">{education.college}</div>
                <p className="timeline-desc">CGPA: <strong style={{ color: "var(--accent)" }}>{education.cgpa}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CERTIFICATIONS ─── */
function Certifications({ addRef }) {
  return (
    <section className="pf-section" style={{ paddingTop: "1rem" }}>
      <div className="container">
        <div className="text-center mb-4 reveal" ref={addRef}>
          <div className="section-label">Credentials</div>
          <div className="accent-line mx-auto" />
          <h2 className="section-title">Certifications</h2>
        </div>
        <div className="row g-3 justify-content-center">
          {certs.map((c, i) => (
            <div className="col-md-8 reveal" ref={addRef} key={c.title} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="cert-card">
                <div>
                  <h6>{c.title}</h6>
                  <p>{c.issuer}</p>
                </div>
                <span className="cert-link">View Certificate →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact({ addRef }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 3200);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="pf-section" id="contact">
      <div className="container">
        <div className="text-center mb-5 reveal" ref={addRef}>
          <div className="section-label">Let's Connect</div>
          <div className="accent-line mx-auto" />
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-desc mx-auto">Have a project in mind, a question, or just want to say hi? Drop me a line.</p>
        </div>
        <div className="reveal" ref={addRef}>
          <div className="contact-wrapper">
            {sent && <div className="success-toast">Message sent successfully ✓</div>}
            <input className="contact-input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="contact-input" placeholder="Your Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea className="contact-input" placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="btn-primary-custom w-100" style={{ padding: ".74rem" }} onClick={submit}>Send Message</button>
          </div>
        </div>
        <div className="social-row reveal mt-4" ref={addRef}>
          {[
            { label: "LinkedIn", icon: "in", href: "https://linkedin.com/in/koushikbijili" },
            { label: "GitHub", icon: "🐙", href: "https://github.com/koushikbijili" },
            { label: "Email", icon: "✉", href: "mailto:koushikbijili48@gmail.com" },
          ].map((s) => (
            <a key={s.label} href={s.href} className="social-btn" title={s.label}>{s.icon}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── APP ─── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const addRef = useReveal();

  return (
    <>
      <BootstrapLink />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <About addRef={addRef} />
      <Skills addRef={addRef} />
      <Projects addRef={addRef} />
      <Experience addRef={addRef} />
      <Certifications addRef={addRef} />
      <Contact addRef={addRef} />
      <footer className="pf-footer">
        <div className="container">
          <p>© 2026 Koushik Bijili &nbsp;|&nbsp; <a href="mailto:koushikbijili48@gmail.com">koushikbijili48@gmail.com</a> &nbsp;|&nbsp; Hyderabad, Telangana</p>
        </div>
      </footer>
    </>
  );
}