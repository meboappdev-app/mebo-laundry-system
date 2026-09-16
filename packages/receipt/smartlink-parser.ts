import type {
  NormalizedReceipt,
  ReceiptItem
} from "./types";

export function isSmartlinkReceiptUrl(
  value: string
): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "kertas.smartlink.id" &&
      /^\/nota\/n\/[^/]+/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function extractReceiptCode(
  value: string
): string | null {
  if (!isSmartlinkReceiptUrl(value)) {
    return null;
  }

  const url = new URL(value);
  const match = url.pathname.match(
    /^\/nota\/n\/([^/]+)/i
  );

  return match?.[1] ?? null;
}

function cleanText(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function rupiah(value: string): number {
  const cleaned = value
    .replace(/[^\d,-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const result = Number(cleaned);

  return Number.isFinite(result) ? result : 0;
}

function findMoney(
  text: string,
  label: string
): number {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    escaped +
      "\\s*(?:Rp\\.?\\s*)?([0-9.]+)",
    "i"
  );

  const match = text.match(regex);

  return match ? rupiah(match[1]) : 0;
}

export function parseSmartlinkHtml(
  html: string,
  sourceUrl: string
): NormalizedReceipt {
  const text = cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
  );

  const receiptCode =
    extractReceiptCode(sourceUrl) ?? "";

  const customerMatch =
    text.match(
      /Customer\s+([A-Za-zÀ-ÿ0-9 .'-]{2,80})/i
    );

  const phoneMatch =
    text.match(
      /(?:Telepon|Phone|No\.?\s*HP|Customer Phone)\s*[:\-]?\s*(\+?\d{8,16})/i
    );

  const grandTotal =
    findMoney(text, "Total Biaya");

  const paymentAmount =
    findMoney(text, "Pembayaran");

  const subtotal =
    findMoney(text, "Subtotal");

  const discount =
    findMoney(text, "Diskon");

  const serviceFee =
    findMoney(text, "Biaya Layanan");

  const items: ReceiptItem[] = [];

  const serviceRegex =
    /(Cuci\s+Setrika|Cuci\s+Kering|Setrika|Cuci\s+Sepatu)[^0-9]{0,100}(\d+(?:[.,]\d+)?)\s*(KG|PCS)?[^0-9]{0,80}(?:Rp\.?\s*)?([\d.]+)/gi;

  let match: RegExpExecArray | null;

  while (
    (match = serviceRegex.exec(text)) !== null
  ) {
    const quantity = Number(
      match[2].replace(",", ".")
    );

    const unitPrice = rupiah(match[4]);

    if (
      Number.isFinite(quantity) &&
      quantity > 0
    ) {
      items.push({
        serviceName: cleanText(match[1]),
        quantity,
        unit: match[3] || "PCS",
        unitPrice,
        subtotal: quantity * unitPrice
      });
    }
  }

  return {
    receiptCode,
    customerName:
      customerMatch?.[1]?.trim() ?? null,
    customerPhone:
      phoneMatch?.[1]?.trim() ?? null,
    receivedAt: null,
    completedAt: null,
    items,
    subtotal,
    discount,
    serviceFee,
    grandTotal,
    paymentAmount,
    paymentStatus:
      /Belum\s+lunas/i.test(text)
        ? "UNPAID"
        : /Pelunasan|Lunas/i.test(text)
          ? "PAID"
          : null,
    sourceUrl
  };
}
