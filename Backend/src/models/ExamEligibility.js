import mongoose from 'mongoose';

const examEligibilitySchema = new mongoose.Schema(
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
        minimumQualification: {
            type: String,
            required: true,
            trim: true,
        },
        requiredSubjects: {
            type: [String],
            default: [],
        },
        minimumPercentage: {
            type: String,
            default: '',
            trim: true,
        },
        ageLimit: {
            type: String,
            default: '',
            trim: true,
        },
        numberOfAttempts: {
            type: String,
            default: '',
            trim: true,
        },
        nationality: {
            type: String,
            default: '',
            trim: true,
        },
        otherRequirements: {
            type: String,
            default: '',
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

// Allow only one ExamEligibility record per Exam Session
examEligibilitySchema.index({ examSession: 1 }, { unique: true });

const ExamEligibility = mongoose.model('ExamEligibility', examEligibilitySchema);

export default ExamEligibility;
