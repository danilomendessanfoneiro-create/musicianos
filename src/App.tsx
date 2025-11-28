import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import DashboardPage from "./pages/Dashboard"
import AdminPage from "./pages/Admin"

import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard normal */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
