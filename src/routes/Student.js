import express from 'express';
const router = express.Router();
import {
    authorize,
    Authentication
} from '../middlewares/auth.js';

// Import routes
import {
    register,
    login,
    changePassword,
    getStudentDetails,
    updateStudentDetails,
    deleteStudent,
    getStudentsByCollageId
} from '../controllers/studentController.js';

router.post('/register', register);
router.post('/login', login);

// All routes below are authenticated
router.use(Authentication);

// Student Routes
router.patch('/change-password', authorize(['student']), changePassword); // Change password
router.get('/studentDetails', authorize(['student']), getStudentDetails); // Get student details
router.patch('/updateStudentDetails', authorize(['student']), updateStudentDetails); // Update student details
router.delete('/deleteStudent', authorize(['student']), deleteStudent); // Delete student

// Host Routes
router.delete('/deleteStudent/:id', authorize(['host']), deleteStudent); // Delete student by ID (host only)
router.get('/getStudentsByCollageId/:collageId', authorize(['host']), getStudentsByCollageId); // Get students by collegeId

export default router;
