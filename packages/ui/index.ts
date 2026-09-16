export function formatRupiah(
  value: number | null | undefined
): string {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(value ?? 0);
}

export function formatDate(
  value: string | null | undefined
): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(new Date(value));
}
