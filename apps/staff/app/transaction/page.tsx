"use client";

import {
  useEffect,
  useState
} from "react";
import { useRouter } from "next/navigation";
import {
  createWhatsAppLink
} from "@mebo/whatsapp";

export default function TransactionPage() {
  const router = useRouter();

  const [receipt, setReceipt] =
    useState<any>(null);

  const [member, setMember] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const receiptUrl =
      sessionStorage.getItem(
        "mebo_receipt_url"
      );

    const memberRaw =
      sessionStorage.getItem(
        "mebo_member"
      );

    if (
      !receiptUrl ||
      !memberRaw
    ) {
      router.replace("/scan");
      return;
    }

    void (async () => {
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
              url: receiptUrl
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Nota gagal dibaca."
        );
        return;
      }

      setReceipt(
        data.receipt
      );

      setMember(
        JSON.parse(memberRaw)
      );
    })();
  }, [router]);

  async function save() {
    if (!receipt || !member) {
      return;
    }

    setLoading(true);
    setError("");

    const response =
      await fetch(
        "/api/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            receipt,
            memberId:
              member.id
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Transaksi gagal."
      );
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);

    sessionStorage.removeItem(
      "mebo_receipt_url"
    );
    sessionStorage.removeItem(
      "mebo_member"
    );
  }

  return (
    <main className="container">
      <div className="card">
        <h1>
          Konfirmasi Transaksi
        </h1>

        {error && (
          <p style={{
            color: "crimson"
          }}>
            {error}
          </p>
        )}

        {member && (
          <p>
            Member:{" "}
            <strong>
              {member.name}
            </strong>{" "}
            ({member.member_code})
          </p>
        )}

        {receipt && (
          <>
            <p>
              Nota:{" "}
              {receipt.receiptCode}
            </p>

            <p>
              Total: Rp{" "}
              {Number(
                receipt.grandTotal
              ).toLocaleString(
                "id-ID"
              )}
            </p>

            <h3>
              Items
            </h3>

            <ul>
              {receipt.items.map(
                (
                  item: any,
                  index: number
                ) => (
                  <li key={index}>
                    {item.serviceName}{" "}
                    {item.quantity}{" "}
                    {item.unit}
                  </li>
                )
              )}
            </ul>

            {!result && (
              <button
                onClick={() =>
                  void save()
                }
                disabled={loading}
              >
                {loading
                  ? "Menyimpan..."
                  : "Simpan Transaksi"}
              </button>
            )}
          </>
        )}
      </div>

      {result && (
        <div className="card">
          <h2>
            Transaksi Berhasil
          </h2>

          <p>
            Poin Transaksi:{" "}
            <strong>
              +{result.pointTransaction}
            </strong>
          </p>

          <p>
            Total Poin Sebelumnya:{" "}
            {result.previousPoints}
          </p>

          <p>
            Total Poin Sekarang:{" "}
            <strong>
              {result.currentPoints}
            </strong>
          </p>

          {member && (
            <a
              className="btn"
              href={createWhatsAppLink(
                member.phone,
                `Halo ${member.name}, transaksi Mebo Laundry berhasil.\n\nNota: ${receipt.receiptCode}\nTotal: Rp ${Number(receipt.grandTotal).toLocaleString("id-ID")}\nPoin transaksi: +${result.pointTransaction}\nTotal poin sebelumnya: ${result.previousPoints}\nTotal poin sekarang: ${result.currentPoints}`
              )}
              target="_blank"
            >
              WhatsApp Customer
            </a>
          )}

          <a
            className="btn"
            href="/"
          >
            Selesai
          </a>
        </div>
      )}
    </main>
  );
}
