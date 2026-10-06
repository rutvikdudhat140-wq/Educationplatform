import ExamMockTest from '../models/ExamMockTest.js';


export const getExamMockTests = async (req, res) => {
    try {
        const filter = {};
        if (req.query.exam) filter.exam = req.query.exam;
        if (req.query.examSession) filter.examSession = req.query.examSession;
        if (req.query.status) filter.status = req.query.status;

        const data = await ExamMockTest.find(filter)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch ExamMockTests' });
    }
};

export const getExamMockTest = async (req, res) => {
    try {
        const data = await ExamMockTest.findById(req.params.id)
            .populate('exam', 'name shortName')
            .populate('examSession', 'academicYear sessionName');
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch' });
    }
};

export const createExamMockTest = async (req, res) => {
    try {
        const data = await ExamMockTest.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create' });
    }
};

export const updateExamMockTest = async (req, res) => {
    try {
        const data = await ExamMockTest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update' });
    }
};

export const deleteExamMockTest = async (req, res) => {
    try {
        const data = await ExamMockTest.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete' });
    }
};
