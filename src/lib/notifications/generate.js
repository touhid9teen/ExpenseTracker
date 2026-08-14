import sql from "../db";
import { computePeriods } from "./periods";

// A period is flagged as an alert when spending exceeds the user's own
// trailing average ("regular spend") by this factor.
export const ALERT_THRESHOLD = 1.25;

const fmt = (n) => `৳${Math.round(n).toLocaleString("en-US")}`;

const TITLES = {
  day: "Daily Spend Summary",
  week: "Weekly Spend Summary",
  month: "Monthly Spend Summary",
  year: "Yearly Spend Summary",
};

const ALERT_TITLES = {
  day: "Daily Spending Alert",
  week: "Weekly Spending Alert",
  month: "Monthly Spending Alert",
  year: "Yearly Spending Alert",
};

/**
 * Build the summary message: total spent in the period + comparison with the
 * previous period (absolute difference and percentage).
 */
const buildSummary = (p, current, previous) => {
  const total = `You spent ${fmt(current)} ${p.periodWord}`;
  if (previous > 0) {
    const diff = current - previous;
    const pct = Math.round((Math.abs(diff) / previous) * 100);
    const direction = diff >= 0 ? "more" : "less";
    return `${total} — ${pct}% ${direction} than ${p.prevSubject} (${fmt(previous)}).`;
  }
  return `${total}.`;
};

/**
 * Build the alert message when the user crossed their regular spend.
 */
const buildAlert = (p, current, baseline) =>
  `You crossed your usual ${p.unit} spend — ${fmt(current)} ${p.periodWord} vs a typical ${fmt(baseline)}.`;

const sumRange = (totals, start, end) => {
  let sum = 0;
  for (const [date, amount] of totals) {
    if (date >= start && date <= end) sum += amount;
  }
  return sum;
};

/**
 * Insert one notification, silently skipping duplicates (the daily cron can
 * re-run and must stay idempotent). Returns true when a row was created.
 */
const insertNotification = async (userId, p, type, title, message) => {
  const result = await sql`
    INSERT INTO notifications (user_id, period, period_key, type, title, message)
    VALUES (${userId}, ${p.period}, ${p.key}, ${type}, ${title}, ${message})
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  return result.length > 0;
};

/**
 * Generate period-end notifications for every user. Safe to call repeatedly —
 * dedupe is handled by the unique index + ON CONFLICT DO NOTHING.
 *
 * @returns {{created: number, users: number, periods: number}}
 */
export const generateNotifications = async () => {
  if (!sql) return { created: 0, users: 0, periods: 0, skipped: "no database" };

  const periods = computePeriods();
  const users = await sql`SELECT id FROM users`;
  let created = 0;

  for (const user of users) {
    const rows = await sql`
      SELECT date, amount FROM expenses
      WHERE user_id = ${user.id} AND date IS NOT NULL
    `;

    // date → total spent that day
    const totals = new Map();
    for (const row of rows) {
      const amount = Number(row.amount);
      if (!Number.isFinite(amount) || !row.date) continue;
      totals.set(row.date, (totals.get(row.date) || 0) + amount);
    }

    for (const p of Object.values(periods)) {
      const current = sumRange(totals, p.start, p.end);
      if (current <= 0) continue; // nothing to report for this period

      const previous = sumRange(totals, p.prevStart, p.prevEnd);
      const baseline =
        sumRange(totals, p.baselineStart, p.baselineEnd) / p.baselineDivisor;

      if (
        await insertNotification(
          user.id,
          p,
          "summary",
          TITLES[p.period],
          buildSummary(p, current, previous)
        )
      ) {
        created += 1;
      }

      if (baseline > 0 && current > baseline * ALERT_THRESHOLD) {
        if (
          await insertNotification(
            user.id,
            p,
            "alert",
            ALERT_TITLES[p.period],
            buildAlert(p, current, baseline)
          )
        ) {
          created += 1;
        }
      }
    }
  }

  return { created, users: users.length, periods: Object.keys(periods).length };
};

export default generateNotifications;
