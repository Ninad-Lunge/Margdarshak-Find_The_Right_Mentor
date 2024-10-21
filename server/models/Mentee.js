const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Mentee' }
});

module.exports = mongoose.model('Mentee', menteeSchema);