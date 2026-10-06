import Application from '../models/application.model.js';
import College from '../models/college.model.js';
import User from '../models/user.model.js';

export const createApplication = async (req, res) => {
  try {
    const {
      collegeId,
      name,
      phone,
      email,
      message,
    } = req.body;

    if (!collegeId || !name || !phone || !email || !message) {
      return res.status(400).json({
        message: 'College, name, phone, email, and message are required.',
      });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        message: 'College not found',
      });
    }

    const applicantUserId = req.user?.id || null;

    if (applicantUserId) {
      const alreadyApplied = await Application.findOne({
        userId: applicantUserId,
        collegeId,
      });

      if (alreadyApplied) {
        return res.status(409).json({
          message: 'You have already applied to this college',
        });
      }
    }

    const user = applicantUserId ? await User.findById(applicantUserId).select('-password') : null;

    const application = await Application.create({
      userId: applicantUserId,
      collegeId,
      name: String(name),
      phone: String(phone),
      email: String(email),
      message: String(message),

    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {

  }
};


export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user.id,
    })

    res.json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getCollegeApplications = async (req, res) => {
  const applications = await Application.find({
    collegeId: req.params.collegeId,
  })

  res.json({
    applications,
  });
}


export const getApplications = async (req, res) => {

    const applications = await Application.find()


    res.json({
      applications,
    });
  }



export const checkApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      userId: req.user.id,
      collegeId: req.params.collegeId,
    });

    res.json({
      applied: !!application,
    });
  } catch (error) {
  }
};
