const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Create a single OAuth2 client instance
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://margdarshak-find-the-right-mentor.onrender.com/api/auth/google/callback'
);

router.get('/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'  // Add events scope
    ]
  });
  res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens); // Set credentials for future use
    
    // Store tokens in session or database if needed
    
    res.send(`
      <script>
        window.opener.postMessage(
          { 
            type: 'GOOGLE_AUTH_SUCCESS', 
            token: '${tokens.access_token}',
            refreshToken: '${tokens.refresh_token || ''}',
            expiryDate: ${tokens.expiry_date}
          }, 
          'http://localhost:3000'
        );
        window.close();
      </script>
    `);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send('Authentication failed');
  }
});

router.post('/schedule-meet', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    // Set credentials for this request
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const { date, startTime, endTime, mentorName, menteeName, emails } = req.body;

    // Format date and time properly
    const startDateTime = new Date(`${date.split('T')[0]}T${startTime}`).toISOString();
    const endDateTime = new Date(`${date.split('T')[0]}T${endTime}`).toISOString();

    const event = {
      summary: `Mentorship Session: ${mentorName} & ${menteeName}`,
      description: 'Mentorship session scheduled via Mentor Platform.',
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Kolkata'
      },
      attendees: emails.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    // Add conferenceDataVersion in the correct place
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event  // Use requestBody instead of resource
    });

    res.json({
      message: 'Meeting scheduled successfully',
      meetLink: response.data.hangoutLink,
      eventId: response.data.id
    });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    
    // More detailed error handling
    const errorMessage = error.response?.data?.error?.message || error.message;
    const statusCode = error.response?.status || 500;
    
    res.status(statusCode).json({
      message: 'Failed to schedule meeting',
      error: errorMessage,
      details: error.response?.data
    });
  }
});

module.exports = router;