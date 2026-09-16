"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import "../admin.css";

export default function AdminSetupPage(){
  const router=useRouter();
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [setupCode,setSetupCode]=useState("");
  const [hasSession,setHasSession]=useState(false);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{supabase.auth.getSession().then(({data})=>setHasSession(!!data.session))},[]);

  async function promote(){
    setLoading(true);setError("");setMessage("");
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setLoading(false);setError("Silakan login atau buat akun terlebih dahulu.");return}
    const {data,error:rpcError}=await supabase.rpc("bootstrap_first_admin",{p_code:setupCode});
    setLoading(false);
    if(rpcError){setError(rpcError.message.includes("invalid setup code")?"Kode setup tidak sesuai.":rpcError.message);return}
    if(data===false){setMessage("Super Admin sudah pernah dibuat. Silakan masuk melalui halaman login.");return}
    router.replace("/admin");
  }

  async function submit(e:FormEvent){
    e.preventDefault();setLoading(true);setError("");setMessage("");
    const {data,error:signUpError}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});
    if(signUpError){setLoading(false);setError(signUpError.message);return}
    if(!data.session){setLoading(false);setMessage("Akun berhasil dibuat. Konfirmasi email terlebih dahulu. Setelah itu login, kembali ke halaman Setup, masukkan Kode Setup, lalu aktifkan Super Admin.");return}
    setHasSession(true);
    const {data:promoted,error:rpcError}=await supabase.rpc("bootstrap_first_admin",{p_code:setupCode});
    setLoading(false);
    if(rpcError){setError(rpcError.message.includes("invalid setup code")?"Akun dibuat, tetapi Kode Setup tidak sesuai. Login lalu ulangi aktivasi Super Admin.":rpcError.message);return}
    if(promoted===false){setMessage("Akun dibuat, tetapi Super Admin sudah tersedia. Silakan masuk melalui halaman login.");return}
    router.replace("/admin");
  }

  return <main className="admin-auth-shell"><section className="admin-login-card"><a className="admin-logo" href="/"><img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research"/></a><span className="admin-kicker">INITIAL SETUP</span><h1>Aktifkan Super Admin Pertama</h1><p>Gunakan halaman ini satu kali untuk membuat pengelola pertama Banua Research. Kode Setup hanya diberikan kepada pemilik sistem.</p>{hasSession?<div className="admin-setup-box"><label>Kode Setup<input value={setupCode} onChange={e=>setSetupCode(e.target.value)} placeholder="Masukkan kode setup"/></label>{error&&<div className="admin-error">{error}</div>}{message&&<div className="admin-success">{message}</div>}<button type="button" onClick={promote} disabled={loading||!setupCode}>{loading?"Mengaktifkan...":"Aktifkan Super Admin"}</button></div>:<form onSubmit={submit}><label>Nama lengkap<input required value={fullName} onChange={e=>setFullName(e.target.value)}/></label><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Kata sandi<input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimal 8 karakter"/></label><label>Kode Setup<input required value={setupCode} onChange={e=>setSetupCode(e.target.value)} placeholder="Kode setup dari pemilik sistem"/></label>{error&&<div className="admin-error">{error}</div>}{message&&<div className="admin-success">{message}</div>}<button disabled={loading}>{loading?"Menyiapkan...":"Buat & Aktifkan Super Admin"}</button></form>}<div className="admin-auth-links"><a className="admin-back" href="/admin/login">Sudah punya akun? Masuk</a><a className="admin-back" href="/">← Kembali ke website</a></div></section></main>
}
