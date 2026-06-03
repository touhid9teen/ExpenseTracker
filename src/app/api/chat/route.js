import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

- If you don't need to modify data, just answer normally without the action block.
- If the user asks to add an expense but doesn't provide enough details (e.g., missing amount or description), politely ask for the missing details before outputting the action block.
- If the user doesn't specify a date for a new expense, use today's date.
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
    return NextResponse.json(
      {
        response: "I'm sorry, I encountered an error processing your request.",
      },
      { status: 500 },
    );
  }
}
