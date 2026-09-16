"use client";

import { useRouter } from "next/navigation";

export default function StaffHome() {
  const router = useRouter();

  async function logout() {
    await fetch(
      "/api/auth/logout",
      {
        method: "POST"
      }
    );

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="container">
      <div className="card">
        <h1>
          MEBO LAUNDRY
        </h1>

        <h2>
          Staff
        </h2>

        <p>
          Alur transaksi:
          scan nota → cari member →
          simpan transaksi.
        </p>

        <a
          className="btn"
          href="/staff/scan"
        >
          Scan Nota
        </a>

        <a
          className="btn"
          href="/staff/member"
        >
          Cari Member
        </a>

        <a
          className="btn"
          href="/staff/members/new"
        >
          Tambah Member
        </a>

        <button
          onClick={() =>
            void logout()
          }
        >
          Logout
        </button>
      </div>
    </main>
  );
}
