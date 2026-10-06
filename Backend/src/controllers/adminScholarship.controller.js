import Scholarship from '../models/scholarship.model.js';
import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import { stripEmptyValues } from '../utils/relaxedValidation.js';

export const getAllScholarshipsAdmin = async (req, res) => {
  const {type, status } = req.query;

  const query = {};

  if (type) query.type = type;
  if (status) query.status = status;

  const scholarships = await Scholarship.find(query)
    .populate('collegeIds', 'name location')
    .populate('courseIds', 'name fullName level')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: scholarships,
  });
};


export const getScholarshipByIdAdmin = async (req, res) => {
  const { id } = req.params;

  const scholarship = await Scholarship.findById(id)
    .populate('collegeIds', 'name location website')
    .populate('courseIds', 'name fullName level duration')
    .populate('createdBy', 'name email');

  res.json({
    success: true,
    data: scholarship,
  });
};


export const createScholarship = async (req, res) => {
  const adminId = req.user.id;

  const scholarshipData = stripEmptyValues(req.body);

  if (scholarshipData.eligibility?.gender === undefined) {
    scholarshipData.eligibility = { ...(scholarshipData.eligibility || {}), gender: 'All' };
  }

  const scholarship = new Scholarship({
    ...scholarshipData,
    createdBy: adminId,
  });

  await scholarship.save();

  const populatedScholarship = await Scholarship.findById(scholarship._id)
    .populate('collegeIds', 'name location')
    .populate('courseIds', 'name fullName level');

  res.status(201).json({
    success: true,
    message: 'Scholarship created successfully',
    data: populatedScholarship,
  });
};

export const updateScholarship = async (req, res) => {
  const { id } = req.params;
  const updateData = stripEmptyValues(req.body);

  const scholarship = await Scholarship.findByIdAndUpdate(
    id,
    { $set: updateData },
  )
    .populate('collegeIds', 'name location')
    .populate('courseIds', 'name fullName level');

  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }

  res.json({
    success: true,
    message: 'Scholarship updated successfully',
    data: scholarship,
  });
};

export const deleteScholarship = async (req, res) => {
  const { id } = req.params;

  const applicationCount = await ScholarshipApplication.countDocuments({
    scholarshipId: id,
  });

  if (applicationCount > 0) {
    const scholarship = await Scholarship.findByIdAndUpdate(
      id,
      { status: 'Inactive' },
    );

    return res.json({
      success: true,
      message: 'Scholarship deactivated successfully (applications exist)',
      data: scholarship,
    });
  }
  await Scholarship.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Scholarship deleted successfully',
  });
};

export const getAllApplicationsAdmin = async (req, res) => {
  const { scholarshipId, status} = req.query;

  const query = {};

  if (scholarshipId) query.scholarshipId = scholarshipId;
  if (status) query.status = status;

  const applications = await ScholarshipApplication.find(query)
    .populate('scholarshipId', 'name provider amount type')
    .populate('userId', 'name email')
    .populate('collegeId', 'name location')
    .populate('courseId', 'name fullName')

  res.json({
    success: true,
    data: applications,
  });
};


export const getApplicationByIdAdmin = async (req, res) => {
  const { id } = req.params;

  const application = await ScholarshipApplication.findOne(query)
    .populate('scholarshipId')
    .populate('userId', 'name email phone')
    .populate('collegeId', 'name location website')
    .populate('courseId', 'name fullName level')
    .populate('statusHistory.updatedBy', 'name email');

  res.json({
    success: true,
    data: application,
  });
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.user.id;

  const application = await ScholarshipApplication.findById(id);

  application.status = status;

  application.statusHistory.push({
    status,
    updatedBy: adminId,
    updatedAt: new Date(),
  });

  await application.save();

  const updatedApplication = await ScholarshipApplication.findById(id)
    .populate('scholarshipId', 'name provider')
    .populate('userId', 'name email');

  res.json({
    success: true,
    message: 'Application status updated successfully',
    data: updatedApplication,
  });
};

export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  const application = await ScholarshipApplication.findById(id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  await ScholarshipApplication.findByIdAndDelete(id);
  res.json({ success: true, message: 'Application deleted successfully' });
};
