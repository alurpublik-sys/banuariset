"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "../../../lib/supabase";
import "../admin.css";
export default function MediaPage(){const router=useRouter();const[ready,setReady]=useState(false);useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(!data.session){router.replace('/admin/login');return}setReady(true)})},[router]);if(!ready)return <main className="admin-loading">Memuat media…</main>;return <main className="admin-form-page"><div className="admin-form-header"><div><span className="admin-kicker">CMS</span><h1>Media</h1><p>Storage Banua Research sudah menyiapkan bucket untuk media publik, file publikasi, foto peneliti, dan draft privat.</p></div><a href="/admin">← Dashboard</a></div><section className="admin-panel"><div className="admin-empty"><h3>Media Library siap dihubungkan.</h3><p>Upload UI dan browser file akan menjadi iterasi berikutnya. Struktur Storage Supabase sudah tersedia.</p></div></section></main>}
