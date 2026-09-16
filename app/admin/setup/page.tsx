"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import "../admin.css";

export default function AdminSetupPage(){
  const router=useRouter();
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  async function submit(e:FormEvent){
    e.preventDefault();setLoading(true);setError("");setMessage("");
    const {data,error:signUpError}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});
    if(signUpError){setLoading(false);setError(signUpError.message);return}
    if(!data.session){setLoading(false);setMessage("Akun berhasil dibuat. Cek email untuk konfirmasi, lalu login melalui halaman admin.");return}
    const {error:rpcError}=await supabase.rpc("bootstrap_first_admin");
    setLoading(false);
    if(rpcError){setError(rpcError.message);return}
    router.replace("/admin");
  }

  return <main className="admin-auth-shell"><section className="admin-login-card"><a className="admin-logo" href="/"><img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research"/></a><span className="admin-kicker">INITIAL SETUP</span><h1>Buat Super Admin Pertama</h1><p>Halaman ini hanya dipakai untuk inisialisasi akun pengelola pertama Banua Research.</p><form onSubmit={submit}><label>Nama lengkap<input required value={fullName} onChange={e=>setFullName(e.target.value)}/></label><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Kata sandi<input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimal 8 karakter"/></label>{error&&<div className="admin-error">{error}</div>}{message&&<div className="admin-success">{message}</div>}<button disabled={loading}>{loading?"Menyiapkan...":"Buat Super Admin"}</button></form><a className="admin-back" href="/admin/login">Sudah punya akun? Masuk</a></section></main>
}
