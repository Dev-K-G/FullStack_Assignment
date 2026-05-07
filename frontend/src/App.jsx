import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AdminEvents from "./components/AdminEvents.jsx";
import EventsPage from "./components/EventsPage.jsx";
import HomePage from "./components/HomePage.jsx";
import UnsubscribePage from "./components/Unsubscribe.jsx";
import EventRegistrations from "./components/EventRegistrations.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';  
import AdminRoute from './components/AdminRoute.jsx';
import { Home } from "lucide-react";

export default function App() {
  const token = localStorage.getItem("token");

   const handleLogout = () => {
    localStorage.clear(); // Removes token, isAdmin, etc.
    navigate("/login");    // Send back to login
  };
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

          {token ? (
        // Show this if logged in
        <Link className="nav-link" onClick={handleLogout}>Logout</Link>
      ) : (
          <Link className="nav-link" to="/login">
            Login
          </Link>
      )}

          {localStorage.getItem("isAdmin") === "true" && (
            // <Link to="/admin">Admin Panel</Link>
            <span style={{ 
  color: 'blue', 
  textDecoration: 'underline'
}}>
  Admin Panel
</span>
          )}

        </div>
      </nav>

      {/* Routes */}
      <Routes>
        {/* User Only */}
        {/* <Route element={<ProtectedRoute role="user" />}> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId/register" element={<RegistrationForm />} />        
          <Route path="/subscribers/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/login" element={<LoginPage />} />
        {/* </Route> */}
        

        {/* Protected Routes For Admin Only*/}
        <Route element={<AdminRoute role="admin"/>}>          
          <Route path="/admin" element={<AdminEvents />} />
          <Route path="/admin/events/:eventId/registrations" element={<EventRegistrations />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}