"use client";

import Link from "next/link";

export default function StaffDashboard(){
  return (
    <main className="app-shell">

      <header className="topbar">
        <div className="topbar-inner">

          <Link href="/staff" className="brand">
            <span className="brand-logo">M</span>
            <span className="brand-name">Mebo Laundry</span>
          </Link>

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="badge">STAFF</span>
            <Link href="/api/auth/logout" className="btn btn-secondary">
              Keluar
            </Link>
          </div>

        </div>
      </header>

      <div className="container">

        <section className="hero">
          <div className="eyebrow" style={{color:"rgba(255,255,255,.7)"}}>
            Staff Workspace
          </div>
          <h1>Halo, Staff 👋</h1>
          <p>
            Proses member dan transaksi laundry dengan cepat dari sini.
          </p>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2 className="section-title">Operasional</h2>
              <p className="section-desc">
                Menu utama yang digunakan setiap hari.
              </p>
            </div>
          </div>

          <div className="action-grid">

            <Link href="/staff/scan" className="action-card">
              <span className="action-icon">📷</span>
              <div>
                <div className="action-title">Scan Nota</div>
                <div className="action-desc">
                  Scan QR nota Smartlink.
                </div>
              </div>
            </Link>

            <Link href="/staff/member" className="action-card">
              <span className="action-icon">🔎</span>
              <div>
                <div className="action-title">Cari Member</div>
                <div className="action-desc">
                  Cari pelanggan dengan cepat.
                </div>
              </div>
            </Link>

            <Link href="/staff/members/new" className="action-card">
              <span className="action-icon">✨</span>
              <div>
                <div className="action-title">Tambah Member</div>
                <div className="action-desc">
                  Buat member dan member card.
                </div>
              </div>
            </Link>

            <Link href="/staff/transaction" className="action-card">
              <span className="action-icon">🧾</span>
              <div>
                <div className="action-title">Transaksi</div>
                <div className="action-desc">
                  Proses transaksi pelanggan.
                </div>
              </div>
            </Link>

          </div>
        </section>

        <section className="section stats-grid">

          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div className="stat-label">Transaksi Hari Ini</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-label">Member Hari Ini</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Points</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-label">Sistem</div>
            <div className="stat-value" style={{fontSize:21}}>
              Aktif
            </div>
          </div>

        </section>

      </div>

      <nav className="mobile-nav">
        <Link href="/staff">⌂<span>Home</span></Link>
        <Link href="/staff/scan">📷<span>Scan</span></Link>
        <Link href="/staff/member">👤<span>Member</span></Link>
        <Link href="/staff/transaction">🧾<span>Transaksi</span></Link>
      </nav>

    </main>
  );
}
