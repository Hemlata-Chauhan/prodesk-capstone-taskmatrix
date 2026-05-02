import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        form
      );

      alert("Registration successful");

      // redirect to login
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
        
        {/* Branding */}
        <h1 style={{
          textAlign: "center",
          color: "#0078d4",
          marginBottom: "10px"
        }}>
          TaskMatrix
        </h1>

        <h2 style={{ marginBottom: "20px" }}>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
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
            value={form.password}
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
            Register
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#0078d4",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;