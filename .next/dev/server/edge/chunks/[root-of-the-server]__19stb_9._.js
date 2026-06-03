(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__19stb_9._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/db.js [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* global process */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-edge-route] (ecmascript)");
;
const sql = process.env.DATABASE_URL ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL) : null;
const __TURBOPACK__default__export__ = sql;
}),
"[project]/src/lib/jwt.js [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-edge-route] (ecmascript)");
;
const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-expense-tracker';
const key = new TextEncoder().encode(secretKey);
async function encrypt(payload) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('30d') // 1 month
    .sign(key);
}
async function decrypt(input) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(input, key, {
            algorithms: [
                'HS256'
            ]
        });
        return payload;
    } catch (error) {
        return null;
    }
}
}),
"[project]/src/utils/dateUtils.js [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/data/expenseData.js [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "SEED_EXPENSES",
    ()=>SEED_EXPENSES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/dateUtils.js [app-edge-route] (ecmascript)");
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
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(0),
        category: "Food"
    },
    {
        id: "seed-2",
        item: "Uber Ride",
        description: "Ride to office",
        amount: 240,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(0),
        category: "Transport"
    },
    {
        id: "seed-3",
        item: "Netflix Subscription",
        description: "Monthly premium plan",
        amount: 1200,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-1),
        category: "Entertainment"
    },
    {
        id: "seed-4",
        item: "Electricity Bill",
        description: "Recent electric bill",
        amount: 3200,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-5),
        category: "Utilities"
    },
    {
        id: "seed-5",
        item: "Starbucks Coffee",
        description: "Coffee with team",
        amount: 450,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(0),
        category: "Food"
    },
    {
        id: "seed-6",
        item: "Dinner at Bistro",
        description: "Family weekend dinner",
        amount: 4200,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-3),
        category: "Food"
    },
    {
        id: "seed-7",
        item: "Medicine purchase",
        description: "Allergy pills and vitamins",
        amount: 650,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-18),
        category: "Healthcare"
    },
    {
        id: "seed-8",
        item: "New Sneakers",
        description: "Sports sneakers",
        amount: 5500,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-8),
        category: "Shopping"
    },
    {
        id: "seed-9",
        item: "Bus Ticket",
        description: "Intercity bus ticket to Sylhet",
        amount: 900,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-20),
        category: "Transport"
    },
    {
        id: "seed-10",
        item: "Internet Bill",
        description: "Monthly broadband fiber bill",
        amount: 1000,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-1),
        category: "Utilities"
    },
    {
        id: "seed-11",
        item: "React Course",
        description: "Udemy advanced course",
        amount: 1500,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-25),
        category: "Education"
    },
    {
        id: "seed-12",
        item: "Doctor Appointment",
        description: "Routine health checkup",
        amount: 1500,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getRelativeInputDate"])(-18),
        category: "Healthcare"
    }
];
}),
"[project]/src/app/api/expenses/route.js [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jwt.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$expenseData$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/expenseData.js [app-edge-route] (ecmascript)");
;
;
;
;
const runtime = 'edge';
const normalizeAmount = (amount)=>{
    if (typeof amount === 'number' && Number.isFinite(amount)) return amount;
    const parsedAmount = Number.parseFloat(amount);
    return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};
async function GET(request) {
    const token = request.cookies.get('auth_token')?.value;
    let user = null;
    if (token) {
        user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["decrypt"])(token);
    }
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"] || !user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$expenseData$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["SEED_EXPENSES"], {
            status: 200
        });
    }
    try {
        const expenses = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"]`SELECT * FROM expenses WHERE user_id = ${user.id} ORDER BY date DESC`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(expenses.map((expense)=>({
                ...expense,
                amount: normalizeAmount(expense.amount)
            })));
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$expenseData$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["SEED_EXPENSES"], {
            status: 200
        });
    }
}
async function POST(request) {
    const token = request.cookies.get('auth_token')?.value;
    let user = null;
    if (token) {
        user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["decrypt"])(token);
    }
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
    }
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Database is not configured'
        }, {
            status: 503
        });
    }
    try {
        const data = await request.json();
        const { id, description, amount, date, category } = data;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"]`
      INSERT INTO expenses (id, user_id, item, description, amount, date, category)
      VALUES (${id}, ${user.id}, ${description}, ${description}, ${amount}, ${date}, ${category})
      RETURNING *
    `;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...result[0],
            amount: normalizeAmount(result[0].amount)
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error adding expense:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to add expense'
        }, {
            status: 500
        });
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__19stb_9._.js.map