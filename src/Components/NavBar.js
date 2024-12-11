import React from 'react';
import { useAuth } from '../Auth/AuthContext';  
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const { currentUser, logout } = useAuth();  
    const navigate = useNavigate();  
    // function to manage the logout 
    const handleLogout = async () => {
        try {
            await logout();
            alert('Logged out successfully!');
            navigate('/login');  
        } catch (error) {
            console.error('Failed to log out:', error.message);
        }
    };
    // Navbar component creates the top menu bar
    return (
        <nav className="nav">
            <div className="logo" onClick={() => navigate('/dashboard')}>  
                <h2 className="title">Bug-Tracker</h2>
            </div>
            {currentUser && (  
                <button className="logoutButton" onClick={handleLogout}>Logout</button>
            )}
        </nav>
    );
};

export default NavBar;
