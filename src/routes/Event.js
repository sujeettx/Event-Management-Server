import express from "express";
const router = express.Router();
import { authorize, Authentication } from "../middlewares/auth.js";

import {
 createEvent,
 getAllEventsforHost,
 getEventsForStudent,
 getSingleEventsforHost,
 getSingleEventsforStudent,
 updateEvent,
 deleteEvent,
 bookTicket,
} from "../controllers/eventController.js";
router.use(Authentication);

// Host Routes 
router.post("/", authorize(["host"]), createEvent);                   // Create event
router.patch("/:eventId", authorize(["host"]), updateEvent);               // Update event
router.delete("/:eventId", authorize(["host"]), deleteEvent);             // Delete event
router.get("/:eventId", authorize(["host"]),getSingleEventsforHost);      // Get single events for host
router.get("/", authorize(["host"]),getAllEventsforHost);            // Get all events for host

// Student Routes
router.post("/book-ticket:eventId", authorize(["student"]), bookTicket);  // Book ticket
router.get("/:eventId", authorize(["student"]), getSingleEventsforStudent); // get signle events for student
router.get("/", authorize(["student"]),getEventsForStudent);        // get all events for student

export default router;