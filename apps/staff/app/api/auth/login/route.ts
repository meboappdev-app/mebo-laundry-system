import { NextResponse } from "next/server";
import {
  createStaffSession,
  STAFF_COOKIE
} from "@/lib/auth";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const password =
    String(body.password ?? "");

  if (
    password !==
    (process.env.STAFF_LOGIN_PASSWORD ||
      "staff123")
  ) {
    return NextResponse.json(
      {
        error: "Password salah."
      },
      {
        status: 401
      }
    );
  }

  const token =
    await createStaffSession();

  const response =
    NextResponse.json({
      ok: true
    });

  response.cookies.set(
    STAFF_COOKIE,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    }
  );

  return response;
}
