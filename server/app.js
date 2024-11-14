const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const scheduleMeet = require('./middleware/scheduleMeet');

require('dotenv').config();
const app = express();

const mentorRoutes = require('./routes/mentors');
const menteeRoutes = require('./routes/mentee');
const meetingRoutes = require('./routes/meetings');
const loginRoutes = require('./routes/login');
const slots = require('./routes/availability');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// Routes
app.use('/api', mentorRoutes);
app.use('/api', menteeRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/availability', slots);

app.post('/api/schedule-meet', async (req, res) => {
    const { date, time, mentorName, menteeName, emails } = req.body;
  
    if (!emails || emails.length !== 2) {
      return res.status(400).json({ error: 'Both mentor and mentee emails are required' });
    }
  
    const [menteeEmail, mentorEmail] = emails; // Extract emails from the array
    
    try {
      const result = await scheduleMeet(date, time, mentorName, menteeName, menteeEmail, mentorEmail);
  
      if (result.success) {
        // If the meet link is generated, return it
        res.status(200).json({ meetLink: result.meetLink });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Error scheduling meet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});  

app.get('/', (req, res) => {
    res.send('Welcome to the Server');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});