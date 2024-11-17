import logo from '../Assets/MentorHands.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MentorRegister = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        jobTitle: '',
        company: '',
        location: '',
        industrywork: '',
        skills: '',
        bio: '',
        linkedin: '',
        twitter: '',
        website: '',
        introVideo: '',
        featuredArticles: '',
        whyMentor: '',
        greatestAchievement: '',

        //for recommendation engine
        industry:'',
        companytype:'',
        noofmentoredstudent:'',
        domain:'',
        subdomain:'',
        noofprojects:'',
        yearofexperience:'',
        technologies:'',
        positionofmentors:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleRegister = () => {
        navigate('/mentee-register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/mentor/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(formData)
            
        });
        console.log(formData)

        if (response.ok) {
            console.log('Mentor application submitted successfully');
            const mentorData = await response.json();
            console.log("1",mentorData)
            localStorage.setItem('mentorData', JSON.stringify(mentorData)); // Save mentor data
            console.log("2",mentorData)
            localStorage.setItem('mentorId', mentorData._id); // Save mentor ID
            console.log("3",mentorData)
            localStorage.setItem('token', mentorData.token); // Assuming token is part of the response
            navigate('/mentor-dashboard');
        } else {
            console.log('Error submitting application');
        }
    };

    return (
        <div className="login-container flex flex-col md:flex-row justify-center items-center min-h-screen p-4 bg-gray-100">
            <div className="logo-container w-full md:w-1/3 flex justify-center items-center h-full">
                <img src={logo} alt="icon" className="logo w-3/4 md:w-1/2" />
            </div>

            <div className="form-container w-full md:w-2/3 bg-white flex flex-col justify-center p-8 md:p-40 max-h-screen">
                <h1 className="text-xl font-semibold mb-3">Apply as a Mentor</h1>

                <div className="form-container w-full md:w-2/3 bg-white p-6">
                    <h1 className="text-xl font-semibold mb-4">Mentor Application - Step {currentStep}</h1>

                    <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-3 w-[600px]'>
                        {/* Step 1: About Section */}
                    {currentStep === 1 && (
                        <>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group col-span-2">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Company</label>
                            <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Company Type</label>
                            <input type="text" name="companytype" value={formData.companytype} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>JobTitle</label>
                            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        </>
                    )}

                    {/* Step 2: Profile Section */}
                    {currentStep === 2 && (
                        <>
                        <div className="form-group">
                            <label>Industry of Work</label>
                            <input type="text" name="industrywork" value={formData.industrywork} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Skills</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Industry</label>
                            <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="form-group">
                            <label>Technologies</label>
                            <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn URL</label>
                            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="form-group">
                            <label>Twitter URL</label>
                            <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="form-group">
                            <label>Website URL</label>
                            <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        </>
                    )}

                     {/* Step 3: recommendation engine Section */}
                     {currentStep === 3 && (
                        <>
                        <div className="form-group">
                        <label>No. of Projects</label>
                            <input type="text" name="noofprojects" value={formData.noofprojects} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Year of Experience</label>
                            <input type="text" name="yearofexperience" value={formData.yearofexperience} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        
                        <div className="form-group">
                            <label>No. of Mentored Student</label>
                            <input type="text" name="noofmentoredstudent" value={formData.noofmentoredstudent} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Current Position</label>
                            <input type="text" name="positionofmentors" value={formData.positionofmentors} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Domain</label>
                            <input type="text" name="domain" value={formData.domain} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Subdomain</label>
                            <input type="text" name="subdomain" value={formData.subdomain} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        </>
                    )}

                     {/* Step 4: Experience Section */}
                     {currentStep === 4 && (
                        <>
                        <div className="form-group">
                        <label>Intro Video Link</label>
                            <input type="text" name="introVideo" value={formData.introVideo} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Featured Article Links</label>
                            <input type="text" name="featuredArticles" value={formData.featuredArticles} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        
                        <div className="form-group">
                            <label>Why do you want to become a mentor?</label>
                            <textarea name="whyMentor" value={formData.whyMentor} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div className="form-group">
                            <label>Greatest Achievement</label>
                            <textarea name="greatestAchievement" value={formData.greatestAchievement} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div className="form-navigation mt-4 flex justify-between gap-32">
                        {currentStep > 1 && <button type="button" className="px-4 py-2 bg-gray-300 border rounded-md w-[150px]" onClick={handlePrev}>Previous</button>}
                        {currentStep < 4 && <button type="button" className="px-4 py-2 bg-green-500 text-white border rounded-md w-[150px]" onClick={handleNext}>Next</button>}
                        {currentStep === 4 && <button type="submit" className="px-4 py-2 bg-green-500 text-white border rounded-md w-[150px]">Submit</button>}
                    </div>
                    </form>

                    <p className='mt-1'><span>Already have an account?</span><span className='ms-2 text-green-500 cursor-pointer' onClick={handleLogin}>Login</span></p>

                    <p className='mt-1'><span>Looking to join us as a mentee?</span><span className='ms-2 text-green-500 cursor-pointer' onClick={handleRegister}>Register Now as Mentee</span></p>
                </div>
            </div>
        </div>
    );
};

export default MentorRegister;