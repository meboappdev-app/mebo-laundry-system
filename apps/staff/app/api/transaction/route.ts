import { NextResponse } from "next/server";
import {
  createAdminSupabase
} from "@mebo/database";
import {
  calculateTransactionPoints
} from "@mebo/loyalty";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const receipt =
    body.receipt;

  const memberId =
    String(
      body.memberId ?? ""
    );

  if (
    !receipt ||
    !receipt.receiptCode ||
    !memberId
  ) {
    return NextResponse.json(
      {
        error:
          "Data transaksi tidak lengkap."
      },
      {
        status: 400
      }
    );
  }

  const supabase =
    createAdminSupabase();

  const member =
    await supabase
      .from("members")
      .select("*")
      .eq("id", memberId)
      .eq("status", "ACTIVE")
      .maybeSingle();

  if (!member.data) {
    return NextResponse.json(
      {
        error:
          "Member tidak valid."
      },
      {
        status: 400
      }
    );
  }

  const duplicate =
    await supabase
      .from("transactions")
      .select("id")
      .eq(
        "receipt_code",
        receipt.receiptCode
      )
      .maybeSingle();

  if (duplicate.data) {
    return NextResponse.json(
      {
        error:
          "Nota sudah pernah diproses."
      },
      {
        status: 409
      }
    );
  }

  const transaction =
    await supabase
      .from("transactions")
      .insert({
        member_id: memberId,
        receipt_code:
          receipt.receiptCode,
        customer_name:
          receipt.customerName,
        customer_phone:
          receipt.customerPhone,
        received_at:
          receipt.receivedAt,
        completed_at:
          receipt.completedAt,
        subtotal:
          receipt.subtotal ?? 0,
        discount:
          receipt.discount ?? 0,
        service_fee:
          receipt.serviceFee ?? 0,
        grand_total:
          receipt.grandTotal ?? 0,
        payment_amount:
          receipt.paymentAmount ?? 0,
        payment_status:
          receipt.paymentStatus,
        status:
          receipt.paymentStatus ===
          "PAID"
            ? "PAID"
            : "PENDING"
      })
      .select("*")
      .single();

  if (transaction.error) {
    return NextResponse.json(
      {
        error:
          transaction.error.message
      },
      {
        status: 500
      }
    );
  }

  const items =
    Array.isArray(
      receipt.items
    )
      ? receipt.items
      : [];

  if (items.length > 0) {
    const insertedItems =
      await supabase
        .from("transaction_items")
        .insert(
          items.map(
            (item: any) => ({
              transaction_id:
                transaction.data.id,
              service_name:
                item.serviceName,
              quantity:
                item.quantity,
              unit:
                item.unit,
              unit_price:
                item.unitPrice,
              subtotal:
                item.subtotal
            })
          )
        );

    if (insertedItems.error) {
      return NextResponse.json(
        {
          error:
            insertedItems.error.message
        },
        {
          status: 500
        }
      );
    }
  }

  const point =
    calculateTransactionPoints(
      Number(
        receipt.grandTotal ?? 0
      )
    );

  const previous =
    await supabase
      .from("point_ledger")
      .select("points")
      .eq(
        "member_id",
        memberId
      );

  const previousTotal =
    (previous.data ?? []).reduce(
      (sum, row) =>
        sum + (row.points ?? 0),
      0
    );

  if (point.points > 0) {
    const ledger =
      await supabase
        .from("point_ledger")
        .insert({
          member_id:
            memberId,
          transaction_id:
            transaction.data.id,
          type: "EARN",
          points:
            point.points,
          description:
            `Poin transaksi ${receipt.receiptCode}`
        });

    if (ledger.error) {
      return NextResponse.json(
        {
          error:
            ledger.error.message
        },
        {
          status: 500
        }
      );
    }
  }

  return NextResponse.json({
    transaction:
      transaction.data,
    pointTransaction:
      point.points,
    previousPoints:
      previousTotal,
    currentPoints:
      previousTotal +
      point.points
  });
}
