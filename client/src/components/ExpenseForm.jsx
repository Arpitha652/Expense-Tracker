import { useState } from "react";
import api from "../api/api";

function ExpenseForm({ userId, onExpenseAdded }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/expenses", {
        user_id: userId,
        amount: parseFloat(amount),
        category,
        date,
      });
      setAmount("");
      setCategory("");
      setDate("");
      onExpenseAdded();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add expense");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category (e.g. Food, Rent)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default ExpenseForm;
