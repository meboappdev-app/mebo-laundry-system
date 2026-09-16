"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

type Member = {
  id?: string;
  member_code?: string;
  name?: string;
  phone?: string;
  address?: string;
};

type Result = {
  member: Member;
  customerLink?: string;
};

function normalizePhone(phone:string){
  let p = phone.replace(/\D/g,"");
  if(p.startsWith("0")) p = "62" + p.slice(1);
  return p;
}

export default function NewMemberPage(){
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [result,setResult] = useState<Result|null>(null);
  const [qr,setQr] = useState("");

  async function submit(e:FormEvent){
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);
    setQr("");

    try{
      const res = await fetch("/api/members",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name:name.trim(),
          phone:phone.trim(),
          address:address.trim()
        })
      });

      const data = await res.json().catch(()=>({}));

      if(!res.ok){
        setError(data.error || "Gagal membuat member.");
        setLoading(false);
        return;
      }

      setResult(data);

      if(data.customerLink){
        const qrData = await QRCode.toDataURL(data.customerLink,{
          width:500,
          margin:1,
          errorCorrectionLevel:"M"
        });

        setQr(qrData);
      }
    }catch{
      setError("Tidak dapat terhubung ke server.");
    }

    setLoading(false);
  }

  function sendWhatsApp(){
    if(!result?.member) return;

    const member = result.member;
    const link = result.customerLink || "";

    const message =
`🎉 Selamat datang di Mebo Laundry!

Member Card Anda

👤 Nama: ${member.name || "-"}
🪪 Member ID: ${member.member_code || "-"}
📱 No. HP: ${member.phone || "-"}

⭐ Simpan link member Anda:
${link}

Terima kasih sudah menjadi member Mebo Laundry 🙏`;

    const wa = `https://wa.me/${normalizePhone(member.phone || phone)}?text=${encodeURIComponent(message)}`;

    window.open(wa,"_blank","noopener,noreferrer");
  }

  function downloadCard(){
    if(!result?.member || !qr) return;

    const canvas = document.createElement("canvas");
    const width = 1000;
    const height = 620;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const gradient = ctx.createLinearGradient(0,0,width,height);
    gradient.addColorStop(0,"#111827");
    gradient.addColorStop(.68,"#1d4ed8");
    gradient.addColorStop(1,"#4f46e5");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,width,height);

    ctx.fillStyle = "rgba(255,255,255,.10)";
    ctx.beginPath();
    ctx.arc(850,100,220,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#ffffff";
    ctx.font="800 34px Inter, Arial";
    ctx.fillText("MEBO LAUNDRY",60,75);

    ctx.fillStyle="rgba(255,255,255,.65)";
    ctx.font="700 16px Inter, Arial";
    ctx.fillText("MEMBER CARD",60,110);

    ctx.fillStyle="#ffffff";
    ctx.font="800 48px Inter, Arial";
    ctx.fillText(result.member.name || "Member",60,235);

    ctx.fillStyle="rgba(255,255,255,.72)";
    ctx.font="500 22px Inter, Arial";
    ctx.fillText(result.member.member_code || "",60,275);

    ctx.fillStyle="rgba(255,255,255,.55)";
    ctx.font="500 16px Inter, Arial";
    ctx.fillText(result.member.phone || "",60,315);

    const image = new Image();

    image.onload = () => {
      ctx.fillStyle="#ffffff";
      ctx.fillRect(735,365,190,190);
      ctx.drawImage(image,750,380,160,160);

      ctx.fillStyle="rgba(255,255,255,.55)";
      ctx.font="500 15px Inter, Arial";
      ctx.fillText("Scan untuk membuka member",60,535);

      const a=document.createElement("a");
      a.download=`member-card-${result.member.member_code || "mebo"}.png`;
      a.href=canvas.toDataURL("image/png");
      a.click();
    };

    image.src=qr;
  }

  function printCard(){
    if(!result?.member || !qr) return;

    const w=window.open("","_blank","width=900,height=700");
    if(!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Member Card - ${result.member.member_code || ""}</title>
          <style>
            body{
              margin:0;
              min-height:100vh;
              display:grid;
              place-items:center;
              background:#f4f7fb;
              font-family:Arial,sans-serif;
            }
            .card{
              width:760px;
              max-width:90vw;
              padding:38px;
              color:white;
              border-radius:28px;
              background:linear-gradient(135deg,#111827,#1d4ed8,#4f46e5);
            }
            .top{
              display:flex;
              justify-content:space-between;
              font-weight:bold;
            }
            .name{
              margin-top:90px;
              font-size:38px;
              font-weight:800;
            }
            .code{
              margin-top:8px;
              opacity:.75;
            }
            .bottom{
              margin-top:45px;
              display:flex;
              justify-content:space-between;
              align-items:end;
            }
            img{
              width:150px;
              height:150px;
              padding:8px;
              background:white;
              border-radius:15px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="top">
              <span>MEBO LAUNDRY</span>
              <span>MEMBER CARD</span>
            </div>
            <div class="name">${result.member.name || ""}</div>
            <div class="code">${result.member.member_code || ""} · ${result.member.phone || ""}</div>
            <div class="bottom">
              <span>Scan QR untuk membuka member</span>
              <img src="${qr}" />
            </div>
          </div>
          <script>
            window.onload=function(){
              window.print();
            }
          </script>
        </body>
      </html>
    `);

    w.document.close();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/members" className="brand">
            <span className="brand-logo">M</span>
            <span className="brand-name">Mebo Laundry</span>
          </Link>

          <Link href="/members" className="btn btn-secondary">
            ← Kembali
          </Link>
        </div>
      </header>

      <div className="container">

        <div className="page-heading">
          <div>
            <div className="eyebrow">Member Management</div>
            <h1 className="page-title">Tambah Member</h1>
            <p className="page-subtitle">
              Daftarkan pelanggan baru dan langsung buat member card digital.
            </p>
          </div>
        </div>

        {!result && (
          <section className="card">
            <div className="card-title">Data pelanggan</div>
            <div className="card-desc">
              Isi data berikut. Member card akan dibuat otomatis setelah berhasil.
            </div>

            <form onSubmit={submit}>
              <div className="form-grid">

                <div className="field">
                  <label>Nama Lengkap</label>
                  <input
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>

                <div className="field">
                  <label>Nomor WhatsApp</label>
                  <input
                    value={phone}
                    onChange={e=>setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    inputMode="tel"
                    required
                  />
                </div>

                <div className="field field-full">
                  <label>Alamat</label>
                  <textarea
                    value={address}
                    onChange={e=>setAddress(e.target.value)}
                    placeholder="Alamat pelanggan"
                  />
                </div>

              </div>

              {error && (
                <div className="alert" style={{marginTop:16}}>
                  {error}
                </div>
              )}

              <div className="btn-row" style={{marginTop:20}}>
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Membuat Member..." : "✨ Buat Member & Card"}
                </button>
              </div>
            </form>
          </section>
        )}

        {result && (
          <div className="grid grid-2">

            <section className="card">
              <div className="card-title">Member berhasil dibuat 🎉</div>
              <div className="card-desc">
                Member card digital sudah siap digunakan.
              </div>

              <div className="member-card-preview">
                <div className="member-card-inner">

                  <div className="member-card-brand">
                    <strong>MEBO LAUNDRY</strong>
                    <span className="member-card-label">MEMBER CARD</span>
                  </div>

                  <div className="member-card-name">
                    {result.member.name}
                  </div>

                  <div className="member-card-code">
                    {result.member.member_code}
                  </div>

                  <div className="member-card-bottom">
                    <div>
                      <div className="member-card-label">
                        MEMBER
                      </div>
                      <div style={{marginTop:6,fontSize:12}}>
                        {result.member.phone}
                      </div>
                    </div>

                    {qr && (
                      <div className="qr-box">
                        <img src={qr} alt="QR Member" />
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="btn-row" style={{marginTop:18}}>
                <button
                  className="btn btn-success"
                  onClick={sendWhatsApp}
                >
                  💬 Kirim Member Card
                </button>

                <button
                  className="btn btn-primary"
                  onClick={downloadCard}
                >
                  ↓ Download Card
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={printCard}
                >
                  🖨 Print
                </button>
              </div>
            </section>

            <section className="card">
              <div className="card-title">Detail Member</div>
              <div className="card-desc">
                Data member yang baru dibuat.
              </div>

              <div className="member-meta">
                <div className="meta-box">
                  <div className="meta-label">NAMA</div>
                  <div className="meta-value">
                    {result.member.name}
                  </div>
                </div>

                <div className="meta-box">
                  <div className="meta-label">MEMBER ID</div>
                  <div className="meta-value">
                    {result.member.member_code}
                  </div>
                </div>

                <div className="meta-box">
                  <div className="meta-label">WHATSAPP</div>
                  <div className="meta-value">
                    {result.member.phone}
                  </div>
                </div>

                <div className="meta-box">
                  <div className="meta-label">STATUS</div>
                  <div className="meta-value">
                    <span className="badge badge-success">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {result.customerLink && (
                <div style={{marginTop:18}}>
                  <div className="field">
                    <label>Member Portal Link</label>
                    <input
                      value={result.customerLink}
                      readOnly
                    />
                  </div>
                </div>
              )}

              <div className="success-box" style={{marginTop:18}}>
                Member sudah tersimpan. Card dapat langsung dikirim ke
                WhatsApp pelanggan.
              </div>

              <div className="btn-row" style={{marginTop:18}}>
                <Link href="/members" className="btn btn-secondary">
                  Lihat Semua Member
                </Link>

                <button
                  className="btn btn-primary"
                  onClick={()=>{
                    setResult(null);
                    setQr("");
                    setName("");
                    setPhone("");
                    setAddress("");
                  }}
                >
                  + Member Baru
                </button>
              </div>
            </section>

          </div>
        )}

      </div>
    </main>
  );
}
