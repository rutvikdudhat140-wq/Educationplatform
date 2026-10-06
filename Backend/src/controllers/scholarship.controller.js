import Scholarship from '../models/scholarship.model.js';
import ScholarshipApplication from '../models/scholarshipApplication.model.js';


export const getAllScholarships = async (req, res) => {

  const query = { status: 'Active' };

  const scholarships = await Scholarship.find(query)
    .populate('collegeIds', 'name location')
    .populate('courseIds', 'name fullName level')

  res.json({
    success: true,
    data: scholarships,
  });
};

export const getScholarshipById = async (req, res) => {
  const { id } = req.params;

  const scholarship = await Scholarship.findById(id)
    .populate('collegeIds', 'name location website')
    .populate('courseIds', 'name fullName level duration');

  if (!scholarship) {
    return res.status(404).json({
      success: false,
      message: 'Scholarship not found',
    });
  }

  res.json({
    success: true,
    data: scholarship,
  });
};

export const getScholarshipsByCollege = async (req, res) => {
  const { collegeId } = req.params;

  const scholarships = await Scholarship.find({
    status: 'Active',
    collegeIds: { $in: [collegeId] },
    applicationDeadline: { $gte: new Date() },
  })
    .populate('courseIds', 'name fullName level')
    .sort({ applicationDeadline: 1 });

  res.json({
    success: true,
    data: scholarships,
    count: scholarships.length,
  });
};

export const applyForScholarship = async (req, res) => {
  const { scholarshipId } = req.params;
  const userId = req.user.id;
  const applicationData = req.body;

  const scholarship = await Scholarship.findOne({
    _id: scholarshipId,
    status: 'Active',
  });

  if (!scholarship) {
    return res.status(404).json({
      success: false,
      message: 'Scholarship not found or inactive',
    });
  }

  if (new Date() > scholarship.applicationDeadline) {
    return res.status(400).json({
      success: false,
      message: 'Application deadline has passed',
    });
  }

  const existingApplication = await ScholarshipApplication.findOne({
    userId,
    scholarshipId,
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this scholarship',
    });
  }

  const application = new ScholarshipApplication({
    ...payload,
    documents: payload.documents || [],
    statusHistory: [
      {
        status: 'Submitted',
        updatedAt: new Date(),
      },
    ],
  });

  await application.save();

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: {
      applicationId: application.applicationId,
      applicationNumber: application._id,
    },
  });
};


export const getUserApplications = async (req, res) => {
  const userId = req.user.id;

  const applications = await ScholarshipApplication.find({ userId })
    .populate('scholarshipId', 'name provider amount type applicationDeadline')
    .populate('collegeId', 'name location')
    .populate('courseId', 'name fullName')
    .sort({ appliedAt: -1 });

  res.json({
    success: true,
    data: applications,
  });
};


export const getApplicationById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (isObjectId) {
    query._id = id;
  } else {
    query.applicationId = id;
  }

  const application = await ScholarshipApplication.findOne(query)
    .populate('scholarshipId')
    .populate('collegeId', 'name location website')
    .populate('courseId', 'name fullName level');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  res.json({
    success: true,
    data: application,
  });
};
