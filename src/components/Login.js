import React from "react";

function SignInForm() {
  const [state, setState] = React.useState({
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

    const { email, password } = state;

    try {
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      const user = users.find((user) => user.email === email && user.password === password);

      if (user) {
        alert(`Welcome back, ${user.name}!`);
      } else {
        alert("Invalid email or password");
      }

      setState({ email: "", password: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error signing in");
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your account</span>
        <input type="email" placeholder="Email" name="email" value={state.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={state.password} onChange={handleChange} />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
