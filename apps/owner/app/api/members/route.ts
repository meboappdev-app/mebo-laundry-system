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
  const body = await request.json();

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
          "Nama dan nomor HP wajib."
      },
      {
        status: 400
      }
    );
  }

  const supabase =
    createAdminSupabase();

  const duplicate =
    await supabase
      .from("members")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

  if (duplicate.error) {
    return NextResponse.json(
      {
        error:
          duplicate.error.message
      },
      {
        status: 500
      }
    );
  }

  if (duplicate.data) {
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

  const memberCode =
    generateMemberCode();

  const access =
    createMemberAccessToken();

  const { data, error } =
    await supabase
      .from("members")
      .insert({
        member_code:
          memberCode,
        phone,
        name,
        address,
        status: "ACTIVE",
        access_token_hash:
          access.hash,
        token_created_at:
          new Date().toISOString()
      })
      .select("*")
      .single();

  if (error) {
    return NextResponse.json(
      {
        error: error.message
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
    member: data,
    accessToken: access.token,
    customerLink:
      `${appUrl}/m/${access.token}`
  });
}
