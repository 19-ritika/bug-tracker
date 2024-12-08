import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  // State for error message
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            // Set the error message to be displayed on the page
            setErrorMessage(error.message);  // Show error message on page
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
                    <button id='loginBtn' type="submit">Login</button>
                </form>
                
                {errorMessage && (
                    <div className="error-message" style={{ color: 'red' }}>
                        <p>{errorMessage}</p>  {/* Display the error message */}
                    </div>
                )}

                <p>
                    <b><a href="/forgot-password" style = {{color: 'black'}}>Forgot Password?</a></b>
                </p>
                <p>
                    <b>Don't have an account? <a href="/register" style = {{color: 'blue'}}>Sign up</a></b>
                </p>
            </div>
        </div>
    );
}

export default Login;
