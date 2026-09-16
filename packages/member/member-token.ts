import {
  createHash,
  randomBytes
} from "crypto";

export function generateMemberAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashMemberAccessToken(
  token: string
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function createMemberAccessToken() {
  const token = generateMemberAccessToken();

  return {
    token,
    hash: hashMemberAccessToken(token)
  };
}
