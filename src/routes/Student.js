import express from 'express';
const router = express.Router();
import {
    authorize,
    Authentication
} from '../middlewares/auth.js';

// Import routes
import {getEventsForStudent,
    bookTicket,
    getSingleEventsforStudent
} 
from '../controllers/eventController.js'
import {
    register,
    login,
    changePassword,
    getStudentDetails,
    updateStudentDetails,
    deleteStudent
} from '../controllers/studentController.js';

router.post('/register', register);
router.post('/login', login);

// All routes below are authenticated and autherized for students
router.use(Authentication,authorize(['student']));

// Student Routes
router.patch('/change-password', changePassword);                   // Change password
router.get('/studentprofile', getStudentDetails);                   // Get student details
router.patch('/updateprofile', updateStudentDetails);               // Update student details
router.delete('/deleteStudent', deleteStudent);                     // Delete student
router.post("/bookticket/:eventId", bookTicket);                    // Book ticket
router.get("/geteventDetailes/:eventId", getSingleEventsforStudent);// get signle events for student
router.get("/getAllEvents", getEventsForStudent);                   // get all events for student

export default router;
