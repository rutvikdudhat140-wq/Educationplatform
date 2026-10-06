import ExamPreparation from '../models/ExamPreparation.js';
import Exam from '../models/Exam.js';
import ExamSession from '../models/ExamSession.js';

export const getExamPreparations = async (req, res) => {
    try {
        const filter = {};

        if (req.query.exam) filter.exam = req.query.exam;
        if (req.query.examSession) filter.examSession = req.query.examSession;
        if (req.query.status) filter.status = req.query.status;

        const examPreparations = await ExamPreparation.find(filter)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            examPreparations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exam preparations',
        });
    }
};

export const getExamPreparationById = async (req, res) => {
    try {
        const examPreparation = await ExamPreparation.findById(req.params.id)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');

        if (!examPreparation) {
            return res.status(404).json({
                success: false,
                message: 'Exam preparation not found',
            });
        }

        res.status(200).json({
            success: true,
            examPreparation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exam preparation',
        });
    }
};

export const createExamPreparation = async (req, res) => {
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

        const examPreparation = await ExamPreparation.create(req.body);

        res.status(201).json({
            success: true,
            examPreparation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create exam preparation',
        });
    }
};

export const updateExamPreparation = async (req, res) => {
    try {
        const examPreparation = await ExamPreparation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );

        if (!examPreparation) {
            return res.status(404).json({
                success: false,
                message: 'Exam preparation not found',
            });
        }

        res.status(200).json({
            success: true,
            examPreparation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update exam preparation',
        });
    }
};

export const deleteExamPreparation = async (req, res) => {
    try {
        const examPreparation = await ExamPreparation.findById(req.params.id);

        if (!examPreparation) {
            return res.status(404).json({
                success: false,
                message: 'Exam preparation not found',
            });
        }

        await ExamPreparation.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Exam preparation deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete exam preparation',
        });
    }
};
