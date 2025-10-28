import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function Protected({ children }) {
  const token = getToken();
  const loc = useLocation();
  if (!token) return <Navigate to="/sign-in" state={{ from: loc }} replace />;
  return children;
}
