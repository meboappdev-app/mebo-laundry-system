import {
  createAdminSupabase
} from "@mebo/database";

export default async function PointsPage() {
  const supabase =
    createAdminSupabase();

  const result =
    await supabase
      .from("point_ledger")
      .select(
        "id,member_id,transaction_id,type,points,description,created_at"
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
          Point Ledger
        </h1>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Type</th>
              <th>Points</th>
              <th>Keterangan</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(row => {
              const points =
                row.points ?? 0;

              return (
                <tr key={row.id}>
                  <td>
                    {row.member_id}
                  </td>
                  <td>
                    {row.type}
                  </td>
                  <td>
                    <strong>
                      {points > 0
                        ? "+"
                        : ""}
                      {points}
                    </strong>
                  </td>
                  <td>
                    {row.description ??
                      "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
