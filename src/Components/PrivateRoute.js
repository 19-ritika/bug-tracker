// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
    const { currentUser } = useAuth();  // Get the currentUser from AuthContext

    return currentUser ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
