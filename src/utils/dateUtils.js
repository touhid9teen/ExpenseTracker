const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (value) => String(value).padStart(2, "0");

export const toInputDateValue = (date) => {
    const normalized = new Date(date);
    return normalized.getFullYear() + "-" + pad(normalized.getMonth() + 1) + "-" + pad(normalized.getDate());
};

export const getTodayInputValue = () => toInputDateValue(new Date());

export const getRelativeInputDate = (offsetDays) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return toInputDateValue(date);
};

const parseInputDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};

const startOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

const endOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999);
    return normalized;
};

export const getWeekRange = (baseDate = new Date()) => {
    const start = startOfDay(baseDate);
    start.setDate(start.getDate() - start.getDay());

    const end = endOfDay(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
};

export const isToday = (dateStr) => dateStr === getTodayInputValue();

export const isThisWeek = (dateStr) => {
    const checkDate = parseInputDate(dateStr);
    if (!checkDate) return false;

    const { start, end } = getWeekRange();
    return checkDate >= start && checkDate <= end;
};

export const isThisMonth = (dateStr) => {
    const checkDate = parseInputDate(dateStr);
    if (!checkDate) return false;

    const today = new Date();
    return checkDate.getFullYear() === today.getFullYear() && checkDate.getMonth() === today.getMonth();
};

export const formatDate = (dateStr) => {
    const date = parseInputDate(dateStr);
    if (!date) return dateStr || "";
    return date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
};

export const formatShortDate = (dateStr) => {
    const date = parseInputDate(dateStr);
    if (!date) return dateStr || "";
    return date.getDate() + " " + MONTHS[date.getMonth()];
};

export const getCurrentMonthLabel = () => {
    const today = new Date();
    return MONTHS[today.getMonth()] + " " + today.getFullYear();
};

export const getCurrentWeekLabel = () => {
    const { start, end } = getWeekRange();
    return formatShortDate(toInputDateValue(start)) + " - " + formatShortDate(toInputDateValue(end));
};

export const getDashboardDateLabels = () => ({
    today: formatDate(getTodayInputValue()),
    week: getCurrentWeekLabel(),
    month: getCurrentMonthLabel()
});
