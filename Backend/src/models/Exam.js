import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        shortName: {
            type: String,
            trim: true,
            default: '',
        },
        conductingBody: {
            type: String,
            trim: true,
            default: '',
        },
        stream: {
            type: String,
            required: true,
            enum: [
                'Engineering',
                'Management',
                'Commerce & Banking',
                'Medical',
                'Sciences',
                'Hotel Management',
                'Information Technology',
                'Arts & Humanities',
                'Mass Communication',
                'Agriculture',
                'Design',
                'Law',
                'Pharmacy',
                'Dental',
                'Performing Arts',
                'Education',
            ],
        },
        level: {
            type: String,
            required: true,
            enum: ['UG', 'PG', 'Diploma', 'PhD', 'Other'],
        },
        examType: {
            type: String,
            required: true,
            enum: ['National Level', 'State Level', 'University Level', 'Institute Level'],
        },
        description: {
            type: String,
            default: '',
        },
        syllabus: {
            type: String,
            default: '',
        },
        examPattern: {
            type: String,
            default: '',
        },
        questionPaper: {
            type: String,
            default: '',
        },
        otherInformation: {
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

examSchema.virtual('dates', {
    ref: 'ExamDate',
    localField: '_id',
    foreignField: 'exam',
});

examSchema.virtual('eligibility', {
    ref: 'ExamEligibility',
    localField: '_id',
    foreignField: 'exam',
});

examSchema.virtual('sessions', {
    ref: 'ExamSession',
    localField: '_id',
    foreignField: 'exam',
});

examSchema.set('toJSON', { virtuals: true });
examSchema.set('toObject', { virtuals: true });

examSchema.index({ stream: 1, name: 1 }, { unique: true });

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
