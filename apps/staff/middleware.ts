import { NextRequest, NextResponse } from "next/server";
import {
  jwtVerify
} from "jose";

export async function middleware(
  request: NextRequest
) {
  const path =
    request.nextUrl.pathname;

  if (
    path.startsWith("/login") ||
    path.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      "mebo_staff_session"
    )?.value;

  if (!token) {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      );
    }

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  try {
    const secret =
      process.env.AUTH_SESSION_SECRET;

    if (!secret) {
      throw new Error();
    }

    const result =
      await jwtVerify(
        token,
        new TextEncoder().encode(
          secret
        )
      );

    if (
      result.payload.role !==
      "STAFF"
    ) {
      throw new Error();
    }

    return NextResponse.next();
  } catch {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      );
    }

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
