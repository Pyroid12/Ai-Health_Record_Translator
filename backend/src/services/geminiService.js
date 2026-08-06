import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Small delay helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call Gemini with automatic retry on transient errors (503 overloaded, 429 rate limit).
 * Uses exponential backoff: 1s, 2s, 4s between attempts.
 * @param {Function} fn - Async function that performs the Gemini call
 * @param {number} maxRetries - Max number of retry attempts
 */
const withRetry = async (fn, maxRetries = 3) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.httpStatus;
      const isRetryable = status === 503 || status === 429;

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      const delayMs = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
      console.warn(`Gemini call failed (status ${status}), retrying in ${delayMs}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(delayMs);
    }
  }
  throw lastError;
};

/**
 * Generate an easy English explanation from OCR text
 * @param {string} ocrText - The extracted text from the medical report
 * @returns {Promise<string>} - The AI generated summary
 */
export const generateSummary = async (ocrText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
You are an expert medical assistant AI. Your task is to translate complex medical reports into easy-to-understand English for a patient.
CRITICAL: You must NEVER diagnose a disease. Always include a medical disclaimer stating this is for educational purposes and they must consult a doctor.

FIRST, check whether the text below actually looks like a medical report, lab result, prescription, or clinical document (e.g. it should contain things like test names, values, units, patient/doctor information, diagnoses, or medication details).

If it does NOT look like a medical document (for example, it's random text, an unrelated document, gibberish/OCR noise, or nearly empty), respond with ONLY this exact message and nothing else:
"This doesn't appear to be a medical report. Please upload a clear photo or scan of a lab result, prescription, or clinical document, and try again."

If it DOES look like a medical document, provide a structured summary using EXACTLY these headings:

1. Patient Summary: (A brief overview of who the report is for and what the test is)
2. Important Findings: (Key results from the report in simple terms)
3. Abnormal Values: (Any out-of-range metrics, or state "None found")
4. Meaning of abnormal values: (What those out-of-range metrics generally indicate)
5. Questions to ask doctor: (3-4 suggested questions for their next appointment)
6. Health Tips: (General wellness advice related to the test type)
7. Medical Disclaimer: (Must include a strong disclaimer that this is not a diagnosis)

Medical Report Text:
"""
${ocrText}
"""
    `;

    const response = await withRetry(async () => {
      const result = await model.generateContent(prompt);
      return await result.response;
    });

    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate summary from AI. The AI service may be temporarily busy — please try again in a moment.');
  }
};

/**
 * Translate an English summary to a target regional language
 * @param {string} englishSummary - The original English summary
 * @param {string} targetLanguage - The language to translate to
 * @returns {Promise<string>} - The translated summary
 */
export const translateSummary = async (englishSummary, targetLanguage) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
You are an expert medical translator. Translate the following medical report summary into ${targetLanguage}.
CRITICAL INSTRUCTIONS:
1. Translate the conversational and explanatory text into easy-to-understand ${targetLanguage}.
2. Keep specific medical terms, test names, and metrics in English (or append the English term in brackets) to avoid confusion.
3. Maintain the exact same markdown structure and headings as the original.
4. Ensure the Medical Disclaimer is strongly translated and emphasizes that this is not a diagnosis.

Original Summary:
"""
${englishSummary}
"""
    `;

    const response = await withRetry(async () => {
      const result = await model.generateContent(prompt);
      return await result.response;
    });

    return response.text();
  } catch (error) {
    console.error('Gemini Translation Error:', error);
    throw new Error('Failed to translate summary. The AI service may be temporarily busy — please try again in a moment.');
  }
};
