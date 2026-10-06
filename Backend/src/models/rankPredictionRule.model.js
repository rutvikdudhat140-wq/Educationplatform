import mongoose from 'mongoose';

const rankPredictionRuleSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    examSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    predictionMethod: { type: String, default: 'percentile' },
    category: { type: String, default: 'ALL' },
    inputFrom: { type: Number, required: true },
    inputTo: { type: Number, required: true },
    expectedRankFrom: { type: Number, required: true },
    expectedRankTo: { type: Number, required: true },
  },
  { timestamps: true }
);

rankPredictionRuleSchema.index({ examId: 1, examSessionId: 1, predictionMethod: 1 });

export default mongoose.model('RankPredictionRule', rankPredictionRuleSchema);
