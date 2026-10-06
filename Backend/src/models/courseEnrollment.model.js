import mongoose from 'mongoose';

const courseEnrollmentSchema = new mongoose.Schema(
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

    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    status: {
      type: String,
      enum: ['ENROLLED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'ENROLLED',
    },

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    lastActivityAt: { type: Date, default: Date.now },

    assessmentScore: { type: Number, default: 0 },
    assessmentTotal: { type: Number, default: 0 },
    assessmentPassed: { type: Boolean, default: false },
    assessmentLastAttemptAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// one enrollment per user per course
courseEnrollmentSchema.index(
  { userId: 1, onlineCourseId: 1 },
  { unique: true }
);

export default mongoose.model('CourseEnrollment', courseEnrollmentSchema);
