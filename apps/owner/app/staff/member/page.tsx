"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MemberPage() {
  const router = useRouter();

  const [phone, setPhone] =
    useState("");

  const [member, setMember] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  async function search() {
    setError("");

    const response =
      await fetch(
        `/api/member?phone=${encodeURIComponent(phone)}`
      );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Gagal mencari member."
      );
      return;
    }

    if (!data.member) {
      setError(
        "Member tidak ditemukan."
      );
      return;
    }

    setMember(data.member);

    sessionStorage.setItem(
      "mebo_member",
      JSON.stringify(
        data.member
      )
    );

    router.push(
      "/transaction"
    );
  }

  return (
    <main className="container">
      <div className="card">
        <a href="/staff/scan">
          ← Scan Nota
        </a>

        <h1>
          Cari Member
        </h1>

        <input
          placeholder="Nomor HP member"
          value={phone}
          onChange={e =>
            setPhone(e.target.value)
          }
        />

        <button
          onClick={() =>
            void search()
          }
        >
          Cari Member
        </button>

        {error && (
          <p style={{
            color: "crimson"
          }}>
            {error}
          </p>
        )}

        {member && (
          <div>
            <h2>
              {member.name}
            </h2>
            <p>
              {member.member_code}
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <a
          className="btn"
          href="/staff/members/new"
        >
          Member Baru
        </a>
      </div>
    </main>
  );
}
