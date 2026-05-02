import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        form
      );

      // store token
      localStorage.setItem("token", res.data.token);

      // redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f6"
  }}>
    <div style={{
      width: "350px",
      background: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px"
          }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#0078d4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        New user?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "#0078d4", cursor: "pointer", fontWeight: "bold" }}
        >
          Create account
        </span>
      </p>
    </div>
  </div>
);
}

export default Login;