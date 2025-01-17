import Host from "../models/Host.js";
import { tokenGenerate } from "../utils/tokenGenerate.js";
import { generatecollageId } from "../utils/generateCollageId.js";

// Register Host
export const hostRegister = async (req, res) => {
    try {
        console.log("host Register hits!");
        
        const { collageName, collageEmail, password } = req.body;
        console.log(collageName, collageEmail, password);
        
        const collageId = generatecollageId(collageName, collageEmail);
        // Basic validation
        if (!collageName || !collageEmail || !password) {
            return res.status(400).json({
                message: "Invalid input - all fields must be valid and required",
            });
        }
        // Password regex validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }
        // Check existing Host
        const existingHost = await Host.findOne({ collageEmail });
        if (existingHost) {
            return res.status(400).json({ message: "Host already exists" });
        }
        // Create & save Host
        const newHost = new Host({
            collageName,
            collageEmail,
            password,
            collageId,
        });
        await newHost.save();
        return res.status(201).json({ message: "Host registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Login Host
export const login = async (req, res) => {
    try {
        const { collageEmail, password } = req.body;
        const host = await Host.findOne({ collageEmail });
        // Check if host exists
        if (!host) {
            return res.status(400).json({ message: "Host does not exist. Please create an account." });
        }
        // Check password
        const isMatch = await host.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password. Please enter the correct password." });
        }
        // Create token payload
        const payload = {
            id: host._id,
            collageEmail: host.collageEmail, 
            role: host.role,
        };
        const token = tokenGenerate(payload);
        return res.status(200).json({
            Success: true,
            message: "Host logged in successfully",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error logging in", error });
    }
};

// Change Password
export const changePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        console.log(password, newPassword);
        const host = await Host.findById(req.user.id);
        if (!host) {
            return res.status(400).json({ message: "Host not found" });
        }
        const isMatch = await host.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid old password" });
        }
        // Validate new password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }
        host.password = newPassword;
        await host.save();
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Password change error:", error);
        return res.status(500).json({ message: "Error changing password", error });
    }
};

// Get Host Details
export const getHostDetails = async (req, res) => {
    try {
        const host = await Host.findById(req.user.id);
        if (!host) {
            return res.status(404).json({ message: "Host not found" });
        }
        host.password = undefined;
        return res.json(host);
    } catch (error) {
        console.error("Get host details error:", error);
        return res.status(500).json({ message: "Error getting host details", error });
    }
};

// Get Hosts List
export const getHostsList = async (req, res) => {
    try {
        const hosts = await Host.find({});
        if (!hosts) {
            return res.status(404).json({ message: "No hosts found" });
        }

        return res.status(200).json({
            success: true,
            message: "Hosts found",
            totalhosts: hosts.length,
            hosts: {
                data: hosts.map((host) => ({
                    collageName: host.collageName,
                    collageEmail: host.collageEmail,
                    collageId: host.collageId
                })),
            },
        });
    } catch (error) {
        console.error("Get hosts list error:", error);
        return res.status(500).json({ message: "Error getting hosts list", error });
    }
};
