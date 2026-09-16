"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();

  const [scanning, setScanning] =
    useState(false);

  const [url, setUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const scannerRef =
    useRef<any>(null);

  async function startScanner() {
    setError("");
    setScanning(true);

    try {
      const {
        Html5Qrcode
      } = await import(
        "html5-qrcode"
      );

      const scanner =
        new Html5Qrcode(
          "nota-reader"
        );

      scannerRef.current =
        scanner;

      await scanner.start(
        {
          facingMode:
            "environment"
        },
        {
          fps: 10,
          qrbox: 250
        },
        async decoded => {
          await scanner.stop();

          scanner.clear();

          setScanning(false);

          sessionStorage.setItem(
            "mebo_receipt_url",
            decoded
          );

          router.push(
            "/member"
          );
        },
        () => {}
      );
    } catch {
      setScanning(false);

      setError(
        "Kamera tidak dapat digunakan. Gunakan input manual."
      );
    }
  }

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      if (scanner) {
        void scanner.stop().catch(
          () => {}
        );
      }
    };
  }, []);

  function continueManual() {
    sessionStorage.setItem(
      "mebo_receipt_url",
      url
    );

    router.push("/staff/member");
  }

  return (
    <main className="container">
      <div className="card">
        <a href="/">← Home</a>

        <h1>
          Scan Nota
        </h1>

        <p>
          Kamera hanya aktif setelah
          tombol Scan Nota ditekan.
        </p>

        {!scanning && (
          <button
            onClick={() =>
              void startScanner()
            }
          >
            Buka Kamera
          </button>
        )}

        <div
          id="nota-reader"
          style={{
            width: "100%",
            maxWidth: 500,
            marginTop: 20
          }}
        />

        {error && (
          <p style={{
            color: "crimson"
          }}>
            {error}
          </p>
        )}
      </div>

      <div className="card">
        <h2>
          Input Manual
        </h2>

        <input
          placeholder="URL Smartlink nota"
          value={url}
          onChange={e =>
            setUrl(e.target.value)
          }
        />

        <button
          onClick={
            continueManual
          }
        >
          Lanjut
        </button>
      </div>
    </main>
  );
}
