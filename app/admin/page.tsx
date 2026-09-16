"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import "./admin.css";

type Publication = {id:string;title:string;publication_type:string;status:string;publication_date:string|null;updated_at:string};
type Metrics={total:number;published:number;draft:number;review:number;researchers:number;events:number;downloads:number};

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [profile, setProfile] = useState<{full_name?:string; role?:string} | null>(null);
  const [metrics,setMetrics]=useState<Metrics>({total:0,published:0,draft:0,review:0,researchers:0,events:0,downloads:0});

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/admin/login"); return; }
      const [profileRes,recentRes,totalRes,publishedRes,draftRes,reviewRes,researcherRes,eventRes,downloadRes]=await Promise.all([
        supabase.from("profiles").select("full_name, role").eq("id", session.user.id).maybeSingle(),
        supabase.from("publications").select("id,title,publication_type,status,publication_date,updated_at").order("updated_at", { ascending: false }).limit(8),
        supabase.from("publications").select("id",{count:"exact",head:true}),
        supabase.from("publications").select("id",{count:"exact",head:true}).eq("status","published"),
        supabase.from("publications").select("id",{count:"exact",head:true}).eq("status","draft"),
        supabase.from("publications").select("id",{count:"exact",head:true}).eq("status","in_review"),
        supabase.from("researchers").select("id",{count:"exact",head:true}).eq("is_active",true),
        supabase.from("events").select("id",{count:"exact",head:true}),
        supabase.from("publication_downloads").select("id",{count:"exact",head:true}),
      ]);
      setProfile(profileRes.data);
      setPublications(recentRes.data ?? []);
      setMetrics({total:totalRes.count??0,published:publishedRes.count??0,draft:draftRes.count??0,review:reviewRes.count??0,researchers:researcherRes.count??0,events:eventRes.count??0,downloads:downloadRes.count??0});
      setReady(true);
    }
    init();
  }, [router]);

  async function logout() { await supabase.auth.signOut(); router.replace("/admin/login"); }
  if (!ready) return <main className="admin-loading">Memuat CMS Banua Research…</main>;

  const metricCards=[["Total Publikasi",metrics.total],["Terbit",metrics.published],["Draft",metrics.draft],["Dalam Review",metrics.review],["Peneliti Aktif",metrics.researchers],["Kegiatan",metrics.events],["Download PDF",metrics.downloads]];

  return <main className="admin-shell"><aside className="admin-sidebar"><a href="/" className="admin-side-logo"><img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research" /></a><nav><a className="active" href="/admin">Dashboard</a><a href="/admin/publications">Publikasi</a><a href="/admin/researchers">Peneliti</a><a href="/admin/events">Kegiatan</a><a href="/admin/media">Media</a><a href="/admin/settings">Pengaturan</a></nav><button onClick={logout}>Keluar</button></aside><section className="admin-main"><header className="admin-topbar"><div><span className="admin-kicker">BANUA RESEARCH CMS</span><h1>Dashboard</h1><p className="admin-help">Ringkasan aktual dari database Banua Research.</p></div><div className="admin-user"><strong>{profile?.full_name || "Tim Banua"}</strong><span>{profile?.role || "researcher"}</span></div></header><div className="admin-metrics">{metricCards.map(([label,value])=><article key={String(label)}><span>{label}</span><strong>{value}</strong></article>)}</div><section className="admin-panel"><div className="admin-panel-head"><div><span className="admin-kicker">CONTENT</span><h2>Publikasi terbaru</h2></div><a href="/admin/publications/new">+ Publikasi baru</a></div>{publications.length===0?<div className="admin-empty"><h3>Belum ada publikasi.</h3><p>Buat publikasi pertama Banua Research dari CMS.</p><a href="/admin/publications/new">Buat publikasi</a></div>:<div className="admin-table-wrap"><table><thead><tr><th>Judul</th><th>Jenis</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead><tbody>{publications.map(p=><tr key={p.id}><td>{p.title}</td><td>{p.publication_type.replaceAll("_"," ")}</td><td><span className={`status ${p.status}`}>{p.status.replaceAll("_"," ")}</span></td><td>{p.publication_date || "—"}</td><td><a href={`/admin/publications/${p.id}`}>Edit →</a></td></tr>)}</tbody></table></div>}</section></section></main>;
}
