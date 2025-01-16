import express from 'express';
const router = express.Router();
import {
    Authentication,
    authorize
} from '../middlewares/auth.js';

import {
    hostRegister,
    login,
    changePassword,
    getHostDetails,
    getHostsList
} from '../controllers/hostContoller.js';

router.post('/login',login);                                                         // Login

// All routes below are authenticated                     
// router.use(Authentication);

// routes for host                                                 
router.get('/hostdetails',authorize(['host']),getHostDetails);                        // Get host details
router.patch('/change-password', authorize(['host']), changePassword);                // Change password

// routes for superadmin                                
router.get('/',authorize(['superadmin']),getHostsList);                               // get all host details
router.post('/register',hostRegister);                                                // Register new host

// Export the router module
export default router;
