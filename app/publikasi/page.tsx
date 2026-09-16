"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../globals.css";

type Publication={id:string;title:string;slug:string;publication_type:string;excerpt:string|null;publication_date:string|null;cover_image_url:string|null};

export default function PublicationsPage(){
 const [items,setItems]=useState<Publication[]>([]); const [q,setQ]=useState(""); const [type,setType]=useState("all"); const [loading,setLoading]=useState(true);
 useEffect(()=>{supabase.from("publications").select("id,title,slug,publication_type,excerpt,publication_date,cover_image_url").eq("status","published").order("publication_date",{ascending:false}).then(({data})=>{setItems(data??[]);setLoading(false)})},[]);
 const filtered=useMemo(()=>items.filter(x=>(type==="all"||x.publication_type===type)&&(!q||`${x.title} ${x.excerpt??""}`.toLowerCase().includes(q.toLowerCase()))),[items,q,type]);
 return <main><header className="header"><div className="head shell"><a href="/" className="brand"><img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research"/></a><a href="/">← Beranda</a></div><div className="orange"/></header><section className="section shell"><div className="title"><h2>Publikasi</h2><i/></div><div style={{display:"grid",gridTemplateColumns:"1fr 220px",gap:16,marginBottom:28}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari judul atau ringkasan..." style={{padding:14,border:"1px solid #dfe5e8"}}/><select value={type} onChange={e=>setType(e.target.value)} style={{padding:14,border:"1px solid #dfe5e8"}}><option value="all">Semua jenis</option><option value="policy_brief">Policy Brief</option><option value="policy_paper">Policy Paper</option><option value="research_report">Research Report</option><option value="insight">Insight</option><option value="article">Article</option></select></div>{loading?<p>Memuat publikasi...</p>:filtered.length===0?<p>Belum ada publikasi yang diterbitkan.</p>:<div className="cards">{filtered.map(p=><a className="card" href={`/publikasi/${p.slug}`} key={p.id}><span>{p.publication_type.replaceAll("_"," ")}</span><h3>{p.title}</h3><p>{p.excerpt||"Baca publikasi Banua Research."}</p><b>→</b></a>)}</div>}</section></main>
}
