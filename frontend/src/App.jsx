import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AdminEvents from "./components/AdminEvents.jsx";
import EventsPage from "./components/EventsPage.jsx";
import HomePage from "./components/HomePage.jsx";

export default function App() {
  return (
    <BrowserRouter>

      {/* 🔝 Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-3">
        <Link className="navbar-brand fw-bold" to="/">
          Event System
        </Link>

        <div className="ms-auto d-flex gap-3">
          <Link className="nav-link" to="/">
            Register
          </Link>

          <Link className="nav-link" to="/events">
            Events
          </Link>

          <Link className="nav-link" to="/admin">
            Admin
          </Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/events" element={<EventsPage />} />
         <Route path="/events/:eventId/register" element={<RegistrationForm />} />
        <Route path="/admin" element={<AdminEvents />} />
      </Routes>

    </BrowserRouter>
  );
}