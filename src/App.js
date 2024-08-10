import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SignInForm from "./components/Login";
import SignUpForm from "./components/Registration";
import Home from "./components/home";

export default function App() {
  const [type, setType] = useState("signIn");
  const [user, setUser] = useState(null); // State to manage user authentication

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData); // Set user data on successful login
  };

  const handleLogout = () => {
    setUser(null); // Clear user data on logout
  };

  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <Router>
      <div className="App">
        <h2>Online Recipe Form</h2>

        <Routes>
          <Route
            path="/"
            element={
              <div className={containerClass} id="container">
                {type === "signUp" ? (
                  <SignUpForm onLogin={handleLogin} />
                ) : (
                  <SignInForm onLogin={handleLogin} />
                )}
                <div className="overlay-container">
                  <div className="overlay">
                    <div className="overlay-panel overlay-left">
                      <h1>Welcome Back!</h1>
                      <p>To keep connected with us, please login with your personal info</p>
                      <button
                        className="ghost"
                        id="signIn"
                        onClick={() => handleOnClick("signIn")}
                      >
                        Sign In
                      </button>
                    </div>
                    <div className="overlay-panel overlay-right">
                      <h1>Hello, Friend!</h1>
                      <p>Enter your personal details and start your journey with us</p>
                      <button
                        className="ghost"
                        id="signUp"
                        onClick={() => handleOnClick("signUp")}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/home"
            element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          {/* Redirect to home if the user tries to access an unknown route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
