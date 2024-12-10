import React, { useState } from 'react';
import { useAuth } from './AuthContext';  
import './Auth.css';

// register funciton
function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();  

    // handler for form submisison
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError('');
            await register(email, password);  
            alert('Registration successful!');  
            setEmail('');  
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError(error.message);  
        }
    };

    return (
        // register html component
        <div>
            <div id ='registerComp'>
                <h2>Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form id = 'registerForm' onSubmit={handleSubmit}>
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button id = 'registerBtn' type="submit">Register</button>
                </form>
                <p>
                    <b>Already have an account? <a href="/login" style = {{color: 'blue'}}>Log in</a></b>
                </p>
            </div>
        </div>
    );
}

export default Register;
