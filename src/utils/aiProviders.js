// ─── Generic model caller ─────────────────────────────────

export async function callAIModel(config, instruction, userMessage) {
  const apiKey = process.env[config.apiKeyLabel];
  if (!apiKey) {
    throw new Error(`${config.apiKeyLabel} not configured`);
  }

  const url =
    config.authType === "query" ? `${config.url}?key=${apiKey}` : config.url;

  const body = config.formatRequest
    ? config.formatRequest({ instruction, userMessage, model: config.model })
    : {
        model: config.model,
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: userMessage },
        ],
        max_tokens: 2048,
      };

  const headers = { "Content-Type": "application/json" };
  if (config.authType !== "query") {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `${config.name} API error ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();

  if (config.parseResponse) {
    return config.parseResponse(data);
  }

  return data.choices?.[0]?.message?.content || "";
}

// ─── Error helpers ────────────────────────────────────────

export const getRetryDelaySeconds = (error) => {
  const retryInfo = error?.errorDetails?.find((detail) =>
    detail?.["@type"]?.includes("RetryInfo")
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
