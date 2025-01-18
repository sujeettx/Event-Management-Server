import Event from '../models/Event.js';
import Host from '../models/Host.js';

// Create a new event
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, Venue, ticketPrice, time, deadlineDate } = req.body;
        if (!title || !description || !date || !Venue || !ticketPrice || !time || !deadlineDate) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        const organizer = req.user.id; 
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            Venue,
            ticketPrice,
            deadlineDate,
            organizer,
        });
        await newEvent.save();
        res.status(201).json({
            success: true,
            message: "Event created successfully"
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all events created by the host
export const getAllEventsforHost = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id });
        res.json({
            success: true,
            message: "Events found",
            totalEvents: events.length,
            events,
        });
    } catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get events for a student based on their college ID
export const getEventsForStudent = async (req, res) => {
    try {
        const studentCollegeId = req.user.collegeId;
        const host = await Host.findOne({ collegeId: studentCollegeId });
        if (!host) {
            return res.status(404).json({ message: "No host found for the given college ID" });
        }
        const events = await Event.find({ organizer: host._id });
        if (!events) {
            return res.status(404).json({ message: "No events found for the given college ID" });
        }
        events.registeredStudents = undefined;
        res.json({
            success: true,
            message: "Events found",
            events,
        });
    } catch (error) {
        console.error("Error getting events for student:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get details of a single event for host
export const getSingleEventsforHost = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        .populate("registeredStudents");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({
            success: true,
            message: "Event found",
            event,
        });
    } catch (error) {
        console.error("Error getting event:", error);
        res.status(500).json({ message: error.message });
    }
};

// get single event for students
export const getSingleEventsforStudent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
      event.registeredStudents = undefined;
        res.json({
            success: true,
            message: "Event found",
            event,
        });
    } catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({ message: error.message });
    }
}
// Update an event's details
export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId
        const event = await Event.findByIdAndUpdate(eventId,req.body, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({
            success: true,
            message: "Event updated successfully",
            updatedEvent: event,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!eventId) {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: error.message });
    }
};

// Book a ticket for an event
export const bookTicket = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        if (!event.registeredStudents.includes(req.user.id)) {
            event.registeredStudents.push(req.user.id);
            await event.save();
        } else {
            return res.status(400).json({ message: "You have already booked a ticket for this event" });
        }
        res.json({
            success: true,
            message: "Ticket booked successfully",
        });
    } catch (error) {
        console.error("Error booking ticket:", error);
        res.status(500).json({ message: error.message });
    }
};
