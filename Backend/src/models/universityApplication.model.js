import mongoose from 'mongoose';

const universityApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    course: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    qualification: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'accepted', 'rejected'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

universityApplicationSchema.index(
  { userId: 1, universityId: 1 },
  { unique: true }
);

const UniversityApplication = mongoose.model(
  'UniversityApplication',
  universityApplicationSchema
);

export default UniversityApplication;
