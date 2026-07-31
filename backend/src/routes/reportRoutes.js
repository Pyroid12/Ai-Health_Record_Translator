import express from 'express';
import { uploadReport, translateReport, getReports, getReportById, deleteReport } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getReports);

router.post('/upload', protect, upload.single('report'), uploadReport);

router.route('/:id')
  .get(protect, getReportById)
  .delete(protect, deleteReport);

router.post('/:id/translate', protect, translateReport);

export default router;
