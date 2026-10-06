import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  question: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'HIDDEN'], default: 'ACTIVE' },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;
