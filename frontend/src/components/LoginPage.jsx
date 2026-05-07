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
    //   alert(`Login Data: ${JSON.stringify(res.data)}`); //${res.data.token}
      alert(`Success Login`);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin); 

    //   alert("Token:", localStorage.getItem("token"));
    //   alert("IsAdmin:", localStorage.getItem("isAdmin"));
    //   alert("Type of IsAdmin:", typeof localStorage.getItem("isAdmin"));

      window.location.href = "/admin"; // redirect
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
    }}
  >
    {/* BACKGROUND ONLY */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('../assets/admin-bg-2.jpg')",
        // backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(2px) brightness(0.6)",
        transform: "scale(1.1)",
      }}
    />

    {/* OVERLAY */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
      }}
    />

    {/* CENTER LOGIN BOX */}
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "12px",
          background: "white",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Admin Login</h3>

        <input
          type="email"
          className="form-control"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            margin: 0,
          }}
        >
          *** Only Admin can login ***
        </p>

        <button
          className="btn btn-primary"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  </div>
);
}