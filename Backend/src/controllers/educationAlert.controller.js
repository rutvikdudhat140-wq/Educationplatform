import EducationAlert from '../models/educationAlert.model.js';
import UserUpdate from '../models/userUpdate.model.js';

const ALERT_RELATED_FIELDS = [
  { path: 'updateId', select: 'title category' },
  { path: 'examId', select: 'name shortName' },
  { path: 'collegeId', select: 'name location' },
  { path: 'courseId', select: 'name fullName level' },
  { path: 'scholarshipId', select: 'name provider amount' },
];

const ALERT_TYPES = [
  'Exam Alert',
  'Admission Alert',
  'Scholarship Alert',
  'Result Alert',
  'Deadline Alert',
  'Counselling Alert',
  'College Alert',
  'General Education Alert',
];

export const getEducationAlerts = async (req, res) => {
  const userId = req.user.id;
  const { type, priority, search, read } = req.query;
  const now = new Date();

  const conditions = [
    { status: 'ACTIVE' },
    { startDate: { $lte: now } },
    { $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }] },
  ];

  if (type) conditions.push({ type: { $in: type.split(',') } });
  if (priority) conditions.push({ priority });

  if (search) {
    const keyword = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );

    conditions.push({
      $or: [{ title: keyword }, { message: keyword }],
    });
  }

  const alerts = await EducationAlert.find({ $and: conditions })
    .populate(ALERT_RELATED_FIELDS)
    .sort({ priority: -1, startDate: -1 });

  const readRecords = await UserUpdate.find({ userId, alertId: { $ne: null } });

  const readMap = new Map(
    readRecords.map((record) => [record.alertId.toString(), record.read])
  );

  let data = alerts.map((alert) => ({
    ...alert.toObject(),
    read: readMap.get(alert._id.toString()) || false,
  }));

  // Read state lives in the per-user collection, so it is filtered here.
  if (read === 'true') {
    data = data.filter((alert) => alert.read);
  }

  if (read === 'false') {
    data = data.filter((alert) => !alert.read);
  }

  res.json({
    success: true,
    data,
    meta: {
      total: data.length,
      unread: data.filter((alert) => !alert.read).length,
      important: data.filter((alert) => alert.priority === 'IMPORTANT').length,
      types: ALERT_TYPES.filter((item) =>
        data.some((alert) => alert.type === item)
      ),
    },
  });
};

export const markAlertAsRead = async (req, res) => {
  const userId = req.user.id;
  const alertId = req.params.id;

  const record = await UserUpdate.findOneAndUpdate(
    { userId, alertId },
    { $set: { read: true, readAt: new Date() } },
    { returnDocument: 'after', upsert: true }
  );

  res.json({
    success: true,
    message: 'Alert marked as read',
    data: record,
  });
};

export const getUnreadAlertCount = async (req, res) => {
  const userId = req.user.id;
  const now = new Date();

  const alerts = await EducationAlert.find({
    status: 'ACTIVE',
    startDate: { $lte: now },
    $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
  }).select('_id');

  const alertIds = alerts.map((alert) => alert._id);

  const readRecords = await UserUpdate.find({
    userId,
    alertId: { $in: alertIds },
    read: true,
  });

  res.json({
    success: true,
    data: { count: alertIds.length - readRecords.length },
  });
};
