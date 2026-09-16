import { NextResponse } from "next/server";
import { STAFF_COOKIE } from "@/lib/auth";

export async function POST() {
  const response =
    NextResponse.json({
      ok: true
    });

  response.cookies.set(
    STAFF_COOKIE,
    "",
    {
      httpOnly: true,
      expires: new Date(0),
      path: "/"
    }
  );

  return response;
}
