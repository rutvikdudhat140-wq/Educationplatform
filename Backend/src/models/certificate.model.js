import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    onlineCourseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OnlineCourse',
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    studentName: { type: String, default: '' },
    courseName: { type: String, default: '' },
    courseCategory: { type: String, default: '' },
    courseDuration: { type: String, default: '' },
    instructorName: { type: String, default: '' },

    issuedAt: { type: Date, default: Date.now },
    completionDate: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ['Valid', 'Revoked'],
      default: 'Valid',
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index(
  { userId: 1, onlineCourseId: 1 },
  { unique: true }
);

export default mongoose.model('Certificate', certificateSchema);
