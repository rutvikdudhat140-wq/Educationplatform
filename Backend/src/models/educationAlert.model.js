import mongoose from 'mongoose';

const educationAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: [
        'Exam Alert',
        'Admission Alert',
        'Scholarship Alert',
        'Result Alert',
        'Deadline Alert',
        'Counselling Alert',
        'College Alert',
        'General Education Alert',
      ],
      default: 'General Education Alert',
    },

    // Related records - reused from the existing modules
    updateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationUpdate',
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
    },

    priority: {
      type: String,
      enum: ['NORMAL', 'IMPORTANT'],
      default: 'NORMAL',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

educationAlertSchema.index({ status: 1, expiryDate: 1 });
educationAlertSchema.index({ updateId: 1 });

const EducationAlert = mongoose.model('EducationAlert', educationAlertSchema);

export default EducationAlert;
