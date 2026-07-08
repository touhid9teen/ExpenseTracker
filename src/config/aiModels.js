export const AI_MODELS = [
  {
    name: "Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    apiKeyLabel: "GEMINI_API_KEY",
    model: "gemini-flash-latest",
    timeout: 15000,
    authType: "query",
    formatRequest: ({ instruction, userMessage }) => ({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: instruction }] },
    }),
    parseResponse: (data) =>
      data.candidates?.[0]?.content?.parts?.[0]?.text || "",
  },
  {
    name: "DeepSeek",
    url: "https://api.deepseek.com/v1/chat/completions",
    apiKeyLabel: "DEEPSEEK_API_KEY",
    model: "deepseek-chat",
    timeout: 10000,
  },
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKeyLabel: "GROQ_API_KEY",
    model: "mixtral-8x7b-32768",
    timeout: 10000,
  },
  {
    name: "OpenAI",
    url: "https://api.openai.com/v1/chat/completions",
    apiKeyLabel: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
    timeout: 10000,
  },
];
