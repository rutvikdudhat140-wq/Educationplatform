import Career from '../models/career.model.js';
import Course from '../models/course.model.js';



export const createCareer = async (req, res) => {
  try {
    const career = await Career.create({
      ...req.body,
      isActive: req.body.isActive ?? true,
      status: req.body.status || 'Active',
    })
    res.status(201).json({
      message: "career created successfully",
      career,
    })
  } catch (error) {

  }
}

export const getCareers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.isActive && req.query.isActive !== 'all') {
      filter.isActive = req.query.isActive === 'true';
    }

    if (req.query.stream) {
      filter.stream = req.query.stream;
    }

    if (req.query.course) {
      filter.relatedCourses = req.query.course;
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const careers = await Career.find(filter).populate('relatedCourses', 'name').skip(skip).limit(limit);
    const total = await Career.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      careers,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
  }
};

export const getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    let relatedCourses = [];

    if (career.relatedCourses?.length) {
      relatedCourses = await Course.find({
        _id: { $in: career.relatedCourses },
      });
    }

    res.status(200).json({
      career,
      relatedCourses,
    });
  } catch (error) {
  }
};

export const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
    );

    if (!career) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    res.status(200).json({
      career,
    });
  } catch (error) {
  }
};



export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);

    if (!career) {
      return res.status(404).json({
        message: 'Career not found'
      })
    }
    res.status(200).json({
      message: 'career deleted successfully',
      career,
    })
  } catch (error) {

  }
}

import MentorshipRequest from '../models/mentorshipRequest.model.js';

export const submitMentorshipRequest = async (req, res) => {
  try {
    const { careerId, mentorId, mentorName, topic, message, studentName, studentEmail, studentId } = req.body;
    const request = new MentorshipRequest({
      careerId, mentorId, mentorName, topic, message, studentName, studentEmail, studentId
    });
    await request.save();
    res.status(201).json({ success: true, message: 'Request submitted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllMentorshipRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find().sort({ createdAt: -1 }).populate('careerId', 'name');
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMentorshipRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await MentorshipRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
