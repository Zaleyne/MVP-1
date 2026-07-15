import OpenAI from "openai";

const rawKey = process.env.OPENROUTER_API_KEY;
const keyStatus = rawKey
  ? `YES (length: ${rawKey.length}, starts with: ${rawKey.substring(0, 12)}...)`
  : "NO (undefined)";
const trimmed = rawKey?.trim();
if (trimmed !== rawKey) {
  console.warn("[OPENROUTER] WARNING: API key has whitespace around it — trimmed automatically");
}
console.log("[OPENROUTER] Key loaded:", keyStatus);
console.log("[OPENROUTER] Model:", process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini (default)");

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: trimmed,
  defaultHeaders: {
    "HTTP-Referer": "https://career-coach-mvp.vercel.app",
    "X-Title": "Career Coach MVP",
  },
});

export const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

export default openrouter;
