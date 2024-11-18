import logo from '../Assets/MentorHands.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const MenteeRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        skills: '',
        linkedin: '',
        github: '',
        role: 'Mentee',
    });

    const [resume, setResume] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleResumeUpload = (e) => {
        setResume(e.target.files[0]);
    };

    const parseResume = async () => {
        if (!resume) {
            alert("Please upload a resume to parse.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf_doc", resume);

        try {
            setIsLoading(true);
            const response = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const parsedData = await response.json();
                setFormData(prevData => ({
                    ...prevData,
                    firstName: parsedData.firstName || prevData.firstName,
                    lastName: parsedData.lastName || prevData.lastName,
                    email: parsedData.email || prevData.email,
                    phone: parsedData.phone || prevData.phone,
                    skills: parsedData.skills || prevData.skills,
                    linkedin: parsedData.linkedin || prevData.linkedin,
                    github: parsedData.github || prevData.github,
                }));
            } else {
                console.error("Failed to parse resume:", response.statusText);
            }
        } catch (err) {
            console.error("Error parsing resume:", err);
        } finally {
            setIsLoading(false);
        }
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
        <div className="login-container flex flex-col md:flex-row justify-center items-center min-h-screen bg-green-50">
            <div className="hidden logo-container w-full md:w-5/12 md:flex flex-col justify-center items-center h-full m-2">
                <img src={logo} alt="MentorHands Logo" className="logo w-1/4 md:w-1/3" />
                <p className="text-[#3B50D5] text-xl md:text-5xl text-semibold mt-10">Margadarshak</p>
            </div>

            <div className="form-container w-full md:w-7/12 bg-white flex flex-col justify-center p-8 md:px-20 min-h-screen">
                <h1 className="text-xl font-semibold mb-6">Sign Up as a Mentee</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
                        <label className="block mb-1 text-sm">Email</label>
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
                        <label className="block mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="form-group w-full">
                        <label className="block mb-1 text-sm">GitHub</label>
                        <input
                            type="text"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 "
                        />
                    </div>
                    <div className="form-group w-full col-span-2 grid grid-cols-3 gap-x-2">
                        <label className="block mb-1 text-sm col-span-3">Upload Resume</label>
                        <input
                            type="file"
                            onChange={handleResumeUpload}
                            className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2"
                        />
                        <button
                            type="button"
                            onClick={parseResume}
                            className="mt-2 w-full h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 animate-spin" />
                                    Parsing Resume...
                                </>
                            ) : (
                                'Parse Resume'
                            )}
                        </button>
                    </div>
                    <button
                        className="w-full h-12 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors col-span-2"
                        type="submit"
                    >
                        Sign Up
                    </button>

                    <p className='text-center col-span-2'>Or</p>

                    <button
                        className="w-full h-12 bg-white text-black rounded-md hover:bg-black hover:text-white transition-colors border border-black col-span-2"
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