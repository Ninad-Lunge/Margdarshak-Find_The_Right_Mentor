const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const session = require('express-session');

const { client_secret, client_id, redirect_uris } = require('../credentials.json').web;

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        sameSite: 'none',
    }
}));

// Add this route to check the session
router.get('/session', (req, res) => {
    // Check if session tokens are available
    if (req.session && req.session.tokens) {
        res.status(200).json({ session: req.session });
    } else {
        res.status(401).json({ message: 'No session tokens found. User not authenticated.' });
    }
});


// Redirect user for authentication
router.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.redirect(authUrl);
});

// Callback endpoint to exchange code for tokens
router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        
        // Save tokens in the session
        req.session.tokens = tokens;

        res.send('Authentication successful! You can close this tab.');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Error retrieving access token');
    }
});

router.post('/schedule', async (req, res) => {
    const { menteeEmail, mentorEmail, startTime, endTime, subject } = req.body;

    // Ensure the client is authenticated before making requests
    if (!req.session.tokens) {
        return res.status(401).json({ error: 'User not authenticated. Please log in.' });
    }

    // Set credentials for the calendar API
    oAuth2Client.setCredentials(req.session.tokens);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
        summary: subject,
        start: {
            dateTime: startTime,
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: endTime,
            timeZone: 'America/Los_Angeles',
        },
        attendees: [
            { email: menteeEmail },
            { email: mentorEmail },
        ],
        conferenceData: {
            createRequest: {
                requestId: "some-random-string",
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });
        res.status(201).json({ message: 'Meeting scheduled successfully', data: response.data });
    } catch (error) {
        console.error('Error scheduling meeting:', error.response.data); 
        res.status(500).json({ error: 'Failed to schedule meeting', details: error.response.data });
    }
});

module.exports = router;