import React, { useState } from 'react';
import { useAuth } from './AuthContext';  // Import useAuth hook
import './Auth.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();  // Access register function from context

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError('');
            await register(email, password);  // Call register function from context
            alert('Registration successful!');  // Optional alert for successful registration
            setEmail('');  // Clear form fields
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError(error.message);  // Handle errors, e.g., invalid email/password
        }
    };

    return (
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
