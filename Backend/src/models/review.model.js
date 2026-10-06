import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    reviewerName: { type: String, default: 'Anonymous' },
    course: { type: String, required: true },
    graduationYear: { type: String, required: true },
    ratings: {
        overall: { type: Number, required: true, min: 1, max: 5 },
        placements: { type: Number, required: true, min: 1, max: 5 },
        faculty: { type: Number, required: true, min: 1, max: 5 },
        infrastructure: { type: Number, required: true, min: 1, max: 5 },
        campusLife: { type: Number, required: true, min: 1, max: 5 },
        valueForMoney: { type: Number, min: 1, max: 5 } // Optional extra
    },
    reviewTitle: { type: String, required: true },
    pros: { type: String, required: true },
    cons: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
