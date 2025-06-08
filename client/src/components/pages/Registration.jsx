import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaBuilding, FaCodeBranch } from "react-icons/fa";
import axios from 'axios';
import './Allcss.css';

function Registration() {
    const [registrationData, setRegistrationData] = useState({
        name: "",
        collagename: "",
        branch: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegistrationData({
            ...registrationData,
            [name]: value
        });
    };

    const HandleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/register', {
                name: registrationData.name,
                collagename: registrationData.collagename,
                branch: registrationData.branch,
                email: registrationData.email,
                password: registrationData.password
            });
            setLoading(false);

            // Example: Handle success (navigate to login page)
            alert('Registration successful! Please login.');
            navigate('/login');

        } catch (error) {
            setLoading(false);
            console.error('Registration error:', error.message);
            alert("Something went wrong");
        }
    };

    return (
        <div className='body'>
            <div className='wrapper'>
                <form onSubmit={HandleRegistration}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Name'
                            name="name"
                            value={registrationData.name}
                            onChange={handleChange}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='College Name'
                            name="collagename"
                            value={registrationData.collagename}
                            onChange={handleChange}
                            required
                        />
                        <FaBuilding className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Branch'
                            name="branch"
                            value={registrationData.branch}
                            onChange={handleChange}
                            required
                        />
                        <FaCodeBranch className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder='Email'
                            name="email"
                            value={registrationData.email}
                            onChange={handleChange}
                            required
                        />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder='Password'
                            name="password"
                            value={registrationData.password}
                            onChange={handleChange}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                    <div className='login-link'>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;
