import express from 'express';
const router = express.Router();
import {
    Authentication,
    authorize
} from '../middlewares/auth.js';
// Import routes
import {
    register,
    login
} from '../controllers/superAdminControler.js';

router.post('/login', login);                                                      // Login
router.post('/register',Authentication,authorize(['superadmin']),register);        // Register new superadmin

export default router;
