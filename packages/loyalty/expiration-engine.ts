export function isExpired(
  expiresAt: string | null
): boolean {
  if (!expiresAt) return false;

  const timestamp =
    new Date(expiresAt).getTime();

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return timestamp <= Date.now();
}
