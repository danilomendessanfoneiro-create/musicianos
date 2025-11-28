import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useUserData } from "../services/authService";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const user = auth.currentUser;
  const userData = useUserData();

  if (!user) return <Navigate to="/login" replace />;

  // Só deixa passar se for admin
  if (userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
