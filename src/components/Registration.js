import React, { useState } from 'react';

function Registration() {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const newUser = await response.json();
        alert(`User signed up with ID: ${newUser.id}`);
        setState({ name: "", email: "", password: "" });
      } else {
        alert("Failed to sign up");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error signing up");
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <input type="text" name="name" value={state.name} onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={state.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Registration;
