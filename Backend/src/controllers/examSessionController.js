import mongoose from 'mongoose';
import Exam from '../models/Exam.js';
import ExamSession from '../models/ExamSession.js';

export const getExamSessions = async (req, res) => {
    try {
        const filter = {};
        if (req.query.exam && mongoose.isValidObjectId(req.query.exam)) {
            filter.exam = req.query.exam;
        }
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }

        const examSessions = await ExamSession.find(filter)
            .populate('exam', 'name shortName stream')
            .sort({ academicYear: -1, sessionName: 1 });

        return res.status(200).json({
            success: true,
            examSessions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch exam sessions',
            error: error.message,
        });
    }
};

export const getExamSession = async (req, res) => {
    const examSession = await ExamSession.findById(req.params.id)

    if (!examSession) {
        return res.status(404).json({
            success: false,
            message: 'Exam session not found',
        });
    }
    res.status(200).json({
        success: true,
        examSession,
    });
};

export const createExamSession = async (req, res) => {
    const {
        exam,
        academicYear,
        sessionName,
        description,
        status,
    } = req.body;

    if (!mongoose.isValidObjectId(exam)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid exam',
        });
    }

    const examExists = await Exam.findById(exam);
    const examSession = await ExamSession.create({
        exam,
        academicYear,
        sessionName,
        description,
        status,
    });

    res.status(201).json({
        success: true,
        examSession,
    });
};

export const updateExamSession = async (req, res) => {
    const {
        exam,
        academicYear,
        sessionName,
        description,
        status,
    } = req.body;

    const examSession = await ExamSession.findById(req.params.id);

    examSession.exam = exam;
    examSession.academicYear = academicYear;
    examSession.sessionName = sessionName;
    examSession.description = description;
    examSession.status = status;

    await examSession.save();

    res.status(200).json({
        success: true,
        examSession,
    });
};

export const deleteExamSession = async (req, res) => {
    const examSession = await ExamSession.findById(req.params.id);

    if (!examSession) {
        return res.status(404).json({
            success: false,
            message: 'Exam session not found',
        });
    }

    await ExamSession.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Exam session deleted successfully',
    });
};
