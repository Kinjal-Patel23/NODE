import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

  let token = localStorage.getItem("token");
  if(!token) {
    return <Navigate to="/" />
  }  

  return children
}

export default ProtectedRoute
