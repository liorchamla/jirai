import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
