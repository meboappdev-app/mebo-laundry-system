import { NextResponse } from "next/server";
import {
  createAdminSupabase
} from "@mebo/database";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const phone =
    String(
      searchParams.get("phone") ?? ""
    ).trim();

  if (!phone) {
    return NextResponse.json(
      {
        error:
          "Nomor HP wajib."
      },
      {
        status: 400
      }
    );
  }

  const supabase =
    createAdminSupabase();

  const result =
    await supabase
      .from("members")
      .select("*")
      .eq("phone", phone)
      .eq("status", "ACTIVE")
      .maybeSingle();

  if (result.error) {
    return NextResponse.json(
      {
        error:
          result.error.message
      },
      {
        status: 500
      }
    );
  }

  return NextResponse.json({
    member:
      result.data
  });
}
