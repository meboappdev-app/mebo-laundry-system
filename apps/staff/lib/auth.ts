import {
  jwtVerify,
  SignJWT
} from "jose";
import { cookies } from "next/headers";

export const STAFF_COOKIE =
  "mebo_staff_session";

function secret() {
  const value =
    process.env.AUTH_SESSION_SECRET;

  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_SESSION_SECRET minimal 32 karakter."
    );
  }

  return new TextEncoder().encode(value);
}

export async function createStaffSession() {
  return new SignJWT({
    role: "STAFF"
  })
    .setProtectedHeader({
      alg: "HS256"
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function getStaffSession() {
  const store = await cookies();

  const token =
    store.get(STAFF_COOKIE)?.value;

  if (!token) return null;

  try {
    const result =
      await jwtVerify(
        token,
        secret()
      );

    if (
      result.payload.role !==
      "STAFF"
    ) {
      return null;
    }

    return result.payload;
  } catch {
    return null;
  }
}
