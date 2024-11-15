const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', default: null },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Availability', availabilitySchema);