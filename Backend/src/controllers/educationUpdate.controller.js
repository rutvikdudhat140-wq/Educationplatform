import jwt from 'jsonwebtoken';
import EducationUpdate from '../models/educationUpdate.model.js';
import EducationAlert from '../models/educationAlert.model.js';
import UserUpdate from '../models/userUpdate.model.js';
import College from '../models/college.model.js';

const RELATED_FIELDS = [
  { path: 'examId', select: 'name shortName' },
  { path: 'collegeId', select: 'name location website' },
  { path: 'courseId', select: 'name fullName level' },
  { path: 'scholarshipId', select: 'name provider amount' },
];

// News is public, so a token is optional here. It only decides whether the
// Save button starts in the saved or unsaved state.
const getOptionalUserId = (req) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secretkey').id;
  } catch (error) {
    return null;
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_OPTIONS = {
  latest: { publishedAt: -1 },
  oldest: { publishedAt: 1 },
  title: { title: 1 },
};

export const getEducationUpdates = async (req, res) => {
  const {
    search,
    category,
    examId,
    collegeId,
    courseId,
    scholarshipId,
    isImportant,
    state,
    from,
    to,
    sort,
    page,
    limit,
  } = req.query;

  // Every active filter is pushed as its own condition so that two
  // conditions can never overwrite each other's $or.
  const conditions = [{ status: 'Published' }];

  if (search) {
    const keyword = new RegExp(escapeRegex(search), 'i');

    conditions.push({
      $or: [
        { title: keyword },
        { shortDescription: keyword },
        { content: keyword },
      ],
    });
  }

  if (category && category !== 'All') conditions.push({ category });
  if (examId) conditions.push({ examId });
  if (collegeId) conditions.push({ collegeId });
  if (courseId) conditions.push({ courseId });
  if (scholarshipId) conditions.push({ scholarshipId });
  if (isImportant === 'true') conditions.push({ isImportant: true });

  // The state filter runs through the related college records.
  if (state && state !== 'All') {
    const collegeIds = await College.find({
      'location.state': state,
    }).distinct('_id');

    conditions.push({ collegeId: { $in: collegeIds } });
  }

  if (from || to) {
    const publishedAt = {};

    if (from) publishedAt.$gte = new Date(from);
    if (to) publishedAt.$lte = new Date(to);

    conditions.push({ publishedAt });
  }

  const query = { $and: conditions };

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (currentPage - 1) * perPage;

  const total = await EducationUpdate.countDocuments(query);

  let updates;

  if (sort === 'deadline') {
    // Updates without a deadline are pushed to the end so the nearest
    // deadline always comes first.
    const ordered = await EducationUpdate.aggregate([
      { $match: query },
      {
        $addFields: {
          deadlineSort: {
            $ifNull: ['$deadline', new Date('2999-12-31T00:00:00.000Z')],
          },
        },
      },
      { $sort: { deadlineSort: 1, publishedAt: -1 } },
      { $skip: skip },
      { $limit: perPage },
    ]);

    const orderedIds = ordered.map((item) => item._id);

    const populated = await EducationUpdate.find({
      _id: { $in: orderedIds },
    }).populate(RELATED_FIELDS);

    const byId = new Map(
      populated.map((item) => [item._id.toString(), item])
    );

    updates = orderedIds
      .map((id) => byId.get(id.toString()))
      .filter(Boolean);
  } else {
    updates = await EducationUpdate.find(query)
      .populate(RELATED_FIELDS)
      .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.latest)
      .skip(skip)
      .limit(perPage);
  }

  const userId = getOptionalUserId(req);

  const savedRecords = userId
    ? await UserUpdate.find({ userId, updateId: { $ne: null }, saved: true })
    : [];

  const savedIds = new Set(savedRecords.map((item) => item.updateId?.toString()));

  res.json({
    success: true,
    data: updates.map((update) => ({
      ...update.toObject(),
      isSaved: savedIds.has(update._id.toString()),
    })),
    meta: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    },
  });
};

export const getEducationUpdateById = async (req, res) => {
  const update = await EducationUpdate.findById(req.params.id).populate(
    RELATED_FIELDS
  );

  if (!update) {
    return res.status(404).json({
      success: false,
      message: 'Update not found',
    });
  }

  const userId = getOptionalUserId(req);

  const saved = userId
    ? await UserUpdate.findOne({ userId, updateId: update._id, saved: true })
    : null;

  res.json({
    success: true,
    data: { ...update.toObject(), isSaved: !!saved },
  });
};

export const saveEducationUpdate = async (req, res) => {
  const userId = req.user.id;
  const updateId = req.params.id;

  const saved = await UserUpdate.findOneAndUpdate(
    { userId, updateId },
    { $set: { saved: true } },
    { returnDocument: 'after', upsert: true }
  );

  res.json({
    success: true,
    message: 'Update saved successfully',
    data: saved,
  });
};

export const removeSavedEducationUpdate = async (req, res) => {
  const userId = req.user.id;
  const updateId = req.params.id;

  await UserUpdate.findOneAndUpdate(
    { userId, updateId },
    { $set: { saved: false } },
    { returnDocument: 'after' }
  );

  res.json({
    success: true,
    message: 'Update removed from saved list',
  });
};

export const getMyUpdates = async (req, res) => {
  const userId = req.user.id;

  const savedRecords = await UserUpdate.find({ userId, saved: true })
    .populate({
      path: 'updateId',
      populate: RELATED_FIELDS,
    })
    .sort({ updatedAt: -1 });

  const savedUpdates = savedRecords
    .map((record) => record.updateId)
    .filter((update) => update);

  const now = new Date();

  const importantAlerts = await EducationAlert.find({
    priority: 'IMPORTANT',
    status: 'ACTIVE',
    startDate: { $lte: now },
    $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
  })
    .populate('updateId', 'title category')
    .sort({ startDate: -1 });

  const recentUpdates = await EducationUpdate.find({ status: 'Published' })
    .populate(RELATED_FIELDS)
    .sort({ publishedAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      savedUpdates,
      importantAlerts,
      recentUpdates,
    },
  });
};
