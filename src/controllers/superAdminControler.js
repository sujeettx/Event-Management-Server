import SuperAdmin from '../models/SuperAdmin.js';
import {tokenGenerate} from '../utils/tokenGenerate.js';
// Register SuperAdmin

export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;
        // Basic validation
        if (!username ||!email ||!password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // chack password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }
        // Check for existing user
        const superAdminExist = await SuperAdmin.findOne({ email });
        if (superAdminExist) {
            return res.status(400).json({ message: 'SuperAdmin already exists' })
        }
        // Create a new superAdmin
        const newSuperAdmin = new SuperAdmin({
            username,
            email,
            password
        });
        await newSuperAdmin.save();
        res.
        status(201)
        .json({ message: 'SuperAdmin registered successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

// Login SuperAdmin
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check for existing user
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Compare passwords
        const isMatch = await superAdmin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // create a playload for generating a 
        const payload = {
            id: superAdmin._id,
            email: superAdmin.email,
            role: superAdmin.role
        };
        // Generate and send JWT
        const token = tokenGenerate(payload);
        res.status(200).json({
            success: true,
            message: 'SuperAdmin logged in successfully',
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};