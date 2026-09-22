import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader } from "./Loader.jsx";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  if (loading) {
    return <Loader message="Cargando usuario..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};
