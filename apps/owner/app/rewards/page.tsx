import {
  createAdminSupabase
} from "@mebo/database";

export default async function RewardsPage() {
  const supabase =
    createAdminSupabase();

  const result =
    await supabase
      .from("rewards")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(100);

  return (
    <main className="container">
      <div className="card">
        <a href="/">← Dashboard</a>
        <h1>Rewards</h1>
      </div>

      {(result.data ?? []).map(
        reward => (
          <div
            className="card"
            key={reward.id}
          >
            <h2>
              {reward.name}
            </h2>

            <p>
              Status:{" "}
              {reward.status}
            </p>

            <p>
              Points:{" "}
              {reward.points_cost ??
                0}
            </p>
          </div>
        )
      )}
    </main>
  );
}
