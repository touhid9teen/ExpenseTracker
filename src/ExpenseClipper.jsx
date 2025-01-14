import InputField from "./Components/InputField";
import Button from "./Components/Button";
import { useEffect, useState } from "react";

const ExpenseClipper = () => {
    const [inputItem, setInputItem] = useState("");
    const [inputAmounts, setInputAmounts] = useState();
    const [inputDate, setInputDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [expenses, setExpenses] = useState([]);
    const [filterDate, setFilteDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const handleClick = () => {
        if (inputItem && inputAmounts) {
            const newExpanse = {
                item: inputItem,
                amount: parseFloat(inputAmounts),
                date: inputDate,
            };
            setExpenses([newExpanse, ...expenses]);
            localStorage.setItem(
                "My_Expenses",
                JSON.stringify([newExpanse, ...expenses])
            );
            setInputAmounts("");
            setInputItem("");
        } else {
            alert("Please fill in all fields");
        }
    };

    const expensesDatewise = expenses.filter(
        (expense) => expense.date === filterDate
    );
    const total_amounts = expensesDatewise.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem("My_Expenses"));
        if (storedExpenses) {
            setExpenses(storedExpenses);
        }
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 bg-gray-200 p-4">
            <h1 className="font-semibold text-4xl text-green-600">
                Expense Tracker
            </h1>
            <div className="w-full max-w-lg p-6 bg-white rounded">
                <div className="flex flex-col gap-4">
                    <InputField
                        type={"text"}
                        placeholder="Item"
                        customClass={"border-2 rounded-lg p-3 text-lg"}
                        value={inputItem}
                        onChange={(e) => setInputItem(e.target.value)}
                    />
                    <InputField
                        type={"number"}
                        placeholder="Amount"
                        customClass={"border-2 rounded rounded-lg p-3 text-lg"}
                        value={inputAmounts}
                        onChange={(e) => setInputAmounts(e.target.value)}
                    />
                    <InputField
                        type={"date"}
                        customClass={"border-2 rounded rounded-lg p-3 text-lg"}
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                    />
                    <Button
                        onClick={handleClick}
                        title={"Add Expenses"}
                        customButtonClass={
                            "bg-green-600 text-white font-semibold rounded rounded-lg p-3 text-lg hover:bg-green-800"
                        }
                    />
                </div>
            </div>
            <div className="w-full max-w-lg p-6 bg-white pt-2">
                <div className="flex flex-row justify-between">
                    <h1 className="font-semibold text-4xl text-green-700 p-3">
                        All Expenses
                    </h1>
                    <InputField
                        type={"date"}
                        customClass={"border-2 rounded-lg p-3 text-lg mb-4"}
                        value={filterDate}
                        onChange={(e) => setFilteDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-row justify-between p-2 border-b">
                    <span className="text-xl font-normal text-green-700">
                        Items
                    </span>
                    <span className="text-xl font-normal text-green-700">
                        Amounts
                    </span>
                </div>
                <ul className="">
                    {expensesDatewise.map((expense, indx) => (
                        <li key={indx}>
                            <div className="flex flex-row justify-between p-2 border-b">
                                <span className="text-xl font-normal">
                                    {expense.item}
                                </span>
                                <span className="text-xl font-normal">
                                    {expense.amount}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full max-w-lg flex flex-row justify-between bg-white p-6 border-b">
                <span className="text-xl font-normal text-green-700">
                    Total Amounts
                </span>
                <span className="text-xl font-normal text-green-700">
                    {total_amounts}
                </span>
            </div>
        </div>
    );
};
export default ExpenseClipper;
