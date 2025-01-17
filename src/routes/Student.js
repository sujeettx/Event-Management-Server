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
    deleteStudentById,
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
router.delete('/deleteStudentById/:id', authorize(['host']), deleteStudentById); // Delete student by student ID (host only)
router.get('/getStudentsByCollageId', authorize(['host']), getStudentsByCollageId); // Get students by collageId

export default router;
