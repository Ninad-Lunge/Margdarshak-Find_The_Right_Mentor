import logo from '../Assets/MentorHands.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const MentorRegister = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        image: '',
        password: '',
        confirmPassword: '',
        jobTitle: '',
        company: '',
        location: '',
        Technologies: [],
        bio: '',
        linkedin: '',
        twitter: '',
        website: '',
        whyMentor: '',

        industry: '',
        domain: '',
        subdomain: '',
        yearofexperience: '',
        positionofmentors: ''

    });


    // Enum Values (frontend-friendly)
    const TechnologiesOptions = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Data Science',
        'Machine Learning'
    ];

    const industryOptions = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
        'Retail', 'Consulting', 'Media & Entertainment', 'Real Estate', 'Energy',
    ];

    const domainOptions = {
        'Software Development': [
            'Frontend Development', 'Backend Development', 'Mobile Development',
            'DevOps', 'Quality Assurance', 'Full Stack Development',
            'Cloud Computing', 'Database Development', 'API Development', 'System Architecture',
        ],
        'Data & Analytics': [
            'Data Engineering', 'Data Science', 'Business Intelligence',
            'Data Analytics', 'Machine Learning', 'Big Data', 'Statistical Analysis',
            'Predictive Analytics', 'Data Visualization', 'Data Mining',
        ],
        'Product Management': [
            'Product Strategy', 'Product Development', 'Product Marketing',
            'Product Analytics', 'User Research', 'Product Operations',
            'Growth Product Management', 'Technical Product Management', 'Product Design', 'Agile Product Management',
        ],
        "Design": [
            "UI Design",
            "UX Design",
            "Graphic Design",
            "Web Design",
            "Product Design",
            "Visual Design",
            "Interaction Design",
            "Motion Design",
            "Brand Design",
            "Design Systems"
        ],

        "Marketing": [
            "Digital Marketing",
            "Content Marketing",
            "Social Media Marketing",
            "Email Marketing",
            "SEO/SEM",
            "Brand Marketing",
            "Marketing Analytics",
            "Growth Marketing",
            "Product Marketing",
            "Performance Marketing"
        ],

        "Sales": [
            "Inside Sales",
            "Field Sales",
            "Enterprise Sales",
            "Sales Operations",
            "Sales Management",
            "Business Development",
            "Account Management",
            "Channel Sales",
            "Sales Strategy",
            "Technical Sales"
        ],

        "Operations": [
            "Project Operations",
            "Business Operations",
            "Technical Operations",
            "Supply Chain Operations",
            "Customer Operations",
            "IT Operations",
            "Process Improvement",
            "Quality Management",
            "Operations Analytics",
            "Vendor Management"
        ],

        "Human Resources": [
            "Talent Acquisition",
            "Employee Relations",
            "Compensation & Benefits",
            "HR Operations",
            "Learning & Development",
            "Performance Management",
            "HR Analytics",
            "Organizational Development",
            "HR Strategy",
            "Diversity & Inclusion"
        ],

        "Finance & Accounting": [
            "Financial Planning",
            "Financial Analysis",
            "Corporate Finance",
            "Investment Banking",
            "Risk Management",
            "Tax Planning",
            "Audit",
            "Management Accounting",
            "Treasury",
            "Financial Reporting"
        ],

        "Research & Development": [
            "Product R&D",
            "Software R&D",
            "Scientific Research",
            "Technology Innovation",
            "Applied Research",
            "Experimental Development",
            "Research Strategy",
            "Prototype Development",
            "Research Analytics",
            "Innovation Management"
        ]

    };


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
            localStorage.setItem('mentorData', JSON.stringify(mentorData)); // Save mentor data
            localStorage.setItem('mentorId', mentorData._id); // Save mentor ID
            localStorage.setItem('token', mentorData.token); // Assuming token is part of the response
            navigate('/mentor-dashboard');
        } else {
            console.log('Error submitting application');
        }
    };

    //  Dropdowns for dynamic subdomains based on selected domain
    const getSubdomainOptions = () => {
        return domainOptions[formData.domain] || [];
    };


    return (
        <div className="login-container flex flex-col md:flex-row justify-center items-center min-h-screen bg-green-50">
            <div className="hidden logo-container w-full md:w-5/12 md:flex flex-col justify-center items-center h-full m-2">
                <img src={logo} alt="MentorHands Logo" className="logo w-1/4 md:w-1/3" />
                <p className='text-[#3B50D5] text-xl md:text-5xl text-semibold mt-10'>Margadarshak</p>
            </div>

            <div className="form-container w-full md:w-7/12 bg-white flex flex-col justify-center h-screen md:p-20">
                <h1 className="text-xl font-semibold px-6">Apply as a Mentor</h1>

                <div className="form-container w-full bg-white p-6">
                    <h1 className="text-xl font-semibold mb-4">Mentor Application - Step {currentStep}</h1>

                    <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-3'>
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
                                <div className="form-group col-span-1">
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                                </div>
                                <div className="form-group">
                                    <label>Profile Image URL</label>
                                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
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
                                    <label>Technologies</label>
                                    <Select
                                        isMulti
                                        name="Technologies"
                                        options={TechnologiesOptions.map((Technologies) => ({ value: Technologies, label: Technologies }))}
                                        onChange={(selected) =>
                                            setFormData({ ...formData, Technologies: selected.map((item) => item.value) })
                                        }
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                                </div>
                                <div className="form-group">
                                    <label>Industry</label>
                                    <select name="industry" value={formData.industry} onChange={handleChange} className="w-full border rounded-md p-2 mb-4">
                                        <option value="">Select Industry</option>
                                        {industryOptions.map((industry) => (
                                            <option key={industry} value={industry}>{industry}</option>
                                        ))}
                                    </select>
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
                                    <label>Year of Experience</label>
                                    <input type="text" name="yearofexperience" value={formData.yearofexperience} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                                </div>


                                <div className="form-group">
                                    <label>Current Position</label>
                                    <input type="text" name="positionofmentors" value={formData.positionofmentors} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                                </div>
                                <div className="form-group">
                                    <label>Domain</label>
                                    <select name="domain" value={formData.domain} onChange={handleChange} className="w-full border rounded-md p-2 mb-4">
                                        <option value="">Select Domain</option>
                                        {Object.keys(domainOptions).map((domain) => (
                                            <option key={domain} value={domain}>{domain}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Subdomain</label>
                                    <select name="subdomain" value={formData.subdomain} onChange={handleChange} className="w-full border rounded-md p-2 mb-4">
                                        <option value="">Select Subdomain</option>
                                        {getSubdomainOptions().map((subdomain) => (
                                            <option key={subdomain} value={subdomain}>{subdomain}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Why do you want to become a mentor?</label>
                                    <textarea name="whyMentor" value={formData.whyMentor} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                                </div>
                            </>
                        )}


                        {/* Navigation Buttons */}
                        <div className="form-navigation mt-4 flex justify-between gap-32 col-span-2">
                            {currentStep > 1 && <button type="button" className="px-4 py-2 bg-gray-300 border rounded-md w-[150px]" onClick={handlePrev}>Previous</button>}
                            {currentStep < 3 && <button type="button" className="px-4 py-2 bg-green-500 text-white border rounded-md w-[150px]" onClick={handleNext}>Next</button>}
                            {currentStep === 3 && <button type="submit" className="px-4 py-2 bg-green-500 text-white border rounded-md w-[150px]">Submit</button>}
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


