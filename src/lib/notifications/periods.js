// Period math for the automated spending notifications.
//
// The app is BDT-focused, so period boundaries follow Asia/Dhaka (UTC+6)
// local dates. Edge functions run on UTC, so "today" is derived by shifting
// the clock +6h and reading the UTC date parts. All functions here are pure
// and Edge-safe (no Node-only APIs).
//
// Each period describes the most recently *completed* period (e.g. the day
// that just ended, last week, last month, last year), the period before it
// (for the comparison), and a trailing window used as the user's "regular
// spend" baseline for alerts.

const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n) => String(n).padStart(2, "0");
const toDateStr = (year, month, day) => `${year}-${pad(month)}-${pad(day)}`;

/** Dhaka-local calendar date parts for a given instant (defaults to now). */
export const getDhakaDate = (now = new Date()) => {
  const shifted = new Date(now.getTime() + DHAKA_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
};

/** Dhaka-local 'YYYY-MM-DD' string for the given instant. */
export const toDhakaDateStr = (now = new Date()) => {
  const { year, month, day } = getDhakaDate(now);
  return toDateStr(year, month, day);
};

const addDays = (dateStr, days) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return toDateStr(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
};

const daysInMonth = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/** ISO-8601 week number (1-53) for a 'YYYY-MM-DD' string. */
export const isoWeekNumber = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (dt.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  const thursday = new Date(dt);
  thursday.setUTCDate(dt.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((thursday - firstThursday) / (7 * 24 * 3600 * 1000));
};

/**
 * Return the reporting periods for the most recently completed day, week
 * (Mon–Sun), month and year, each with:
 *   period, key, subject, prevSubject, periodWord, unit
 *   start/end         – the reported period (inclusive 'YYYY-MM-DD')
 *   prevStart/prevEnd – the period before it
 *   baselineStart/End – trailing window for the "regular spend" average
 *   baselineDivisor   – number of periods that window spans
 */
export const computePeriods = (now = new Date()) => {
  const todayStr = toDhakaDateStr(now);

  // ── Day: the most recently completed day ──
  const dayEnd = addDays(todayStr, -1);
  const dayPrev = addDays(dayEnd, -1);
  const day = {
    period: "day",
    key: dayEnd,
    subject: "Yesterday",
    prevSubject: "the day before",
    periodWord: "yesterday",
    unit: "daily",
    start: dayEnd,
    end: dayEnd,
    prevStart: dayPrev,
    prevEnd: dayPrev,
    baselineStart: addDays(dayEnd, -30),
    baselineEnd: addDays(dayEnd, -1),
    baselineDivisor: 30,
  };

  // ── Week: the most recently completed Mon–Sun week ──
  const weekMonday = addDays(todayStr, -7);
  const weekStart = addDays(weekMonday, -((new Date(Date.UTC(...weekMonday.split("-").map(Number))).getUTCDay() + 6) % 7));
  const weekEnd = addDays(weekStart, 6);
  const prevWeekStart = addDays(weekStart, -7);
  const week = {
    period: "week",
    key: `${weekStart.slice(0, 4)}-W${pad(isoWeekNumber(weekStart))}`,
    subject: "Last week",
    prevSubject: "the week before",
    periodWord: "last week",
    unit: "weekly",
    start: weekStart,
    end: weekEnd,
    prevStart: prevWeekStart,
    prevEnd: addDays(prevWeekStart, 6),
    baselineStart: addDays(weekStart, -28),
    baselineEnd: addDays(weekStart, -1),
    baselineDivisor: 4,
  };

  // ── Month: the most recently completed calendar month ──
  const { year, month: nowMonth } = getDhakaDate(now);
  const lastMonth = new Date(Date.UTC(year, nowMonth - 2, 1)); // first day of previous month
  const monthY = lastMonth.getUTCFullYear();
  const monthM = lastMonth.getUTCMonth() + 1;
  const monthStart = toDateStr(monthY, monthM, 1);
  const monthEnd = toDateStr(monthY, monthM, daysInMonth(monthY, monthM));
  const prevMonth = new Date(Date.UTC(monthY, monthM - 2, 1));
  const prevMonthY = prevMonth.getUTCFullYear();
  const prevMonthM = prevMonth.getUTCMonth() + 1;
  const baselineMonthStart = new Date(Date.UTC(monthY, monthM - 4, 1));
  const month = {
    period: "month",
    key: `${monthY}-${pad(monthM)}`,
    subject: MONTHS[monthM - 1],
    prevSubject: MONTHS[prevMonthM - 1],
    periodWord: `in ${MONTHS[monthM - 1]}`,
    unit: "monthly",
    start: monthStart,
    end: monthEnd,
    prevStart: toDateStr(prevMonthY, prevMonthM, 1),
    prevEnd: toDateStr(prevMonthY, prevMonthM, daysInMonth(prevMonthY, prevMonthM)),
    baselineStart: toDateStr(
      baselineMonthStart.getUTCFullYear(),
      baselineMonthStart.getUTCMonth() + 1,
      1
    ),
    baselineEnd: addDays(monthStart, -1),
    baselineDivisor: 3,
  };

  // ── Year: the most recently completed calendar year ──
  const yearEnd = year - 1;
  const prevYearEnd = yearEnd - 1;
  const yearPeriod = {
    period: "year",
    key: `${yearEnd}`,
    subject: `${yearEnd}`,
    prevSubject: `${prevYearEnd}`,
    periodWord: `in ${yearEnd}`,
    unit: "yearly",
    start: `${yearEnd}-01-01`,
    end: `${yearEnd}-12-31`,
    prevStart: `${prevYearEnd}-01-01`,
    prevEnd: `${prevYearEnd}-12-31`,
    baselineStart: `${yearEnd - 2}-01-01`,
    baselineEnd: `${yearEnd - 1}-12-31`,
    baselineDivisor: 2,
  };

  return { day, week, month, year: yearPeriod };
};

export default computePeriods;
