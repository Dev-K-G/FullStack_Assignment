import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AdminEvents from "./components/AdminEvents.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: 20 }}>
              <h1>Event Registration System</h1>
              <RegistrationForm />
            </div>
          }
        />

        <Route path="/admin" element={<AdminEvents />} />
      </Routes>
    </BrowserRouter>
  );
}