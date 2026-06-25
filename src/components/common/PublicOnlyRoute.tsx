import { type ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "@/context/AuthContext";
import { roleToPath } from "@/lib/roleNavigation";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  if (isAuthenticated) return <Navigate to={roleToPath(userRole)} replace />;
  return <>{children}</>;
};

export { PublicOnlyRoute };
