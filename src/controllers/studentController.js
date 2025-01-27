import mongoose from 'mongoose';
import Student from "../models/Student.js";
import { tokenGenerate } from "../utils/tokenGenerate.js";
import Host from '../models/Host.js'
// Register Student
export const register = async (req, res) => {
  try {
    const { name, email, password, collageId } = req.body;
    // Basic validation
    if (!name || !email || !password || !collageId) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    // password validation
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
    // Check if the email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }
    // validate the collageId
    const existingHost = await Host.findOne({collegeId:req.collageId});
    if (!existingHost) {
      return res
        .status(400)
        .json({
          message: "Invalid collageId. Please enter a correct collageId.",
        });
    }

    // Create and save the new student
    const newStudent = new Student({
      name,
      email,
      password,
      collageId,
    });
    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering student",
      error,
    });
  }
};

// Login Student
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Student does not exist" });
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // create plaload for generating jwt token
    const plaload = {
      id: student._id,
      email: student.email,
      role: student.role,
    }
    const token = tokenGenerate(plaload);
    res.status(200).json({
      success: true,
      message: "Student logged in successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    const isMatch = await student.comparePassword(password);
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
    // Update password
    student.password = newPassword;
    await student.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};

// Get Student Details
export const getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    // Hide sensitive data
    student.password = undefined;
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error getting student details", error });
  }
};

// Update Student Details
export const updateStudentDetails = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    // Hide sensitive data
    student.password = undefined;
    res.status(200).json({
      success: true,
      message: "Details updated successfully",
      updatedStudent: student,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating student details", error });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.user.id
    );
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      message: "account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};
// delete student account by their id only host can access it
export const deleteStudentById = async (req, res) => {
  try {
    const { id: studentId } = req.params;
    const hostId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(hostId)) {
      return res.status(400).json({ message: "Invalid student or host ID" });
    }
    const host = await Host.findById(hostId);
    if (!host || !host.collageId) return res.status(404).json({ message: "Host not found" });
    const student = await Student.findById(studentId);
    if (!student || !student.collageId) return res.status(404).json({ message: "Student not found" });
    if (host.collageId.toString() !== student.collageId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this student" });
    }
    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ success: true, message: "Student account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting student", error });
  }
};
// Get Students by Collage ID
export const getStudentsByCollageId = async (req, res) => {
  try {
    const students = await Student.find({ collageId: req.user.collageId });
    if (!students) {
      return res
        .status(400)
        .json({ message: "No students found for the given collage ID" });
    }
    res.status(200).json({
      success: true,
      totalStudentCount: students.length,
      students: students.map((student) =>{
        student.password = undefined;
        return {
          name: student.name,
          email: student.email,
        };
      } )
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting students by collage ID", error });
  }
};
