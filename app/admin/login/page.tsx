"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAdminPin, supabase } from "../../../lib/supabase";
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
      const { data, error: rpcError } = await supabase.rpc("verify_admin_pin", { p_pin: pin });
      if (rpcError) throw rpcError;
      if (!data?.ok || !data?.user_id) throw new Error("PIN tidak sesuai.");
      saveAdminPin(pin, data.user_id);
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
        <p>Cukup masukkan PIN untuk membuka dashboard.</p>
        <form onSubmit={submit}>
          <label>PIN Admin
            <input
              className="admin-pin-input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
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
