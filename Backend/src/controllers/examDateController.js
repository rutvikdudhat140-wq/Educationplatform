import ExamDate from "../models/ExamDate.js";

export const getExamDates = async (req, res) => {
  const examDates = await ExamDate.find()
    .populate("exam", "name shortName")
    .populate("examSession", "academicYear sessionName")
    .sort({ examStartDate: 1 });

  res.json({
    success: true,
    examDates,
  });
};

export const getUpcomingExamDates = async (req, res) => {
  const examDates = await ExamDate.find({
    status: "Active",
    examStartDate: { $gt: new Date() },
  })
    .populate("exam", "name shortName conductingBody stream level examType status")
    .populate("examSession", "academicYear sessionName status")
    .sort({ examStartDate: 1 });

  res.json({
    success: true,
    data: examDates,
  });
};

export const getOngoingExamDates = async (req, res) => {
  const today = new Date();

  const examDates = await ExamDate.find({
    status: "Active",
    examStartDate: { $lte: today },
    examEndDate: { $gte: today },
  })
    .populate("exam", "name shortName conductingBody stream level examType status")
    .populate("examSession", "academicYear sessionName status")
    .sort({ examStartDate: 1 });

  res.json({
    success: true,
    data: examDates,
  });
};

export const getCompletedExamDates = async (req, res) => {
  const examDates = await ExamDate.find({
    status: "Active",
    examEndDate: { $lt: new Date() },
  })
    .populate("exam", "name shortName conductingBody stream level examType status")
    .populate("examSession", "academicYear sessionName status")


  res.json({
    success: true,
    data: examDates,
  });
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
