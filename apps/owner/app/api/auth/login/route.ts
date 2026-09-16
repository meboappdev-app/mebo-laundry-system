import { NextResponse } from "next/server";
import {
  createSession,
  SESSION_COOKIE
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");

    const ownerPassword =
      process.env.OWNER_LOGIN_PASSWORD || "owner123";

    const staffPassword =
      process.env.STAFF_LOGIN_PASSWORD || "staff123";

    let role: "OWNER" | "STAFF" | null = null;

    if (password === ownerPassword) {
      role = "OWNER";
    } else if (password === staffPassword) {
      role = "STAFF";
    }

    if (!role) {
      return NextResponse.json(
        { error: "Password salah." },
        { status: 401 }
      );
    }

    const token = await createSession(role);

    const response = NextResponse.json({
      ok: true,
      role,
      redirect: role === "OWNER" ? "/" : "/staff"
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login gagal." },
      { status: 400 }
    );
  }
}
