import React from 'react';
import { useAuth } from '../Auth/AuthContext';  // Import the useAuth hook
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const { currentUser, logout } = useAuth();  // Get the currentUser and logout function
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleLogout = async () => {
        try {
            await logout();
            alert('Logged out successfully!');
            navigate('/login');  // Redirect to login page after logout
        } catch (error) {
            console.error('Failed to log out:', error.message);
        }
    };

    return (
        <nav className="nav">
            <div className="logo" onClick={() => navigate('/dashboard')}>  {/* Make the logo clickable */}
                <img src="/bugImage.png" alt="Bug Tracker Logo" className="image" />
                <h2 className="title">Bug Tracker</h2>
            </div>
            {currentUser && (  // Only show logout button if the user is logged in
                <button className="logoutButton" onClick={handleLogout}>Logout</button>
            )}
        </nav>
    );
};

export default NavBar;
