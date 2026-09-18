import api from "../api/api";

function ExpenseList({ expenses, onExpenseDeleted }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      onExpenseDeleted();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (expenses.length === 0) {
    return <p>No expenses yet.</p>;
  }

  return (
    <div>
      <h3>Your Expenses</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.date} — {exp.category} — ₹{exp.amount}
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
