import Link from "next/link";

export default function OwnerDashboard(){
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">
            <span className="brand-logo">M</span>
            <span className="brand-name">Mebo Laundry</span>
          </Link>

          <nav className="main-nav">
            <Link href="/">Dashboard</Link>
            <Link href="/members">Member</Link>
            <Link href="/transactions">Transaksi</Link>
            <Link href="/points">Points</Link>
            <Link href="/reports">Laporan</Link>
          </nav>

          <Link href="/api/auth/logout" className="btn btn-secondary">
            Keluar
          </Link>
        </div>
      </header>

      <div className="container">

        <section className="hero">
          <div className="eyebrow" style={{color:"rgba(255,255,255,.7)"}}>
            Mebo Laundry Management
          </div>
          <h1>Selamat datang kembali 👋</h1>
          <p>
            Pantau member, transaksi, loyalty point, dan operasional laundry
            dari satu dashboard.
          </p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Omzet Hari Ini</div>
            <div className="stat-value">Rp 0</div>
            <div className="stat-change">Hari ini</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div className="stat-label">Transaksi Hari Ini</div>
            <div className="stat-value">0</div>
            <div className="stat-change">Transaksi masuk</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-label">Member Aktif</div>
            <div className="stat-value">0</div>
            <div className="stat-change">Pelanggan aktif</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Points Beredar</div>
            <div className="stat-value">0</div>
            <div className="stat-change">Loyalty program</div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2 className="section-title">Akses cepat</h2>
              <p className="section-desc">Menu utama operasional laundry.</p>
            </div>
          </div>

          <div className="action-grid">
            <Link href="/members" className="action-card">
              <span className="action-icon">👥</span>
              <div>
                <div className="action-title">Member</div>
                <div className="action-desc">Kelola pelanggan dan member card.</div>
              </div>
            </Link>

            <Link href="/transactions" className="action-card">
              <span className="action-icon">🧾</span>
              <div>
                <div className="action-title">Transaksi</div>
                <div className="action-desc">Lihat seluruh transaksi laundry.</div>
              </div>
            </Link>

            <Link href="/points" className="action-card">
              <span className="action-icon">⭐</span>
              <div>
                <div className="action-title">Loyalty Points</div>
                <div className="action-desc">Kelola point dan reward.</div>
              </div>
            </Link>

            <Link href="/reports" className="action-card">
              <span className="action-icon">📊</span>
              <div>
                <div className="action-title">Laporan</div>
                <div className="action-desc">Pantau performa bisnis.</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="section grid grid-2">
          <div className="card">
            <h2 className="card-title">Operasional Staff</h2>
            <p className="card-desc">
              Buka workspace khusus staff untuk menerima dan memproses transaksi.
            </p>
            <Link href="/staff" className="btn btn-primary">
              Buka Staff Workspace →
            </Link>
          </div>

          <div className="card">
            <h2 className="card-title">Manajemen Staff</h2>
            <p className="card-desc">
              Kelola akses dan kebutuhan operasional staff.
            </p>
            <Link href="/staff-management" className="btn btn-secondary">
              Kelola Staff →
            </Link>
          </div>
        </section>

      </div>

      <nav className="mobile-nav">
        <Link href="/">⌂<span>Home</span></Link>
        <Link href="/members">👥<span>Member</span></Link>
        <Link href="/transactions">🧾<span>Transaksi</span></Link>
        <Link href="/reports">📊<span>Laporan</span></Link>
      </nav>
    </main>
  );
}
