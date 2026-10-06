import ExamEligibility from '../models/ExamEligibility.js';
import Exam from '../models/Exam.js';
import ExamSession from '../models/ExamSession.js';

export const getExamEligibilities = async (req, res) => {
    try {
        const examEligibilities = await ExamEligibility.find()
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');

        res.status(200).json({
            success: true,
            examEligibilities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exam eligibilities',
        });
    }
};

export const getExamEligibility = async (req, res) => {
    try {
        const examEligibility = await ExamEligibility.findById(req.params.id)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');

        if (!examEligibility) {
            return res.status(404).json({
                success: false,
                message: 'Exam eligibility not found',
            });
        }

        res.status(200).json({
            success: true,
            examEligibility,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exam eligibility',
        });
    }
};

export const createExamEligibility = async (req, res) => {
    try {
        const { exam, examSession } = req.body;

        const existingExam = await Exam.findById(exam);

        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found',
            });
        }

        const existingSession = await ExamSession.findById(examSession);

        if (!existingSession) {
            return res.status(404).json({
                success: false,
                message: 'Exam session not found',
            });
        }

        const examEligibility = await ExamEligibility.create(req.body);

        res.status(201).json({
            success: true,
            examEligibility,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create exam eligibility',
        });
    }
};

export const updateExamEligibility = async (req, res) => {
    try {
        const examEligibility = await ExamEligibility.findById(req.params.id);

        if (!examEligibility) {
            return res.status(404).json({
                success: false,
                message: 'Exam eligibility not found',
            });
        }

        examEligibility.exam = req.body.exam;
        examEligibility.examSession = req.body.examSession;
        examEligibility.minimumQualification = req.body.minimumQualification;
        examEligibility.requiredSubjects = req.body.requiredSubjects;
        examEligibility.minimumPercentage = req.body.minimumPercentage;
        examEligibility.ageLimit = req.body.ageLimit;
        examEligibility.numberOfAttempts = req.body.numberOfAttempts;
        examEligibility.nationality = req.body.nationality;
        examEligibility.otherRequirements = req.body.otherRequirements;
        examEligibility.description = req.body.description;
        examEligibility.status = req.body.status;

        await examEligibility.save();

        res.status(200).json({
            success: true,
            examEligibility,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update exam eligibility',
        });
    }
};

export const deleteExamEligibility = async (req, res) => {
    try {
        const examEligibility = await ExamEligibility.findById(req.params.id);

        if (!examEligibility) {
            return res.status(404).json({
                success: false,
                message: 'Exam eligibility not found',
            });
        }

        await ExamEligibility.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Exam eligibility deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete exam eligibility',
        });
    }
};
