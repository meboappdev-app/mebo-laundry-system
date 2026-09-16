import { NextResponse } from "next/server";
import {
  createAdminSupabase
} from "@mebo/database";
import {
  createMemberAccessToken,
  generateMemberCode
} from "@mebo/member";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const name =
    String(body.name ?? "").trim();

  const phone =
    String(body.phone ?? "").trim();

  const address =
    body.address
      ? String(body.address).trim()
      : null;

  if (!name || !phone) {
    return NextResponse.json(
      {
        error:
          "Nama dan HP wajib."
      },
      {
        status: 400
      }
    );
  }

  const supabase =
    createAdminSupabase();

  const exists =
    await supabase
      .from("members")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

  if (exists.data) {
    return NextResponse.json(
      {
        error:
          "Nomor HP sudah terdaftar."
      },
      {
        status: 409
      }
    );
  }

  const access =
    createMemberAccessToken();

  const result =
    await supabase
      .from("members")
      .insert({
        member_code:
          generateMemberCode(),
        name,
        phone,
        address,
        status: "ACTIVE",
        access_token_hash:
          access.hash,
        token_created_at:
          new Date().toISOString()
      })
      .select("*")
      .single();

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

  const appUrl =
    process.env.MEMBER_APP_URL ||
    "https://mebo-member.vercel.app";

  return NextResponse.json({
    member: result.data,
    customerLink:
      `${appUrl}/m/${access.token}`
  });
}
