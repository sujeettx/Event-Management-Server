import Event from '../models/Event.js';
/// Create a new event
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, Venue, ticketPrice, time, deadlineDate } = req.body;

        // Validation error
        if (!title || !description || !date || !Venue || !ticketPrice || !time || !deadlineDate) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        const organizer = req.host.hostId; 

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
            message: "Event created successfully",
            event: newEvent,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id });
        res.json({
            success: true,
            message: "Events found",
            events,
        });
    } catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single event details
export const getEventDetails = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("registeredStudents"); 
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

// Update event
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
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

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
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

// Book a ticket
export const bookTicket = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Add student to registeredStudents
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