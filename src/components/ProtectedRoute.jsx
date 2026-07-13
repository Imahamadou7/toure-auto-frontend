import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Attente du chargement initial
  if (loading) {
    return (
      <div className="p-10 text-center">
        Chargement...
      </div>
    );
  }

  // Utilisateur non connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Utilisateur connecté
  return children;
}