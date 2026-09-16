"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("pin-login", {
        body: { pin },
      });
      if (invokeError) throw invokeError;
      if (!data?.token_hash) throw new Error(data?.error || "PIN tidak sesuai.");

      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: data.token_hash,
        type: "email",
      });
      if (verifyError) throw verifyError;

      router.replace("/admin");
    } catch {
      setError("PIN salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-login-card admin-pin-card">
        <a className="admin-logo" href="/" aria-label="Kembali ke Banua Research">
          <img src="https://raw.githubusercontent.com/alurpublik-sys/banuariset/main/public/banua-logo.png" alt="Banua Research" />
        </a>
        <span className="admin-kicker">BANUA RESEARCH CMS</span>
        <h1>Masuk Admin</h1>
        <p>Masukkan PIN untuk membuka dashboard pengelolaan Banua Research.</p>
        <form onSubmit={submit}>
          <label>PIN Admin
            <input
              className="admin-pin-input"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={pin}
              onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,6))}
              placeholder="••••••"
              required
              autoFocus
            />
          </label>
          {error && <div className="admin-error">{error}</div>}
          <button disabled={loading || pin.length !== 6}>{loading ? "Memeriksa..." : "Masuk Dashboard"}</button>
        </form>
        <div className="admin-auth-links"><a className="admin-back" href="/">← Kembali ke website</a></div>
      </section>
    </main>
  );
}
