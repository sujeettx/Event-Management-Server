import express from "express";
const router = express.Router();
import { authorize, Authintication } from "../middlewares/auth.js";

import {
  createEvent,
  getAllEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
  bookTicket,
} from "../controllers/eventController.js";

router.use(Authintication);

// Host Routes 
router.post("/event", authorize(["host"]), createEvent);                   // Create event
router.put("/event/:id", authorize(["host"]), updateEvent);                // Update event
router.delete("/event/:id", authorize(["host"]), deleteEvent);             // Delete event

// Student Routes
router.post("/event/:id/book-ticket", authorize(["student"]), bookTicket);  // Book ticket

// Both Host and Student Routes
router.get("/events", authorize(['host', 'student']), getAllEvents);        // Get all events
router.get("/event/:id", authorize(['host', 'student']), getEventDetails);  // Get event by id

export default router;
