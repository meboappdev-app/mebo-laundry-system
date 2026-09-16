import {
  createAdminSupabase
} from "@mebo/database";

export default async function SettingsPage() {
  const supabase =
    createAdminSupabase();

  const result =
    await supabase
      .from("settings")
      .select("*")
      .order("key");

  return (
    <main className="container">
      <div className="card">
        <a href="/">← Dashboard</a>
        <h1>Settings</h1>
      </div>

      {(result.data ?? []).map(
        setting => (
          <div
            className="card"
            key={setting.id}
          >
            <strong>
              {setting.key}
            </strong>

            <pre>
              {JSON.stringify(
                setting.value,
                null,
                2
              )}
            </pre>
          </div>
        )
      )}
    </main>
  );
}
