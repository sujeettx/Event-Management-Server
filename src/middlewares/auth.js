import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import SuperAdmin from "../models/SuperAdmin.js";
import Host from "../models/Host.js";
import Student from "../models/Student.js";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

// Authentication Middleware
export const Authentication = () => { 
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Invalid authorization header" });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, SECRET_KEY);
            let user;

            if (decoded.role === "superadmin") {
                user = await SuperAdmin.findById(decoded.id);
            } else if (decoded.role === "host") {
                user = await Host.findById(decoded.id);
            } else if (decoded.role === "student") {
                user = await Student.findById(decoded.id);
            }

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};

// Authorization Middleware (no changes needed)
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