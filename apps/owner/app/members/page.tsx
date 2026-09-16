"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id?: string;
  member_code?: string;
  name?: string;
  phone?: string;
  address?: string;
  status?: string;
};

export default function MembersPage(){
  const [members,setMembers]=useState<Member[]>([]);
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  async function load(q=""){
    setLoading(true);
    setError("");

    try{
      const res=await fetch(
        `/api/members/search?q=${encodeURIComponent(q)}`
      );

      const data=await res.json().catch(()=>({}));

      if(!res.ok){
        setError(data.error || "Gagal mengambil member.");
        setLoading(false);
        return;
      }

      setMembers(
        Array.isArray(data.members)
          ? data.members
          : Array.isArray(data)
          ? data
          : []
      );
    }catch{
      setError("Tidak dapat mengambil data member.");
    }

    setLoading(false);
  }

  useEffect(()=>{
    const timer=setTimeout(()=>load(search),250);
    return ()=>clearTimeout(timer);
  },[search]);

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
          </nav>

          <Link href="/members/new" className="btn btn-primary">
            + Member
          </Link>
        </div>
      </header>

      <div className="container">

        <div className="page-heading">
          <div>
            <div className="eyebrow">Customer Management</div>
            <h1 className="page-title">Member</h1>
            <p className="page-subtitle">
              Kelola pelanggan dan member card Mebo Laundry.
            </p>
          </div>

          <Link href="/members/new" className="btn btn-primary">
            + Tambah Member
          </Link>
        </div>

        <section className="card" style={{marginBottom:20}}>
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Cari nama, nomor WhatsApp, atau member ID..."
            />
          </div>
        </section>

        {error && (
          <div className="alert" style={{marginBottom:18}}>
            {error}
          </div>
        )}

        {loading ? (
          <section className="card">
            Memuat member...
          </section>
        ) : members.length === 0 ? (
          <section className="card" style={{textAlign:"center",padding:45}}>
            <div style={{fontSize:35}}>👥</div>
            <h2 className="card-title" style={{marginTop:12}}>
              Belum ada member
            </h2>
            <p className="card-desc">
              Tambahkan pelanggan pertama Mebo Laundry.
            </p>
            <Link href="/members/new" className="btn btn-primary">
              + Tambah Member
            </Link>
          </section>
        ) : (
          <div className="member-grid">
            {members.map((member,index)=>{
              const initials=(member.name || "M")
                .split(" ")
                .slice(0,2)
                .map(x=>x[0])
                .join("")
                .toUpperCase();

              return (
                <article className="member-card" key={member.id || member.member_code || index}>

                  <div className="member-top">
                    <div className="member-avatar">
                      {initials}
                    </div>

                    <span className="badge badge-success">
                      {member.status || "ACTIVE"}
                    </span>
                  </div>

                  <div className="member-name">
                    {member.name || "Tanpa Nama"}
                  </div>

                  <div className="member-code">
                    {member.member_code || "-"}
                  </div>

                  <div className="member-meta">
                    <div className="meta-box">
                      <div className="meta-label">WHATSAPP</div>
                      <div className="meta-value">
                        {member.phone || "-"}
                      </div>
                    </div>

                    <div className="meta-box">
                      <div className="meta-label">MEMBER ID</div>
                      <div className="meta-value">
                        {member.member_code || "-"}
                      </div>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

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
