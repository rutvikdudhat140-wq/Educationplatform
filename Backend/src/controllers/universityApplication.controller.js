import UniversityApplication from '../models/universityApplication.model.js';
import University from '../models/university.model.js';
import User from '../models/user.model.js';

export const createUniversityApplication = async (req, res) => {
  try {
    const {
      universityId,
      email,
      message,
      name,
      phone,
      course,
      address,
      qualification,
    } = req.body;

    if (!universityId || !name || !phone || !email || !message) {
      return res.status(400).json({
        message: 'Name, phone, email, university and message are required',
      });
    }

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        message: 'University not found',
      });
    }

    const applicantUserId = req.user?.id || null;

    if (applicantUserId) {
      const existingApplication = await UniversityApplication.findOne({
        userId: applicantUserId,
        universityId,
      });

      if (existingApplication) {
        return res.status(409).json({
          message: 'You have already applied to this university',
          application: existingApplication,
        });
      }
    }

    const user = applicantUserId ? await User.findById(applicantUserId).select('-password') : null;

    const application = await UniversityApplication.create({
      userId: applicantUserId,
      universityId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      course: course ? String(course).trim() : '',
      address: address ? String(address).trim() : '',
      qualification: qualification ? String(qualification).trim() : '',
      image: user?.image || req.body.image || '',
      message: String(message).trim(),
      status: 'new',
    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to submit application',
    });
  }
};

export const getMyUniversityApplications = async (req, res) => {
  try {
    const applications = await UniversityApplication.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUniversityApplications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    const applications = await UniversityApplication.find({
      universityId: req.params.universityId,
    })
      .populate('universityId', 'name')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Unable to fetch university applications',
    });
  }
};

export const checkUniversityApplication = async (req, res) => {
  try {
    const application = await UniversityApplication.findOne({
      userId: req.user.id,
      universityId: req.params.universityId,
    }).select('_id');

    res.status(200).json({
      applied: Boolean(application),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Unable to check application status',
    });
  }
};
