import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  "https://mxlutydmehaltgtdhsry.supabase.co";

const SUPABASE_SECRET_KEY =
  "sb_secret_qnq1vkdGNJ6wiMoCjoWebA_cXNDUR4I";

export function createAdminSupabase() {
  return createClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}