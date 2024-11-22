import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../../Components/Mentee/MenteeNavbar"


const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    education: [{
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      percentage: '', // Can be CGPA or percentage
      major: '',
      location: ''
    }],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      location: ''
    }],
    projects: [{
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: '',
      link: ''
    }],
    skills: {
      technical: [''],
      softSkills: [''],
      languages: [''],
      tools: ['']
    },
    achievements: [{
      title: '',
      date: '',
      description: ''
    }],
    positionsOfResponsibility: [{
      position: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    }]
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (section, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const handleSkillsChange = (category, index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((item, i) => 
          i === index ? value : item
        )
      }
    }));
  };

  const addSkill = (category) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], '']
      }
    }));
  };

  const removeSkill = (category, index) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const addArrayItem = (section, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultValue]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/generate-resume', formData, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.personalInfo.fullName}-Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating resume:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      {/* Personal Information Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.personalInfo.fullName}
            onChange={handlePersonalInfoChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.personalInfo.email}
            onChange={handlePersonalInfoChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.personalInfo.phone}
            onChange={handlePersonalInfoChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn URL"
            value={formData.personalInfo.linkedin}
            onChange={handlePersonalInfoChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="github"
            placeholder="GitHub URL"
            value={formData.personalInfo.github}
            onChange={handlePersonalInfoChange}
            className="border p-2 rounded"
          />
        </div>
        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={formData.personalInfo.summary}
          onChange={handlePersonalInfoChange}
          className="w-full mt-4 border p-2 rounded"
          rows="4"
        />
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleArrayChange('education', index, {
                  ...edu,
                  institution: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleArrayChange('education', index, {
                  ...edu,
                  degree: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={edu.startDate}
                onChange={(e) => handleArrayChange('education', index, {
                  ...edu,
                  startDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="End Date"
                value={edu.endDate}
                onChange={(e) => handleArrayChange('education', index, {
                  ...edu,
                  endDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Percentage/CGPA"
                value={edu.percentage}
                onChange={(e) => handleArrayChange('education', index, {
                  ...edu,
                  percentage: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Major"
                value={edu.major}
                onChange={(e) => handleArrayChange('education', index, {
                  ...edu,
                  major: e.target.value
                })}
                className="border p-2 rounded"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeArrayItem('education', index)}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('education', {
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
            percentage: '',
            major: '',
            location: ''
          })}
          className="text-blue-600"
        >
          Add Education
        </button>
      </section>

      {/* Experience Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Experience</h2>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleArrayChange('experience', index, {
                  ...exp,
                  company: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Position"
                value={exp.position}
                onChange={(e) => handleArrayChange('experience', index, {
                  ...exp,
                  position: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => handleArrayChange('experience', index, {
                  ...exp,
                  startDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="End Date"
                value={exp.endDate}
                onChange={(e) => handleArrayChange('experience', index, {
                  ...exp,
                  endDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => handleArrayChange('experience', index, {
                  ...exp,
                  description: e.target.value
                })}
                className="col-span-2 border p-2 rounded"
                rows="3"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeArrayItem('experience', index)}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('experience', {
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            location: ''
          })}
          className="text-blue-600"
        >
          Add Experience
        </button>
      </section>

      {/* Projects Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleArrayChange('projects', index, {
                  ...project,
                  name: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Technologies Used"
                value={project.technologies}
                onChange={(e) => handleArrayChange('projects', index, {
                  ...project,
                  technologies: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={project.startDate}
                onChange={(e) => handleArrayChange('projects', index, {
                  ...project,
                  startDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="End Date"
                value={project.endDate}
                onChange={(e) => handleArrayChange('projects', index, {
                  ...project,
                  endDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="url"
                placeholder="Project Link"
                value={project.link}
                onChange={(e) => handleArrayChange('projects', index, {
                  ...project,
                  link: e.target.value
                })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={project.description}
                onChange={(e) => handleArrayChange('projects', index, {
                  ...project,
                  description: e.target.value
                })}
                className="col-span-2 border p-2 rounded"
                rows="3"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeArrayItem('projects', index)}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('projects', {
            name: '',
            startDate: '',
            endDate: '',
            description: '',
            technologies: '',
            link: ''
          })}
          className="text-blue-600"
        >
          Add Project
        </button>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        {Object.entries(formData.skills).map(([category, skills]) => (
          <div key={category} className="mb-4">
            <h3 className="text-xl font-semibold mb-2 capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Add ${category} skill`}
                  value={skill}
                  onChange={(e) => handleSkillsChange(category, index, e.target.value)}
                  className="border p-2 rounded flex-grow"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(category, index)}
                    className="text-red-600 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSkill(category)}
              className="text-blue-600"
            >
              Add {category.replace(/([A-Z])/g, ' $1').trim()} Skill
            </button>
          </div>
        ))}
      </section>

      {/* Achievements Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="Achievement Title"
                value={achievement.title}
                onChange={(e) => handleArrayChange('achievements', index, {
                  ...achievement,
                  title: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Date"
                value={achievement.date}
                onChange={(e) => handleArrayChange('achievements', index, {
                  ...achievement,
                  date: e.target.value
                })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={achievement.description}
                onChange={(e) => handleArrayChange('achievements', index, {
                  ...achievement,
                  description: e.target.value
                })}
                className="col-span-2 border p-2 rounded"
                rows="3"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeArrayItem('achievements', index)}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('achievements', {
            title: '',
            date: '',
            description: ''
          })}
          className="text-blue-600"
        >
          Add Achievement
        </button>
      </section>

      {/* Positions of Responsibility Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Positions of Responsibility</h2>
        {formData.positionsOfResponsibility.map((position, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Position"
                value={position.position}
                onChange={(e) => handleArrayChange('positionsOfResponsibility', index, {
                  ...position,
                  position: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Organization"
                value={position.organization}
                onChange={(e) => handleArrayChange('positionsOfResponsibility', index, {
                  ...position,
                  organization: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={position.startDate}
                onChange={(e) => handleArrayChange('positionsOfResponsibility', index, {
                  ...position,
                  startDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="End Date"
                value={position.endDate}
                onChange={(e) => handleArrayChange('positionsOfResponsibility', index, {
                  ...position,
                  endDate: e.target.value
                })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={position.description}
                onChange={(e) => handleArrayChange('positionsOfResponsibility', index, {
                  ...position,
                  description: e.target.value
                })}
                className="col-span-2 border p-2 rounded"
                rows="3"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeArrayItem('positionsOfResponsibility', index)}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('positionsOfResponsibility', {
            position: '',
            organization: '',
            startDate: '',
            endDate: '',
            description: ''
          })}
          className="text-blue-600"
        >
          Add Position
        </button>
      </section>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
      >
        Generate Resume
      </button>
    </form>
    </>
  );
};

export default ResumeBuilder;