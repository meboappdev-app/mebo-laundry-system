"use client";

import { useState } from "react";

export default function NewMember() {
  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  async function save() {
    const response =
      await fetch(
        "/api/members",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            name,
            phone,
            address
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Gagal membuat member."
      );
      return;
    }

    setResult(data);
  }

  return (
    <main className="container">
      <div className="card">
        <a href="/">← Home</a>

        <h1>
          Member Baru
        </h1>

        <input
          placeholder="Nama"
          value={name}
          onChange={e =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Nomor HP"
          value={phone}
          onChange={e =>
            setPhone(e.target.value)
          }
        />

        <textarea
          placeholder="Alamat"
          value={address}
          onChange={e =>
            setAddress(
              e.target.value
            )
          }
        />

        {error && (
          <p style={{
            color: "crimson"
          }}>
            {error}
          </p>
        )}

        <button
          onClick={() =>
            void save()
          }
        >
          Simpan
        </button>
      </div>

      {result && (
        <div className="card">
          <h2>
            Member berhasil
          </h2>

          <p>
            Code:{" "}
            {result.member.member_code}
          </p>

          <p>
            Dashboard:
          </p>

          <textarea
            readOnly
            value={
              result.customerLink
            }
          />
        </div>
      )}
    </main>
  );
}
