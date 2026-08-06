import Tesseract from 'tesseract.js';
import { PDFParse } from 'pdf-parse';
import axios from 'axios';

/**
 * Perform OCR on an image URL
 * @param {string} fileUrl - Cloudinary URL of the image
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (fileUrl) => {
  try {
    const { data: { text } } = await Tesseract.recognize(fileUrl, 'eng');
    return text.trim();
  } catch (error) {
    console.error('Image OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Extract text from a PDF URL
 * @param {string} fileUrl - Cloudinary URL of the PDF
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (fileUrl) => {
  try {
    // Download PDF buffer from Cloudinary URL
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    // Parse PDF
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text.trim();
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Main entry point to extract text based on file type
 * @param {string} fileUrl - The URL of the file
 * @param {string} fileType - Mimetype (e.g., application/pdf or image/png)
 * @returns {Promise<string>}
 */
export const extractText = async (fileUrl, fileType) => {
  if (fileType === 'application/pdf') {
    return await extractTextFromPDF(fileUrl);
  } else if (fileType.startsWith('image/')) {
    return await extractTextFromImage(fileUrl);
  } else {
    throw new Error('Unsupported file format for text extraction');
  }
};
