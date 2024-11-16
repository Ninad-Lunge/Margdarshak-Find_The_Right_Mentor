const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { OAuth2 } = google.auth;
const { body, validationResult } = require('express-validator');  // Added express-validator for validation

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

// Route to start the OAuth2 flow (redirect to Google's consent screen)
router.get('/auth', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',  // No refresh token, only access token
    scope: scopes
  });
  res.redirect(url);
});

// Callback route to handle the OAuth2 redirect and get the access token
router.get('/auth/redirect', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:5000/api/auth/redirect',  // Ensure this matches what is in Google Console
      grant_type: 'authorization_code',
    });

    console.log('Token Response:', tokenResponse.data); // Log response to check for any issues

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ message: 'Failed to receive access token' });
    }

    // Set the access token on oAuth2Client
    oAuth2Client.setCredentials({ access_token });

    // Optionally, save the token securely for later use
    // Example: Save in session, database, or return to frontend

    res.status(200).json({ message: 'Authorization successful', access_token });
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to exchange code for token', error: error.response?.data || error.message });
  }
});

// Route to schedule a Google Meet
router.post('/schedule-meet', [
  // Validation using express-validator
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').isString().notEmpty().withMessage('Time is required'),
  body('mentorName').isString().notEmpty().withMessage('Mentor name is required'),
  body('menteeName').isString().notEmpty().withMessage('Mentee name is required'),
  body('emails').isArray().withMessage('Emails must be an array')
    .custom((emails) => {
      if (!emails.every(email => /^\S+@\S+\.\S+$/.test(email))) {
        throw new Error('Invalid email format');
      }
      return true;
    })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, time, mentorName, menteeName, emails } = req.body;

    // Log request payload for debugging purposes
    console.log('Received request payload:', req.body);

    // Make sure the user is authenticated and has an access token
    if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
      return res.status(400).json({ message: 'User is not authenticated. Please authorize first.' });
    }    

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // Create event details
    const eventStartTime = new Date(`${date}T${time}:00`);
    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 30); // 30-minute meeting

    const event = {
      summary: `Mentorship Session: ${mentorName} & ${menteeName}`,
      description: 'Mentorship session scheduled via Mentor Platform.',
      start: { dateTime: eventStartTime.toISOString(), timeZone: 'Asia/Kolkata' },
      end: { dateTime: eventEndTime.toISOString(), timeZone: 'Asia/Kolkata' },
      attendees: emails.map((email) => ({ email })), // Mapping emails to attendees
      conferenceData: {
        createRequest: {
          requestId: `${new Date().getTime()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    res.status(200).json({ message: 'Meet scheduled successfully', meetLink });
  } catch (error) {
    console.error('Error scheduling Google Meet:', error);

    // Check if error has a response object with message
    const errorMessage = error.response ? error.response.data.message : error.message;

    res.status(500).json({ message: 'Failed to schedule meet', error: errorMessage });
  }
});

module.exports = router;