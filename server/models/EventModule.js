const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventPoster: { type: String, required: true },
    email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
