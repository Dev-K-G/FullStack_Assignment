import { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event: "Tech Talk"
  });

const submit = async () => {
  try {
    console.log("Submitting form:", form);

    await axios.post("http://localhost:5001/api/register", form);

    alert("Registered successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + (error.response?.data?.message || error.message));
  }
};

  return (
    <div>
     <input placeholder="Name"
      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Email"
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      {/* <select onChange={(e) => setForm({ ...form, event: e.target.value })}>
        <option>Tech Talk</option>
        <option>Workshop</option>
        <option>Seminar</option>
      </select> */}

      {/* <button type="button" onClick={() => submit()}>Register</button> */}
      <select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}>
        <option value="Tech Talk">Tech Talk</option>
        <option value="Workshop">Workshop</option>
        <option value="Seminar">Seminar</option>
      </select>
      <button type="button" onClick={() => submit()}>Register</button>
    </div>
  );
}