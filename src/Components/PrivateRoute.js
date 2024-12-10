
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
// component that enables only logged in users to access certain pages
const PrivateRoute = ({ element, ...rest }) => {
    const { currentUser } = useAuth();  

    return currentUser ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
