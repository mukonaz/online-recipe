import React, { useState } from "react";
import "./App.css";
import SignInForm from "./components/Login";
import SignUpForm from "./components/Registration";
import HomePage from "./components/home";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(null); // Track logged-in user
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
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
                <SignUpForm setUser={setUser} /> 
                <SignInForm setUser={setUser} /> 
                <div className="overlay-container">
                  <div className="overlay">
                    <div className="overlay-panel overlay-left">
                      <h1>Welcome Back!</h1>
                      <p>To keep connected with us please login with your personal info</p>
                      <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                        Sign In
                      </button>
                    </div>
                    <div className="overlay-panel overlay-right">
                      <h1>Hello, Friend!</h1>
                      <p>Enter your personal details and start journey with us</p>
                      <button className="ghost" id="signUp" onClick={() => handleOnClick("signUp")}>
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
