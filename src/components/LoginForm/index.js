import React, { Component } from "react";
import { motion } from "framer-motion";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css"; // Import CSS for styling

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    name: "",
    gender: "Male",
    isLogin: true,
    errorMessage: "",
  };

  toggleMode = () => {
    this.setState({ isLogin: !this.state.isLogin, errorMessage: "" });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, name, gender, isLogin } = this.state;
    
    const url = isLogin ? "http://localhost:3000/login/" : "http://localhost:3000/register/";
    const bodyData = isLogin ? { username, password } : { username, password, name, gender };
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.setState({ errorMessage: errorText });
        return;
      }

      if (isLogin) {
        const data = await response.json();
        const jwtToken = data.jwtToken;

        if (jwtToken) {
          Cookies.set("jwt_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU", { expires: 30 });
          this.props.history.replace("/");
        }
      } else {
        alert("User Registered Successfully!");
        this.toggleMode();
      }
    } catch (error) {
      this.setState({ errorMessage: "Something went wrong. Try again later." });
    }
  };

  render() {
    const { isLogin, errorMessage } = this.state;
    
    return (
      <div className="auth-container" style={{
        backgroundImage: "url('https://res.cloudinary.com/dgledopgq/image/upload/v1743426554/ChatGPT_Image_Mar_31_2025_at_06_38_11_PM_z8iq7t.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh"
      }}>
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={this.handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={this.handleInputChange}
                  required
                />
                <select name="gender" onChange={this.handleInputChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleInputChange}
              required
            />
            
            <button type="submit" className="auth-button">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="toggle-text" onClick={this.toggleMode}>
            {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
          </p>
        </motion.div>
      </div>
    );
  }
}

export default withRouter(LoginForm);
