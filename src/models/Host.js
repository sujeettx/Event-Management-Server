import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const salted = 20;
const hostSchema  = mongoose.Schema({
    collageName: {
        type: String,
        required: true
    },
    collageEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    collegeId: { 
        type: String,
        required: true,
        unique: true
     },
    role:{
        type: String,
        default: 'host'
    }
},
{ timestamps: true }
)
// Hash password before saving
hostSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, salted);
        next();
    } catch (error) {
        next(error);
    }
}); 

// Compare password method
hostSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const User = mongoose.model('Host', hostSchema);
export default User;