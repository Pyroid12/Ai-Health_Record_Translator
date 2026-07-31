import express from 'express';
import { uploadReport, translateReport } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('report'), uploadReport);
router.post('/:id/translate', protect, translateReport);

export default router;
