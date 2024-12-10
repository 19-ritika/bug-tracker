import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgotPassword from './Auth/ForgotPassword';  
import { AuthProvider } from './Auth/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

//main app function
function App() {
    return (
        <Router>
            <AuthProvider> {/*for Auth Context*/}
                <div className="App">
                    <NavBar />
                    <Routes>
                        {/*App routes*/}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add this line */}
                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
