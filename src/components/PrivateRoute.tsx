import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
/**
 * Simple PrivateRoute using Firebase Auth state.
 * Replace with your preferred auth logic.
 */
export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
