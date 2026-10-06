import Question from '../models/question.model.js';
import Answer from '../models/answer.model.js';

// GET /api/admin/questions
export const getAllQuestions = async (req, res) => {
  try {
    const { search, college } = req.query;

    const query = {};

    if (college) {
      query.collegeId = college;
    }

    if (search) {
      query.question = { $regex: search, $options: 'i' };
    }

    const questions = await Question.find(query)
      .populate('userId', 'name email')
      .populate('collegeId', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/admin/questions/:id
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('collegeId', 'name');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const answers = await Answer.find({ questionId: question._id })
      .populate('userId', 'name email')
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

// DELETE /api/admin/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
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

// DELETE /api/admin/questions/answers/:answerId
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
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

// PATCH /api/admin/questions/:id/status
export const updateQuestionStatus = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/admin/questions/answers/:answerId/status
export const updateAnswerStatus = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.answerId,
      { status: req.body.status },
      { new: true }
    );

    res.json({
      success: true,
      data: answer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/admin/questions/:id/answers
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

    const populatedAnswer = await Answer.findById(ans._id).populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: populatedAnswer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
