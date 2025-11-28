import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Carregando...</div>;
  if (!user) window.location.href = "/login";

  return children;
}
