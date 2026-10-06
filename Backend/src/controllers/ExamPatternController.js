import ExamPattern from '../models/ExamPattern.js';

export const getExamPatterns = async (req, res) => {
    try {
        const filter = {};

        if (req.query.exam) filter.exam = req.query.exam;
        if (req.query.examSession) filter.examSession = req.query.examSession;
        if (req.query.status) filter.status = req.query.status;

        const data = await ExamPattern.find(filter)
            .populate([
                {
                    path: 'exam',
                    select: 'name shortName',
                },
                {
                    path: 'examSession',
                    select: 'academicYear sessionName',
                },
            ])
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {

    }
};

export const getExamPatternById = async (req, res) => {
    try {
        const data = await ExamPattern.findById(req.params.id)


        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Exam pattern not found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
    }
};

export const createExamPattern = async (req, res) => {
    try {
        const data = await ExamPattern.create({
            exam: req.body.exam,
            examSession: req.body.examSession,
            paperName: req.body.paperName,
            duration: req.body.duration || '',
            totalQuestions: Number(req.body.totalQuestions) || 0,
            totalMarks: Number(req.body.totalMarks) || 0,
            questionTypes: req.body.questionTypes || '',
            markingScheme: req.body.markingScheme,
            negativeMarking: req.body.negativeMarking,
            subjects: Array.isArray(req.body.subjects) ? req.body.subjects : [],
            description: req.body.description || '',
            status: req.body.status || 'Active'
        });

        res.status(201).json({
            success: true,
            data
        });
    } catch (error) {

    }
};

export const updateExamPattern = async (req, res) => {
    try {
        const data = await ExamPattern.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                totalQuestions: Number(req.body.totalQuestions) || 0,
                totalMarks: Number(req.body.totalMarks) || 0,
                subjects: Array.isArray(req.body.subjects)
                    ? req.body.subjects
                    : []
            },

        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Exam pattern not found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {


        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteExamPattern = async (req, res) => {
    try {
        const data = await ExamPattern.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Exam pattern not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Deleted successfully'
        });
    } catch (error) {

    }
};
