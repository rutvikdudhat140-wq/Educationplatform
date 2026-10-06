import mongoose from 'mongoose';

const educationUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Education News',
        'Exam Update',
        'Admission Update',
        'College Update',
        'Scholarship Update',
        'Result',
        'Counselling',
        'Application Deadline',
        'Course Update',
        'Announcement',
      ],
      default: 'Education News',
    },
    thumbnail: {
      type: String,
      default: '',
    },

    // Existing platform records - referenced, never duplicated
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

    // Important dates - only the ones an admin fills in are shown to students
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    examDate: {
      type: Date,
    },
    resultDate: {
      type: Date,
    },

    officialLink: {
      type: String,
      default: '',
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
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

educationUpdateSchema.index({ status: 1, publishedAt: -1 });
educationUpdateSchema.index({ category: 1 });

const EducationUpdate = mongoose.model('EducationUpdate', educationUpdateSchema);

export default EducationUpdate;
