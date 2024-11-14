const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const scheduleMeet = async (date, time, mentorName, menteeName, menteeEmail) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const eventStartTime = new Date(`${date}T${time}:00`);
  const eventEndTime = new Date(eventStartTime);
  eventEndTime.setMinutes(eventStartTime.getMinutes() + 30);

  const event = {
    summary: `Mentorship Session with ${menteeName}`,
    description: `Mentorship session between ${mentorName} and ${menteeName}`,
    start: { dateTime: eventStartTime },
    end: { dateTime: eventEndTime },
    attendees: [{ email: menteeEmail }],
    conferenceData: {
      createRequest: { requestId: 'sample123', conferenceSolutionKey: { type: 'hangoutsMeet' } },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });
    return { success: true, meetLink: response.data.hangoutLink };
  } catch (error) {
    console.error('Error creating Google Meet:', error);
    return { success: false, error: 'Failed to schedule Google Meet' };
  }
};

module.exports = scheduleMeet;