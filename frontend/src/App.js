import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import AdminEvents from "./AdminEvents";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/admin" element={<AdminEvents />} />
      </Routes>
    </BrowserRouter>
  );
}