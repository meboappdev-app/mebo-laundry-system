import {
  createAdminSupabase
} from "@mebo/database";

import {
  hashMemberAccessToken
} from "@mebo/member";

import {
  formatRupiah,
  formatDate
} from "@mebo/ui";

interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default async function MemberDashboard({
  params
}: Props) {
  const { token } =
    await params;

  if (
    !token ||
    token.length < 30
  ) {
    return (
      <main className="container">
        <div className="card">
          <h1>
            Link tidak valid
          </h1>
        </div>
      </main>
    );
  }

  const supabase =
    createAdminSupabase();

  const tokenHash =
    hashMemberAccessToken(
      token
    );

  const memberResult =
    await supabase
      .from("members")
      .select("*")
      .eq(
        "access_token_hash",
        tokenHash
      )
      .eq("status", "ACTIVE")
      .is(
        "token_revoked_at",
        null
      )
      .maybeSingle();

  const member =
    memberResult.data;

  if (!member) {
    return (
      <main className="container">
        <div className="card">
          <h1>
            Link tidak aktif
          </h1>

          <p>
            Hubungi Mebo Laundry untuk
            mendapatkan link baru.
          </p>
        </div>
      </main>
    );
  }

  const [
    transactions,
    points,
    rewards,
    promotions
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .eq(
        "member_id",
        member.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(20),

    supabase
      .from("point_ledger")
      .select("*")
      .eq(
        "member_id",
        member.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(50),

    supabase
      .from("rewards")
      .select("*")
      .eq(
        "member_id",
        member.id
      )
      .eq(
        "status",
        "AVAILABLE"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      ),

    supabase
      .from("promotion_progress")
      .select("*")
      .eq(
        "member_id",
        member.id
      )
  ]);

  const totalPoints =
    (points.data ?? []).reduce(
      (sum, row) =>
        sum + (row.points ?? 0),
      0
    );

  return (
    <main className="container">
      <div className="card">
        <h1>
          MEBO LAUNDRY
        </h1>

        <h2>
          {member.name}
        </h2>

        <p>
          Member Code:
          <strong>
            {" "}
            {member.member_code}
          </strong>
        </p>

        <p>
          HP: {member.phone}
        </p>

        <p>
          {member.address ??
            "-"}
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h2>
            {totalPoints}
          </h2>
          <p>
            Total Poin
          </p>
        </div>

        <div className="card">
          <h2>
            {(rewards.data ?? [])
              .length}
          </h2>
          <p>
            Reward Tersedia
          </p>
        </div>
      </div>

      <div className="card">
        <h2>
          Transaksi Terakhir
        </h2>

        <table>
          <thead>
            <tr>
              <th>Nota</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>

          <tbody>
            {(transactions.data ??
              []).map(row => (
              <tr key={row.id}>
                <td>
                  {row.receipt_code}
                </td>

                <td>
                  {formatRupiah(
                    row.grand_total
                  )}
                </td>

                <td>
                  {row.status}
                </td>

                <td>
                  {formatDate(
                    row.created_at
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>
          Riwayat Poin
        </h2>

        <table>
          <thead>
            <tr>
              <th>Jenis</th>
              <th>Poin</th>
              <th>Keterangan</th>
            </tr>
          </thead>

          <tbody>
            {(points.data ??
              []).map(row => (
              <tr key={row.id}>
                <td>
                  {row.type}
                </td>

                <td>
                  {(row.points ??
                    0) > 0
                    ? "+"
                    : ""}
                  {row.points ?? 0}
                </td>

                <td>
                  {row.description ??
                    "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>
          Reward
        </h2>

        {(rewards.data ??
          []).length === 0 ? (
          <p>
            Belum ada reward tersedia.
          </p>
        ) : (
          (rewards.data ??
            []).map(reward => (
            <div
              key={reward.id}
              style={{
                padding:
                  "12px 0",
                borderBottom:
                  "1px solid #eee"
              }}
            >
              <strong>
                {reward.name}
              </strong>

              <p>
                {reward.description ??
                  "-"}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2>
          Progress Promosi
        </h2>

        {(promotions.data ??
          []).length === 0 ? (
          <p>
            Belum ada progress promosi.
          </p>
        ) : (
          (promotions.data ??
            []).map(progress => (
            <pre
              key={progress.id}
            >
              {JSON.stringify(
                progress,
                null,
                2
              )}
            </pre>
          ))
        )}
      </div>
    </main>
  );
}
