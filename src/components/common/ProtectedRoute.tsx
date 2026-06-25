import { type ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "@/context/AuthContext";
import { type UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (userRole === null || !allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };
