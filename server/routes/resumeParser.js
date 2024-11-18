const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
require('dotenv').config();

// Configure Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Multer setup for file upload
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file limit
});


async function getGeminiResponse(text) {
    const prompt = `
    Please extract the following details from the resume text: 
    Full Name (First and Last Name separately), Email, Phone Number, Skills, LinkedIn URL, and GitHub URL. 
    Return the data in the following format:
    First Name: [First Name]
    Last Name: [Last Name]
    Email: [Email or check it twice]
    Phone: [Phone Number]
    Skills: [Skills (comma-separated)]
    LinkedIn: [LinkedIn URL or https://www.linkedin.com/]
    GitHub: [GitHub URL or https://www.github.com/]
    
    Here is the resume text:
    ${text}
    `;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

function parseGeminiResponse(responseText) {
    const data = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        skills: '',
        linkedin: '',
        github: ''
    };

    const lines = responseText.split('\n');
    lines.forEach(line => {
        if (line.startsWith('First Name:')) {
            data.firstName = line.split('First Name:')[1].trim();
        } else if (line.startsWith('Last Name:')) {
            data.lastName = line.split('Last Name:')[1].trim();
        } else if (line.startsWith('Email:')) {
            data.email = line.split('Email:')[1].trim();
        } else if (line.startsWith('Phone:')) {
            data.phone = line.split('Phone:')[1].trim();
        } else if (line.startsWith('Skills:')) {
            data.skills = line.split('Skills:')[1].trim();
        } else if (line.startsWith('LinkedIn:')) {
            data.linkedin = line.split('LinkedIn:')[1].trim();
        } else if (line.startsWith('GitHub:')) {
            data.github = line.split('GitHub:')[1].trim();
        }
    });

    return data;
}

// Route for processing PDF resume
router.post('/process', upload.single('pdf_doc'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Extract text from PDF
        const pdfText = await pdf(req.file.buffer);
        const extractedText = pdfText.text;

        // Get Gemini response
        const responseText = await getGeminiResponse(extractedText);

        // Parse Gemini response
        const parsedData = parseGeminiResponse(responseText);

        res.json(parsedData);
    } catch (error) {
        console.error('Processing Error:', error);
        res.status(500).json({ error: "Failed to process resume" });
    }
});

module.exports = router;