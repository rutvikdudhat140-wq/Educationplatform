import ExamDate from "../models/ExamDate.js";

const EXAM_POPULATE =
    "name shortName conductingBody stream level examType status";
const SESSION_POPULATE = "academicYear sessionName status";

const getTodayBounds = () => {
    const now = new Date();
    const todayStart = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        )
    );
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    return { todayStart, tomorrowStart };
};

const filterActive = (items) =>
    items.filter((item) => {
        const examActive = !item.exam || item.exam.status === "Active";
        const sessionActive =
            !item.examSession || item.examSession.status === "Active";
        return examActive && sessionActive;
    });

export const getExamDates = async (req, res) => {
    const examDates = await ExamDate.find()
        .populate("exam", "name shortName")
        .populate("examSession", "academicYear sessionName");

    res.json({
        success: true,
        examDates,
    });
};

export const getUpcomingExamDates = async (req, res) => {
    try {
        const { tomorrowStart } = getTodayBounds();

        const examDates = await ExamDate.find({
            status: "Active",
            examStartDate: { $gte: tomorrowStart },
        })
            .populate("exam", EXAM_POPULATE)
            .populate("examSession", SESSION_POPULATE)
            .sort({ examStartDate: 1 });

        const upcomingExams = filterActive(examDates);

        res.status(200).json({
            success: true,
            data: upcomingExams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getOngoingExamDates = async (req, res) => {
    try {
        const { todayStart, tomorrowStart } = getTodayBounds();

        const examDates = await ExamDate.find({
            status: "Active",
            examStartDate: { $lt: tomorrowStart },
            examEndDate: { $gte: todayStart },
        })
            .populate("exam", EXAM_POPULATE)
            .populate("examSession", SESSION_POPULATE)
            .sort({ examStartDate: 1 });

        const ongoingExams = filterActive(examDates);

        res.status(200).json({
            success: true,
            data: ongoingExams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCompletedExamDates = async (req, res) => {
    try {
        const { todayStart } = getTodayBounds();

        const examDates = await ExamDate.find({
            status: "Active",
            examEndDate: { $lt: todayStart },
        })
            .populate("exam", EXAM_POPULATE)
            .populate("examSession", SESSION_POPULATE)
            .sort({ examEndDate: -1 });

        const completedExams = filterActive(examDates);

        res.status(200).json({
            success: true,
            data: completedExams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getExamDate = async (req, res) => {
    const examDate = await ExamDate.findById(req.params.id)
        .populate("exam", "name shortName")
        .populate("examSession", "academicYear sessionName");

    res.json({
        success: true,
        examDate,
    });
};

export const createExamDate = async (req, res) => {
    const existingExamDate = await ExamDate.findOne({
        examSession: req.body.examSession,
    });

    if (existingExamDate) {
        const examDate = await ExamDate.findByIdAndUpdate(
            existingExamDate._id,
            req.body,
            { new: true }
        );

        return res.json({
            success: true,
            examDate,
            message: "Exam date updated successfully",
        });
    }

    const examDate = await ExamDate.create(req.body);

    res.status(201).json({
        success: true,
        examDate,
        message: "Exam date created successfully",
    });
};

export const updateExamDate = async (req, res) => {
    const examDate = await ExamDate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({
        success: true,
        examDate,
        message: "Exam date updated successfully",
    });
};

export const deleteExamDate = async (req, res) => {
    await ExamDate.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Exam date deleted successfully",
    });
};
