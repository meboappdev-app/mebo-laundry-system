import { NextResponse } from "next/server";
import {
  createAdminSupabase
} from "@mebo/database";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const q =
    String(
      searchParams.get("q") ?? ""
    ).trim();

  if (!q) {
    return NextResponse.json({
      members: []
    });
  }

  const supabase =
    createAdminSupabase();

  const safe =
    q.replace(/[%_]/g, "");

  const result =
    await supabase
      .from("members")
      .select("*")
      .or(
        `name.ilike.%${safe}%,phone.ilike.%${safe}%,member_code.ilike.%${safe}%`
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(50);

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
    members:
      result.data ?? []
  });
}
