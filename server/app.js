const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const app = express();

const mentorRoutes = require('./routes/mentor');
const menteeRoutes = require('./routes/mentee');
const meetingRoutes = require('./routes/meetings');
const loginRoutes = require('./routes/login');
const slots = require('./routes/availability');
const resumeRoutes = require('./routes/resume');
const scheduleRoutes = require('./routes/scheduleMeet');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/mentor', mentorRoutes);
app.use('/api/mentee', menteeRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/availability', slots);
app.use('/api', resumeRoutes);
// app.use('/api', scheduleRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Server');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
