import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function SignInForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users?email=" + encodeURIComponent(email));
      const users = await response.json();

     
      const user = users.find(user => user.password === password);
      
      if (users) {
        onLogin(user); 
        navigate("/Home"); 
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (

<div className="form-box">
<form onSubmit={handleSubmit} className="form">
    <span className="title">Sign in</span>
    <span className="subtitle">Welcome Back</span>
    <div className="form-container">
			<input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
			<input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
    </div>
    <button type="submit">Sign up</button>
    {error && <p className="error">{error}</p>}
</form>
<div class="form-section">
  <p>Don't have an account? <Link to="/signup" >Sign Up</Link>  </p>
</div>
</div>
   
  );
}

export default SignInForm;
 