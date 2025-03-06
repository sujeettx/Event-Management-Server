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

router.post('/loginHost',login);                                                      // Login

// All routes below are authenticated                     
router.use(Authentication);                                                
router.get('/hostdetails',authorize(['host']),getHostDetails);                        // Get host details
router.patch('/change-password',authorize(['host']),changePassword);                  // Change password
router.delete('/deleteStudentById/:id', authorize(['host']), deleteStudentById);      // Delete student by student ID (host only)
router.get('/getStudentsBycollegeId', authorize(['host']), getStudentsBycollegeId);   // Get students by collegeId

// Export the router module
export default router;
