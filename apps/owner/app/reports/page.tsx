import {
  createAdminSupabase
} from "@mebo/database";

export default async function ReportsPage() {
  const supabase =
    createAdminSupabase();

  const [
    members,
    transactions,
    points
  ] = await Promise.all([
    supabase
      .from("members")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("transactions")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("point_ledger")
      .select("points")
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
        <a href="/">← Dashboard</a>
        <h1>Reports</h1>
      </div>

      <div className="grid">
        <div className="card">
          <h2>
            {members.count ?? 0}
          </h2>
          <p>Members</p>
        </div>

        <div className="card">
          <h2>
            {transactions.count ?? 0}
          </h2>
          <p>Transactions</p>
        </div>

        <div className="card">
          <h2>
            {totalPoints}
          </h2>
          <p>Net Points</p>
        </div>
      </div>
    </main>
  );
}
