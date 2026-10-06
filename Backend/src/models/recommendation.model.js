import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    recommendationType: {
      type: String,
      enum: ['course', 'college'],
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null,
    },

    matchScore: { type: Number, min: 0, max: 100, default: 0 },


    matchedFactors: { type: [String], default: [] },

    reasons: { type: [String], default: [] },


    scoreBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    source: {
      type: String,
      enum: ['profile', 'counselling'],
      default: 'profile',
    },

    rank: { type: Number, default: 0 },

    generatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

recommendationSchema.index({ userId: 1, recommendationType: 1, generatedAt: -1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
