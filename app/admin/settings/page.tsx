"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "../../../lib/supabase";
import "../admin.css";
export default function SettingsPage(){const router=useRouter();const[rows,setRows]=useState<any[]>([]);const[ready,setReady]=useState(false);useEffect(()=>{(async()=>{const{data:{session}}=await supabase.auth.getSession();if(!session){router.replace('/admin/login');return}const{data}=await supabase.from('site_settings').select('key,value,updated_at').order('key');setRows(data??[]);setReady(true)})()},[router]);if(!ready)return <main className="admin-loading">Memuat pengaturan…</main>;return <main className="admin-form-page"><div className="admin-form-header"><div><span className="admin-kicker">CMS</span><h1>Pengaturan</h1><p>Identitas lembaga, kontak, dan pengaturan situs tersimpan di Supabase.</p></div><a href="/admin">← Dashboard</a></div><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Kunci</th><th>Nilai</th></tr></thead><tbody>{rows.map(r=><tr key={r.key}><td>{r.key}</td><td><code>{JSON.stringify(r.value)}</code></td></tr>)}</tbody></table></div></section></main>}
