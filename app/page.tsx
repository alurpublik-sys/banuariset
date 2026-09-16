"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const slides = [
  { type: "POLICY PAPER", title: "Membaca Sulawesi Tengah dengan riset yang dekat pada persoalan publik.", text: "Banua Research mempertemukan data, pengetahuan lokal, dan analisis kebijakan untuk membantu keputusan yang lebih baik.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85" },
  { type: "REGIONAL INSIGHT", title: "Dari lapangan ke meja kebijakan, tanpa kehilangan konteks daerah.", text: "Kami menerjemahkan temuan penelitian menjadi pengetahuan yang relevan bagi pemerintah, akademisi, media, dan masyarakat.", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85" },
  { type: "POLICY BRIEF", title: "Pengetahuan regional yang ringkas, tajam, dan bisa dipakai.", text: "Policy brief, policy paper, dan insight disusun agar mudah ditemukan, dibaca, dan digunakan kembali.", image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=2000&q=85" }
];

const publications = [
  ["POLICY PAPER", "Dari investasi pendidikan menuju nilai publik daerah", "Pendidikan & SDM", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"],
  ["POLICY BRIEF", "Ketika data daerah harus berujung pada keputusan", "Tata Kelola", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"],
  ["INSIGHT", "Membaca perubahan ekonomi dari perspektif wilayah", "Ekonomi", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"]
];

const topics = ["Pendidikan & SDM", "Ekonomi & Industri", "Tata Kelola Pemerintahan", "Sosial & Kesejahteraan", "Lingkungan & Energi", "Desa & Pembangunan Daerah"];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "show" : ""}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function SectionHead({ title, action, dark = false }: { title: string; action: string; dark?: boolean }) {
  return <div className={`section-head ${dark ? "dark" : ""}`}><div><h2>{title}</h2><span /></div><a href="#">{action} →</a></div>;
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [compact, setCompact] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const scroll = () => setCompact(window.scrollY > 35);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    const timer = window.setInterval(() => setSlide(v => (v + 1) % slides.length), 6500);
    return () => { window.removeEventListener("scroll", scroll); window.clearInterval(timer); };
  }, []);
  const current = slides[slide];

  return <main id="top">
    <header className={`site-header ${compact ? "compact" : ""}`}>
      <div className="top shell">
        <a className="brand" href="#top"><img src="/banua-logo.png" alt="Banua Research" /><div><strong>BANUA</strong><small>RESEARCH</small></div></a>
        <div className="quick"><span>Peneliti</span><span>Mitra</span><span>Publikasi</span><span>Kontak</span><span>•</span><span>ID</span><b>⌕</b></div>
        <button className="menu" onClick={() => setMenu(!menu)}>{menu ? "×" : "☰"}</button>
      </div>
      <div className="accent" />
      <nav className={menu ? "open" : ""}><div className="shell nav-inner">{["Beranda","Tentang","Riset","Publikasi","Data","Kegiatan","Kolaborasi"].map((x,i)=><a key={x} className={i===0?"active":""} href={i===0?"#top":`#${x.toLowerCase()}`} onClick={()=>setMenu(false)}>{x}</a>)}</div></nav>
    </header>

    <section className="hero"><div className="shell hero-wrap">
      <div className="hero-media">{slides.map((s,i)=><img key={s.image} src={s.image} alt="" className={i===slide?"active":""} />)}<div className="shade"/><div className="counter">0{slide+1} / 0{slides.length}</div></div>
      <div className="hero-panel">
        <div className="hero-copy" key={slide}><div className="eyebrow"><i/>{current.type}</div><h1>{current.title}</h1><p>{current.text}</p><a href="#publikasi">Jelajahi publikasi <b>→</b></a></div>
        <div className="controls"><button onClick={()=>setSlide((slide-1+slides.length)%slides.length)}>←</button><div className="dots">{slides.map((_,i)=><button key={i} className={i===slide?"active":""} onClick={()=>setSlide(i)}/>)}</div><button onClick={()=>setSlide((slide+1)%slides.length)}>→</button></div>
      </div>
    </div></section>

    <section className="section shell" id="publikasi"><Reveal><SectionHead title="Publikasi Terbaru" action="Lihat semua" /></Reveal>
      <div className="featured"><Reveal><article className="feature-card"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85" alt=""/><div className="overlay"/><div className="copy"><span>FEATURED RESEARCH</span><h2>Riset yang memberi konteks pada perubahan Sulawesi Tengah.</h2><p>Catatan awal tentang ekonomi, pendidikan, tata kelola, dan transformasi wilayah.</p></div></article></Reveal>
      <div>{publications.map((p,i)=><Reveal key={p[1]} delay={i*90}><article className="pub"><img src={p[3]} alt=""/><div><span>{p[0]} · {p[2]}</span><h3>{p[1]}</h3><a href="#">Baca publikasi →</a></div></article></Reveal>)}</div></div>
    </section>

    <section className="section pale" id="riset"><div className="shell"><Reveal><SectionHead title="Fokus Riset" action="Jelajahi isu" /></Reveal><div className="focus-grid">{[["Kebijakan Publik","Menempatkan bukti sebagai dasar keputusan daerah."],["Ekonomi & Pembangunan","Membaca transformasi ekonomi lewat konteks wilayah."],["Sosial & Pendidikan","Melihat akses, kualitas, dan perubahan sosial secara utuh."]].map((x,i)=><Reveal key={x[0]} delay={i*100}><article className="focus"><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p><b>→</b></article></Reveal>)}</div></div></section>

    <section className="section shell" id="data"><Reveal><SectionHead title="Sulawesi Tengah dalam Data" action="Lihat data" /></Reveal><div className="stats">{[["13","Kabupaten/Kota"],["6","Fokus Riset"],["24+","Publikasi Target Awal"],["1","Regional Knowledge Hub"]].map((s,i)=><Reveal key={s[1]} delay={i*80}><div className="stat"><strong>{s[0]}</strong><span>{s[1]}</span></div></Reveal>)}</div></section>

    <section className="section talks"><div className="shell"><Reveal><SectionHead title="Banua Talks" action="Semua video" dark /></Reveal><div className="video-grid"><Reveal><div className="video-feature"><img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1500&q=85" alt=""/><button>▶</button><div><span>VIDEO SERIES</span><h2>Membaca masa depan Sulawesi Tengah dari data dan pengalaman lapangan.</h2></div></div></Reveal><div>{["Mengapa data daerah penting?","Apa yang membuat sebuah policy brief berguna?","Riset regional dan masa depan keputusan publik"].map((v,i)=><Reveal key={v} delay={i*90}><div className="video-item"><b>0{i+1}</b><div><span>BANUA TALKS</span><h3>{v}</h3></div><i>↗</i></div></Reveal>)}</div></div></div></section>

    <section className="section shell"><Reveal><SectionHead title="Fokus Pengetahuan" action="Semua topik" /></Reveal><div className="topic-grid">{topics.map((t,i)=><Reveal key={t} delay={(i%3)*70}><a className="topic" href="#"><span>0{i+1}</span><h3>{t}</h3><b>↗</b></a></Reveal>)}</div></section>

    <section className="closing"><div className="shell"><Reveal><div className="eyebrow"><i/>BANUA RESEARCH</div><h2>Pengetahuan lokal.<br/>Dampak kebijakan yang lebih luas.</h2><p>Riset, policy paper, policy brief, dan insight yang tumbuh dari konteks Sulawesi Tengah.</p><a className="cta" href="#publikasi">Jelajahi pengetahuan</a></Reveal></div></section>

    <footer><div className="shell footer-grid"><div><div className="brand"><img src="/banua-logo.png" alt="Banua Research"/><div><strong>BANUA</strong><small>RESEARCH</small></div></div><p>Research · Policy · Regional Insight</p></div><div><h4>Jelajahi</h4><a>Publikasi</a><a>Riset</a><a>Data</a><a>Kegiatan</a></div><div><h4>Terhubung</h4><a>Instagram</a><a>LinkedIn</a><a>YouTube</a><a>X</a></div><div><h4>Banua Research</h4><p>Palu, Sulawesi Tengah<br/>Indonesia</p><a>halo@banuaresearch.id</a></div></div><div className="shell footer-bottom"><span>© 2026 Banua Research</span><span>Researching the region. Informing public policy.</span></div></footer>
  </main>;
}
