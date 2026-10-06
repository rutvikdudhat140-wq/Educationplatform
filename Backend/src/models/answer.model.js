import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answer: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'HIDDEN'], default: 'ACTIVE' },
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
