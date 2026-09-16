import {
  NextRequest,
  NextResponse
} from "next/server";
import { jwtVerify } from "jose";

const SECRET =
  process.env.AUTH_SESSION_SECRET ||
  "mebo-secret-2025-panjang-banget-yakin-32karakter";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/login") ||
    path.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("mebo_session")?.value;

  if (!token) {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    const result = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET)
    );

    const role = result.payload.role;

    if (
      role !== "OWNER" &&
      role !== "STAFF"
    ) {
      throw new Error();
    }

    /*
     * Staff hanya boleh masuk area /staff
     * dan API /api/staff.
     */
    if (
      role === "STAFF" &&
      !path.startsWith("/staff") &&
      !path.startsWith("/api/staff")
    ) {
      return NextResponse.redirect(
        new URL("/staff", request.url)
      );
    }

    /*
     * Owner tidak boleh masuk API Staff.
     */
    if (
      role === "OWNER" &&
      path.startsWith("/api/staff")
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
