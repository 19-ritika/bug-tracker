// src/auth/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './FirebaseConfigs';  // Ensure this is properly configured
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

// Create the context
const AuthContext = createContext();

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  // Initialize useNavigate hook

    // Listen for authentication changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe; // Unsubscribe when the component unmounts
    }, []);

    // Register function
    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Redirect to login page after successful registration
                navigate('/login');
            });
    };

    // Login function
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout function
    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
