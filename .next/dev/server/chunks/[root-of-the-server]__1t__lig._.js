module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/utils/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initDb",
    ()=>initDb,
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
}
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(databaseUrl);
async function initDb() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(100) PRIMARY KEY,
        item VARCHAR(255) NOT NULL,
        description TEXT,
        amount NUMERIC(12, 2) NOT NULL,
        date VARCHAR(20) NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        console.log("Database table 'expenses' verified/created successfully.");
    } catch (error) {
        console.error("Failed to initialize database table:", error);
        throw error;
    }
}
}),
"[project]/src/utils/dateUtils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatShortDate",
    ()=>formatShortDate,
    "getCurrentMonthLabel",
    ()=>getCurrentMonthLabel,
    "getCurrentWeekLabel",
    ()=>getCurrentWeekLabel,
    "getDashboardDateLabels",
    ()=>getDashboardDateLabels,
    "getRelativeInputDate",
    ()=>getRelativeInputDate,
    "getTodayInputValue",
    ()=>getTodayInputValue,
    "getWeekRange",
    ()=>getWeekRange,
    "isThisMonth",
    ()=>isThisMonth,
    "isThisWeek",
    ()=>isThisWeek,
    "isToday",
    ()=>isToday,
    "toInputDateValue",
    ()=>toInputDateValue
]);
const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const pad = (value)=>String(value).padStart(2, "0");
const toInputDateValue = (date)=>{
    const normalized = new Date(date);
    return normalized.getFullYear() + "-" + pad(normalized.getMonth() + 1) + "-" + pad(normalized.getDate());
};
const getTodayInputValue = ()=>toInputDateValue(new Date());
const getRelativeInputDate = (offsetDays)=>{
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return toInputDateValue(date);
};
const parseInputDate = (dateStr)=>{
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};
const startOfDay = (date)=>{
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};
const endOfDay = (date)=>{
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999);
    return normalized;
};
const getWeekRange = (baseDate = new Date())=>{
    const start = startOfDay(baseDate);
    start.setDate(start.getDate() - start.getDay());
    const end = endOfDay(start);
    end.setDate(start.getDate() + 6);
    return {
        start,
        end
    };
};
const isToday = (dateStr)=>dateStr === getTodayInputValue();
const isThisWeek = (dateStr)=>{
    const checkDate = parseInputDate(dateStr);
    if (!checkDate) return false;
    const { start, end } = getWeekRange();
    return checkDate >= start && checkDate <= end;
};
const isThisMonth = (dateStr)=>{
    const checkDate = parseInputDate(dateStr);
    if (!checkDate) return false;
    const today = new Date();
    return checkDate.getFullYear() === today.getFullYear() && checkDate.getMonth() === today.getMonth();
};
const formatDate = (dateStr)=>{
    const date = parseInputDate(dateStr);
    if (!date) return dateStr || "";
    return date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
};
const formatShortDate = (dateStr)=>{
    const date = parseInputDate(dateStr);
    if (!date) return dateStr || "";
    return date.getDate() + " " + MONTHS[date.getMonth()];
};
const getCurrentMonthLabel = ()=>{
    const today = new Date();
    return MONTHS[today.getMonth()] + " " + today.getFullYear();
};
const getCurrentWeekLabel = ()=>{
    const { start, end } = getWeekRange();
    return formatShortDate(toInputDateValue(start)) + " - " + formatShortDate(toInputDateValue(end));
};
const getDashboardDateLabels = ()=>({
        today: formatDate(getTodayInputValue()),
        week: getCurrentWeekLabel(),
        month: getCurrentMonthLabel()
    });
}),
"[project]/src/data/expenseData.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "SEED_EXPENSES",
    ()=>SEED_EXPENSES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/dateUtils.js [app-route] (ecmascript)");
;
const CATEGORIES = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Education",
    "Others"
];
const SEED_EXPENSES = [
    {
        id: "seed-1",
        item: "Grocery Shopping",
        description: "Weekly grocery from supermarket",
        amount: 1850,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(0),
        category: "Food"
    },
    {
        id: "seed-2",
        item: "Uber Ride",
        description: "Ride to office",
        amount: 240,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(0),
        category: "Transport"
    },
    {
        id: "seed-3",
        item: "Netflix Subscription",
        description: "Monthly premium plan",
        amount: 1200,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-1),
        category: "Entertainment"
    },
    {
        id: "seed-4",
        item: "Electricity Bill",
        description: "Recent electric bill",
        amount: 3200,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-5),
        category: "Utilities"
    },
    {
        id: "seed-5",
        item: "Starbucks Coffee",
        description: "Coffee with team",
        amount: 450,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(0),
        category: "Food"
    },
    {
        id: "seed-6",
        item: "Dinner at Bistro",
        description: "Family weekend dinner",
        amount: 4200,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-3),
        category: "Food"
    },
    {
        id: "seed-7",
        item: "Medicine purchase",
        description: "Allergy pills and vitamins",
        amount: 650,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-18),
        category: "Healthcare"
    },
    {
        id: "seed-8",
        item: "New Sneakers",
        description: "Sports sneakers",
        amount: 5500,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-8),
        category: "Shopping"
    },
    {
        id: "seed-9",
        item: "Bus Ticket",
        description: "Intercity bus ticket to Sylhet",
        amount: 900,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-20),
        category: "Transport"
    },
    {
        id: "seed-10",
        item: "Internet Bill",
        description: "Monthly broadband fiber bill",
        amount: 1000,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-1),
        category: "Utilities"
    },
    {
        id: "seed-11",
        item: "React Course",
        description: "Udemy advanced course",
        amount: 1500,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-25),
        category: "Education"
    },
    {
        id: "seed-12",
        item: "Doctor Appointment",
        description: "Routine health checkup",
        amount: 1500,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-18),
        category: "Healthcare"
    }
];
}),
"[project]/src/app/api/expenses/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$expenseData$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/expenseData.js [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initDb"])();
        let expenses = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`SELECT * FROM expenses ORDER BY date DESC, created_at DESC`;
        // If database is empty, seed it
        if (expenses.length === 0) {
            console.log("Database is empty. Seeding expenses...");
            for (const expense of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$expenseData$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SEED_EXPENSES"]){
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
          INSERT INTO expenses (id, item, description, amount, date, category)
          VALUES (${expense.id}, ${expense.item}, ${expense.description}, ${expense.amount}, ${expense.date}, ${expense.category})
        `;
            }
            expenses = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`SELECT * FROM expenses ORDER BY date DESC, created_at DESC`;
        }
        // Normalize amounts to numbers since NUMERIC fields can return as strings
        const normalizedExpenses = expenses.map((exp)=>({
                id: exp.id,
                item: exp.item,
                description: exp.description || "",
                amount: Number(exp.amount),
                date: exp.date,
                category: exp.category
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(normalizedExpenses);
    } catch (error) {
        console.error("GET /api/expenses error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initDb"])();
        const body = await request.json();
        const { id, item, description, amount, date, category } = body;
        if (!item || !amount || !date || !category) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const expenseId = id || "exp-" + Math.random().toString(36).substring(2, 11) + "-" + Date.now();
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO expenses (id, item, description, amount, date, category)
      VALUES (${expenseId}, ${item}, ${description || ""}, ${Number(amount)}, ${date}, ${category})
    `;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: expenseId,
            item,
            description: description || "",
            amount: Number(amount),
            date,
            category
        }, {
            status: 201
        });
    } catch (error) {
        console.error("POST /api/expenses error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1t__lig._.js.map