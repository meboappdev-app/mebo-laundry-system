import {
  createAdminSupabase
} from "@mebo/database";

export default async function PromotionsPage() {
  const supabase =
    createAdminSupabase();

  const result =
    await supabase
      .from("promotions")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  return (
    <main className="container">
      <div className="card">
        <a href="/">← Dashboard</a>
        <h1>Promotions</h1>
        <p>
          Promosi dikelola dari database.
        </p>
      </div>

      {(result.data ?? []).map(
        promotion => (
          <div
            className="card"
            key={promotion.id}
          >
            <h2>
              {promotion.name}
            </h2>

            <p>
              {promotion.description ??
                "-"}
            </p>

            <p>
              Status:{" "}
              {promotion.active
                ? "ACTIVE"
                : "INACTIVE"}
            </p>
          </div>
        )
      )}
    </main>
  );
}
