import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    examSession: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export default mongoose.model('ExamMockTest', schema);
