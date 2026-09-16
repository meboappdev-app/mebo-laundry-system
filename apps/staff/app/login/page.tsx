"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function login() {
    setError("");

    const response =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            password
          })
        }
      );

    if (!response.ok) {
      setError(
        "Password salah."
      );
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="container">
      <div
        className="card"
        style={{
          maxWidth: 420,
          margin: "80px auto"
        }}
      >
        <h1>
          MEBO STAFF
        </h1>

        <input
          type="password"
          placeholder="Password Staff"
          value={password}
          onChange={e =>
            setPassword(
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
            void login()
          }
        >
          Login
        </button>
      </div>
    </main>
  );
}
