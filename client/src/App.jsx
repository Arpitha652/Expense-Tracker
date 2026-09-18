import { useState, useEffect } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";
import api from "./api/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async (userId) => {
    try {
      const res = await api.get(`/expenses/${userId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  const fetchSummary = async (userId) => {
    try {
      const res = await api.get(`/expenses/monthly/${userId}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchExpenses(user.user_id),
        fetchSummary(user.user_id),
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    alert("Signup successful! Please login.");
  };

  const handleExpenseChange = () => {
    fetchExpenses(user.user_id);
    fetchSummary(user.user_id);
  };

  if (user) {
    return (
      <div className="App">
        <h1>Expense Tracker</h1>
        <p>Welcome, {user.name}!</p>
        <ExpenseForm
          userId={user.user_id}
          onExpenseAdded={handleExpenseChange}
        />
        {loading ? (
          <p>Loading your expenses...</p>
        ) : (
          <>
            <ExpenseList
              expenses={expenses}
              onExpenseDeleted={handleExpenseChange}
            />
            <ExpenseChart summary={summary} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      {showSignup ? (
        <Signup onSignupSuccess={handleSignupSuccess} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      <button onClick={() => setShowSignup(!showSignup)}>
        {showSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}

export default App;
