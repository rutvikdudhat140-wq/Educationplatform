import Review from '../models/review.model.js';

export const addReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getReviewsByCollege = async (req, res) => {
    try {
        const reviews = await Review.find({
            collegeId: req.params.collegeId,
            status: 'approved'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Review deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateReviewStatus = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
        );
        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
