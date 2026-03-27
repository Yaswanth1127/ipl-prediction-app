import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return <div className="state-card">Checking your session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/app/predictions"} replace />;
  }

  return <Outlet />;
}
