import mongoose from 'mongoose';
import Question from '../models/question.model.js';
import Answer from '../models/answer.model.js';

// POST /api/questions
export const createQuestion = async (req, res) => {
  try {
    const { collegeId, question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question text is required',
      });
    }

    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: 'College id is required',
      });
    }

    const q = await Question.create({
      userId: req.user.id,
      collegeId,
      question: question.trim(),
    });

    res.status(201).json({
      success: true,
      data: q,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/questions/college/:collegeId
export const getQuestionsByCollege = async (req, res) => {
  try {
    const questions = await Question.find({
      collegeId: req.params.collegeId,
      status: 'ACTIVE',
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Count ACTIVE answers for each question in a single aggregation
    const counts = await Answer.aggregate([
      {
        $match: {
          questionId: { $in: questions.map((q) => q._id) },
          status: 'ACTIVE',
        },
      },
      {
        $group: {
          _id: '$questionId',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const questionsWithCount = questions.map((q) => ({
      ...q.toObject(),
      answerCount: countMap[q._id] || 0,
    }));

    res.json({
      success: true,
      data: questionsWithCount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/questions/:id
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('userId', 'name');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const answers = await Answer.find({
      questionId: question._id,
      status: 'ACTIVE',
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...question.toObject(),
        answers,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/questions/:id/answers
export const addAnswer = async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required',
      });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const ans = await Answer.create({
      questionId: req.params.id,
      userId: req.user.id,
      answer: answer.trim(),
    });

    res.status(201).json({
      success: true,
      data: ans,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found or not authorized',
      });
    }

    await Answer.deleteMany({ questionId: req.params.id });

    res.json({
      success: true,
      message: 'Question deleted',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/questions/answers/:answerId
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findOneAndDelete({
      _id: req.params.answerId,
      userId: req.user.id,
    });

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found or not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Answer deleted',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
