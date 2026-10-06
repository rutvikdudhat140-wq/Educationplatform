import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    examSession: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    paperName: { type: String, required: true, trim: true },
    duration: { type: String, default: '' },
    totalQuestions: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    questionTypes: { type: String, default: '' },
    markingScheme: { type: String, default: '' },
    negativeMarking: { type: String, default: '' },
    subjects: { type: [String], default: [] },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export default mongoose.model('ExamPattern', schema);
