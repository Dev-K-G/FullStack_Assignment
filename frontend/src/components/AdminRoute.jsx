import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // LocalStorage stores strings

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;