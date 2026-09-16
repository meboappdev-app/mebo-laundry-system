import {
  createAdminSupabase
} from "@mebo/database";
import {
  formatRupiah,
  formatDate
} from "@mebo/ui";

export default async function TransactionsPage() {
  const supabase =
    createAdminSupabase();

  const result =
    await supabase
      .from("transactions")
      .select(
        "id,receipt_code,grand_total,payment_amount,status,created_at,member_id"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(100);

  const rows =
    result.data ?? [];

  return (
    <main className="container">
      <div className="card">
        <a href="/">← Dashboard</a>

        <h1>
          Transaksi
        </h1>

        <a
          className="btn"
          href="/transactions/import"
        >
          Import Nota
        </a>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nota</th>
              <th>Member</th>
              <th>Total</th>
              <th>Status</th>
              <th>Waktu</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>
                  {row.receipt_code}
                </td>
                <td>
                  {row.member_id}
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
    </main>
  );
}
