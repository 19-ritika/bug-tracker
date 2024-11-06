// src/auth/Logout.js
import React from 'react';
import { useAuth } from './AuthContext';

function Logout() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            alert('Logged out successfully!');
        } catch (error) {
            console.error('Failed to log out:', error.message);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
