import Student from "../models/Student.js";
import { tokenGenerate } from "../utils/tokenGenerate.js";
import Host from "../models/Host.js";
// Register Student
export const register = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, collageId } = req.body;

    // Basic validation
    if (!name || !phoneNumber || !email || !password || !collageId) {
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
    const existingHost = await Host.findOne({ collageId });
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
      phoneNumber,
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
    const isMatch = await Student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // Generate JWT token
    const token = tokenGenerate(student);
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
    const isMatch = await Student.comparePassword(password);
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
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating student details", error });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.user.id || req.params.id
    );
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};

// Get Students by Collage ID
export const getStudentsByCollageId = async (req, res) => {
  try {
    const students = await Student.find({ collageId: req.params.collageId });
    if (!students) {
      return res
        .status(400)
        .json({ message: "No students found for the given collage ID" });
    }
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting students by collage ID", error });
  }
};
