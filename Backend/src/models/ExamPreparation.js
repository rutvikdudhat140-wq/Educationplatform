import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
    {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
    },
    { _id: false }
);

const examPreparationSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
        },
        examSession: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExamSession',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        overview: {
            type: String,
            default: '',
        },
        preparationStrategy: {
            type: String,
            default: '',
        },
        subjectWisePreparation: {
            type: String,
            default: '',
        },
        importantTopics: {
            type: String,
            default: '',
        },
        studyPlan: {
            type: String,
            default: '',
        },
        bestBooks: {
            type: String,
            default: '',
        },
        previousYearPapers: {
            type: String,
            default: '',
        },
        mockTest: {
            type: String,
            default: '',
        },
        timeManagement: {
            type: String,
            default: '',
        },
        revisionStrategy: {
            type: String,
            default: '',
        },
        lastMinuteTips: {
            type: String,
            default: '',
        },
        examDayTips: {
            type: String,
            default: '',
        },
        commonMistakes: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
        faqs: {
            type: [faqSchema],
            default: [],
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

export default mongoose.model('ExamPreparation', examPreparationSchema);
