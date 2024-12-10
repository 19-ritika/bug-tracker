import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import './Auth.css';

// function for forgot password component
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { resetPassword } = useAuth();

    // handler function for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(email); //send email to user
            setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            setMessage('Failed to reset password. Please try again.');
            console.error(error);
        }
    };

    return (
        <div id = 'forgotDiv'>
            <h2>Forgot Password</h2>
            <form id = 'forgotForm' onSubmit={handleSubmit}>
            <p style= {{color: 'red', fontSize: '14px'}}>Enter valid email address to receive reset link on your email</p>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button id = 'resetBtn' type="submit">Reset Password</button>
                <br />
                <button style ={{color : 'green'}} id = 'ForgotLoginBtn'><Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Log in</Link></button>
                
            </form>
            {message && <p id="message">{message}</p>}
        </div>
    );
}

export default ForgotPassword;
