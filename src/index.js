import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import superAdmin from './routes/SuperAdmin.js';
import Host from './routes/Host.js';
import Student from './routes/Student.js';
import Event from './routes/Event.js';
const PORT = process.env.PORT || 8000
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3000'],
    credentials: true,
}
));
dotenv.config();

// connect to the database
connectDB()

// routes
app.use('/superadmins',superAdmin);
app.use('/hosts',Host);
app.use('/students',Student);
app.use('/events',Event);

// 404 response
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Page not found check your url' });
});
// start the server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
