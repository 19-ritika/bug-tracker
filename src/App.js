import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Add Route and Routes import
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { AuthProvider } from './Auth/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Protect the /dashboard route with PrivateRoute */}
                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
