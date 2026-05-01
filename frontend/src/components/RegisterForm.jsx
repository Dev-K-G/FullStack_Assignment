import { useState } from "react";
import { registerUser } from "../api";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    event: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    alert("Registered successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="event" placeholder="Event" onChange={handleChange} />

      <button type="submit">Register</button>
    </form>
  );
}