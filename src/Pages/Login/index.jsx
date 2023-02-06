import React from "react";
import "./style.css";
import { MdFaceUnlock, MdOutlineLock } from "react-icons/md";
import { useUserAuthContext } from "../../context/userAuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const { signIn, user } = useUserAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();



  const onLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/dashboard");
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      setError(error.message)
    }
  };
  return (
    <div className="login-container">
      <div className="box-container">
        <div className="login">Login</div>
        <form onSubmit={onLogin}>
          <label className="custom-field two">
            <MdFaceUnlock />
            {/* <input type="url" placeholder="&nbsp;" /> */}
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="&nbsp;"
            />
            <span className="placeholder">Enter Email</span>
          </label>

          <label className="custom-field two">
            <MdOutlineLock />
            {/* <input type="url" placeholder="&nbsp;" /> */}
            {/* <input type="password" placeholder="&nbsp;" /> */}
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&nbsp;"
            />
            <span className="placeholder">Enter Password</span>
          </label>
          <div className="error">{error}</div>
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
