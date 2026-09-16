"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import "../../admin.css";

function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}

export default function NewPublicationPage(){
  const router=useRouter();
  const [userId,setUserId]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({title:"",subtitle:"",publication_type:"policy_brief",excerpt:"",publication_date:""});

  useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(!data.session){router.replace("/admin/login");return}setUserId(data.session.user.id)})},[router]);

  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError("");const slug=slugify(form.title);const {error}=await supabase.from("publications").insert({title:form.title,slug,subtitle:form.subtitle||null,publication_type:form.publication_type,excerpt:form.excerpt||null,publication_date:form.publication_date||null,status:"draft",created_by:userId,updated_by:userId});setLoading(false);if(error){setError(error.message);return}router.push("/admin")}

  return <main className="admin-form-page"><div className="admin-form-header"><div><span className="admin-kicker">PUBLIKASI</span><h1>Publikasi baru</h1><p>Simpan sebagai draft terlebih dahulu. Workflow review dan publish akan ditambahkan setelah editor aktif.</p></div><a href="/admin">← Dashboard</a></div><form className="admin-form" onSubmit={submit}><label>Judul<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Subjudul<input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})}/></label><div className="admin-form-grid"><label>Jenis<select value={form.publication_type} onChange={e=>setForm({...form,publication_type:e.target.value})}><option value="policy_brief">Policy Brief</option><option value="policy_paper">Policy Paper</option><option value="research_report">Research Report</option><option value="insight">Insight</option><option value="article">Article</option><option value="working_paper">Working Paper</option></select></label><label>Tanggal publikasi<input type="date" value={form.publication_date} onChange={e=>setForm({...form,publication_date:e.target.value})}/></label></div><label>Ringkasan<textarea rows={6} value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/></label>{error&&<div className="admin-error">{error}</div>}<div className="admin-form-actions"><a href="/admin">Batal</a><button disabled={loading||!userId}>{loading?"Menyimpan...":"Simpan draft"}</button></div></form></main>
}
