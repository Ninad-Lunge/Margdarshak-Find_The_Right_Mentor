import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../Assets/MentorHands.png';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Mentee',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', formData);
            if (response.data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', response.data.token);

                if (formData.role === 'Mentor') {
                    localStorage.setItem('mentorData', JSON.stringify(response.data.mentorData));
                    navigate('/mentor-dashboard');
                } else {
                    localStorage.setItem('menteeData', JSON.stringify(response.data.menteeData));
                    navigate('/mentee-dashboard');
                }
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            setError('An error occurred. Please try again.');
        }    
    };

    const toggleRole = () => {
        setFormData({
            ...formData,
            role: formData.role === 'Mentor' ? 'Mentee' : 'Mentor'
        });
    };

    const handleMentorApply = () => {
        navigate('/mentor-register');
    };

    const handleMenteeSignUp = () => {
        navigate('/mentee-register');
    };

    return (
        <div className="login-container flex flex-col md:flex-row justify-center items-center min-h-screen p-4 bg-gray-100">
            <div className="logo-container w-full md:w-1/3 flex justify-center items-center h-full">
                <img src={logo} alt="icon" className="logo w-3/4 md:w-1/2" />
            </div>

            <div className="form-container w-full md:w-2/3 bg-white flex flex-col justify-center p-8 md:p-40 max-h-screen">
                <h1 className="text-xl font-semibold mb-6">Log In as {formData.role}</h1>

                <div className="toggle-role mb-6">
                    <button 
                        className={`px-4 py-2 ${formData.role === 'Mentor' ? 'bg-black text-white border' : 'bg-gray-200 text-black'} rounded-l-md`}
                        onClick={toggleRole}>
                        I'm a Mentor
                    </button>
                    <button 
                        className={`px-4 py-2 ${formData.role === 'Mentee' ? 'bg-black text-white border' : 'bg-gray-200 text-black'} rounded-r-md`}
                        onClick={toggleRole}>
                        I'm a Mentee
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
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

                    {error && <p className="text-red-500">{error}</p>}

                    <button className="w-[560px] h-[50px] bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors" type="submit">
                        Log In
                    </button>

                    <p>Or</p>

                    <button 
                        className="w-[560px] h-[50px] bg-white text-black rounded-md hover:bg-black hover:text-white transition-colors border border-black" 
                        type="button">
                        Log In with Google
                    </button>
                </form>

                <p className='mt-2'>Forgot Password?</p>

                <p className='mt-2'>
                    <span className='text-green-500 cursor-pointer' onClick={handleMenteeSignUp}>
                        Sign up as a Mentee
                    </span>
                    <span className='ms-2 me-2'> Or </span>
                    <span className='text-green-500 cursor-pointer' onClick={handleMentorApply}>
                        Apply to be a Mentor
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;