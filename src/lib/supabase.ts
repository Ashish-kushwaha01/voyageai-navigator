import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const normalizeEnv = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");

let client: SupabaseClient | null = null;

/**
 * Lazy singleton so missing/invalid env does not crash the whole app at import time
 * (avoids a blank white page before React can render a message).
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = normalizeEnv(import.meta.env.VITE_SUPABASE_URL);
  const supabaseAnonKey = normalizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl)) {
    throw new Error("Invalid VITE_SUPABASE_URL format. Expected: https://<project-ref>.supabase.co");
  }

  const currentProjectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const currentStorageKey = `sb-${currentProjectRef}-auth-token`;

  if (typeof window !== "undefined") {
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith("sb-") && key.endsWith("-auth-token") && key !== currentStorageKey) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => localStorage.removeItem(key));
    window.localStorage.setItem("voyageai:supabase-project-ref", currentProjectRef);
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

/** Delegates to getSupabase() on first property access. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});
