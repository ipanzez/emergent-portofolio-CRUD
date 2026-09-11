import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (user === null) {
    return (
      <div className="grid min-h-screen place-items-center" data-testid="auth-checking">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-blue" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <Outlet />;
};
