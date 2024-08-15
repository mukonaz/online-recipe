import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import "./App.css";
import SignInForm from "./components/Login";
import SignUpForm from "./components/Registration";
import Home from "./components/home";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    console.log("Logging in user:", userData); 
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SignInForm onLogin={handleLogin} />} />
      <Route path="/signin" element={<SignInForm onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUpForm onLogin={handleLogin} />} />
      <Route
        path="/home"
        element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
