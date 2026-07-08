import { NextResponse } from "next/server";
import { callAIModel, getRetryDelaySeconds, isRateLimitError } from "@/utils/aiProviders";
import { AI_MODELS } from "@/config/aiModels";
import { buildSystemInstruction } from "@/utils/promptBuilder";

// ─── Main handler ────────────────────────────────────────

export async function POST(request) {
  try {
    const { message, expenses, user } = await request.json();
    const instruction = buildSystemInstruction({ user, expenses });

    const models = AI_MODELS.map((config) => ({
      name: config.name,
      call: () => callAIModel(config, instruction, message),
    }));

    let lastError = null;

    for (const { name, call } of models) {
      try {
        const response = await call();
        console.log(`[Chat] ${name} responded successfully`);
        return NextResponse.json({ response });
      } catch (error) {
        console.error(`[Chat] ${name} failed:`, error.message);
        lastError = error;
        // Continue to next model
      }
    }

    // All models failed
    console.error("All AI models failed:", lastError);

    if (isRateLimitError(lastError)) {
      const retryDelaySeconds = getRetryDelaySeconds(lastError);
      const retryText = retryDelaySeconds
        ? ` Please try again in about ${retryDelaySeconds} seconds.`
        : " Please try again later.";

      return NextResponse.json(
        {
          response: `All AI services are currently unavailable due to rate limits.${retryText}`,
          code: "ALL_MODELS_RATE_LIMIT",
        },
        {
          status: 429,
          headers: retryDelaySeconds
            ? { "Retry-After": String(retryDelaySeconds) }
            : undefined,
        },
      );
    }

    return NextResponse.json(
      {
        response: "I'm sorry, all AI models are currently unavailable. Please try later.",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        response: "I'm sorry, I encountered an error processing your request.",
      },
      { status: 500 },
    );
  }
}
