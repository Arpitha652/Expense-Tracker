import { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import api from "./api/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async (userId) => {
    try {
      const res = await api.get(`/expenses/${userId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses(user.user_id);
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
        <ExpenseList
          expenses={expenses}
          onExpenseDeleted={handleExpenseChange}
        />
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
