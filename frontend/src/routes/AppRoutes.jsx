import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function ProtectedRoute() {
  return useAuth().user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function HomeRedirect() {
  const { user } = useAuth();
  return (
    <Navigate to={user?.role === "admin" ? "/dashboard" : "/sales"} replace />
  );
}
