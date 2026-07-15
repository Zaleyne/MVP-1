import OpenAI from "openai";

const rawKey = process.env.OPENROUTER_API_KEY;
const trimmed = rawKey?.trim();
if (!trimmed) {
  console.warn("[OPENROUTER] WARNING: No API key found in environment variables");
} else if (trimmed !== rawKey) {
  console.warn("[OPENROUTER] WARNING: API key has whitespace — trimmed automatically");
}
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
