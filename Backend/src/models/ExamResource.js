import mongoose from 'mongoose';
import applyRelaxedValidation from '../utils/relaxedValidation.js';

/**
 * Syllabus, sample papers, mock tests and FAQs all share one shape, so they
 * live in a single collection discriminated by `type` instead of four
 * near-identical models. The four public endpoints are just this controller
 * mounted with a different `type`.
 */
const RESOURCE_TYPES = ['Syllabus', 'Sample Paper', 'Mock Test', 'FAQ'];

const examResourceSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: RESOURCE_TYPES,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        fileUrl: {
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

applyRelaxedValidation(examResourceSchema);

examResourceSchema.index({ exam: 1, type: 1 });
examResourceSchema.index({ type: 1, title: 1 }, { unique: true });

const ExamResource = mongoose.model('ExamResource', examResourceSchema);

export { RESOURCE_TYPES };
export default ExamResource;
