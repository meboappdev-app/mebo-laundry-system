import { NextResponse } from "next/server";
import {
  isSmartlinkReceiptUrl,
  parseSmartlinkHtml
} from "@mebo/receipt";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const url =
    String(body.url ?? "").trim();

  if (!isSmartlinkReceiptUrl(url)) {
    return NextResponse.json(
      {
        error:
          "URL Smartlink tidak valid."
      },
      {
        status: 400
      }
    );
  }

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      10000
    );

  try {
    const response =
      await fetch(url, {
        signal:
          controller.signal,
        redirect: "error",
        headers: {
          "User-Agent":
            "Mebo-Laundry-System/2.0"
        }
      });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            `Smartlink HTTP ${response.status}`
        },
        {
          status: 502
        }
      );
    }

    const html =
      await response.text();

    return NextResponse.json({
      receipt:
        parseSmartlinkHtml(
          html,
          url
        )
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Gagal membaca nota."
      },
      {
        status: 502
      }
    );
  } finally {
    clearTimeout(timeout);
  }
}
