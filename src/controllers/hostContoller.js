import Host from "../models/Host.js";
import { tokenGenerate } from "../utils/tokenGenerate.js";
import { generateCollegeId } from "../utils/generateCollageId.js";

// Register Host
export const register = async (req, res) => {
    try {
        const { collageName, collageEmail, password } = req.body;
        const collegeId = generateCollegeId(collageName, collageEmail);
        // Basic validation
        if (!collageName || !collageEmail || !password) {
            return res.status(400).json({
                message: "Invalid input - all fields must be valid and required",
            });
        }
        // chack the password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res
                .status(400)
                .json({
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
        const newHost = await new Host({
            collageName,
            collageEmail,
            password,
            collegeId,
        }).save();
        return res.status(201).json({ message: "Host registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: error.message });
    }
};
// login  host
export const login = async (req, res) => {
    try {
        const { collageEmail, password } = req.body;
        const host = await Host.findOne({ collageEmail });
        // check existing host account
        if (!host) {
            return res
                .status(400)
                .json({ message: "Host does not exist please create account" });
        }
        // check password
        const isMatch = await Host.comparePassword(password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid password please enter correct password" });
        }
        // create a playload for generating a
        const payload = {
            id: host._id,
            email: host.email,
            role: host.role,
        };
        const token = tokenGenerate(payload);
        res.status(200).json({
            Success: true,
            message: "Host logged in successfully",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// change password

export const changePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const host = await Host.findById(req.user.id);
        if (!host) {
            return res.status(400).json({ message: "Host not found" });
        }
        const isMatch = await Host.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid old password" });
        }
        // Validate new password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res
                .status(400)
                .json({
                    message:
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                });
        }
        const hashedPassword = await Host.hashPassword(newPassword);
        host.password = hashedPassword;
        await host.save();
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error });
    }
};

// Get Host Details
export const getHostDetails = async (req, res) => {
    try {
        const host = await Host.findById(req.user.id);
        if (!host) {
            return res.status(404).json({ message: "Host not found" });
        }
        host.password = undefined; // hide the password from the response
        return res.json(host);
    } catch (error) {
        res.status(500).json({ message: "Error getting host details", error });
    }
};

// Get Hosts List

export const getHostsList = async (req, res) => {
    try {
        const hosts = await Host.find({});
        return res.json(hosts);
    } catch (error) {
        res.status(500).json({ message: "Error getting hosts list", error });
    }
};
