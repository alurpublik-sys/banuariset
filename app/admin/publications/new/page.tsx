"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import "../../admin.css";

type Option={id:string;name:string};
function slugify(value:string){return value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}

export default function NewPublicationPage(){
  const router=useRouter();
  const [userId,setUserId]=useState("");
  const [topics,setTopics]=useState<Option[]>([]);
  const [regions,setRegions]=useState<Option[]>([]);
  const [topicIds,setTopicIds]=useState<string[]>([]);
  const [regionIds,setRegionIds]=useState<string[]>([]);
  const [cover,setCover]=useState<File|null>(null);
  const [pdf,setPdf]=useState<File|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({title:"",subtitle:"",publication_type:"policy_brief",excerpt:"",executive_summary:"",publication_date:"",key_findings:"",recommendations:"",seo_title:"",seo_description:""});

  useEffect(()=>{async function init(){const {data:{session}}=await supabase.auth.getSession();if(!session){router.replace("/admin/login");return}setUserId(session.user.id);const [{data:t},{data:r}]=await Promise.all([supabase.from("topics").select("id,name").eq("is_active",true).order("sort_order"),supabase.from("regions").select("id,name").eq("is_active",true).order("sort_order")]);setTopics(t??[]);setRegions(r??[])}init()},[router]);

  async function upload(bucket:string,file:File,slug:string){const ext=file.name.split(".").pop()||"bin";const path=`${slug}/${Date.now()}.${ext}`;const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:false});if(error)throw error;return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl}

  async function submit(e:FormEvent){
    e.preventDefault();setLoading(true);setError("");
    try{
      const slug=slugify(form.title);
      let coverUrl:string|null=null,pdfUrl:string|null=null;
      if(cover)coverUrl=await upload("public-media",cover,slug);
      if(pdf)pdfUrl=await upload("publication-files",pdf,slug);
      const findings=form.key_findings.split("\n").map(x=>x.trim()).filter(Boolean);
      const recs=form.recommendations.split("\n").map(x=>x.trim()).filter(Boolean);
      const {data:pub,error:insertError}=await supabase.from("publications").insert({title:form.title,slug,subtitle:form.subtitle||null,publication_type:form.publication_type,excerpt:form.excerpt||null,executive_summary:form.executive_summary||null,key_findings:findings,recommendations:recs,cover_image_url:coverUrl,featured_image_url:coverUrl,pdf_url:pdfUrl,publication_date:form.publication_date||null,status:"draft",seo_title:form.seo_title||form.title,seo_description:form.seo_description||form.excerpt||null,created_by:userId,updated_by:userId}).select("id").single();
      if(insertError)throw insertError;
      if(topicIds.length){const {error}=await supabase.from("publication_topics").insert(topicIds.map(topic_id=>({publication_id:pub.id,topic_id})));if(error)throw error}
      if(regionIds.length){const {error}=await supabase.from("publication_regions").insert(regionIds.map(region_id=>({publication_id:pub.id,region_id})));if(error)throw error}
      router.push("/admin/publications");
    }catch(err:any){setError(err?.message||"Gagal menyimpan publikasi.")}finally{setLoading(false)}
  }

  function toggle(value:string,list:string[],set:(v:string[])=>void){set(list.includes(value)?list.filter(x=>x!==value):[...list,value])}

  return <main className="admin-form-page"><div className="admin-form-header"><div><span className="admin-kicker">PUBLIKASI</span><h1>Publikasi baru</h1><p>Lengkapi metadata, cover, PDF, topik, dan wilayah. Publikasi disimpan sebagai draft.</p></div><a href="/admin/publications">← Daftar publikasi</a></div><form className="admin-form" onSubmit={submit}><label>Judul<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Subjudul<input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})}/></label><div className="admin-form-grid"><label>Jenis<select value={form.publication_type} onChange={e=>setForm({...form,publication_type:e.target.value})}><option value="policy_brief">Policy Brief</option><option value="policy_paper">Policy Paper</option><option value="research_report">Research Report</option><option value="insight">Insight</option><option value="article">Article</option><option value="working_paper">Working Paper</option></select></label><label>Tanggal publikasi<input type="date" value={form.publication_date} onChange={e=>setForm({...form,publication_date:e.target.value})}/></label></div><label>Ringkasan singkat<textarea rows={4} value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/></label><label>Executive summary<textarea rows={7} value={form.executive_summary} onChange={e=>setForm({...form,executive_summary:e.target.value})}/></label><div className="admin-form-grid"><label>Cover image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setCover(e.target.files?.[0]??null)}/></label><label>File PDF<input type="file" accept="application/pdf" onChange={e=>setPdf(e.target.files?.[0]??null)}/></label></div><div className="admin-form-grid"><fieldset><legend>Topik</legend>{topics.map(x=><label key={x.id} style={{display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" checked={topicIds.includes(x.id)} onChange={()=>toggle(x.id,topicIds,setTopicIds)}/>{x.name}</label>)}</fieldset><fieldset><legend>Wilayah</legend>{regions.map(x=><label key={x.id} style={{display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" checked={regionIds.includes(x.id)} onChange={()=>toggle(x.id,regionIds,setRegionIds)}/>{x.name}</label>)}</fieldset></div><label>Temuan utama <small>(satu poin per baris)</small><textarea rows={6} value={form.key_findings} onChange={e=>setForm({...form,key_findings:e.target.value})}/></label><label>Rekomendasi <small>(satu poin per baris)</small><textarea rows={6} value={form.recommendations} onChange={e=>setForm({...form,recommendations:e.target.value})}/></label><div className="admin-form-grid"><label>SEO title<input value={form.seo_title} onChange={e=>setForm({...form,seo_title:e.target.value})}/></label><label>SEO description<textarea rows={3} value={form.seo_description} onChange={e=>setForm({...form,seo_description:e.target.value})}/></label></div>{error&&<div className="admin-error">{error}</div>}<div className="admin-form-actions"><a href="/admin/publications">Batal</a><button disabled={loading||!userId}>{loading?"Menyimpan...":"Simpan draft"}</button></div></form></main>
}
