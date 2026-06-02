import { getRelativeInputDate } from "../utils/dateUtils";

export const CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment", "Healthcare", "Shopping", "Education", "Others"];

export const SEED_EXPENSES = [
    { id: "seed-1", item: "Grocery Shopping", description: "Weekly grocery from supermarket", amount: 1850, date: getRelativeInputDate(0), category: "Food" },
    { id: "seed-2", item: "Uber Ride", description: "Ride to office", amount: 240, date: getRelativeInputDate(0), category: "Transport" },
    { id: "seed-3", item: "Netflix Subscription", description: "Monthly premium plan", amount: 1200, date: getRelativeInputDate(-1), category: "Entertainment" },
    { id: "seed-4", item: "Electricity Bill", description: "Recent electric bill", amount: 3200, date: getRelativeInputDate(-5), category: "Utilities" },
    { id: "seed-5", item: "Starbucks Coffee", description: "Coffee with team", amount: 450, date: getRelativeInputDate(0), category: "Food" },
    { id: "seed-6", item: "Dinner at Bistro", description: "Family weekend dinner", amount: 4200, date: getRelativeInputDate(-3), category: "Food" },
    { id: "seed-7", item: "Medicine purchase", description: "Allergy pills and vitamins", amount: 650, date: getRelativeInputDate(-18), category: "Healthcare" },
    { id: "seed-8", item: "New Sneakers", description: "Sports sneakers", amount: 5500, date: getRelativeInputDate(-8), category: "Shopping" },
    { id: "seed-9", item: "Bus Ticket", description: "Intercity bus ticket to Sylhet", amount: 900, date: getRelativeInputDate(-20), category: "Transport" },
    { id: "seed-10", item: "Internet Bill", description: "Monthly broadband fiber bill", amount: 1000, date: getRelativeInputDate(-1), category: "Utilities" },
    { id: "seed-11", item: "React Course", description: "Udemy advanced course", amount: 1500, date: getRelativeInputDate(-25), category: "Education" },
    { id: "seed-12", item: "Doctor Appointment", description: "Routine health checkup", amount: 1500, date: getRelativeInputDate(-18), category: "Healthcare" }
];
