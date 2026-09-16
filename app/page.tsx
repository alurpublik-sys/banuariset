"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const logo = "https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png";
const navItems = [
  ["Beranda", "top"], ["Tentang", "tentang"], ["Riset", "riset"], ["Publikasi", "publikasi"], ["Data", "data"], ["Kegiatan", "kegiatan"], ["Kolaborasi", "kolaborasi"]
] as const;

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
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "show" : ""}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function SectionHead({ title, action, target = "#top", dark = false }: { title: string; action: string; target?: string; dark?: boolean }) {
  return <div className={`section-head ${dark ? "dark" : ""}`}><div><h2>{title}</h2><span /></div><a href={target}>{action} →</a></div>;
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const timer = window.setInterval(() => setSlide(v => (v + 1) % slides.length), 6500);
    const sections = navItems.map(([,id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: "-160px 0px -55% 0px", threshold: [0.1, 0.35, 0.6] });
    sections.forEach(s => observer.observe(s));
    return () => { window.clearInterval(timer); observer.disconnect(); };
  }, []);

  const current = slides[slide];

  return <main id="top">
    <header className="site-header">
      <div className="top shell">
        <a className="brand" href="#top" aria-label="Banua Research"><img src={logo} alt="Logo Banua Research" /></a>
        <div className="quick"><a href="#peneliti">Peneliti</a><a href="#kolaborasi">Mitra</a><a href="#publikasi">Publikasi</a><a href="#kontak">Kontak</a><span>•</span><span>ID</span><b>⌕</b></div>
        <button className="menu" onClick={() => setMenu(!menu)} aria-label="Buka menu">{menu ? "×" : "☰"}</button>
      </div>
      <div className="accent" />
      <nav className={menu ? "open" : ""}><div className="shell nav-inner">{navItems.map(([label,id]) => <a key={id} className={active===id?"active":""} href={`#${id}`} onClick={()=>setMenu(false)}>{label}</a>)}</div></nav>
    </header>

    <section className="hero" aria-label="Sorotan utama"><div className="shell hero-wrap">
      <div className="hero-media">{slides.map((s,i)=><img key={s.image} src={s.image} alt="" className={i===slide?"active":""}/>)}<div className="shade"/><div className="counter">0{slide+1} / 0{slides.length}</div></div>
      <div className="hero-panel"><div className="hero-copy" key={slide}><div className="eyebrow"><i/>{current.type}</div><h1>{current.title}</h1><p>{current.text}</p><a href="#publikasi">Jelajahi publikasi <b>→</b></a></div><div className="controls"><button onClick={()=>setSlide((slide-1+slides.length)%slides.length)}>←</button><div className="dots">{slides.map((_,i)=><button key={i} aria-label={`Slide ${i+1}`} className={i===slide?"active":""} onClick={()=>setSlide(i)}/>)}</div><button onClick={()=>setSlide((slide+1)%slides.length)}>→</button></div></div>
    </div></section>

    <section className="section pale" id="tentang"><div className="shell"><Reveal><SectionHead title="Tentang Banua Research" action="Lihat riset" target="#riset" /></Reveal><div className="focus-grid">{[["Berbasis Daerah","Berangkat dari konteks Sulawesi Tengah, bukan sekadar menyalin perspektif nasional."],["Berbasis Bukti","Mengutamakan data, temuan lapangan, dan analisis yang bisa dipertanggungjawabkan."],["Berorientasi Dampak","Mendorong pengetahuan agar bisa dipakai dalam kebijakan, program, dan diskusi publik."]].map((x,i)=><Reveal key={x[0]} delay={i*90}><a href={i===0?"#data":i===1?"#publikasi":"#kolaborasi"} className="focus click-card"><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p><b>→</b></a></Reveal>)}</div></div></section>

    <section className="section shell" id="publikasi"><Reveal><SectionHead title="Publikasi Terbaru" action="Fokus riset" target="#riset" /></Reveal><div className="featured"><Reveal><a href="#data" className="feature-card click-card"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85" alt=""/><div className="overlay"/><div className="copy"><span>FEATURED RESEARCH</span><h2>Riset yang memberi konteks pada perubahan Sulawesi Tengah.</h2><p>Catatan awal tentang ekonomi, pendidikan, tata kelola, dan transformasi wilayah.</p></div></a></Reveal><div>{publications.map((p,i)=><Reveal key={p[1]} delay={i*90}><article className="pub"><img src={p[3]} alt=""/><div><span>{p[0]} · {p[2]}</span><h3>{p[1]}</h3><a href="#riset">Baca publikasi →</a></div></article></Reveal>)}</div></div></section>

    <section className="section pale" id="riset"><div className="shell"><Reveal><SectionHead title="Fokus Riset" action="Lihat peneliti" target="#peneliti" /></Reveal><div className="focus-grid">{[["Kebijakan Publik","Menempatkan bukti sebagai dasar keputusan daerah."],["Ekonomi & Pembangunan","Membaca transformasi ekonomi lewat konteks wilayah."],["Sosial & Pendidikan","Melihat akses, kualitas, dan perubahan sosial secara utuh."]].map((x,i)=><Reveal key={x[0]} delay={i*100}><a href="#publikasi" className="focus click-card"><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p><b>→</b></a></Reveal>)}</div></div></section>

    <section className="section researchers" id="peneliti"><div className="shell"><Reveal><SectionHead title="Peneliti" action="Kolaborasi" target="#kolaborasi" /></Reveal><div className="researcher-grid">{[["RESEARCHER 01","Kebijakan Publik & Tata Kelola"],["RESEARCHER 02","Ekonomi Regional & Industri"],["RESEARCHER 03","Pendidikan & Pembangunan Sosial"]].map((r,i)=><Reveal key={r[0]} delay={i*90}><a href="#publikasi" className="researcher-card"><span>{r[0]}</span><h3>Profil Peneliti Banua</h3><p>{r[1]}. Profil lengkap dan daftar publikasi akan terhubung ke CMS pada tahap berikutnya.</p></a></Reveal>)}</div></div></section>

    <section className="section shell" id="data"><Reveal><SectionHead title="Sulawesi Tengah dalam Data" action="Lihat kegiatan" target="#kegiatan" /></Reveal><div className="stats">{[["13","Kabupaten/Kota"],["6","Fokus Riset"],["24+","Publikasi Target Awal"],["1","Regional Knowledge Hub"]].map((s,i)=><Reveal key={s[1]} delay={i*80}><a href="#publikasi" className="stat click-card"><strong>{s[0]}</strong><span>{s[1]}</span></a></Reveal>)}</div></section>

    <section className="section talks"><div className="shell"><Reveal><SectionHead title="Banua Talks" action="Kegiatan" target="#kegiatan" dark /></Reveal><div className="video-grid"><Reveal><a href="#kegiatan" className="video-feature click-card"><img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1500&q=85" alt=""/><button type="button">▶</button><div><span>VIDEO SERIES</span><h2>Membaca masa depan Sulawesi Tengah dari data dan pengalaman lapangan.</h2></div></a></Reveal><div>{["Mengapa data daerah penting?","Apa yang membuat sebuah policy brief berguna?","Riset regional dan masa depan keputusan publik"].map((v,i)=><Reveal key={v} delay={i*90}><a href="#publikasi" className="video-item"><b>0{i+1}</b><div><span>BANUA TALKS</span><h3>{v}</h3></div><i>↗</i></a></Reveal>)}</div></div></div></section>

    <section className="section shell"><Reveal><SectionHead title="Fokus Pengetahuan" action="Data" target="#data" /></Reveal><div className="topic-grid">{topics.map((t,i)=><Reveal key={t} delay={(i%3)*70}><a className="topic" href="#publikasi"><span>0{i+1}</span><h3>{t}</h3><b>↗</b></a></Reveal>)}</div></section>

    <section className="section pale" id="kegiatan"><div className="shell"><Reveal><SectionHead title="Kegiatan" action="Kolaborasi" target="#kolaborasi" /></Reveal><div className="activity-grid">{[["DISKUSI PUBLIK","Membaca isu daerah bersama peneliti, pemerintah, dan komunitas."],["FGD","Mempertemukan data, pengalaman, dan perspektif para pemangku kepentingan."],["RESEARCH FORUM","Membahas temuan riset dan implikasinya bagi kebijakan daerah."]].map((x,i)=><Reveal key={x[0]} delay={i*90}><a href="#kolaborasi" className="activity-card"><span>{x[0]}</span><h3>Kegiatan Banua Research</h3><p>{x[1]}</p></a></Reveal>)}</div></div></section>

    <section className="section shell" id="kolaborasi"><Reveal><SectionHead title="Kolaborasi" action="Kontak" target="#kontak" /></Reveal><div className="partner-grid">{[["RISET BERSAMA","Kolaborasi penelitian, survey, dan kajian kebijakan."],["KNOWLEDGE PARTNERSHIP","Pertukaran data, forum pengetahuan, dan publikasi bersama."],["POLICY SUPPORT","Analisis, evaluasi, dan penyusunan rekomendasi berbasis bukti."]].map((x,i)=><Reveal key={x[0]} delay={i*90}><a href="#kontak" className="partner-card"><span>{x[0]}</span><h3>Bekerja bersama Banua</h3><p>{x[1]}</p></a></Reveal>)}</div></section>

    <section className="closing" id="kontak"><div className="shell"><Reveal><div className="eyebrow"><i/>BANUA RESEARCH</div><h2>Pengetahuan lokal.<br/>Dampak kebijakan yang lebih luas.</h2><p>Riset, policy paper, policy brief, dan insight yang tumbuh dari konteks Sulawesi Tengah.</p><a className="cta" href="mailto:halo@banuaresearch.id">Hubungi Banua Research</a></Reveal></div></section>

    <footer><div className="shell footer-grid"><div><a className="brand" href="#top"><img src={logo} alt="Logo Banua Research"/></a><p>Research · Policy · Regional Insight</p></div><div><h4>Jelajahi</h4><a href="#publikasi">Publikasi</a><a href="#riset">Riset</a><a href="#data">Data</a><a href="#kegiatan">Kegiatan</a></div><div><h4>Terhubung</h4><a href="#kontak">Instagram</a><a href="#kontak">LinkedIn</a><a href="#kontak">YouTube</a><a href="#kontak">X</a></div><div><h4>Banua Research</h4><p>Palu, Sulawesi Tengah<br/>Indonesia</p><a href="mailto:halo@banuaresearch.id">halo@banuaresearch.id</a></div></div><div className="shell footer-bottom"><span>© 2026 Banua Research</span><span>Researching the region. Informing public policy.</span></div></footer>
  </main>;
}
