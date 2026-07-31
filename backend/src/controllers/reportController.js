import cloudinary from '../config/cloudinary.js';
import Report from '../models/Report.js';
import fs from 'fs';
import { extractText } from '../services/ocrService.js';
import { generateSummary } from '../services/geminiService.js';

// @desc    Upload a report
// @route   POST /api/reports/upload
// @access  Private
export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ai_health_reports',
      resource_type: 'auto', // Automatically determine if image or raw(pdf)
    });

    // Remove file from local storage after successful upload
    fs.unlinkSync(req.file.path);

    // Run OCR / Text Extraction based on MimeType
    const extractedText = await extractText(result.secure_url, req.file.mimetype);

    // Generate AI Summary
    const aiSummary = await generateSummary(extractedText);

    // Create Report in DB
    const report = await Report.create({
      user: req.user.id,
      originalFileName: req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileType: req.file.mimetype,
      ocrText: extractedText,
      summary: aiSummary,
    });

    res.status(201).json({
      message: 'File uploaded, text extracted, and summarized successfully',
      report,
    });
  } catch (error) {
    // Clean up local file if Cloudinary fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
};
