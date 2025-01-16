import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    Venue: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    deadlineDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Deadline date must be in the future'
        }
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Host',
        required: true
    },
    registeredStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
},{timestamps : true})
eventSchema.index(true);
const Event = mongoose.model("Event", eventSchema);
export default Event;