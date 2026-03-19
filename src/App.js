import { useState, useEffect, useRef, useCallback } from "react";

/*
  THEME: "Deep Infrastructure"
  Concept: Clean, professional dark portfolio with purposeful depth.
  - Hero: smooth 3D perspective grid floor with mouse parallax
  - Cards: subtle CSS 3D tilt on hover (smooth, not gimmicky)
  - Sections: staggered entrance with depth (translateZ + opacity)
  - Pipeline: clean animated flow diagram
  - Colors: deep navy + electric violet accent — single palette, no rainbow
  - Typography: clean hierarchy, generous whitespace
*/

const V  = "#7c3aed";          // violet-700 — primary accent
const V1 = "rgba(124,58,237,0.1)";
const V2 = "rgba(124,58,237,0.22)";
const V3 = "rgba(124,58,237,0.45)";
const G  = "#10b981";          // emerald — status green only
const FG  = "#f1f5f9";
const FG2 = "rgba(241,245,249,0.55)";
const FG3 = "rgba(241,245,249,0.28)";
const BG0 = "#06060e";
const BG1 = "#0b0d17";
// const BG2 = "#0f1120";
const BD  = "rgba(241,245,249,0.07)";
const BDH = "rgba(124,58,237,0.4)";
const SANS = "'Inter',system-ui,sans-serif";
const MONO = "'JetBrains Mono',monospace";

/* ── DATA ───────────────────────────────────────────────────── */
const ROLES = ["Cloud Engineer","Junior DevOps Engineer","Platform Engineer","Infrastructure Engineer","Site Reliability Engineer (SRE)"];

const SKILLS = [
  { cat:"Cloud Platform",        items:["EC2","S3","IAM","VPC","Route 53","Auto Scaling","Load Balancer","CloudWatch","SNS","ACM","NAT Gateway","CLI","CloudTrail","Launch Templates"] },
  { cat:"DevOps & IaC",         items:["Terraform","Ansible","Jenkins","Docker","DockerHub","GitHub Actions","CI/CD Pipelines","Webhooks","Declarative Pipelines"] },
  { cat:"Monitoring",           items:["Prometheus","Grafana","CloudWatch Alarms","SNS Alerts","Health Checks","CPU Metrics","Custom Dashboards"] },
  { cat:"Networking & Security",items:["VPC Design","Subnets","HTTPS / ALB","ACM SSL","Cloudflare DNS","SSM Access","IAM Policies","Security Groups"] },
  { cat:"Scripting & OS",       items:["Linux","Bash / Shell","Git","GitHub","Nginx","SSH Config","Cron Jobs"] },
  { cat:"Core Concepts",        items:["High Availability","Auto Healing","Zero Downtime","IaC","State Locking","Containerisation","Version Control","Failure Simulation"] },
];

const PROJECTS = [
  {
    n:"01", color: V,
    title:"Production-Grade Cloud Infrastructure",
    sub:"Terraform · ACM SSL · Cloudflare · S3 · DynamoDB",
    github:"https://github.com/koushikbijili/aws-production-infrastructure-terraform.git",
    desc:"Designed and deployed a scalable AWS infrastructure using Terraform, including secure networking, load balancing, and auto-scaling compute. The setup eliminates manual configuration by using infrastructure as code and ensures consistent, repeatable deployments.",
    stack:["Terraform","VPC","ALB","ASG","ACM SSL","Cloudflare","S3","DynamoDB","NAT Gateway","SSM"],
    arch:[["VPC Layer","Public/private subnets across AZs with NAT Gateway for secure outbound access."],["Load Balancer","ALB with ACM SSL — HTTP → HTTPS redirection enforced on all traffic."],["Compute","Auto Scaling Group in private subnets via Systems Manager — no SSH keys."],["State","S3 + DynamoDB remote state with locking preventing concurrent conflicts."]],
    built:["VPC, subnets, IGW, NAT via Terraform modules","ALB HTTPS listener + HTTP→HTTPS redirect rules","ASG launch templates with health-check policies","SSM access eliminating SSH key pairs","Cloudflare DNS with SSL certificate validation","Remote state locking for team collaboration"],
  },
  {
    n:"02", color:"#0ea5e9",
    title:"CI/CD Pipeline Automation",
    sub:"Jenkins · Docker · DockerHub · Webhooks",
    github:"https://github.com/koushikbijili/containerized-cicd-automation.git",
    desc:"End-to-end automated pipeline that builds, tags, and deploys Dockerised applications on every code push — zero manual steps from commit to running container.",
    stack:["Jenkins","Docker","DockerHub","GitHub Webhooks","Shell Scripting","Declarative Pipeline"],
    arch:[["Trigger","GitHub webhook fires on every push, instantly starting the pipeline."],["Build","Jenkins builds + tags a Docker image with the build number."],["Registry","Image pushed to DockerHub via Jenkins-stored secrets."],["Deploy","Latest image pulled and deployed as a running container."]],
    built:["Multi-stage declarative Jenkins pipeline (Build → Push → Deploy)","DockerHub credentials secured as Jenkins secrets","Webhook trigger eliminating manual runs","Build-number image tagging for traceability","Consistent containerised deployment across environments","All manual steps eliminated"],
  },
  {
    n:"03", color:"#10b981",
    title:"Self-Healing Infrastructure",
    sub:"EC2 · ASG · ALB · CloudWatch · SNS · Nginx",
    github:"https://github.com/koushikbijili/Self-Healing-Infrastructure-with-Failure-Simulation.git",
    desc:"Highly available infrastructure that auto-detects failures, terminates unhealthy nodes, launches replacements, and reroutes traffic — validated through deliberate failure simulation.",
    stack:["EC2","ASG","ALB","CloudWatch","SNS","Launch Templates","Nginx","Linux"],
    arch:[["Load Balancer","ALB routes away from unhealthy instances within seconds."],["Auto Scaling","ASG with CPU-based scale-out/in trigger policies."],["Monitoring","CloudWatch alarms on CPU, health status, unhealthy host counts."],["Alerting","SNS real-time email alerts on failure, recovery, and scaling."]],
    built:["Multi-AZ EC2 + ASG + ALB + Launch Templates","ALB health checks for auto instance removal","CloudWatch alarms linked to ASG scaling policies","SNS email subscriptions for all infra events","Force-stop simulation validating self-healing","Zero-downtime rerouting confirmed during failures"],
  },
];

const PHILOSOPHY = [
  { icon:"⚡", title:"Automate Where It Matters", desc:"I focus on automating repetitive tasks to reduce manual errors and improve consistency, especially in deployments and infrastructure setup." },
  { icon:"📐", title:"Build for Scale", desc:"Systems are designed with scalability in mind, using load balancing and modular infrastructure to support future growth." },
  { icon:"🔭", title:"Observability and Monitoring", desc:"Metrics, logs, and alerts aren't optional. You can't fix what you can't see. Monitoring is part of the build, not an add-on." },
  { icon:"💥", title:"Design for Failure", desc:"Failures are inevitable. Design systems that detect, recover, and self-heal automatically — then prove it through deliberate failure simulation." },
  { icon:"🔒", title:"Security by Default", desc:"Integrate security practices into every stage of the development lifecycle. Security is not an afterthought." },
  { icon:"🔁", title:"Continuous Improvement", desc:"Ship, measure, improve. Every deployment is reproducible, reversible, and traceable. Version control is non-negotiable." },
];

/* ── HOOKS ──────────────────────────────────────────────────── */
function useInView(t=0.08) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold:t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function useMouse() {
  const [m, setM] = useState({x:0,y:0});
  useEffect(() => {
    const h = e => setM({ x:(e.clientX/window.innerWidth-0.5)*2, y:(e.clientY/window.innerHeight-0.5)*2 });
    window.addEventListener("mousemove", h, {passive:true});
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return m;
}

/* ── TYPEWRITER ─────────────────────────────────────────────── */
function Typer() {
  const [txt,setTxt]=useState(""); const [ri,setRi]=useState(0); const [ph,setPh]=useState("t");
  useEffect(()=>{
    const w=ROLES[ri%ROLES.length]; let t;
    if(ph==="t"){ if(txt.length<w.length) t=setTimeout(()=>setTxt(w.slice(0,txt.length+1)),55); else t=setTimeout(()=>setPh("p"),2000); }
    else if(ph==="p") t=setTimeout(()=>setPh("d"),60);
    else { if(txt.length>0) t=setTimeout(()=>setTxt(s=>s.slice(0,-1)),28); else{setRi(i=>i+1);setPh("t");} }
    return()=>clearTimeout(t);
  },[txt,ph,ri]);
  return <span style={{color:V,fontWeight:600}}>{txt}<span style={{animation:"blink .9s step-end infinite",borderLeft:`1.5px solid ${V}`,marginLeft:1}}> </span></span>;
}

/* ── 3D TILT CARD ───────────────────────────────────────────── */
function Tilt({children, style={}, depth=10, glow=V1}) {
  const r=useRef(null);
  const onMove=useCallback(e=>{
    const el=r.current; if(!el) return;
    const b=el.getBoundingClientRect();
    const x=((e.clientX-b.left)/b.width-0.5)*2;
    const y=((e.clientY-b.top)/b.height-0.5)*2;
    el.style.transform=`perspective(900px) rotateX(${-y*depth}deg) rotateY(${x*depth}deg) translateZ(8px)`;
    el.style.boxShadow=`0 24px 60px ${glow}, 0 0 0 1px ${BDH}`;
  },[depth,glow]);
  const onLeave=useCallback(()=>{
    const el=r.current; if(!el) return;
    el.style.transform="perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    el.style.boxShadow=`0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${BD}`;
  },[]);
  return (
    <div ref={r} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{transition:"transform 0.18s ease, box-shadow 0.3s ease", transformStyle:"preserve-3d", willChange:"transform", boxShadow:`0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${BD}`, ...style}}>
      {children}
    </div>
  );
}

/* ── REVEAL ─────────────────────────────────────────────────── */
function Reveal({children, delay=0, dir="up"}) {
  const [ref,v]=useInView();
  const init = dir==="left" ? "translateX(-32px)" : dir==="right" ? "translateX(32px)" : "translateY(28px)";
  return (
    <div ref={ref} style={{opacity:v?1:0, transform:v?"none":init, transition:`opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`}}>
      {children}
    </div>
  );
}

/* ── SECTION LABEL ──────────────────────────────────────────── */
function SL({tag,title}) {
  return (
    <div style={{marginBottom:"3rem"}}>
      <p style={{fontFamily:MONO,fontSize:"0.62rem",color:V,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.5rem",opacity:.85}}>{tag}</p>
      <h2 style={{fontFamily:SANS,fontSize:"clamp(1.35rem,3vw,1.85rem)",fontWeight:700,color:FG,margin:0,letterSpacing:"-0.025em",lineHeight:1.15}}>{title}</h2>
    </div>
  );
}

/* ── PIPELINE ANIMATION ─────────────────────────────────────── */

/* ── HERO GRID FLOOR ────────────────────────────────────────── */
function GridFloor({mouse}) {
  return (
    <div style={{
      position:"absolute",bottom:0,left:0,right:0,height:"55%",
      background:`
        linear-gradient(transparent 0%, rgba(124,58,237,0.03) 100%),
        repeating-linear-gradient(90deg, ${BD} 0px, transparent 1px, transparent 60px, ${BD} 61px),
        repeating-linear-gradient(0deg,  ${BD} 0px, transparent 1px, transparent 60px, ${BD} 61px)
      `,
      transform:`perspective(700px) rotateX(55deg) translateY(${mouse.y*6}px)`,
      transformOrigin:"50% 100%",
      pointerEvents:"none",
      maskImage:"linear-gradient(to bottom, transparent 0%, black 40%, black 70%, transparent 100%)",
    }}/>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────── */
function Nav({active,setActive}) {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const links=["Home","About","Philosophy","Skills","Experience","Projects","Certifications","Contact"];
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const go=id=>{document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});setActive(id);setOpen(false);};
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(1.5rem,4vw,3rem)",background:scrolled?"rgba(6,6,14,0.85)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${BD}`:"none",transition:"all .4s"}}>
      <div style={{fontFamily:MONO,fontSize:".9rem",fontWeight:700,color:FG,letterSpacing:"-.01em"}}>
        KB<span style={{color:V}}>.</span>
      </div>
      <div className="dnav" style={{display:"flex",gap:"2rem"}}>
        {links.map(l=>(
          <button key={l} onClick={()=>go(l)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:SANS,fontSize:".78rem",fontWeight:500,color:active===l?FG:FG3,transition:"color .25s",padding:0,letterSpacing:"-.01em"}}>
            {l}
          </button>
        ))}
      </div>
      <a href="mailto:koushikbijili48@gmail.com" className="dnav"
        style={{fontFamily:SANS,fontSize:".75rem",fontWeight:600,color:"#fff",background:V,textDecoration:"none",padding:"7px 18px",borderRadius:7,transition:"all .25s",letterSpacing:"-.01em"}}
        onMouseEnter={e=>{e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)";}}
        onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
        Hire Me
      </a>
      <button className="ham" onClick={()=>setOpen(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"pointer",color:FG,fontSize:"1.2rem",padding:4}}>{open?"✕":"☰"}</button>
      {open&&(
        <div style={{position:"fixed",top:58,left:0,right:0,bottom:0,background:"rgba(6,6,14,.97)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2.5rem",zIndex:199}}>
          {links.map(l=><button key={l} onClick={()=>go(l)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:SANS,fontSize:"1.1rem",fontWeight:500,color:active===l?V:FG,letterSpacing:"-.02em"}}>{l}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ───────────────────────────────────────────────────── */
function Hero({mouse}) {
  return(
    <section id="home" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:`radial-gradient(ellipse 100% 70% at 50% -10%, rgba(124,58,237,.13) 0%, transparent 65%), ${BG0}`,padding:"7rem 2rem 5rem"}}>

      <GridFloor mouse={mouse}/>

      {/* Top-left corner accent */}
      <div style={{position:"absolute",top:0,left:0,width:1,height:"40%",background:`linear-gradient(${V3},transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:0,left:0,width:"20%",height:1,background:`linear-gradient(90deg,${V3},transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:0,right:0,width:1,height:"25%",background:`linear-gradient(${BD},transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:0,right:0,width:"15%",height:1,background:`linear-gradient(270deg,${BD},transparent)`,pointerEvents:"none"}}/>

      {/* Content - shifts slightly with mouse for parallax feel */}
      <div style={{
        position:"relative",zIndex:2,textAlign:"center",maxWidth:720,width:"100%",
        transform:`translate(${mouse.x*-6}px,${mouse.y*-4}px)`,
        transition:"transform .12s ease",
      }}>
        {/* Status */}
        <div style={{opacity:0,animation:"fadeUp .7s ease .1s forwards"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:MONO,fontSize:".62rem",color:G,letterSpacing:".15em",textTransform:"uppercase",border:"1px solid rgba(16,185,129,.22)",borderRadius:100,padding:"5px 14px",marginBottom:"2rem",background:"rgba(16,185,129,.05)"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:G,animation:"glow 1.8s ease-in-out infinite",display:"inline-block"}}/>
            Available for Opportunities
          </div>
        </div>

        {/* Name — 3D depth effect via textShadow layers */}
        <div style={{opacity:0,animation:"fadeUp .7s ease .2s forwards"}}>
          <h1 style={{
            fontFamily:SANS,fontSize:"clamp(2.4rem,7vw,4.5rem)",fontWeight:800,color:FG,
            letterSpacing:"-.04em",lineHeight:1.05,margin:"0 0 1.1rem",whiteSpace:"nowrap",
            textShadow:`0 1px 0 rgba(124,58,237,.3), 0 2px 0 rgba(124,58,237,.2), 0 4px 0 rgba(124,58,237,.1), 0 8px 20px rgba(0,0,0,.5)`,
            transform:`perspective(600px) rotateX(${mouse.y*3}deg) rotateY(${mouse.x*-3}deg)`,
            transition:"transform .15s ease",
          }}>
            Koushik Bijili
          </h1>
        </div>

        {/* Role */}
        <div style={{opacity:0,animation:"fadeUp .7s ease .3s forwards"}}>
          <p style={{fontFamily:SANS,fontSize:"clamp(1rem,2.5vw,1.2rem)",color:FG2,margin:"0 0 1.6rem",lineHeight:1.5,fontWeight:400}}>
            <Typer/>
          </p>
        </div>

        {/* Description */}
        <div style={{opacity:0,animation:"fadeUp .7s ease .4s forwards"}}>
          <p style={{fontFamily:SANS,fontSize:".93rem",lineHeight:1.88,color:FG3,maxWidth:500,margin:"0 auto 2.8rem"}}>
            I design and manage cloud-based systems with a focus on scalability and automation. Delivering solutions that are efficient, reliable, and ready for production use.
          </p>
        </div>

        {/* CTAs */}
        <div style={{opacity:0,animation:"fadeUp .7s ease .5s forwards"}}>
          <div style={{display:"flex",gap:".9rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"2.8rem"}}>
            <button onClick={()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}
              style={{fontFamily:SANS,fontSize:".82rem",fontWeight:600,color:"#fff",background:V,border:"none",cursor:"pointer",padding:"12px 30px",borderRadius:8,letterSpacing:"-.01em",transition:"all .25s",boxShadow:`0 0 0 0 ${V2}`}}
              onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow=`0 10px 40px ${V2}`;}}
              onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 0 0 0 transparent";}}>
              View Projects
            </button>
            <button onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              style={{fontFamily:SANS,fontSize:".82rem",fontWeight:500,color:FG2,background:"transparent",border:`1px solid ${BDH}`,cursor:"pointer",padding:"12px 30px",borderRadius:8,letterSpacing:"-.01em",transition:"all .25s"}}
              onMouseEnter={e=>{e.target.style.color=FG;e.target.style.borderColor=V3;e.target.style.background=V1;}}
              onMouseLeave={e=>{e.target.style.color=FG2;e.target.style.borderColor=BDH;e.target.style.background="transparent";}}>
              Contact Me
            </button>
          </div>
        </div>

        {/* Social links */}
        <div style={{opacity:0,animation:"fadeUp .7s ease .6s forwards"}}>
          <div style={{display:"flex",gap:"2rem",justifyContent:"center"}}>
            {[{l:"LinkedIn",u:"https://linkedin.com/in/koushikbijili"},{l:"GitHub",u:"https://github.com/koushikbijili"},{l:"Email",u:"mailto:koushikbijili48@gmail.com"}].map(s=>(
              <a key={s.l} href={s.u} target="_blank" rel="noreferrer"
                style={{fontFamily:MONO,fontSize:".6rem",color:FG3,textDecoration:"none",letterSpacing:".1em",textTransform:"uppercase",transition:"color .25s"}}
                onMouseEnter={e=>e.target.style.color=FG} onMouseLeave={e=>e.target.style.color=FG3}>{s.l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{position:"absolute",bottom:"2.5rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:2,animation:"bob 2.5s ease-in-out infinite"}}>
        <span style={{fontFamily:MONO,fontSize:".55rem",color:FG3,letterSpacing:".15em",textTransform:"uppercase"}}>scroll</span>
        <div style={{width:1,height:40,background:`linear-gradient(${V3},transparent)`}}/>
      </div>
    </section>
  );
}

/* ── ABOUT ──────────────────────────────────────────────────── */
function About() {
  return(
    <section id="about" style={{padding:"8rem clamp(1.5rem,4vw,3rem)",background:BG1,position:"relative",overflow:"hidden"}}>
      {/* Decorative corner lines */}
      <div style={{position:"absolute",top:0,right:"8%",width:1,height:120,background:`linear-gradient(${BD},transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:0,right:"8%",width:80,height:1,background:`linear-gradient(270deg,${BD},transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:0,left:"5%",width:1,height:100,background:`linear-gradient(transparent,${BD})`,pointerEvents:"none"}}/>

      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <div className="a2col" style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:"5rem",alignItems:"start"}}>
          <Reveal>
            <SL tag="01 — About" title="Who I Am"/>
            <div style={{display:"flex",gap:".6rem",flexWrap:"wrap",marginTop:"1rem"}}>
              {[["📍","Hyderabad"],["☁️","Cloud & DevOps"],["✅","Open to Work"]].map(([ic,v])=>(
                <span key={v} style={{fontFamily:SANS,fontSize:".73rem",color:FG2,background:`rgba(241,245,249,.04)`,border:`1px solid ${BD}`,borderRadius:6,padding:"4px 11px"}}>
                  <span style={{fontSize:12}}>{ic}</span> {v}
                </span>
              ))}
            </div>
          </Reveal>

          <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
            <Reveal delay={60}>
              <p style={{fontFamily:SANS,fontSize:".95rem",lineHeight:1.88,color:FG2,margin:0}}>
                I'm a <span style={{color:FG,fontWeight:600}}>Cloud & DevOps Engineer</span> focused on building scalable and reliable cloud systems. With a background in Automobile Engineering, I transitioned into cloud with a clear focus on infrastructure, automation, and real-world problem solving.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p style={{fontFamily:SANS,fontSize:".95rem",lineHeight:1.88,color:FG2,margin:0}}>
                At <span style={{color:FG,fontWeight:600}}>Visys Cloud Technologies</span>, I work with production systems, focusing on deployment automation, infrastructure management, and reliability — ensuring systems run smoothly and consistently.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p style={{fontFamily:SANS,fontSize:".95rem",lineHeight:1.88,color:FG2,margin:0}}>
               I believe in keeping systems simple, automated, and production-ready — so they perform consistently without unnecessary complexity.
              </p>
            </Reveal>

            {/* Stats */}
            <Reveal delay={240}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:BD,border:`1px solid ${BD}`,borderRadius:10,overflow:"hidden",marginTop:".8rem"}}>
                {[["3+","Projects"],["6mo","Internship"],["2","Certs"],["10+","Cloud Svcs"]].map(([n,l])=>(
                  <div key={l} style={{background:BG1,padding:"1.2rem .8rem",textAlign:"center"}}>
                    <div style={{fontFamily:SANS,fontSize:"1.5rem",fontWeight:700,color:FG,letterSpacing:"-.03em",marginBottom:3}}>{n}</div>
                    <div style={{fontFamily:SANS,fontSize:".65rem",color:FG3,textTransform:"uppercase",letterSpacing:".08em"}}>{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div style={{display:"flex",gap:".7rem",flexWrap:"wrap",marginTop:".5rem"}}>
                <a href="mailto:koushikbijili48@gmail.com" style={{fontFamily:SANS,fontSize:".82rem",fontWeight:600,color:"#fff",background:V,textDecoration:"none",padding:"10px 22px",borderRadius:8,transition:"all .25s"}} onMouseEnter={e=>{e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>Hire Me</a>
                <a href="https://github.com/koushikbijili" target="_blank" rel="noreferrer" style={{fontFamily:SANS,fontSize:".82rem",fontWeight:500,color:FG2,border:`1px solid ${BD}`,textDecoration:"none",padding:"10px 22px",borderRadius:8,transition:"all .25s"}} onMouseEnter={e=>{e.currentTarget.style.color=FG;e.currentTarget.style.borderColor=BDH;}} onMouseLeave={e=>{e.currentTarget.style.color=FG2;e.currentTarget.style.borderColor=BD;}}>GitHub →</a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PHILOSOPHY ─────────────────────────────────────────────── */
function Philosophy() {
  return(
    <section id="philosophy" style={{padding:"8rem clamp(1.5rem,4vw,3rem)",background:BG0,position:"relative",overflow:"hidden"}}>
      {/* Subtle accent glow */}
      <div style={{position:"absolute",top:"30%",right:"-5%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${V1},transparent 70%)`,filter:"blur(60px)",pointerEvents:"none"}}/>
      <div style={{maxWidth:1080,margin:"0 auto",position:"relative"}}>
        <Reveal><SL tag="02 — Philosophy" title="How I Work"/></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"1px",background:BD,border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden"}}>
          {PHILOSOPHY.map((p,i)=>(
            <Reveal key={i} delay={i*55}>
              <Tilt depth={6} glow={V1} style={{background:BG0,borderRadius:0,boxShadow:"none",border:"none",height:"100%"}}>
                <div style={{padding:"2rem",height:"100%",transition:"background .25s",borderTop:`2px solid transparent`}}
                  onMouseEnter={e=>{e.currentTarget.style.background=V1;e.currentTarget.style.borderTopColor=V;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderTopColor="transparent";}}>
                  <div style={{fontSize:24,marginBottom:"1rem"}}>{p.icon}</div>
                  <h3 style={{fontFamily:SANS,fontSize:".9rem",fontWeight:600,color:FG,margin:"0 0 .7rem",letterSpacing:"-.015em",lineHeight:1.3}}>{p.title}</h3>
                  <p style={{fontFamily:SANS,fontSize:".83rem",lineHeight:1.82,color:FG2,margin:0}}>{p.desc}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ─────────────────────────────────────────────────── */
function Skills() {
  return(
    <section id="skills" style={{padding:"8rem clamp(1.5rem,4vw,3rem)",background:BG0,position:"relative"}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Reveal><SL tag="03 — Skills" title="Tech Stack"/></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"1px",background:BD,border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden"}}>
          {SKILLS.map((s,i)=>(
            <Reveal key={i} delay={i*50}>
              <Tilt depth={6} glow="rgba(124,58,237,0.1)"
                style={{background:BG0,borderRadius:0,boxShadow:"none",border:"none",height:"100%"}}>
                <div style={{padding:"1.8rem",height:"100%",transition:"background .25s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <h3 style={{fontFamily:SANS,fontSize:".78rem",fontWeight:600,color:V,margin:"0 0 1rem",textTransform:"uppercase",letterSpacing:".08em"}}>{s.cat}</h3>
                  <div style={{display:"flex",flexWrap:"wrap",gap:".38rem"}}>
                    {s.items.map((item,j)=>(
                      <span key={j} style={{fontFamily:MONO,fontSize:".65rem",color:FG2,background:"rgba(241,245,249,.04)",border:`1px solid ${BD}`,borderRadius:4,padding:"3px 8px",lineHeight:1.5}}>{item}</span>
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

/* ── EXPERIENCE ─────────────────────────────────────────────── */
function Experience() {
  return(
    <section id="experience" style={{padding:"8rem clamp(1.5rem,4vw,3rem)",background:BG1}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <div className="a2col" style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:"5rem",alignItems:"start"}}>
          <Reveal><SL tag="04 — Experience" title="Where I've Worked"/></Reveal>
          <div>
            <Reveal>
              <div style={{paddingBottom:"2.8rem",marginBottom:"2.8rem",borderBottom:`1px solid ${BD}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:".5rem",marginBottom:"1.2rem"}}>
                  <div>
                    <h3 style={{fontFamily:SANS,fontSize:"1rem",fontWeight:600,color:FG,margin:"0 0 .2rem",letterSpacing:"-.015em"}}>Cloud & DevOps Intern</h3>
                    <p style={{fontFamily:SANS,fontSize:".82rem",color:FG3,margin:0}}>Visys Cloud Technologies · Hyderabad</p>
                  </div>
                  <span style={{fontFamily:MONO,fontSize:".6rem",color:V,background:V1,border:`1px solid ${V2}`,borderRadius:4,padding:"3px 10px",whiteSpace:"nowrap"}}>Sep 2025 – Feb 2026</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:".75rem"}}>
                  {["Automated CI/CD workflows with Jenkins, improving deployment efficiency and reducing manual intervention.",
                    "Designed and provisioned cloud infrastructure (compute, storage, networking, load balancing, auto scaling) for highly available deployments.",
                    "Configured Prometheus metrics and visualised performance using Grafana dashboards.",
                    "Managed user access, configured systems with access control and active directory."
                  ].map((pt,i)=>(
                    <div key={i} style={{display:"flex",gap:".75rem",alignItems:"flex-start"}}>
                      <span style={{width:4,height:4,borderRadius:"50%",background:V,flexShrink:0,marginTop:8}}/>
                      <span style={{fontFamily:SANS,fontSize:".88rem",lineHeight:1.8,color:FG2}}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:".5rem",marginBottom:".5rem"}}>
                  <div>
                    <h3 style={{fontFamily:SANS,fontSize:"1rem",fontWeight:600,color:FG,margin:"0 0 .2rem",letterSpacing:"-.015em"}}>Bachelor of Engineering</h3>
                    <p style={{fontFamily:SANS,fontSize:".82rem",color:FG3,margin:"0 0 .1rem"}}>MVSR Engineering College, Hyderabad</p>
                    <p style={{fontFamily:SANS,fontSize:".82rem",color:FG3,margin:0}}>Automobile Engineering · CGPA 7.26</p>
                  </div>
                  <span style={{fontFamily:MONO,fontSize:".6rem",color:FG3,background:"rgba(241,245,249,.04)",border:`1px solid ${BD}`,borderRadius:4,padding:"3px 10px",whiteSpace:"nowrap"}}>2020 – 2024</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ───────────────────────────────────────────────── */
function ProjectCard({p,i}) {
  const [ref,v]=useInView(0.05);
  return(
    <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(32px)",transition:`opacity .7s ease ${i*100}ms, transform .7s ease ${i*100}ms`}}>
      <Tilt depth={5} glow={`${p.color}18`} style={{background:BG1,borderRadius:12,overflow:"hidden"}}>
        {/* Accent top bar */}
        <div style={{height:2,background:`linear-gradient(90deg,${p.color} 0%,transparent 55%)`}}/>
        <div style={{padding:"2.2rem"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem",marginBottom:"1.3rem"}}>
            <div>
              <span style={{fontFamily:MONO,fontSize:".58rem",color:p.color,letterSpacing:".14em",opacity:.8}}>Project {p.n}</span>
              <h3 style={{fontFamily:SANS,fontSize:"1.05rem",fontWeight:600,color:FG,margin:".25rem 0 .25rem",letterSpacing:"-.02em",lineHeight:1.2}}>{p.title}</h3>
              <p style={{fontFamily:MONO,fontSize:".58rem",color:FG3,margin:0}}>{p.sub}</p>
            </div>
            <a href={p.github} target="_blank" rel="noreferrer"
              style={{fontFamily:SANS,fontSize:".75rem",fontWeight:500,color:p.color,textDecoration:"none",border:`1px solid ${p.color}35`,padding:"6px 14px",borderRadius:6,transition:"all .25s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${p.color}12`;e.currentTarget.style.borderColor=`${p.color}65`;}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=`${p.color}35`;}}>
              GitHub →
            </a>
          </div>

          {/* Desc */}
          <p style={{fontFamily:SANS,fontSize:".88rem",lineHeight:1.88,color:FG2,marginBottom:"1.6rem",paddingBottom:"1.6rem",borderBottom:`1px solid ${BD}`}}>{p.desc}</p>

          {/* Stack */}
          <div style={{marginBottom:"1.8rem"}}>
            <p style={{fontFamily:MONO,fontSize:".58rem",color:FG3,letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 .7rem"}}>Stack</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:".38rem"}}>
              {p.stack.map((s,j)=><span key={j} style={{fontFamily:MONO,fontSize:".63rem",color:FG2,background:"rgba(241,245,249,.04)",border:`1px solid ${BD}`,borderRadius:4,padding:"3px 9px"}}>{s}</span>)}
            </div>
          </div>

          {/* Arch + Built */}
          <div className="pgrid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem"}}>
            <div>
              <p style={{fontFamily:MONO,fontSize:".58rem",color:FG3,letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 .9rem"}}>Architecture</p>
              {p.arch.map(([t,d],j)=>(
                <div key={j} style={{marginBottom:".9rem"}}>
                  <p style={{fontFamily:SANS,fontSize:".8rem",fontWeight:600,color:FG,margin:"0 0 .18rem",letterSpacing:"-.01em"}}>{t}</p>
                  <p style={{fontFamily:SANS,fontSize:".8rem",lineHeight:1.72,color:FG3,margin:0}}>{d}</p>
                </div>
              ))}
            </div>
            <div>
              <p style={{fontFamily:MONO,fontSize:".58rem",color:FG3,letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 .9rem"}}>What I Built</p>
              {p.built.map((d,j)=>(
                <div key={j} style={{display:"flex",gap:".6rem",alignItems:"flex-start",marginBottom:".6rem"}}>
                  <span style={{width:4,height:4,borderRadius:"50%",background:p.color,flexShrink:0,marginTop:6}}/>
                  <span style={{fontFamily:SANS,fontSize:".82rem",lineHeight:1.75,color:FG2}}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}

function Projects() {
  return(
    <section id="projects" style={{padding:"8rem clamp(1.5rem,4vw,3rem)",background:BG0,position:"relative"}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Reveal><SL tag="05 — Projects" title="What I've Built"/></Reveal>

        <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
          {PROJECTS.map((p,i)=><ProjectCard key={i} p={p} i={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ── CERTIFICATIONS ─────────────────────────────────────────── */
function Certifications() {
  return(
    <section id="certifications" style={{padding:"8rem clamp(1.5rem,4vw,3rem)",background:BG1}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <div className="a2col" style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:"5rem",alignItems:"start"}}>
          <Reveal><SL tag="06 — Certifications" title="Learning & Certifications"/></Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            {[
              {name:"Oracle Certified Foundations Associate",issuer:"Oracle",yr:"2025",ic:"🏅",link:"https://drive.google.com/file/d/1bHB38zUN6Pjv1ttnPkfCXMySXVwqlQAy/view?usp=drive_link"},
              {name:"Solutions Architecture – Job Simulation",issuer:"Forage / Virtual Experience",yr:"2025",ic:"🎯",link:"https://drive.google.com/file/d/1TEQQPHopYd1SMvVJpVIOO7hpEdqMtyxJ/view?usp=drive_link"},
            ].map((c,i)=>(
              <Reveal key={i} delay={i*80}>
                <Tilt depth={7} glow={V1} style={{background:BG0,borderRadius:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:"1.4rem",padding:"1.5rem"}}>
                    <div style={{width:42,height:42,borderRadius:9,background:V1,border:`1px solid ${V2}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:20}}>{c.ic}</span>
                    </div>
                    <div style={{flex:1}}>
                      <h3 style={{fontFamily:SANS,fontSize:".92rem",fontWeight:600,color:FG,margin:"0 0 .2rem",letterSpacing:"-.015em",lineHeight:1.3}}>{c.name}</h3>
                      <p style={{fontFamily:SANS,fontSize:".78rem",color:FG3,margin:0}}>{c.issuer}</p>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:".8rem",flexShrink:0}}>
                      <span style={{fontFamily:MONO,fontSize:".58rem",color:FG3}}>{c.yr}</span>
                      <a href={c.link} target="_blank" rel="noreferrer"
                        style={{fontFamily:SANS,fontSize:".72rem",fontWeight:500,color:V,textDecoration:"none",border:`1px solid ${V2}`,padding:"5px 12px",borderRadius:6,transition:"all .25s",whiteSpace:"nowrap"}}
                        onMouseEnter={e=>{e.currentTarget.style.background=V1;e.currentTarget.style.borderColor=V3;}}
                        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=V2;}}>
                        View →
                      </a>
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
  const contacts=[
    {l:"Email",v:"koushikbijili48@gmail.com",href:"mailto:koushikbijili48@gmail.com"},
    {l:"Phone",v:"+91 7675082758",href:"tel:+917675082758"},
    {l:"LinkedIn",v:"koushikbijili",href:"https://linkedin.com/in/koushikbijili"},
    {l:"GitHub",v:"koushikbijili",href:"https://github.com/koushikbijili"},
    {l:"Location",v:"Hyderabad, Telangana",href:"#"},
  ];
  return(
    <section id="contact" style={{padding:"8rem clamp(1.5rem,4vw,3rem) 6rem",background:BG0,position:"relative",overflow:"hidden"}}>
      {/* Bottom glow */}
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:600,height:200,background:`radial-gradient(ellipse,${V1},transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{maxWidth:1080,margin:"0 auto",position:"relative"}}>
        <div className="a2col" style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:"5rem",alignItems:"start"}}>
          <Reveal>
            <SL tag="07 — Contact" title="Get in Touch"/>
            <p style={{fontFamily:SANS,fontSize:".92rem",lineHeight:1.85,color:FG2,marginBottom:"1.5rem"}}>Open to Cloud and DevOps roles focused on infrastructure, automation, and reliability. Feel free to reach out via email or LinkedIn to connect.</p>
            <div style={{display:"flex",gap:".7rem"}}>
              <a href="mailto:koushikbijili48@gmail.com" style={{fontFamily:SANS,fontSize:".82rem",fontWeight:600,color:"#fff",background:V,textDecoration:"none",padding:"10px 22px",borderRadius:8,transition:"all .25s",display:"inline-block"}} onMouseEnter={e=>{e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>Send Email</a>
              <a href="https://linkedin.com/in/koushikbijili" target="_blank" rel="noreferrer" style={{fontFamily:SANS,fontSize:".82rem",fontWeight:500,color:FG2,border:`1px solid ${BD}`,textDecoration:"none",padding:"10px 22px",borderRadius:8,transition:"all .25s",display:"inline-block"}} onMouseEnter={e=>{e.currentTarget.style.color=FG;e.currentTarget.style.borderColor=BDH;}} onMouseLeave={e=>{e.currentTarget.style.color=FG2;e.currentTarget.style.borderColor=BD;}}>LinkedIn →</a>
            </div>
          </Reveal>

          <div style={{display:"flex",flexDirection:"column",gap:".65rem"}}>
            {contacts.map((c,i)=>(
              <Reveal key={i} delay={i*55}>
                <a href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noreferrer"
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 1.4rem",background:BG1,border:`1px solid ${BD}`,borderRadius:8,textDecoration:"none",transition:"all .25s",gap:"1rem"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=BDH;e.currentTarget.style.background=V1;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.background=BG1;}}>
                  <span style={{fontFamily:MONO,fontSize:".58rem",color:V,letterSpacing:".1em",textTransform:"uppercase",minWidth:68}}>{c.l}</span>
                  <span style={{fontFamily:SANS,fontSize:".85rem",color:FG2,flex:1}}>{c.v}</span>
                  <span style={{color:FG3,fontSize:".72rem"}}>→</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{marginTop:"5rem",paddingTop:"2rem",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
          <span style={{fontFamily:MONO,fontSize:".58rem",color:FG3,letterSpacing:".08em"}}>KB. · Cloud & DevOps Engineer · {new Date().getFullYear()}</span>
          <div style={{display:"flex",gap:"1.5rem"}}>
            {[{l:"LinkedIn",u:"https://linkedin.com/in/koushikbijili"},{l:"GitHub",u:"https://github.com/koushikbijili"}].map(s=>(
              <a key={s.l} href={s.u} target="_blank" rel="noreferrer" style={{fontFamily:MONO,fontSize:".58rem",color:FG3,textDecoration:"none",letterSpacing:".08em",textTransform:"uppercase",transition:"color .25s"}} onMouseEnter={e=>e.target.style.color=FG} onMouseLeave={e=>e.target.style.color=FG3}>{s.l}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── APP ────────────────────────────────────────────────────── */
export default function App() {
  const [active,setActive]=useState("Home");
  const mouse=useMouse();

  useEffect(()=>{
    const ids=["home","about","philosophy","skills","experience","projects","certifications","contact"];
    const obs=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id.charAt(0).toUpperCase()+e.target.id.slice(1));});
    },{rootMargin:"-40% 0px -40% 0px"});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:${BG0};color:${FG};overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${BG0};}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,.45);border-radius:2px;}

        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes blink   { 0%,100%{opacity:1;}50%{opacity:0;} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.5);}50%{box-shadow:0 0 0 5px rgba(16,185,129,0);} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.7;transform:scale(1.3);} }
        @keyframes ring    { 0%{transform:scale(.85);opacity:1;}100%{transform:scale(1.7);opacity:0;} }
        @keyframes packet  { 0%{left:0;}100%{left:calc(100% - 6px);} }
        @keyframes bob     { 0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(8px);} }
        @keyframes floatOrb{ 0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-20px);} }

        .dnav{display:flex!important;}
        .ham{display:none!important;}
        @media(max-width:820px){
          .dnav{display:none!important;}
          .ham{display:block!important;}
          .a2col{grid-template-columns:1fr!important;gap:2.5rem!important;}
          .pgrid{grid-template-columns:1fr!important;gap:1.5rem!important;}
          h1{white-space:normal!important;font-size:clamp(2rem,9vw,3rem)!important;}
        }
      `}</style>
      <Nav active={active} setActive={setActive}/>
      <Hero mouse={mouse}/>
      <About/>
      <Philosophy/>
      <Skills/>
      <Experience/>
      <Projects/>
      <Certifications/>
      <Contact/>
    </>
  );
}