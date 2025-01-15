import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;
if (!secret){
    throw new Error('No JWT secret defined in env .');
}
export const tokenGenerate = (user)=>{
    try {
        if (!user || typeof user !== 'object') {
            throw new Error('Invalid user data provided');
        }
        const token = jwt.sign(user, secret, {
            expiresIn: '5d'
        });
        return token;
    } catch (error) {
        throw new Error(`Token generation failed: ${error.message}`);
    }
}