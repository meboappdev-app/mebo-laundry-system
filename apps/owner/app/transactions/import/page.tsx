"use client";

import { useState } from "react";

interface Receipt {
  receiptCode: string;
  customerName: string | null;
  customerPhone: string | null;
  subtotal: number;
  discount: number;
  serviceFee: number;
  grandTotal: number;
  paymentAmount: number;
  items: Array<{
    serviceName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    subtotal: number;
  }>;
}

export default function ImportReceiptPage() {
  const [url, setUrl] =
    useState("");

  const [receipt, setReceipt] =
    useState<Receipt | null>(null);

  const [error, setError] =
    useState("");

  async function importReceipt() {
    setError("");
    setReceipt(null);

    const response =
      await fetch(
        "/api/receipt",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            url
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Gagal mengambil nota."
      );
      return;
    }

    setReceipt(
      data.receipt
    );
  }

  return (
    <main className="container">
      <div className="card">
        <a href="/">
          ← Dashboard
        </a>

        <h1>
          Import Nota Smartlink
        </h1>

        <p>
          Masukkan URL nota Smartlink.
        </p>

        <input
          placeholder="https://kertas.smartlink.id/nota/n/..."
          value={url}
          onChange={e =>
            setUrl(e.target.value)
          }
        />

        <button
          onClick={() =>
            void importReceipt()
          }
        >
          Ambil Nota
        </button>

        {error && (
          <p style={{
            color: "crimson"
          }}>
            {error}
          </p>
        )}
      </div>

      {receipt && (
        <div className="card">
          <h2>
            {receipt.receiptCode}
          </h2>

          <p>
            Customer:{" "}
            {receipt.customerName ??
              "-"}
          </p>

          <p>
            HP:{" "}
            {receipt.customerPhone ??
              "-"}
          </p>

          <p>
            Total: Rp{" "}
            {receipt.grandTotal.toLocaleString(
              "id-ID"
            )}
          </p>

          <h3>Items</h3>

          <ul>
            {receipt.items.map(
              (item, index) => (
                <li key={index}>
                  {item.serviceName} —{" "}
                  {item.quantity}{" "}
                  {item.unit} — Rp{" "}
                  {item.subtotal.toLocaleString(
                    "id-ID"
                  )}
                </li>
              )
            )}
          </ul>

          <p>
            Setelah nota berhasil dibaca,
            lanjutkan ke proses member.
          </p>
        </div>
      )}
    </main>
  );
}
