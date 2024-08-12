import React, { useState } from "react";

function SignUpForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users?email=" + encodeURIComponent(email));
      const users = await response.json();

      if (users.length > 0) {
        setError("User already exists with this email.");
        return;
      }

      const newUser = { email, password };
      const createUserResponse = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (createUserResponse.ok) {
        const user = await createUserResponse.json();
        onLogin(user); // Pass user data to App component
      } else {
        setError("Failed to create user. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default SignUpForm;
