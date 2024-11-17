const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.post('/api/generate-resume', async (req, res) => {
  try {
    const {
      personalInfo,
      education,
      experience,
      projects,
      skills,
      achievements,
      positionsOfResponsibility
    } = req.body;
    
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true // Enable buffering of pages
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${personalInfo.fullName}-Resume.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Helper functions for consistent styling
    const addSection = (title, y) => {
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text(title, 50, y)
         .moveDown()
         .font('Helvetica');
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Present';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Add personal information
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text(personalInfo.fullName, 50, 50, { align: 'center' })
       .fontSize(12)
       .font('Helvetica')
       .moveDown()
       .text(personalInfo.email, { align: 'center' })
       .text(personalInfo.phone, { align: 'center' });

    if (personalInfo.address) {
      doc.text(personalInfo.address, { align: 'center' });
    }
    doc.moveDown();

    // Add social links
    if (personalInfo.linkedin || personalInfo.github) {
      doc.fontSize(10);
      
      if (personalInfo.linkedin) {
        doc.text(`LinkedIn: ${personalInfo.linkedin}`, {
          align: 'center',
          link: personalInfo.linkedin
        });
      }
      
      if (personalInfo.github) {
        doc.text(`GitHub: ${personalInfo.github}`, {
          align: 'center',
          link: personalInfo.github
        });
      }
      doc.moveDown();
    }

    // Add professional summary
    if (personalInfo.summary) {
      addSection('Professional Summary', doc.y);
      doc.fontSize(11)
         .text(personalInfo.summary)
         .moveDown();
    }

    // Add Education
    if (education.length > 0) {
      addSection('Education', doc.y);
      education.forEach(edu => {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(edu.institution)
           .font('Helvetica')
           .text(`${edu.degree}${edu.major ? ` in ${edu.major}` : ''}`)
           .text(`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`)
           .text(`${edu.percentage ? `CGPA/Percentage: ${edu.percentage}` : ''}`)
           .moveDown();
      });
    }

    // Add Experience
    if (experience.length > 0) {
      addSection('Professional Experience', doc.y);
      experience.forEach(exp => {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(exp.company)
           .text(exp.position, { continued: true })
           .font('Helvetica')
           .text(` (${formatDate(exp.startDate)} - ${formatDate(exp.endDate)})`)
           .fontSize(11)
           .text(exp.description)
           .moveDown();
      });
    }

    // Add Projects
    if (projects.length > 0) {
      addSection('Projects', doc.y);
      projects.forEach(project => {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(project.name, { continued: true })
           .font('Helvetica')
           .text(` (${formatDate(project.startDate)} - ${formatDate(project.endDate)})`)
           .fontSize(11)
           .text(project.description)
           .text(`Technologies: ${project.technologies}`, { 
             continued: project.link ? true : false 
           });
        
        if (project.link) {
          doc.text(`  |  Link: ${project.link}`, { 
            link: project.link 
          });
        }
        doc.moveDown();
      });
    }

    // Add Skills
    if (Object.values(skills).some(skillArray => skillArray.length > 0)) {
      addSection('Skills', doc.y);
      Object.entries(skills).forEach(([category, skillList]) => {
        if (skillList.length > 0 && skillList[0] !== '') { // Only add if there are non-empty skills
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(category.replace(/([A-Z])/g, ' $1').trim() + ': ', {
               continued: true
             })
             .font('Helvetica')
             .text(skillList.filter(skill => skill).join(', ')) // Filter out empty skills
             .moveDown();
        }
      });
    }

    // Add Achievements
    if (achievements.length > 0) {
      addSection('Achievements', doc.y);
      achievements.forEach(achievement => {
        if (achievement.title) { // Only add if there's a title
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(achievement.title, { continued: true })
             .font('Helvetica')
             .text(achievement.date ? ` (${formatDate(achievement.date)})` : '')
             .fontSize(11)
             .text(achievement.description)
             .moveDown();
        }
      });
    }

    // Add Positions of Responsibility
    if (positionsOfResponsibility.length > 0) {
      addSection('Positions of Responsibility', doc.y);
      positionsOfResponsibility.forEach(position => {
        if (position.position) { // Only add if there's a position
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(position.position)
             .text(position.organization, { continued: true })
             .font('Helvetica')
             .text(` (${formatDate(position.startDate)} - ${formatDate(position.endDate)})`)
             .fontSize(11)
             .text(position.description)
             .moveDown();
        }
      });
    }

    // Get the total page count
    const totalPages = doc.bufferedPageRange().count;

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
      doc.switchToPage(i - 1);
      doc.fontSize(10)
         .text(
           `Page ${i} of ${totalPages}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );
    }

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

module.exports = router;