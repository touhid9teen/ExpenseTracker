export const getCategoryStyles = (category, darkMode) => {
    switch (category) {
        case "Food":
            return {
                bg: darkMode ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border border-emerald-200",
                color: "text-emerald-500",
                bullet: "bg-emerald-500"
            };
        case "Transport":
            return {
                bg: darkMode ? "bg-amber-950/60 text-amber-300 border border-amber-800/60" : "bg-amber-50 text-amber-700 border border-amber-200",
                color: "text-amber-500",
                bullet: "bg-amber-500"
            };
        case "Utilities":
            return {
                bg: darkMode ? "bg-cyan-950/60 text-cyan-300 border border-cyan-800/60" : "bg-cyan-50 text-cyan-700 border border-cyan-200",
                color: "text-cyan-500",
                bullet: "bg-cyan-500"
            };
        case "Entertainment":
            return {
                bg: darkMode ? "bg-purple-950/60 text-purple-300 border border-purple-800/60" : "bg-purple-50 text-purple-700 border border-purple-200",
                color: "text-purple-500",
                bullet: "bg-purple-500"
            };
        case "Healthcare":
            return {
                bg: darkMode ? "bg-rose-950/60 text-rose-300 border border-rose-800/60" : "bg-rose-50 text-rose-700 border border-rose-200",
                color: "text-rose-500",
                bullet: "bg-rose-500"
            };
        case "Shopping":
            return {
                bg: darkMode ? "bg-pink-950/60 text-pink-300 border border-pink-800/60" : "bg-pink-50 text-pink-700 border border-pink-200",
                color: "text-pink-500",
                bullet: "bg-pink-500"
            };
        case "Education":
            return {
                bg: darkMode ? "bg-indigo-950/60 text-indigo-300 border border-indigo-800/60" : "bg-indigo-50 text-indigo-700 border border-indigo-200",
                color: "text-indigo-500",
                bullet: "bg-indigo-500"
            };
        default:
            return {
                bg: darkMode ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200",
                color: "text-slate-400",
                bullet: "bg-slate-400"
            };
    }
};
