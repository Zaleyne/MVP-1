import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const urlValid = isValidUrl(supabaseUrl);
const keyValid = !!supabaseAnonKey && supabaseAnonKey.length > 10;

console.log("[SUPABASE] URL loaded:", urlValid ? "YES" : "NO (not configured)");
console.log("[SUPABASE] Anon key loaded:", keyValid ? "YES" : "NO (not configured)");

export const supabase =
  urlValid && keyValid
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
  console.warn(
    "[SUPABASE] Client not created — env vars missing or invalid. Sessions will NOT be saved."
  );
}
