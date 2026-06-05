import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getRetryDelaySeconds = (error) => {
  const retryInfo = error?.errorDetails?.find((detail) =>
    detail?.["@type"]?.includes("RetryInfo"),
  );
  const retryDelay = retryInfo?.retryDelay;
  const seconds = Number.parseInt(retryDelay, 10);

  return Number.isFinite(seconds) ? seconds : null;
};

const isRateLimitError = (error) =>
  error?.status === 429 ||
  error?.statusText === "Too Many Requests" ||
  error?.message?.includes("429 Too Many Requests") ||
  error?.message?.toLowerCase().includes("quota");

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { response: "API Key not configured." },
        { status: 500 },
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const { message, expenses, user } = await request.json();

    const today = new Date();
    const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

    const safeExpenses = expenses || [];
    const expensesText = safeExpenses
      .map(
        (exp) =>
          `ID: ${exp.id} | Date: ${exp.date} | Amount: ৳${exp.amount} | Category: ${exp.category} | Description: ${exp.description}`,
      )
      .join("\n");

    const SYSTEM_INSTRUCTION = `YOU ARE A PERSONAL EXPENSE TRACKER ASSISTANT CALLED "FinVue AI".

YOUR KNOWLEDGE BASE:
1. USER INFORMATION:
Username: ${user?.username || "User"}

2. EXPENSE CATEGORIES:
- Food
- Transport
- Shopping
- Entertainment
- Medical
- Education
- Bills
- Other

3. CURRENT EXPENSES LIST:
${expensesText || "No expenses recorded yet."}

YOUR GUIDELINES:
- Answer as a professional, friendly personal finance assistant.
- Use Bangladeshi Taka (৳) for currency.
- Be concise, clear, and helpful.
- Provide summaries, statistics, and insights based on the CURRENT EXPENSES LIST when requested.
- When the user asks to add, update, or delete an expense, YOU MUST output a special JSON action block at the very end of your message.

ACTION BLOCK FORMAT (only include this if modifying data):
[ACTION: {"type": "ADD_EXPENSE", "payload": {"amount": 100, "category": "Food", "description": "lunch", "date": "2026-06-03"}}]
[ACTION: {"type": "DELETE_EXPENSE", "payload": {"id": "expense_id"}}]
[ACTION: {"type": "UPDATE_EXPENSE", "payload": {"id": "expense_id", "amount": 100, "category": "Food", "description": "lunch", "date": "2026-06-03"}}]

- IMPORTANT: You can output MULTIPLE action blocks one after another for batch operations. For example, if the user asks to add 3 expenses, output 3 separate [ACTION: ...] blocks.
- Each action block must be on its own separate line.
- Process ALL tasks the user asked for — do not stop after the first one.
- If you don't need to modify data, just answer normally without the action block.
- If the user asks to add an expense but doesn't provide enough details (e.g., missing amount or description), politely ask for the missing details before outputting the action block.
- If the user doesn't specify a date for a new expense, you MUST use today's date which is: ${todayStr}. Always use this exact date string (YYYY-MM-DD format) for today.
- For updating/deleting, find the correct ID from the CURRENT EXPENSES LIST based on their description/amount/date. If multiple match, ask for clarification.
`;

    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${message}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (isRateLimitError(error)) {
      const retryDelaySeconds = getRetryDelaySeconds(error);
      const retryText = retryDelaySeconds
        ? ` Please try again in about ${retryDelaySeconds} seconds.`
        : " Please try again later.";

      return NextResponse.json(
        {
          response: `FinVue AI has reached the current Gemini API quota limit.${retryText}`,
          code: "GEMINI_RATE_LIMIT",
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
        response: "I'm sorry, I encountered an error processing your request.",
      },
      { status: 500 },
    );
  }
}
