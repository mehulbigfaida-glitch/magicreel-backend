import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase is not configured in this environment. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before using Supabase-backed features."
    );
  }

  client = createClient(supabaseUrl, supabaseServiceKey);
  return client;
}

/**
 * Delay Supabase initialization until a Supabase-backed feature is actually used.
 * This allows isolated staging services to boot without copying production secrets.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const instance = getSupabaseClient();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
