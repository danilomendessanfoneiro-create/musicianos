import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
