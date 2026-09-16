"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email atau kata sandi belum sesuai.");
      return;
    }
    router.replace("/admin");
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-login-card">
        <a className="admin-logo" href="/" aria-label="Kembali ke Banua Research">
          <img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research" />
        </a>
        <span className="admin-kicker">CONTENT MANAGEMENT SYSTEM</span>
        <h1>Masuk ke Banua Research</h1>
        <p>Kelola publikasi, peneliti, kegiatan, dan konten lembaga dari satu tempat.</p>
        <form onSubmit={submit}>
          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nama@banuaresearch.id" required /></label>
          <label>Kata sandi<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required /></label>
          {error && <div className="admin-error">{error}</div>}
          <button disabled={loading}>{loading ? "Memeriksa..." : "Masuk"}</button>
        </form>
        <a className="admin-back" href="/">← Kembali ke website</a>
      </section>
    </main>
  );
}
