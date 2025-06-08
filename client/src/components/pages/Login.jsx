import React, { useState } from 'react';
import './Allcss.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await axios.post('http://localhost:8000/login', {
                email,
                password
            });
            console.log(response.data);
            setRole("User"); // Example: Set user role (you can customize this based on your application)
            setLoading(false); // Stop loading
            localStorage.setItem("email",email)
            navigate("/"); // Redirect after successful login

        } catch (error) {
            setLoading(false); // Stop loading on error
            console.error('Login failed:', error);
            alert("Login failed. Please check your credentials."); // Basic error handling (customize as needed)
        }
    }

    return (
        <div className='body'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder='Username'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder='Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>
                    </div>
                    <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                    <div className='register-link'>
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
