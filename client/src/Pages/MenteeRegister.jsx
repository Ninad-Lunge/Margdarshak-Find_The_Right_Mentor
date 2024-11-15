import logo from '../Assets/MentorHands.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MenteeRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        'first-name': '',
        'last-name': '',
        email: '',
        password: '',
        role: 'Mentee',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleApply = () => {
        navigate('/mentor-register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted: ', formData);

        try {
            const response = await fetch('/api/register-mentee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const menteeData = await response.json();
                localStorage.setItem('menteeData', JSON.stringify(menteeData));
                localStorage.setItem('token', response.data.token);
                navigate('/mentee-dashboard');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="login-container flex flex-col md:flex-row justify-center items-center min-h-screen p-4 bg-gray-100">
            {/* Left side - Logo */}
            <div className="logo-container w-full md:w-1/3 flex justify-center items-center h-full">
                <img src={logo} alt="icon" className="logo w-3/4 md:w-1/2" />
            </div>

            {/* Right side - Form */}
            <div className="form-container w-full md:w-2/3 bg-white flex flex-col justify-center p-8 md:p-40 max-h-screen">
                <h1 className="text-xl font-semibold mb-6">Sign Up as a Mentee</h1>

                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
                    <div className="form-group">
                        <label className="block mb-1 text-sm">First Name</label>
                        <input 
                            type="text"
                            name="first-name"
                            value={formData['first-name']}
                            onChange={handleChange}
                            className="w-[560px] h-[50px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="block mb-1 text-sm">Last Name</label>
                        <input 
                            type="text"
                            name="last-name"
                            value={formData['last-name']}
                            onChange={handleChange}
                            className="w-[560px] h-[50px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="block mb-1 text-sm">Enter your Email</label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[560px] h-[50px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="block mb-1 text-sm">Enter your Password</label>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-[560px] h-[50px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <button className="w-[560px] h-[50px] bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors" type="submit">
                        Sign Up
                    </button>

                    <p>Or</p>

                    <button className="w-[560px] h-[50px] bg-white text-black rounded-md hover:bg-black hover:text-white transition-colors border border-black" type="submit">
                        Sign Up with Google
                    </button>
                </form>

                <p className='mt-2'><span>Already have an account?</span><span className='ms-2 text-green-500 cursor-pointer' onClick={handleLogin}>Login</span></p>

                <p className='mt-2'><span>Looking to join us as a mentor?</span><span className='ms-2 text-green-500 cursor-pointer' onClick={handleApply}>Apply Now</span></p>
            </div>
        </div>
    );
}

export default MenteeRegister;