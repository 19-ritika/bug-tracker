import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; 

// login function
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  
    const { login } = useAuth();
    const navigate = useNavigate();
    //handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard'); //redirect to dashboard after login
        } catch (error) {
            setErrorMessage(error.message); 
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
                        <p>{errorMessage}</p>  
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
