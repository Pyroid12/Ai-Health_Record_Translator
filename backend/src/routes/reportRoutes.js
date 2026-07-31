import express from 'express';
import { uploadReport } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('report'), uploadReport);

export default router;
