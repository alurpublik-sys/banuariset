"use client";

import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {supabase} from "../../../lib/supabase";
import "../../globals.css";

type Researcher={id:string;name:string;slug:string;title:string|null;bio:string|null;expertise:string[];email_public:string|null;linkedin_url:string|null;orcid:string|null;photo_url:string|null};
type Pub={id:string;title:string;slug:string;publication_type:string;publication_date:string|null};

export default function ResearcherDetail(){
 const params=useParams<{slug:string}>(); const[r,setR]=useState<Researcher|null>(null); const[pubs,setPubs]=useState<Pub[]>([]); const[loading,setLoading]=useState(true);
 useEffect(()=>{if(!params.slug)return;(async()=>{const{data:researcher}=await supabase.from('researchers').select('*').eq('slug',params.slug).eq('is_active',true).maybeSingle();setR(researcher);if(researcher){const{data:links}=await supabase.from('publication_authors').select('publication_id').eq('researcher_id',researcher.id);const ids=(links??[]).map((x:any)=>x.publication_id);if(ids.length){const{data}=await supabase.from('publications').select('id,title,slug,publication_type,publication_date').in('id',ids).eq('status','published').order('publication_date',{ascending:false});setPubs(data??[])}}setLoading(false)})()},[params.slug]);
 if(loading)return <main className="section shell"><p>Memuat profil...</p></main>;
 if(!r)return <main className="section shell"><h1>Peneliti tidak ditemukan</h1><a href="/">← Beranda</a></main>;
 return <main><header className="header"><div className="head shell"><a href="/" className="brand"><img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research"/></a><a href="/">← Beranda</a></div><div className="orange"/></header><section className="section shell"><div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:48,alignItems:'start'}}>{r.photo_url?<img src={r.photo_url} alt={r.name} style={{width:'100%',aspectRatio:'4/5',objectFit:'cover'}}/>:<div style={{width:'100%',aspectRatio:'4/5',background:'#eef2f4'}}/>}<div><span className="eyebrow">▲ PENELITI BANUA</span><h1 style={{font:'500 54px/1.05 Georgia,serif',margin:'18px 0 8px'}}>{r.name}</h1><p style={{fontSize:20,color:'#6c7b84'}}>{r.title||''}</p>{r.bio&&<p style={{lineHeight:1.8,maxWidth:760}}>{r.bio}</p>}<div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'24px 0'}}>{(r.expertise||[]).map(x=><span key={x} style={{padding:'8px 10px',background:'#f5f4ef',fontSize:12}}>{x}</span>)}</div><div style={{display:'flex',gap:18,fontSize:13}}>{r.email_public&&<a href={`mailto:${r.email_public}`}>Email</a>}{r.linkedin_url&&<a href={r.linkedin_url} target="_blank">LinkedIn ↗</a>}{r.orcid&&<span>ORCID {r.orcid}</span>}</div></div></div></section><section className="section pale"><div className="shell"><div className="title"><h2>Publikasi</h2><i/></div>{pubs.length===0?<p>Belum ada publikasi yang ditautkan.</p>:<div className="cards">{pubs.map(p=><a className="card" href={`/publikasi/${p.slug}`} key={p.id}><span>{p.publication_type.replaceAll('_',' ')}</span><h3>{p.title}</h3><p>{p.publication_date||''}</p><b>→</b></a>)}</div>}</div></section></main>
}
