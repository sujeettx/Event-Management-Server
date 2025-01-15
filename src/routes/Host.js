import express from 'express';
const router = express.Router();
import {
    Authintication,
    authorize
} from '../middlewares/auth.js';

import {
    register,
    login,
    changePassword,
    getHostDetails,
    getHostsList
} from '../controllers/hostContoller.js';

router.use(Authintication);

// routes for superadmin
router.post('/register',authorize(['superadmin']),register);                                        // Register new host
router.get('/host',authorize(['superadmin']),getHostsList);                                         // get all host details


// routes for host
router.post('/login',authorize(['host']),login);                                                     // Login
router.get('/hostdetails',authorize(['host']),getHostDetails);                                       // Get host details
router.patch('/change-password', authorize(['host']), changePassword);                               // Change password

// Export the router module
export default router;
