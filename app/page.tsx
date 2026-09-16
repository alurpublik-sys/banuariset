"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const logo = "https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png";
const nav = [["Beranda","top"],["Tentang","tentang"],["Riset","riset"],["Publikasi","publikasi"],["Data","data"],["Kegiatan","kegiatan"],["Kolaborasi","kolaborasi"]] as const;
const slides = [
  ["POLICY PAPER","Membaca Sulawesi Tengah dengan riset yang dekat pada persoalan publik.","Banua Research mempertemukan data, pengetahuan lokal, dan analisis kebijakan untuk membantu keputusan yang lebih baik.","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85"],
  ["REGIONAL INSIGHT","Dari lapangan ke meja kebijakan, tanpa kehilangan konteks daerah.","Temuan penelitian diterjemahkan menjadi pengetahuan yang relevan bagi pemerintah, akademisi, media, dan masyarakat.","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85"],
  ["POLICY BRIEF","Pengetahuan regional yang ringkas, tajam, dan bisa dipakai.","Policy brief, policy paper, dan insight disusun agar mudah ditemukan, dibaca, dan digunakan kembali.","https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=2000&q=85"]
];

type Pub={id:string;title:string;slug:string;publication_type:string;excerpt:string|null;cover_image_url:string|null;featured:boolean};
type Researcher={id:string;name:string;slug:string;title:string|null;expertise:string[]};
type EventRow={id:string;title:string;slug:string;category:string|null;excerpt:string|null;event_date:string|null};

export default function Home(){
  const [slide,setSlide]=useState(0); const [menu,setMenu]=useState(false); const [active,setActive]=useState("top");
  const [latest,setLatest]=useState<Pub[]>([]); const[researchers,setResearchers]=useState<Researcher[]>([]); const[events,setEvents]=useState<EventRow[]>([]); const[pubCount,setPubCount]=useState(0);
  useEffect(()=>{
    const timer=setInterval(()=>setSlide(v=>(v+1)%slides.length),6500);
    const obs=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v?.target?.id)setActive(v.target.id)},{rootMargin:"-155px 0px -55% 0px",threshold:[.1,.4]});
    nav.map(([,id])=>document.getElementById(id)).filter(Boolean).forEach(el=>obs.observe(el!));
    (async()=>{const [{data:p,count},{data:r},{data:e}]=await Promise.all([supabase.from('publications').select('id,title,slug,publication_type,excerpt,cover_image_url,featured',{count:'exact'}).eq('status','published').order('publication_date',{ascending:false}).limit(4),supabase.from('researchers').select('id,name,slug,title,expertise').eq('is_active',true).order('name').limit(3),supabase.from('events').select('id,title,slug,category,excerpt,event_date').eq('status','published').order('event_date',{ascending:false}).limit(3)]);setLatest(p??[]);setPubCount(count??0);setResearchers(r??[]);setEvents(e??[])})();
    return()=>{clearInterval(timer);obs.disconnect()}
  },[]);
  const s=slides[slide];
  const cards=(items:string[][],target:string)=><div className="cards">{items.map((x,i)=><a className="card reveal" href={target} key={i}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><b>→</b></a>)}</div>;
  const fallbackPubs=[["POLICY PAPER","Investasi pendidikan dan nilai publik daerah"],["POLICY BRIEF","Ketika data daerah harus berujung pada keputusan"],["INSIGHT","Membaca perubahan ekonomi dari perspektif wilayah"]];
  const feature=latest.find(x=>x.featured)||latest[0];
  return <main id="top">
    <header className="header"><div className="head shell"><a href="#top" className="brand"><img src={logo} alt="Logo Banua Research"/></a><div className="quick"><a href="#peneliti">Peneliti</a><a href="#kolaborasi">Mitra</a><a href="/publikasi">Publikasi</a><a href="#kontak">Kontak</a></div><button onClick={()=>setMenu(!menu)}>{menu?"×":"☰"}</button></div><div className="orange"/><nav className={menu?"open":""}><div className="shell nav">{nav.map(([label,id])=><a key={id} href={`#${id}`} className={active===id?"active":""} onClick={()=>setMenu(false)}>{label}</a>)}</div></nav></header>

    <section className="hero"><div className="shell"><div className="visual">{slides.map((x,i)=><img key={x[3]} src={x[3]} className={i===slide?"on":""} alt=""/>)}<div className="shade"/><div className="count">0{slide+1} / 0{slides.length}</div></div><div className="heroPanel"><div><span className="eyebrow">▲ {s[0]}</span><h1>{s[1]}</h1><p>{s[2]}</p><a href="/publikasi">Jelajahi publikasi →</a></div><div className="heroControls"><button onClick={()=>setSlide((slide+2)%3)}>←</button><button onClick={()=>setSlide((slide+1)%3)}>→</button></div></div></div></section>

    <section id="tentang" className="section pale"><div className="shell"><div className="title"><h2>Tentang Banua Research</h2><i/></div>{cards([["01","Berbasis Daerah","Berangkat dari konteks Sulawesi Tengah."],["02","Berbasis Bukti","Data dan temuan lapangan menjadi dasar analisis."],["03","Berorientasi Dampak","Pengetahuan diarahkan agar berguna bagi kebijakan dan publik."]],"#riset")}</div></section>

    <section id="publikasi" className="section"><div className="shell"><div className="title"><h2>Publikasi Terbaru</h2><i/></div><div className="pubgrid">{feature?<a href={`/publikasi/${feature.slug}`} className="feature"><img src={feature.cover_image_url||"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1500&q=85"} alt=""/><div><span>{feature.publication_type.replaceAll('_',' ')}</span><h2>{feature.title}</h2></div></a>:<a href="/publikasi" className="feature"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1500&q=85" alt=""/><div><span>FEATURED RESEARCH</span><h2>Riset yang memberi konteks pada perubahan Sulawesi Tengah.</h2></div></a>}<div className="publist">{latest.length>1?latest.filter(x=>x.id!==feature?.id).slice(0,3).map(x=><a href={`/publikasi/${x.slug}`} className="pub" key={x.id}><span>{x.publication_type.replaceAll('_',' ')}</span><h3>{x.title}</h3><b>→</b></a>):fallbackPubs.map((x,i)=><a href="/publikasi" className="pub" key={i}><span>{x[0]}</span><h3>{x[1]}</h3><b>→</b></a>)}</div></div><div style={{marginTop:28}}><a href="/publikasi">Lihat semua publikasi →</a></div></div></section>

    <section id="riset" className="section pale"><div className="shell"><div className="title"><h2>Fokus Riset</h2><i/></div>{cards([["01","Kebijakan Publik","Menempatkan bukti sebagai dasar keputusan daerah."],["02","Ekonomi & Pembangunan","Membaca transformasi ekonomi melalui konteks wilayah."],["03","Sosial & Pendidikan","Melihat akses, kualitas, dan perubahan sosial secara utuh."]],"/publikasi")}</div></section>

    <section id="peneliti" className="section"><div className="shell"><div className="title"><h2>Peneliti</h2><i/></div>{researchers.length?<div className="cards">{researchers.map((r,i)=><a className="card reveal" href={`/peneliti/${r.slug}`} key={r.id}><span>RESEARCHER 0{i+1}</span><h3>{r.name}</h3><p>{r.title||r.expertise?.slice(0,2).join(' · ')||'Peneliti Banua Research'}</p><b>→</b></a>)}</div>:cards([["RESEARCHER 01","Kebijakan Publik & Tata Kelola","Profil peneliti dan publikasinya."],["RESEARCHER 02","Ekonomi Regional & Industri","Profil peneliti dan publikasinya."],["RESEARCHER 03","Pendidikan & Pembangunan Sosial","Profil peneliti dan publikasinya."]],"/publikasi")}</div></section>

    <section id="data" className="section"><div className="shell"><div className="title"><h2>Sulawesi Tengah dalam Data</h2><i/></div><div className="stats">{[["13","Kabupaten/Kota"],["6","Fokus Riset"],[String(pubCount),"Publikasi Terbit"],["1","Regional Knowledge Hub"]].map((x,i)=><a href={i===2?"/publikasi":"#riset"} className="stat" key={i}><strong>{x[0]}</strong><span>{x[1]}</span></a>)}</div></div></section>

    <section id="kegiatan" className="section dark"><div className="shell"><div className="title"><h2>Kegiatan & Banua Talks</h2><i/></div>{events.length?<div className="cards">{events.map(e=><a className="card reveal" href={`/kegiatan/${e.slug}`} key={e.id}><span>{e.category||'KEGIATAN'}</span><h3>{e.title}</h3><p>{e.excerpt|| (e.event_date?new Date(e.event_date).toLocaleDateString('id-ID'):'Kegiatan Banua Research')}</p><b>→</b></a>)}</div>:cards([["DISKUSI PUBLIK","Ruang diskusi berbasis riset","Menghubungkan peneliti, pemerintah, komunitas, dan media."],["FGD","Pendalaman persoalan daerah","Mempertemukan data, pengalaman, dan perspektif pemangku kepentingan."],["RESEARCH FORUM","Temuan ke percakapan publik","Membahas implikasi hasil riset terhadap kebijakan daerah."]],"/kegiatan")}<div style={{marginTop:28}}><a href="/kegiatan">Lihat semua kegiatan →</a></div></div></section>

    <section id="kolaborasi" className="section pale"><div className="shell"><div className="title"><h2>Kolaborasi</h2><i/></div>{cards([["RISET BERSAMA","Kolaborasi penelitian","Survey, kajian kebijakan, evaluasi, dan riset bersama."],["KNOWLEDGE PARTNERSHIP","Kemitraan pengetahuan","Pertukaran data, forum pengetahuan, dan publikasi bersama."],["POLICY SUPPORT","Dukungan kebijakan","Analisis dan rekomendasi berbasis bukti."]],"#kontak")}</div></section>

    <section id="kontak" className="closing"><div className="shell"><span className="eyebrow">▲ BANUA RESEARCH</span><h2>Pengetahuan lokal.<br/>Dampak kebijakan yang lebih luas.</h2><p>Berbasis di Palu, Sulawesi Tengah.</p><a href="mailto:halo@banuaresearch.id">Hubungi Banua Research</a></div></section>

    <footer><div className="shell foot"><div><a href="#top" className="brand footbrand"><img src={logo} alt="Logo Banua Research"/></a><p>Research · Policy · Regional Insight</p></div><div><a href="/publikasi">Publikasi</a><a href="#riset">Riset</a><a href="#data">Data</a><a href="/kegiatan">Kegiatan</a></div><div><a href="#peneliti">Peneliti</a><a href="#kolaborasi">Kolaborasi</a><a href="#kontak">Kontak</a></div></div></footer>
  </main>
}
