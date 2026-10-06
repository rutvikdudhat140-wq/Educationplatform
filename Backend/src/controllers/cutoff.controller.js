import mongoose from 'mongoose';
import Cutoff from '../models/cutoff.model.js';

/**
 * The cutoff tab renders the exam, session and course by name, so every ref is
 * populated here. Returning bare ObjectIds would leave those columns blank.
 */
const POPULATE = [
  { path: 'examId', select: 'name shortName conductingBody stream level' },
  { path: 'examSessionId', select: 'academicYear sessionName' },
  { path: 'courseId', select: 'courseName name fullCourseName stream level' },
  { path: 'collegeId', select: 'name collegeName' },
];

export const getCutoffs = async (req, res) => {
  try {
    const filter = {};

    if (req.query.collegeId) {
      if (!mongoose.isValidObjectId(req.query.collegeId)) {
        return res.status(400).json({ message: 'Invalid collegeId' });
      }
      filter.collegeId = req.query.collegeId;
    }

    if (req.query.examId && mongoose.isValidObjectId(req.query.examId)) {
      filter.examId = req.query.examId;
    }

    if (req.query.courseId && mongoose.isValidObjectId(req.query.courseId)) {
      filter.courseId = req.query.courseId;
    }

    if (req.query.year) {
      const year = parseInt(req.query.year);
      if (!Number.isNaN(year)) filter.year = year;
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 200));
    const skip = (page - 1) * limit;

    const [cutoffs, total] = await Promise.all([
      Cutoff.find(filter)
        .populate(POPULATE)
        .sort({ year: -1, round: 1, openingRank: 1 })
        .skip(skip)
        .limit(limit),
      Cutoff.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      cutoffs,
      data: cutoffs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCutoffById = async (req, res) => {
  try {
    const cutoff = await Cutoff.findById(req.params.id).populate(POPULATE);

    if (!cutoff) {
      return res.status(404).json({ message: 'Cutoff not found' });
    }

    res.status(200).json({ success: true, cutoff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCutoff = async (req, res) => {
  try {
    const cutoff = await Cutoff.create(req.body);

    res.status(201).json({ success: true, cutoff: await cutoff.populate(POPULATE) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCutoff = async (req, res) => {
  try {
    const cutoff = await Cutoff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(POPULATE);

    if (!cutoff) {
      return res.status(404).json({ message: 'Cutoff not found' });
    }

    res.status(200).json({ success: true, cutoff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCutoff = async (req, res) => {
  try {
    const cutoff = await Cutoff.findByIdAndDelete(req.params.id);

    if (!cutoff) {
      return res.status(404).json({ message: 'Cutoff not found' });
    }

    res.status(200).json({ success: true, message: 'Cutoff deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
