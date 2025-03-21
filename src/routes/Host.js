import express from 'express';
const router = express.Router();
import {
    Authentication,
    authorize
} from '../middlewares/auth.js';
import {
    deleteStudentById,
    getStudentsBycollegeId
} from '../controllers/studentController.js';
import {
    login,
    changePassword,
    getHostDetails,
} from '../controllers/hostContoller.js';

router.post('/login',login);                                                         // Login

// All routes below are authenticated                     
router.use(Authentication);                                                
router.get('/hostprofile',authorize(['host']),getHostDetails);                           // Get host details
router.patch('/change-password',authorize(['host']),changePassword);                  // Change password
router.delete('/deleteStudent/:id', authorize(['host']), deleteStudentById);          // Delete student by student ID (host only)
router.get('/getallStudemts', authorize(['host']), getStudentsBycollegeId);   // Get students by collegeId

// Export the router module
export default router;
