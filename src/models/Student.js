import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const salted = 10;
const studentSchema  = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    collegeId :{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'student'
    }
},
{ timestamps: true })

// Enable index for faster searching
studentSchema.index(true);
// Hash password before saving
studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, salted);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const student = mongoose.model('Students', studentSchema);
export default student;