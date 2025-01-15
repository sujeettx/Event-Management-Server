import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const salted = 20;

const SuperAdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'superadmin'
    }
})

// Hash password before saving

SuperAdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, salted);
        next();
    } catch (error) {
        next(error);
    }
})
SuperAdminSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);
export default SuperAdmin;