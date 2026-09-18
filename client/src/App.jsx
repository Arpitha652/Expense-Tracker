import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    alert("Signup successful! Please login.");
  };

  if (user) {
    return (
      <div className="App">
        <h1>Expense Tracker</h1>
        <p>Welcome, {user.name}!</p>
        {/* Dashboard will go here next */}
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
