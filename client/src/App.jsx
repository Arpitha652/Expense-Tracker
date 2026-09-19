import { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
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

  const handleLoginSuccess = (userData) => setUser(userData);

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
      <div className="app-shell">
        <div className="dashboard">
          <header className="dashboard-header">
            <div>
              <h1>Expense Tracker</h1>
              <p className="welcome-text">Welcome back, {user.name}</p>
            </div>
            <button className="btn-ghost" onClick={() => setUser(null)}>
              Logout
            </button>
          </header>

          <section className="card">
            <ExpenseForm
              userId={user.user_id}
              onExpenseAdded={handleExpenseChange}
            />
          </section>

          {loading ? (
            <p className="loading-text">Loading your expenses...</p>
          ) : (
            <div className="dashboard-grid">
              <section className="card">
                <ExpenseList
                  expenses={expenses}
                  onExpenseDeleted={handleExpenseChange}
                />
              </section>
              <section className="card">
                <ExpenseChart summary={summary} />
              </section>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell auth-shell">
      <div className="auth-card">
        <h1>Expense Tracker</h1>
        <p className="auth-subtitle">
          {showSignup ? "Create your account" : "Welcome back"}
        </p>

        {showSignup ? (
          <Signup onSignupSuccess={handleSignupSuccess} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        <button className="btn-link" onClick={() => setShowSignup(!showSignup)}>
          {showSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default App;
