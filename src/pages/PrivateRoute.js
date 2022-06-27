import React from 'react'
import { Navigate } from 'react-router-dom'
import Login from './Login'
import { useAuth0 } from '@auth0/auth0-react'

const PrivateRoute = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
  } = useAuth0()
  console.log(isAuthenticated, isLoading)
  const isUser = isAuthenticated && user
  if (!isUser) {
    return <Navigate to="/login" />
  }
  return children
}
export default PrivateRoute
