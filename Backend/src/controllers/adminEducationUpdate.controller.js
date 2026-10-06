import EducationUpdate from '../models/educationUpdate.model.js';
import EducationAlert from '../models/educationAlert.model.js';
import UserUpdate from '../models/userUpdate.model.js';

const RELATED_FIELDS = [
  { path: 'examId', select: 'name shortName' },
  { path: 'collegeId', select: 'name location' },
  { path: 'courseId', select: 'name fullName level' },
  { path: 'scholarshipId', select: 'name provider amount' },
];


const ALERT_TYPE_BY_CATEGORY = {
  'Exam Update': 'Exam Alert',
  'Admission Update': 'Admission Alert',
  'College Update': 'College Alert',
  'Scholarship Update': 'Scholarship Alert',
  Result: 'Result Alert',
  Counselling: 'Counselling Alert',
  'Application Deadline': 'Deadline Alert',
  'Course Update': 'General Education Alert',
  Announcement: 'General Education Alert',
  'Education News': 'General Education Alert',
};

// An important published update gets one matching alert, never more than one
const createAlertForUpdate = async (update, adminId) => {
  if (!update.isImportant || update.status !== 'Published') return;

  const existingAlert = await EducationAlert.findOne({ updateId: update._id });

  if (existingAlert) return;

  await EducationAlert.create({
    title: update.title,
    message: update.shortDescription,
    type:
      ALERT_TYPE_BY_CATEGORY[update.category] || 'General Education Alert',
    updateId: update._id,
    examId: update.examId?._id,
    collegeId: update.collegeId?._id,
    courseId: update.courseId?._id,
    scholarshipId: update.scholarshipId?._id,
    priority: 'IMPORTANT',
    startDate: new Date(),
    expiryDate: update.deadline,
    status: 'ACTIVE',
    createdBy: adminId,
  });
};

export const getAdminEducationUpdates = async (req, res) => {
  const { search, category, status } = req.query;

  const query = {};

  if (category) query.category = category;
  if (status) query.status = status;

  if (search) {
    const keyword = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );

    query.title = keyword;
  }

  const updates = await EducationUpdate.find(query)
    .populate(RELATED_FIELDS)
    .populate('createdBy', 'name email')


  res.json({
    success: true,
    data: updates,
  });
};

export const createEducationUpdate = async (req, res) => {
  const update = await EducationUpdate.create({
    ...req.body,
    createdBy: req.user.id,
  });

  const published = await EducationUpdate.findById(update._id).populate(
    RELATED_FIELDS
  );

  await createAlertForUpdate(published, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Update created successfully',
    data: published,
  });
};

export const updateEducationUpdate = async (req, res) => {
  const { _id, createdAt, updatedAt, createdBy, ...updateData } = req.body;

  const update = await EducationUpdate.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { returnDocument: 'after' }
  ).populate(RELATED_FIELDS);

  if (!update) {
    return res.status(404).json({
      success: false,
      message: 'Update not found',
    });
  }

  await createAlertForUpdate(update, req.user.id);

  res.json({
    success: true,
    message: 'Update saved successfully',
    data: update,
  });
};

export const deleteEducationUpdate = async (req, res) => {
  await EducationUpdate.findByIdAndDelete(req.params.id);
  await EducationAlert.deleteMany({ updateId: req.params.id });
  await UserUpdate.deleteMany({ updateId: req.params.id });

  res.json({
    success: true,
    message: 'Update deleted successfully',
  });
};

export const getAdminAlerts = async (req, res) => {
  const { type, status, priority } = req.query;

  const query = {};

  if (type) query.type = type;
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const alerts = await EducationAlert.find(query)
    .populate(RELATED_FIELDS)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: alerts,
  });
};

export const createAlert = async (req, res) => {
  const alert = await EducationAlert.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Alert created successfully',
    data: alert,
  });
};

export const updateAlert = async (req, res) => {
  const { _id, createdAt, updatedAt, createdBy, ...alertData } = req.body;

  const alert = await EducationAlert.findByIdAndUpdate(
    req.params.id,
    { $set: alertData },
    { returnDocument: 'after' }
  );

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found',
    });
  }

  res.json({
    success: true,
    message: 'Alert updated successfully',
    data: alert,
  });
};

export const deleteAlert = async (req, res) => {
  await EducationAlert.findByIdAndDelete(req.params.id);
  await UserUpdate.deleteMany({ alertId: req.params.id });

  res.json({
    success: true,
    message: 'Alert deleted successfully',
  });
};
