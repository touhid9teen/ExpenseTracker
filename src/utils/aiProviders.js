import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Error helpers ────────────────────────────────────────

export const getRetryDelaySeconds = (error) => {
  const retryInfo = error?.errorDetails?.find((detail) =>
    detail?.["@type"]?.includes("RetryInfo"),
  );
  const retryDelay = retryInfo?.retryDelay;
  const seconds = Number.parseInt(retryDelay, 10);

  return Number.isFinite(seconds) ? seconds : null;
};

export const isRateLimitError = (error) =>
  error?.status === 429 ||
  error?.statusText === "Too Many Requests" ||
  error?.message?.includes("429 Too Many Requests") ||
  error?.message?.toLowerCase().includes("quota");

// ─── Model providers ──────────────────────────────────────

async function callApi({ url, apiKey, apiKeyLabel, model, instruction, userMessage }) {
  if (!apiKey) {
    throw new Error(`${apiKeyLabel} not configured`);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `${apiKeyLabel.replace("_API_KEY", "")} API error ${response.status}: ${errorBody}`,
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function callGemini(instruction, userMessage) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const prompt = `${instruction}\n\nUser: ${userMessage}\nAssistant:`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function callGroq(instruction, userMessage) {
  return callApi({
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.GROQ_API_KEY,
    apiKeyLabel: "GROQ_API_KEY",
    model: "mixtral-8x7b-32768",
    instruction,
    userMessage,
  });
}

export async function callOpenAI(instruction, userMessage) {
  return callApi({
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: process.env.OPENAI_API_KEY,
    apiKeyLabel: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
    instruction,
    userMessage,
  });
}

export async function callDeepSeek(instruction, userMessage) {
  return callApi({
    url: "https://api.deepseek.com/v1/chat/completions",
    apiKey: process.env.DEEPSEEK_API_KEY,
    apiKeyLabel: "DEEPSEEK_API_KEY",
    model: "deepseek-chat",
    instruction,
    userMessage,
  });
}
