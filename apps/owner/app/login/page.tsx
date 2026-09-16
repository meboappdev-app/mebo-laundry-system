"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Password tidak valid.");
        setLoading(false);
        return;
      }

      router.replace(data.role === "STAFF" ? "/staff" : "/");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server.");
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="login-brand">
          <div className="brand">
            <span className="brand-icon">M</span>
            <span>Mebo Laundry</span>
          </div>

          <h1 className="login-title">Selamat datang 👋</h1>
          <p className="login-subtitle">
            Masuk untuk mengakses sistem Mebo Laundry.
          </p>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert" style={{ marginTop: 14 }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 18 }}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p
          style={{
            margin: "20px 0 0",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 11,
          }}
        >
          Akses akan disesuaikan otomatis berdasarkan akun.
        </p>
      </section>
    </main>
  );
}
