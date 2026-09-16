import {
  jwtVerify,
  SignJWT
} from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "mebo_session";

const SECRET =
  process.env.AUTH_SESSION_SECRET ||
  "mebo-secret-2025-panjang-banget-yakin-32karakter";

function secret() {
  return new TextEncoder().encode(SECRET);
}

export type AppRole = "OWNER" | "STAFF";

export async function createSession(role: AppRole) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const result = await jwtVerify(token, secret());

    if (
      result.payload.role !== "OWNER" &&
      result.payload.role !== "STAFF"
    ) {
      return null;
    }

    return {
      role: result.payload.role as AppRole
    };
  } catch {
    return null;
  }
}
