import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// Load environment variables from .env file

const URI = process.env.MONGODB_URI;
if(!URI){
    console.error("mongodb environment variable in not defined in .env file");
}

// Connect to MongoDB

export const connectDB = async()=>{
    try {
       const con = await mongoose.connect(URI);
        console.log(`Connected to MongoDB with URI: ${con.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}