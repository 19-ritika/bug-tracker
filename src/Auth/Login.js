import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            alert('Logged in successfully!');
            navigate('/dashboard'); // Redirect to the dashboard after successful login
        } catch (error) {
            console.error('Failed to log in:', error.message);
        }
    };

    return (
        <div>
            <div id='loginComp'>
                <h2>Login</h2>
                <form id='loginForm' onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button id = 'loginBtn' type="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
