"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import "../../globals.css";

type Publication={id:string;title:string;subtitle:string|null;slug:string;publication_type:string;excerpt:string|null;executive_summary:string|null;publication_date:string|null;cover_image_url:string|null;pdf_url:string|null;key_findings:any;recommendations:any};

export default function PublicationDetail(){
 const params=useParams<{slug:string}>(); const [item,setItem]=useState<Publication|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{if(!params.slug)return;supabase.from("publications").select("id,title,subtitle,slug,publication_type,excerpt,executive_summary,publication_date,cover_image_url,pdf_url,key_findings,recommendations").eq("slug",params.slug).eq("status","published").maybeSingle().then(({data})=>{setItem(data);setLoading(false)})},[params.slug]);
 if(loading)return <main className="section shell"><p>Memuat publikasi...</p></main>;
 if(!item)return <main className="section shell"><h1>Publikasi tidak ditemukan</h1><a href="/publikasi">← Kembali ke publikasi</a></main>;
 const findings=Array.isArray(item.key_findings)?item.key_findings:[]; const recs=Array.isArray(item.recommendations)?item.recommendations:[];
 return <main><header className="header"><div className="head shell"><a href="/" className="brand"><img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research"/></a><a href="/publikasi">← Publikasi</a></div><div className="orange"/></header><article className="section shell" style={{maxWidth:980}}><span className="eyebrow">▲ {item.publication_type.replaceAll("_"," ").toUpperCase()}</span><h1 style={{font:"500 54px/1.05 Georgia,serif",margin:"20px 0"}}>{item.title}</h1>{item.subtitle&&<p style={{fontSize:20,color:"#6c7b84"}}>{item.subtitle}</p>}<p>{item.publication_date||""}</p>{item.cover_image_url&&<img src={item.cover_image_url} alt={item.title} style={{width:"100%",margin:"34px 0"}}/>}<section style={{marginTop:36}}><h2>Ringkasan</h2><p style={{lineHeight:1.8}}>{item.executive_summary||item.excerpt||"Ringkasan publikasi belum tersedia."}</p></section>{findings.length>0&&<section style={{marginTop:36}}><h2>Temuan Utama</h2><ul>{findings.map((x:any,i:number)=><li key={i} style={{marginBottom:12}}>{typeof x==="string"?x:x?.text||JSON.stringify(x)}</li>)}</ul></section>}{recs.length>0&&<section style={{marginTop:36}}><h2>Rekomendasi</h2><ul>{recs.map((x:any,i:number)=><li key={i} style={{marginBottom:12}}>{typeof x==="string"?x:x?.text||JSON.stringify(x)}</li>)}</ul></section>}{item.pdf_url&&<a className="cta" href={item.pdf_url} target="_blank" rel="noreferrer">Buka / Download PDF</a>}</article></main>
}
