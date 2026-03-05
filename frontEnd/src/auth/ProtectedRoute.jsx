import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../auth/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    // store where user tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}