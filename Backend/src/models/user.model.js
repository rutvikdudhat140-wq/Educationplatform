import mongoose from 'mongoose';

// ── Student Personalization Profile ───────────────────────────────────
// Only the fields the recommendation engine actually reads are stored here.
// Every value is real data entered by the logged-in student.
// ─────────────────────────────────────────────────────────────────────
const personalizationSchema = new mongoose.Schema(
  {
    // Academic
    qualification: { type: String, trim: true, default: '' },
    tenthPercentage: { type: Number, min: 0, max: 100, default: null },
    twelfthPercentage: { type: Number, min: 0, max: 100, default: null },
    graduationPercentage: { type: Number, min: 0, max: 100, default: null },
    passingYear: { type: String, trim: true, default: '' },
    subjects: { type: [String], default: [] },

    // Entrance exam
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', default: null },
    examSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamSession',
      default: null,
    },
    score: { type: Number, default: null },
    rank: { type: Number, default: null },
    percentile: { type: Number, min: 0, max: 100, default: null },

    // Reservation
    category: { type: String, trim: true, default: '' },
    gender: { type: String, trim: true, default: '' },
    quota: { type: String, trim: true, default: '' },

    // Location preference
    preferredState: { type: String, trim: true, default: '' },
    preferredCity: { type: String, trim: true, default: '' },

    // Budget. budgetRange is a bucket, budgetAmount is an exact per-year figure.
    budgetRange: {
      type: String,
      enum: ['Low', 'Medium', 'High', ''],
      default: '',
    },
    budgetAmount: { type: Number, min: 0, default: null },

    // Interests / choices
    careerInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      default: null,
    },
    preferredCourseIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    ],
    preferredCollegeIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    ],

    updatedAt: { type: Date, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    default: ''
  },

  image: {
    type: String,
    default: ''
  },
  
  role: {
    type: String,
    enum: ['Student', 'Admin', 'Counsellor'],
    default: 'Student'
  },
  
  // Counsellor Specific Fields
  expertise: [{
    type: String
  }],
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  availableTimeSlots: [{
    startTime: String, // e.g., '10:00 AM'
    endTime: String,   // e.g., '11:00 AM'
  }],
  currentAssignedStudents: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Student Personalization Profile (used by the recommendation engine)
  personalization: {
    type: personalizationSchema,
    default: () => ({}),
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
