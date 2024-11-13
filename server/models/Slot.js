const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    day: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Slot', SlotSchema);