import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { isLoggedIn, getToken } from "../auth/auth";
import AppContext from "../Context/Context";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const { setIsauthenticated, isAuthenticated } = useContext(AppContext);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const isUserAuthenticated = async () => {
    try {
      await axios.get(`${baseUrl}/checkAuth`, {
        headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" }
      });
      setIsauthenticated(true);

    } catch (error) {
      //console.log(error, 'error in checkAuthentication');
      setIsauthenticated(false);
    }

  }
  useEffect(() => {
    isUserAuthenticated()
  }, []);
  
  if (!isAuthenticated || !isLoggedIn()) {
    // store where user tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}