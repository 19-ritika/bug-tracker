import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import './Auth.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(email);
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
                <button id = 'forgotBtn'><Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Log in</Link></button>
                
            </form>
            {message && <p id="message">{message}</p>}
        </div>
    );
}

export default ForgotPassword;
