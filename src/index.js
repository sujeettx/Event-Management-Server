import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import superAdmin from './routes/SuperAdmin.js';
import Host from './routes/Host.js';
import Student from './routes/Student.js';
import Event from './routes/Event.js';
dotenv.config();
const PORT = process.env.PORT
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to the database
connectDB()

// routes
app.get('/', (req, res) => {
    res.send('Server is working!');
});
app.use('/superadmins',superAdmin);
app.use('/hosts',Host);
app.use('/students',Student);
app.use('/events',Event);
// start the server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
