import express from 'express';
const router = express.Router();
import { authorize, Authentication } from '../middlewares/auth.js';

import {
 createEvent,
 getAllEventsforHost,
 getSingleEventsforHost,
 updateEvent,
 deleteEvent,
} from '../controllers/eventController.js';
router.use(Authentication,authorize([['host']]));

// Host Routes 
router.post('/', createEvent);                         // Create event
router.patch('/:eventId' ,updateEvent);               // Update event
router.delete('/:eventId' , deleteEvent);              // Delete event
router.get('/:eventId' ,getSingleEventsforHost);       // Get single events for host
router.get('/' ,getAllEventsforHost);                  // Get all events for host

// Export the router module
export default router;