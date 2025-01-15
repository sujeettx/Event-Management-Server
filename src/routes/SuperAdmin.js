import express from 'express';
const router = express.Router();

// Import routes
import {
    register,
    login
} from '../controllers/superAdminControler.js';

// Superadmin routes

router.post('/register', register);                                       // Register new superadmin
router.post('/login', login);                                            // Login

export default router;
