import { useState } from "react";
import api from "../api/api";

function ExpenseList({ expenses, onExpenseDeleted }) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      onExpenseDeleted();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = categoryFilter
      ? exp.category.toLowerCase().includes(categoryFilter.toLowerCase())
      : true;
    const matchesStart = startDate ? exp.date >= startDate : true;
    const matchesEnd = endDate ? exp.date <= endDate : true;
    return matchesCategory && matchesStart && matchesEnd;
  });

  const clearFilters = () => {
    setCategoryFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div>
      <h3>Your Expenses</h3>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {(categoryFilter || startDate || endDate) && (
          <button type="button" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No matching expenses.</p>
      ) : (
        <ul>
          {filteredExpenses.map((exp) => (
            <li key={exp.id}>
              {exp.date} — {exp.category} — ₹{exp.amount}
              <button onClick={() => handleDelete(exp.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;
