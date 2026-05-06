import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AdminEvents from "./components/AdminEvents.jsx";
import EventsPage from "./components/EventsPage.jsx";
import HomePage from "./components/HomePage.jsx";
import UnsubscribePage from "./components/Unsubscribe.jsx";
import EventRegistrations from "./components/EventRegistrations.jsx"
import LoginPage from "./components/LoginPage.jsx"
import { Home } from "lucide-react";

export default function App() {
  return (
    <BrowserRouter>

      {/* 🔝 Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-3" >
        <Link className="navbar-brand fw-bold" to="/">
          Event System
        </Link>

        <div className="ms-auto d-flex gap-3">
          <Link className="nav-link d-flex align-items-center gap-1" to="/">
            <Home size={18} />
              <span>Home</span>
          </Link>

          <Link className="nav-link" to="/events">
            Events
          </Link>

          <Link className="nav-link" to="/admin/login">
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
        <Route path="/subscribers/unsubscribe" element={<UnsubscribePage />} />
        <Route path="/admin/events/:eventId/registrations" element={<EventRegistrations />} />
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>

    </BrowserRouter>
  );
}