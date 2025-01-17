import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import SuperAdmin from "../models/SuperAdmin.js";
import Host from "../models/Host.js";
import Student from "../models/Student.js";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
export const Authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
        }
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            let user;

            if (decoded.role === "superadmin") {
                user = await SuperAdmin.findById(decoded.id);
            } else if (decoded.role === "host") {
                user = await Host.findById(decoded.id);
            } 
            else if (decoded.role === "student") {
                user = await Student.findById(decoded.id);
            } else {
                return res.status(401).json({ message: 'Invalid user role' });
            }
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Token has expired' });
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error during authentication' });
    }
};

// Authorization Middleware 
export const authorize = (roles) => (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({ message: "Internal server error during authorization" });
    }
};