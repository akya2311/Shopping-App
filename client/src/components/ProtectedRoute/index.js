import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library

const ProtectedRoute = ({ children }) => {
  // Check if the token is available in the cookies
  const isAuthenticated = Cookies.get('jwt_token') !== undefined; // Adjust the cookie key to match the one you're using

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
