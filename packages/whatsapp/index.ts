export function normalizeWhatsAppPhone(
  phone: string
): string {
  let value = phone.replace(/[^\d]/g, "");

  if (value.startsWith("0")) {
    value = "62" + value.slice(1);
  }

  if (value.startsWith("8")) {
    value = "62" + value;
  }

  return value;
}

export function createWhatsAppLink(
  phone: string,
  message: string
): string {
  const normalized =
    normalizeWhatsAppPhone(phone);

  return (
    "https://wa.me/" +
    normalized +
    "?text=" +
    encodeURIComponent(message)
  );
}

export function renderWhatsAppTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(
    /\{\{([^}]+)\}\}/g,
    (_, key: string) =>
      String(
        variables[key.trim()] ?? ""
      )
  );
}
