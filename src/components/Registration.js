import React, { useState } from "react";
import { Link } from "react-router-dom";

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

<div className="form-box">
<form onSubmit={handleSubmit} className="form">
    <span className="title">Sign up</span>
    <span className="subtitle">Create a free account with your email.</span>
    <div className="form-container">
      <input type="text" class="input" placeholder="Full Name"/>
			<input type="email" class="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
			<input type="password" class="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
    </div>
    <button type="submit">Sign up</button>
</form>
<div className="form-section">
  <p>Have an account? <Link to="/signin" ><a>Sign in</a></Link> </p>
</div>
</div>
    
  );
}

export default SignUpForm;
{/* // <div className="form-container">
    //   <form onSubmit={handleSubmit}>
    //     <h1>Sign Up</h1>
    //     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
    //     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
    //     <button type="submit">Sign Up</button>
    //     {error && <p className="error">{error}</p>}
    //   </form>
    // </div> */}