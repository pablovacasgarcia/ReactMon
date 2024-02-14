import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Utils/firebase';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []); 

  if (isLoading) {
    return <div>Loading...</div>; // Render some loading text or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;