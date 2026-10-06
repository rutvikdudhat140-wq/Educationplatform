import mongoose from 'mongoose';

const examSessionSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
        },
        academicYear: {
            type: Number,
            required: true,
            min: 1900,
            max: 2100,
        },
        sessionName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

examSessionSchema.index(
    { exam: 1, academicYear: 1, sessionName: 1 },
    { unique: true }
);

const ExamSession = mongoose.model('ExamSession', examSessionSchema);

export default ExamSession;
