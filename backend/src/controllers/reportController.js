import cloudinary from '../config/cloudinary.js';
import Report from '../models/Report.js';
import fs from 'fs';
import { extractText } from '../services/ocrService.js';
import { generateSummary, translateSummary } from '../services/geminiService.js';

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

// @desc    Translate a report summary
// @route   POST /api/reports/:id/translate
// @access  Private
export const translateReport = async (req, res) => {
  try {
    const { targetLanguage } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if translation already exists in DB
    if (report.translatedSummary && report.translatedSummary.has(targetLanguage)) {
      return res.json({
        message: 'Translation retrieved from database',
        translation: report.translatedSummary.get(targetLanguage),
      });
    }

    // If English is requested, just return the original summary
    if (targetLanguage === 'English') {
      return res.json({
        message: 'Original English summary',
        translation: report.summary,
      });
    }

    // Generate translation via Gemini
    const translation = await translateSummary(report.summary, targetLanguage);

    // Initialize map if undefined
    if (!report.translatedSummary) {
      report.translatedSummary = new Map();
    }
    
    // Save translation to MongoDB Map
    report.translatedSummary.set(targetLanguage, translation);
    await report.save();

    res.json({
      message: 'Translation successful',
      translation,
    });
  } catch (error) {
    console.error('Translate Error:', error);
    res.status(500).json({ message: 'Translation failed' });
  }
};
