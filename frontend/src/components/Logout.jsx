import { useNavigate } from "react-router-dom";



const handleLogout = () => {
  const navigate = useNavigate(); // Use the hook
  localStorage.removeItem("token"); // Delete the key
  //window.location.href = "/login";   // Force redirect
  
    navigate("/admin"); //smooth redirect
};