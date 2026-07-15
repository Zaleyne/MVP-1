import { supabase } from "./supabase";

export function logMetric(
  event: string,
  data: Record<string, unknown> = {}
) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[METRIC] ${event}`, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}

export async function trackEvent(
  eventName: string,
  metadata: Record<string, unknown> = {}
) {
  if (!supabase) return;
  const { error } = await supabase.from("user_events").insert({
    event_name: eventName,
    metadata,
  });
  if (error) console.error("[TRACK EVENT] Error:", error.message);
}
