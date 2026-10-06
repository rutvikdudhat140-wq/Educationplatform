import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  reason: { type: String },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  counsellorNote: { type: String },
  isShortlisted: { type: Boolean, default: false }
}, { _id: false });

const followUpTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  dueDate: { type: Date },
  assignedTo: { type: String, enum: ['Student', 'Counsellor'], required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  completedAt: { type: Date }
});

// ── Guidance sub-document ────────────────────────────────────────────
const collegeSuggestionSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  note: { type: String, default: '' }
}, { _id: false });

const courseSuggestionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  note: { type: String, default: '' }
}, { _id: false });

const examGuidanceSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  note: { type: String, default: '' }
}, { _id: false });

const collegeComparisonSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }
}, { _id: false });

const guidanceSchema = new mongoose.Schema({
  collegeSuggestions: [collegeSuggestionSchema],
  courseSuggestions:  [courseSuggestionSchema],
  examGuidance:       [examGuidanceSchema],
  collegeComparison:  [collegeComparisonSchema],
  finalRecommendation: { type: String, default: '' },
  counsellorNotes:     { type: String, default: '' }  // private – not shown to student
}, { _id: false });
// ────────────────────────────────────────────────────────────────────

const counsellingSchema = new mongoose.Schema({
  counsellingNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  examSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamSession'
  },

  // Student Information (snapshot)
  qualification: { type: String },
  passingYear: { type: String },
  tenthPercentage: { type: Number },
  twelfthPercentage: { type: Number },
  graduationPercentage: { type: Number },
  category: { type: String },
  rank: { type: String },
  score: { type: String },

  // Preferences
  preferredState: { type: String },
  preferredCity: { type: String },
  budgetRange: { type: String },
  careerInterest: { type: String },
  
  // Request
  studentMessage: { type: String },

  // Workflow
  status: {
    type: String,
    enum: ['Requested', 'Assigned', 'Scheduled', 'In Progress', 'Completed', 'Follow-up Required', 'Closed', 'Cancelled'],
    default: 'Requested'
  },
  statusHistory: [statusHistorySchema],

  // Session
  sessionDate: { type: Date },
  sessionTime: { type: String },
  sessionMode: { type: String, enum: ['Phone', 'Video', 'Chat', 'In Person'] },
  sessionTopic: { type: String },
  sessionNotes: { type: String },

  // Recommendations
  recommendations: [recommendationSchema],

  // Follow-ups
  followUpTasks: [followUpTaskSchema],

  // Counsellor Private Notes
  counsellorNotes: { type: String },

  // Guidance (filled by Guidance Person / Counsellor)
  guidance: { type: guidanceSchema, default: () => ({}) },
  
  closedAt: { type: Date },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closingNote: { type: String },

}, { timestamps: true });

const Counselling = mongoose.model('Counselling', counsellingSchema);
export default Counselling;
