import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { auth } from './FirebaseConfigs';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// create auth context
const AuthContext = createContext();
// Hook for easy access to the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Check authentication status when the app loads
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

     // Function to register 
    const register = useCallback((email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/login');
            });
    }, [navigate]);
    //function to login 
    const login = useCallback((email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }, []);
    //function to logout
    const logout = useCallback(() => {
        return signOut(auth);
    }, []);
    //function to reset password
    const resetPassword = useCallback((email) => {
        return sendPasswordResetEmail(auth, email);
    }, []);

    // Prepare the values to share in the context
    const value = useMemo(() => ({
        currentUser,
        register,
        login,
        logout,
        resetPassword,
    }), [currentUser, register, login, logout, resetPassword]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
