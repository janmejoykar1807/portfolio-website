import { useEffect, useRef, useState } from "react";

const GOLD = "#c9a84c";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --bg: #0d0d0f; --bg2: #121217; --bg3: #18181f;
    --gold: #c9a84c; --gold-light: #e8c97a; --gold-dim: #7a6330;
    --white: #f0ede8; --muted: #7a7875;
    --border: rgba(201,168,76,0.15); --border2: rgba(240,237,232,0.07);
    --font-display: 'Cinzel', serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body {
    background: var(--bg); color: var(--white);
    font-family: var(--font-body); font-weight: 300;
    line-height: 1.7; overflow-x: hidden; cursor: none;
  }

  body::before {
    content: ''; position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9997; opacity: 0.6;
  }

  #cursor {
    position: fixed; width: 10px; height: 10px;
    background: var(--gold); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%);
    transition: width .2s, height .2s;
  }
  #cursor-ring {
    position: fixed; width: 36px; height: 36px;
    border: 1px solid rgba(201,168,76,.5); border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transform: translate(-50%,-50%);
    transition: left .12s ease, top .12s ease, width .3s, height .3s;
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.4rem 4rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: background .4s, backdrop-filter .4s, border-color .4s;
    border-bottom: 1px solid transparent;
  }
  nav.scrolled {
    background: rgba(13,13,15,.88);
    backdrop-filter: blur(20px);
    border-color: var(--border);
  }
  .nav-logo {
    font-family: var(--font-display); font-size: 1rem; font-weight: 700;
    letter-spacing: .18em; color: var(--gold);
    text-decoration: none; text-transform: uppercase;
  }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    font-family: var(--font-mono); font-size: .72rem;
    letter-spacing: .12em; color: var(--muted);
    text-decoration: none; text-transform: uppercase;
    transition: color .2s; cursor: none;
  }
  .nav-links a:hover { color: var(--gold); }

  /* HERO */
  #hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 8rem 4rem 6rem; position: relative; overflow: hidden;
  }
  #hero::after {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
    animation: gridPulse 8s ease-in-out infinite;
  }
  @keyframes gridPulse { 0%,100%{opacity:.6} 50%{opacity:1} }

  .particle {
    position: fixed; width: 2px; height: 2px;
    background: var(--gold); border-radius: 50%; opacity: 0;
    animation: floatUp var(--d,12s) var(--delay,0s) ease-in-out infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes floatUp {
    0%{transform:translateY(100vh) translateX(0);opacity:0}
    10%{opacity:.6} 90%{opacity:.2}
    100%{transform:translateY(-10vh) translateX(var(--dx,40px));opacity:0}
  }

  .hero-content { position: relative; z-index: 2; max-width: 900px; }
  .hero-tag {
    font-family: var(--font-mono); font-size: .72rem;
    letter-spacing: .2em; color: var(--gold);
    text-transform: uppercase; margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 1rem;
    opacity: 0; animation: heroIn .8s .1s ease forwards;
  }
  .hero-tag::before { content:''; display:block; width:40px; height:1px; background:var(--gold); }
  .hero-h1 {
    font-family: var(--font-display);
    font-size: clamp(3.5rem,8vw,7rem); font-weight: 900;
    line-height: .95; letter-spacing: -.02em; color: var(--white);
    margin-bottom: 1.5rem;
    opacity: 0; animation: heroIn .8s .25s ease forwards;
  }
  .hero-h1 .accent { color: var(--gold); }
  .hero-sub {
    font-size: 1.1rem; font-weight: 300; color: var(--muted);
    max-width: 560px; line-height: 1.8; margin-bottom: 3rem;
    opacity: 0; animation: heroIn .8s .4s ease forwards;
  }
  .hero-stats {
    display: flex; gap: 3rem; margin-bottom: 3.5rem; flex-wrap: wrap;
    opacity: 0; animation: heroIn .8s .55s ease forwards;
  }
  .stat-num {
    font-family: var(--font-display); font-size: 2.2rem;
    font-weight: 700; color: var(--gold); line-height: 1; display: block;
  }
  .stat-label {
    font-family: var(--font-mono); font-size: .65rem;
    letter-spacing: .15em; color: var(--muted);
    text-transform: uppercase; margin-top: .3rem; display: block;
  }
  .hero-ctas {
    display: flex; gap: 1rem; flex-wrap: wrap;
    opacity: 0; animation: heroIn .8s .7s ease forwards;
  }
  @keyframes heroIn { to { opacity:1; transform:none; } }

  .scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: .5rem;
    font-family: var(--font-mono); font-size: .6rem;
    letter-spacing: .2em; color: var(--muted); text-transform: uppercase;
    animation: bounce 2s ease-in-out infinite;
  }
  .scroll-hint::after {
    content:''; display:block; width:1px; height:40px;
    background: linear-gradient(var(--gold),transparent);
  }
  @keyframes bounce {
    0%,100%{transform:translateX(-50%) translateY(0)}
    50%{transform:translateX(-50%) translateY(6px)}
  }

  .btn {
    display: inline-flex; align-items: center; gap: .6rem;
    padding: .85rem 2rem;
    font-family: var(--font-mono); font-size: .72rem;
    letter-spacing: .12em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: none;
    transition: all .25s;
  }
  .btn-primary { background: var(--gold); color: var(--bg); font-weight: 500; }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
  .btn-outline { background: transparent; border: 1px solid var(--border2); color: var(--muted); }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

  /* SECTIONS */
  section { padding: 7rem 4rem; }
  .section-tag {
    font-family: var(--font-mono); font-size: .68rem;
    letter-spacing: .2em; color: var(--gold); text-transform: uppercase;
    margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem;
  }
  .section-tag::before { content:''; display:block; width:24px; height:1px; background:var(--gold); }
  .section-h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem,4vw,3rem); font-weight: 700;
    letter-spacing: .02em; color: var(--white);
    margin-bottom: 1rem; line-height: 1.1;
  }
  .section-intro { color: var(--muted); max-width: 520px; font-size: 1rem; margin-bottom: 4rem; line-height: 1.8; }

  .reveal { opacity: 0; transform: translateY(32px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* ABOUT */
  #about { background: var(--bg2); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
  .about-text p { color: var(--muted); font-size: 1rem; line-height: 1.9; margin-bottom: 1.2rem; }
  .about-text p strong { color: var(--white); font-weight: 500; }
  .about-text p em { color: var(--gold); font-style: normal; }

  .skill-row { margin-bottom: 1.2rem; }
  .skill-meta { display: flex; justify-content: space-between; margin-bottom: .4rem; }
  .skill-name { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .1em; color: var(--white); text-transform: uppercase; }
  .skill-pct { font-family: var(--font-mono); font-size: .65rem; color: var(--gold-dim); }
  .skill-bar { height: 2px; background: var(--border2); position: relative; overflow: hidden; }
  .skill-fill {
    position: absolute; left: 0; top: 0; height: 100%;
    background: linear-gradient(90deg, var(--gold-dim), var(--gold));
    width: 0; transition: width 1.2s cubic-bezier(.25,.46,.45,.94);
  }

  /* EXPERIENCE */
  #experience { background: var(--bg); }
  .timeline { position: relative; padding-left: 2rem; }
  .timeline::before {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:1px; background: linear-gradient(var(--gold), transparent);
  }
  .tl-item { position: relative; padding: 0 0 3.5rem 2.5rem; }
  .tl-item::before {
    content:''; position:absolute; left:-4px; top:6px;
    width:9px; height:9px; background:var(--gold);
    border-radius:50%; box-shadow: 0 0 12px var(--gold);
  }
  .tl-date { font-family:var(--font-mono); font-size:.65rem; letter-spacing:.15em; color:var(--gold-dim); text-transform:uppercase; margin-bottom:.4rem; }
  .tl-role { font-family:var(--font-display); font-size:1.15rem; font-weight:600; color:var(--white); margin-bottom:.2rem; }
  .tl-company { font-size:.85rem; color:var(--gold); margin-bottom:.8rem; }
  .tl-desc { color:var(--muted); font-size:.9rem; line-height:1.8; max-width:600px; }
  .tl-tags { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:.8rem; }
  .tag {
    font-family:var(--font-mono); font-size:.6rem; letter-spacing:.1em;
    text-transform:uppercase; padding:.25rem .7rem;
    border:1px solid var(--border2); color:var(--muted);
    transition: all .2s;
  }
  .tag:hover { border-color:var(--gold); color:var(--gold); }

  /* PROJECTS */
  #projects { background: var(--bg2); }
  .projects-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:1.5px; }
  .project-card {
    background:var(--bg3); padding:2rem;
    border:1px solid var(--border2);
    position:relative; overflow:hidden;
    transition: border-color .3s, transform .3s;
  }
  .project-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transition:transform .4s;
  }
  .project-card:hover { border-color:var(--border); transform:translateY(-4px); }
  .project-card:hover::before { transform:scaleX(1); }
  .project-num { font-family:var(--font-display); font-size:3.5rem; font-weight:900; color:var(--border2); line-height:1; margin-bottom:1rem; }
  .project-title { font-family:var(--font-display); font-size:1rem; font-weight:600; color:var(--white); margin-bottom:.6rem; letter-spacing:.04em; }
  .project-desc { font-size:.85rem; color:var(--muted); line-height:1.7; margin-bottom:1.2rem; }
  .project-impact { font-family:var(--font-mono); font-size:.7rem; color:var(--gold); letter-spacing:.08em; margin-bottom:1.2rem; }
  .project-link {
    font-family:var(--font-mono); font-size:.65rem; letter-spacing:.12em;
    text-transform:uppercase; color:var(--muted); text-decoration:none;
    display:inline-flex; align-items:center; gap:.5rem; transition:color .2s; cursor:none;
  }
  .project-link:hover { color:var(--gold); }
  .project-link::after { content:'→'; }

  /* CERTIFICATIONS */
  #certifications { background: var(--bg); }
  .certs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem; }
  .cert-card {
    border:1px solid var(--border2); padding:1.4rem 1.6rem;
    display:flex; gap:1rem; align-items:flex-start;
    transition: border-color .25s, background .25s;
  }
  .cert-card:hover { border-color:var(--border); background:var(--bg2); }
  .cert-icon {
    width:32px; height:32px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    border:1px solid var(--border); font-size:.9rem; color:var(--gold);
  }
  .cert-name { font-size:.82rem; color:var(--white); font-weight:400; line-height:1.4; margin-bottom:.2rem; }
  .cert-meta { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.1em; color:var(--muted); }

  /* CONTACT */
  #contact { background:var(--bg2); text-align:center; }
  .contact-links { display:flex; justify-content:center; gap:1.5rem; flex-wrap:wrap; margin-bottom:4rem; }
  .contact-link {
    display:flex; align-items:center; gap:.8rem; padding:1rem 1.8rem;
    border:1px solid var(--border2);
    font-family:var(--font-mono); font-size:.72rem;
    letter-spacing:.12em; text-transform:uppercase;
    color:var(--muted); text-decoration:none; transition:all .25s; cursor:none;
  }
  .contact-link:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-2px); }
  .footer-rule { border:none; border-top:1px solid var(--border2); max-width:200px; margin:0 auto 2rem; }
  .footer-text { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.15em; color:var(--muted); text-transform:uppercase; }

  @media(max-width:900px){
    nav{padding:1.2rem 2rem} section{padding:5rem 2rem}
    #hero{padding:7rem 2rem 5rem}
    .about-grid{grid-template-columns:1fr;gap:3rem}
    .hero-stats{gap:2rem}
  }
  @media(max-width:600px){
    .nav-links{display:none}
    .hero-h1{font-size:2.8rem}
  }
`;

const skills = [
  { name: "Python / PySpark", pct: 95 },
  { name: "SQL & Big Data", pct: 93 },
  { name: "A/B Testing & Statistics", pct: 90 },
  { name: "Microsoft Fabric / Azure", pct: 92 },
  { name: "Machine Learning / Scikit-Learn", pct: 88 },
  { name: "Power BI / Tableau", pct: 90 },
  { name: "R & Statistical Modeling", pct: 82 },
  { name: "AWS / Databricks", pct: 80 },
];

const projects = [
  { n:"01", title:"Hepatitis C Prediction", desc:"Statistical inference and logistic regression on 615-record clinical dataset. Applied z-tests, hypothesis testing, and confidence intervals in both Python and R.", impact:"Python · R · Scikit-Learn · Statistical Inference", link:"https://github.com/janmejoykar1807/HepatitisC_Project", label:"View on GitHub" },
  { n:"02", title:"Prepaid Card Campaign Analytics", desc:"A/B testing and propensity modeling on B2B vs B2C campaign adoption. Translated empirical findings into optimized project structures generating $5M+ revenue impact.", impact:"$5M+ Revenue · A/B Testing · Propensity Modeling", link:"https://github.com/janmejoykar1807", label:"Group O Project" },
  { n:"03", title:"Enterprise KPI & Anomaly Detection", desc:"Built capacity forecasting models and PySpark anomaly detection across sales, procurement, inventory, and warehouse data using Microsoft Fabric Medallion architecture.", impact:"20% Fewer Gaps · 30% Faster Decisions · Fabric", link:"https://github.com/janmejoykar1807", label:"Group O Project" },
  { n:"04", title:"Python Data Mining Suite", desc:"Four end-to-end ML projects: spam detection, airfare regression, baseball salary prediction, and k-means utility clustering — full supervised and unsupervised pipelines.", impact:"Python · Scikit-Learn · Classification · Clustering", link:"https://github.com/janmejoykar1807/Python_Data_Mining_Projects", label:"View on GitHub" },
  { n:"05", title:"R Data Mining Projects", desc:"Time series on Amazon stock prices, insurance regression, SVM-based consumer classification, and text mining with sentiment analysis — all in reproducible R Markdown.", impact:"R · RMarkdown · NLP · Time Series · SVM", link:"https://github.com/janmejoykar1807/R_Data_Mining_Projects", label:"View on GitHub" },
  { n:"06", title:"Traffic Sign Recognition", desc:"Published CNN-based neural network with self-learning capability for real-time traffic sign detection. Published in IJCRT, ISSN 2320-2882, Vol. 9, Issue 6.", impact:"Published Research · CNN · OpenCV · Python", link:"https://github.com/janmejoykar1807", label:"View Publication" },
];

const certs = [
  { icon:"⊞", name:"Microsoft Certified: Power BI Data Analyst Associate", meta:"Microsoft · Jun 2025" },
  { icon:"⊞", name:"Microsoft Certified: Azure Data Scientist Associate", meta:"Microsoft · Aug 2024" },
  { icon:"⊞", name:"Microsoft Certified: Fabric Analytics Engineer Associate", meta:"Microsoft · Jul 2024" },
  { icon:"⊞", name:"Microsoft Certified: Azure Fundamentals", meta:"Microsoft · Oct 2023" },
  { icon:"⊞", name:"Microsoft Azure", meta:"Microsoft · Jul 2022" },
  { icon:"◎", name:"Python Level 1", meta:"Cambridge Certification Authority · Jul 2022" },
  { icon:"⬡", name:"AWS Cloud Practitioner", meta:"Amazon Web Services · Jul 2020" },
  { icon:"⬡", name:"Architecting on AWS (Associate)", meta:"Amazon Web Services · Jun 2020" },
  { icon:"◈", name:"Business Analytics Graduate Digital Badge", meta:"IBM · Mar 2021" },
];

export default function App() {
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  // Cursor
  useEffect(() => {
    const move = e => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top  = e.clientY + "px";
      }
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.left = e.clientX + "px";
          ringRef.current.style.top  = e.clientY + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Nav scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Skills animation
  useEffect(() => {
    if (!skillsRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSkillsVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* Cursor */}
      <div id="cursor" ref={cursorRef}/>
      <div id="cursor-ring" ref={ringRef}/>

      {/* Particles */}
      {[
        {l:"10%",d:"14s",delay:"0s",dx:"60px"},
        {l:"25%",d:"18s",delay:"3s",dx:"-40px"},
        {l:"42%",d:"12s",delay:"6s",dx:"80px"},
        {l:"60%",d:"20s",delay:"1s",dx:"-60px"},
        {l:"76%",d:"16s",delay:"4s",dx:"30px"},
        {l:"88%",d:"15s",delay:"8s",dx:"-50px"},
      ].map((p,i) => (
        <div key={i} className="particle"
          style={{ left:p.l, "--d":p.d, "--delay":p.delay, "--dx":p.dx }}/>
      ))}

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a className="nav-logo" href="#hero">JK</a>
        <ul className="nav-links">
          {["about","experience","projects","certifications","contact"].map(s => (
            <li key={s}><a href={`#${s}`}>{s}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-content">
          <div className="hero-tag">Senior Data Scientist &amp; Data Engineer</div>
          <h1 className="hero-h1">Janmejoy<br/><span className="accent">Kar</span></h1>
          <p className="hero-sub">
            Turning complex datasets into strategic decisions. Specialist in A/B experimentation,
            capacity forecasting, predictive modeling, and large-scale data engineering across
            Microsoft Fabric, AWS, and Databricks.
          </p>
          <div className="hero-stats">
            {[["$5M+","Revenue Impact"],["40%","Faster Pipelines"],["30%","Forecast Accuracy"],["9","Certifications"]].map(([n,l]) => (
              <div key={l}>
                <span className="stat-num">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="https://www.linkedin.com/in/janmejoy-kar-849756196/" target="_blank" rel="noreferrer" className="btn btn-outline">LinkedIn</a>
            <a href="https://github.com/janmejoykar1807" target="_blank" rel="noreferrer" className="btn btn-outline">GitHub</a>
          </div>
        </div>
        <div className="scroll-hint">Scroll</div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="reveal">
          <div className="section-tag">About</div>
          <h2 className="section-h2">The Data Mind<br/>Behind the Numbers</h2>
        </div>
        <div className="about-grid">
          <div className="about-text reveal">
            <p>I'm a <strong>Data Scientist &amp; Data Engineer</strong> based in Denton, Texas with a M.S. in Business Analytics from the University of North Texas (GPA 3.83). Currently serving as <em>Data Analytics Specialist at Group O</em>, where I build the analytical systems that power enterprise-level decisions.</p>
            <p>My work spans the full data value chain — from architecting <strong>Snowflake schema dimensional models</strong> and <strong>Medallion architecture lakehouses</strong>, to designing <strong>A/B experiments</strong>, building <strong>propensity models</strong>, and delivering <strong>capacity forecasting</strong> systems that directly drive revenue.</p>
            <p>I believe data science isn't just about building models — it's about <em>translating empirical findings into decisions that matter</em>. Every analysis I run has a business question at its core.</p>
          </div>
          <div ref={skillsRef} className="reveal">
            {skills.map(s => (
              <div key={s.name} className="skill-row">
                <div className="skill-meta">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-pct">{s.pct}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-fill"
                    style={{ width: skillsVisible ? `${s.pct}%` : "0%",
                             transition: "width 1.2s cubic-bezier(.25,.46,.45,.94)" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="reveal">
          <div className="section-tag">Experience</div>
          <h2 className="section-h2">Career Timeline</h2>
          <p className="section-intro">Building data products that move the needle — from internship experiments to enterprise-scale systems.</p>
        </div>
        <div className="timeline">
          {[
            { date:"Jun 2023 — Present", role:"Data Analytics Specialist", company:"Group O · Irving, TX",
              desc:"Designed Snowflake schema dimensional models in Microsoft Fabric to unify finance, sales, and inventory datasets. Applied A/B testing and propensity modeling on B2B vs. B2C campaigns that drove $5M+ in annual revenue. Built PySpark-based forecasting models improving accuracy by 30% and anomaly detection reducing fulfillment gaps by 20%.",
              tags:["Microsoft Fabric","PySpark","A/B Testing","Power BI","Snowflake Schema","Forecasting"] },
            { date:"Nov 2020 — Jan 2021", role:"Business Strategist", company:"Filing Rabbit",
              desc:"Conducted competitive pricing analysis and built data-driven pricing models to attract new clients. Coordinated website redesign initiative improving user experience and engagement.",
              tags:["Pricing Analytics","Market Research","Strategy"] },
            { date:"Jun 2020 — Aug 2020", role:"Machine Learning Trainee", company:"Indian Servers Ltd",
              desc:"Built ML models on benchmark datasets (MNIST, CIFAR-100, Fashion-MNIST, Titanic). Developed object recognition pipelines using Python, OpenCV, and Caffe. Applied CNNs for image classification.",
              tags:["CNNs","OpenCV","TensorFlow","Python"] },
          ].map(item => (
            <div key={item.role} className="tl-item reveal">
              <div className="tl-date">{item.date}</div>
              <div className="tl-role">{item.role}</div>
              <div className="tl-company">{item.company}</div>
              <div className="tl-desc">{item.desc}</div>
              <div className="tl-tags">{item.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="reveal">
          <div className="section-tag">Projects</div>
          <h2 className="section-h2">Selected Work</h2>
          <p className="section-intro">From clinical biomarker analysis to enterprise capacity planning — projects that demonstrate rigor, impact, and range.</p>
        </div>
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p.n} className="project-card reveal">
              <div className="project-num">{p.n}</div>
              <div className="project-title">{p.title}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="project-impact">{p.impact}</div>
              <a href={p.link} target="_blank" rel="noreferrer" className="project-link">{p.label}</a>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications">
        <div className="reveal">
          <div className="section-tag">Credentials</div>
          <h2 className="section-h2">Certifications</h2>
          <p className="section-intro">Nine industry certifications across Microsoft Azure, AWS, and data science platforms.</p>
        </div>
        <div className="certs-grid">
          {certs.map(c => (
            <div key={c.name} className="cert-card reveal">
              <div className="cert-icon">{c.icon}</div>
              <div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-meta">{c.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="reveal">
          <div className="section-tag" style={{justifyContent:"center"}}>Contact</div>
          <h2 className="section-h2">Let's Build Something</h2>
          <p className="section-intro" style={{margin:"0 auto 3rem",textAlign:"center"}}>
            Open to Senior Data Scientist, Data Engineer, and Analytics Lead roles.
            Always happy to connect about data, analytics, or collaboration.
          </p>
        </div>
        <div className="contact-links reveal">
          {[
            { href:"mailto:janmejoykar@my.unt.edu", label:"Email Me",
              icon:<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/> },
            { href:"https://www.linkedin.com/in/janmejoy-kar-849756196/", label:"LinkedIn",
              icon:<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/> },
            { href:"https://github.com/janmejoykar1807", label:"GitHub",
              icon:<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/> },
            { href:"https://janmejoykar-portfolio.vercel.app", label:"Portfolio",
              icon:<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/> },
          ].map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">{c.icon}</svg>
              {c.label}
            </a>
          ))}
        </div>
        <hr className="footer-rule"/>
        <p className="footer-text">© 2026 Janmejoy Kar · Denton, Texas</p>
      </section>
    </>
  );
}
