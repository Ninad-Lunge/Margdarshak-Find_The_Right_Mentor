const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

// For Google Calender
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

// Define the scope of access for the Google Calendar API.
const scopes = ['https://www.googleapis.com/auth/calendar'];

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Passport configuration
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/meetings/auth/callback',
}, async (accessToken, refreshToken, profile, done) => {
    // Here you can store the user in your database
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
const mentorRoutes = require('./routes/mentors');
app.use('/api', mentorRoutes);

const menteeRoutes = require('./routes/mentee');
app.use('/api', menteeRoutes);

const meetingRoutes = require('./routes/meetings');
app.use('/api/meetings', meetingRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/auth', loginRoutes);

const slotsRoute = require('./routes/slots');
app.use('/api/slots', slotsRoute);

// OAuth 2 configuration
const oauth2Client = new google.auth.OAuth2
(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

app.get('/', (req, res) => {
    res.send('Welcome to the Server');
});

app.get('/auth', (req, res) => {

    const url = oauth2Client.generateAuthUrl
    ({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
    }
);

app.get("/auth/redirect", async (req, res) => {

    const {tokens} = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    res.send('Authentication successful! Please return to the console.');
    }

);

// OAuth and Google Calendar setup...

app.post('/create-event', async (req, res) => {
    const event = {
        summary: 'Meet',
        location: 'Google Meet',
        description: req.body.description || "Demo event",
        start: {
            dateTime: req.body.start.dateTime,
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: req.body.end.dateTime,
            timeZone: 'Asia/Kolkata',
        },
        colorId: 1,
        conferenceData: {
            createRequest: {
                requestId: uuidv4(),
            }
        },
        attendees: req.body.attendees || [],
    };

    try {
        const result = await calendar.events.insert({
            calendarId: 'primary',
            auth: oauth2Client,
            conferenceDataVersion: 1,
            sendUpdates: 'all',
            resource: event
        });

        res.send({
            status: 200,
            message: 'Event created',
            link: result.data.hangoutLink
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});