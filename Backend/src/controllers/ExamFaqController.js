import ExamFaq from '../models/ExamFaq.js';
import Exam from '../models/Exam.js';
import ExamSession from '../models/ExamSession.js';

export const getExamFaqs = async (req, res) => {
    try {
        const filter = {};
        if (req.query.exam) filter.exam = req.query.exam;
        if (req.query.examSession) filter.examSession = req.query.examSession;
        if (req.query.status) filter.status = req.query.status;

        const data = await ExamFaq.find(filter)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch ExamFaqs' });
    }
};

export const getExamFaq = async (req, res) => {
    try {
        const data = await ExamFaq.findById(req.params.id)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch' });
    }
};

export const createExamFaq = async (req, res) => {
    try {
        const data = await ExamFaq.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create' });
    }
};

export const updateExamFaq = async (req, res) => {
    try {
        const data = await ExamFaq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update' });
    }
};

export const deleteExamFaq = async (req, res) => {
    try {
        const data = await ExamFaq.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete' });
    }
};
