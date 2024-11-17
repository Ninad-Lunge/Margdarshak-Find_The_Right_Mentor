import logo from '../Assets/MentorHands.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MenteeRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName : '',
        lastName : '',
        email: '',
        password: '',
        role: 'Mentee',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleApply = () => {
        navigate('/mentor-register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleGoogleSignUp = () => {
        console.log('Google Sign-Up functionality not implemented yet.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted: ', formData);

        try {
            const response = await fetch('/api/mentee/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const menteeData = await response.json();
                localStorage.setItem('menteeData', JSON.stringify(menteeData));
                localStorage.setItem('menteeId', menteeData._id);
                localStorage.setItem('token', menteeData.token);
                navigate('/mentee-dashboard');
            } else {
                console.error('Failed to register:', response.statusText);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="login-container flex flex-col md:flex-row justify-center items-center max-h-screen bg-green-50">
            {/* Left side - Logo */}
            <div className="hidden logo-container w-full md:w-5/12 md:flex flex-col justify-center items-center h-full m-2">
                <img src={logo} alt="MentorHands Logo" className="logo w-1/4 md:w-1/3" />
                <p className='text-[#3B50D5] text-xl md:text-5xl text-semibold mt-10'>Margadarshak</p>
            </div>

            {/* Right side - Form */}
            <div className="form-container w-full md:w-7/12 bg-white flex flex-col justify-center p-8 md:p-36 max-h-screen">
                <h1 className="text-xl font-semibold mb-6">Sign Up as a Mentee</h1>

                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">Enter your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">Enter your Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <button
                        className="w-full h-12 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        type="submit"
                    >
                        Sign Up
                    </button>

                    <p>Or</p>

                    <button
                        className="w-full h-12 bg-white text-black rounded-md hover:bg-black hover:text-white transition-colors border border-black"
                        type="button"
                        onClick={handleGoogleSignUp}
                    >
                        Sign Up with Google
                    </button>
                </form>

                <p className="mt-2">
                    <span>Already have an account?</span>
                    <span
                        className="ms-2 text-green-500 cursor-pointer"
                        onClick={handleLogin}
                    >
                        Login
                    </span>
                </p>

                <p className="mt-2">
                    <span>Looking to join us as a mentor?</span>
                    <span
                        className="ms-2 text-green-500 cursor-pointer"
                        onClick={handleApply}
                    >
                        Apply Now
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MenteeRegister;