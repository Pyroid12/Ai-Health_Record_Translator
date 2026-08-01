import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  process.env.FRONTEND_URL, // Production frontend (Vercel)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('AI Health Record Translator API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
