import React from 'react';
import { useAuth } from './AuthContext';

//logout function
function Logout() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out:', error.message);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
