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

    // Guard: if OCR couldn't find meaningful text, don't waste an AI call
    // fabricating a summary out of nothing. Clean up the Cloudinary upload too.
    if (!extractedText || extractedText.trim().length < 20) {
      await cloudinary.uploader.destroy(result.public_id);
      return res.status(400).json({
        message: 'We couldn\'t find readable text in this file. Please make sure it\'s a clear photo or scan of a medical report (not a blank page, screenshot, or unrelated image), then try again.',
      });
    }

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

// @desc    Get all reports for the logged in user
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to access this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get Report Error:', error);
    res.status(500).json({ message: 'Failed to fetch report details' });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this report' });
    }

    // Delete from Cloudinary
    if (report.cloudinaryId) {
      await cloudinary.uploader.destroy(report.cloudinaryId);
    }

    // Delete from DB
    await report.deleteOne();

    res.json({ message: 'Report removed' });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
};
