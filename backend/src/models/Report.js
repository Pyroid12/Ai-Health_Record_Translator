import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    ocrText: {
      type: String,
    },
    summary: {
      type: String,
    },
    translatedSummary: {
      type: Map,
      of: String, // E.g., { "Hindi": "...", "Marathi": "..." }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Report', reportSchema);
