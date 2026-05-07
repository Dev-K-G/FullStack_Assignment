



const handleLogout = () => {
  localStorage.removeItem("token"); // Delete the key
  window.location.href = "/login";   // Force redirect
};