import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { auth } from './FirebaseConfigs';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Memoize the functions to avoid recreating them on every render
    const register = useCallback((email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/login');
            });
    }, [navigate]);

    const login = useCallback((email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }, []);

    const logout = useCallback(() => {
        return signOut(auth);
    }, []);

    const resetPassword = useCallback((email) => {
        return sendPasswordResetEmail(auth, email);
    }, []);

    // Memoize the context value to avoid re-creating the object on each render
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
