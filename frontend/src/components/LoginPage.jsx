// AdminLogin.jsx
import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/admin/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin"; // redirect
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Admin Login</h3>

      <input
        className="form-control mb-2"
        minLength={8}
        maxLength={20}
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        className="form-control mb-2"
        minLength={5}
        maxLength={10}
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
    </div>
  );
}