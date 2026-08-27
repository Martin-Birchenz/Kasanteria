import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader } from "./Loader.jsx";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  console.log("🔍 [ProtectedRoute] Ejecutando...", {
    loading,
    isAuthenticated,
    isAdmin,
    userRole: user?.role,
  });

  if (loading) {
    console.log("⏳ [ProtectedRoute] Bloqueado por loading...");
    return <Loader message="Cargando usuario..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    console.warn("🚫 [ProtectedRoute] Acceso denegado. Redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("🔓 [ProtectedRoute] Acceso permitido.");
  return children ? children : <Outlet />;
};
