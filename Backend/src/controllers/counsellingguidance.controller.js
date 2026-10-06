
import bcrypt from 'bcryptjs';
import Counselling from '../models/counselling.model.js';
import User from '../models/user.model.js';
import {
  generateRecommendations,
  serializeCourse,
  serializeCollege,
} from '../services/recommendation.service.js';

const pushStatusHistory = (doc, status, note = '', changedBy = null) => {
  doc.statusHistory = doc.statusHistory || [];
  doc.statusHistory.push({
    status,
    note,
    changedBy,
    changedAt: new Date()
  });
};

// Student

export const createRequest = async (req, res) => {
  let request = await Counselling.findOne({
    studentId: req.user.id || req.user._id
  });

  if (request) {
    Object.assign(request, req.body);
  } else {
    request = new Counselling({
      ...req.body,
      studentId: req.user.id || req.user._id,
      status: 'Requested',
      counsellingNumber: 'CNSL-' + Date.now(),
      statusHistory: []
    });

    pushStatusHistory(
      request,
      'Requested',
      'Counselling request submitted',
      req.user.id || req.user._id
    );
  }

  await request.save();

  res.json({ request: await repopulate(request) });
};

const counsellingPopulate = [
  'studentId',
  'counsellorId',
  'courseId',
  'examId',
  'guidance.collegeSuggestions.collegeId',
  'guidance.courseSuggestions.courseId',
  'guidance.examGuidance.examId',
  'guidance.collegeComparison.collegeId',
  'recommendations.collegeId',
  'recommendations.courseId'
];

const repopulate = async (request) =>
  request
    ? await Counselling.findById(request._id).populate(counsellingPopulate)
    : null;

export const getMyRequests = async (req, res) => {
  const requests = await Counselling.find({
    studentId: req.user.id || req.user._id
  }).populate(counsellingPopulate);

  res.json({ requests });
};

export const getRequestById = async (req, res) => {
  const request = await Counselling.findById(req.params.id).populate(
    counsellingPopulate
  );

  res.json({ request });
};

export const updateRequest = async (req, res) => {
  const request = await Counselling.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ request: await repopulate(request) });
};

// Admin

export const getAllRequests = async (req, res) => {
  const filter = {};

  if (req.query.status && req.query.status !== 'All') {
    filter.status = req.query.status;
  }
  const requests = await Counselling.find(filter).populate(
    counsellingPopulate
  );

  res.json({ requests });
};

export const assignCounsellor = async (req, res) => {
  const { counsellorId } = req.body;

  if (!counsellorId) {
    return res.status(400).json({
      message: 'Guidance Person is required'
    });
  }

  const counsellor = await User.findById(counsellorId).select('name');
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  request.counsellorId = counsellorId;
  request.status = 'Assigned';

  pushStatusHistory(
    request,
    'Assigned',
    `Guidance Person assigned: ${counsellor?.name || ''}`,
    req.user.id
  );

  await request.save();

  res.json({
    message: 'Guidance Person assigned successfully',
    request: await repopulate(request)
  });
};

export const updateStatus = async (req, res) => {
  const { status, note } = req.body;
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  if (status !== request.status) {
    pushStatusHistory(
      request,
      status,
      note || '',
      req.user.id
    );
  }

  request.status = status;

  await request.save();

  res.json({
    message: 'Status updated',
    request: await repopulate(request)
  });
};

export const scheduleSession = async (req, res) => {
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  Object.assign(request, req.body);
  request.status = 'Scheduled';

  pushStatusHistory(
    request,
    'Scheduled',
    'Session scheduled',
    req.user.id
  );

  await request.save();

  res.json({ request: await repopulate(request) });
};

export const completeSession = async (req, res) => {
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  Object.assign(request, req.body);
  request.status = 'Completed';

  pushStatusHistory(
    request,
    'Completed',
    'Session completed',
    req.user.id
  );

  await request.save();

  res.json({ request: await repopulate(request) });
};

export const setFollowUp = async (req, res) => {
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  request.followUpTasks.push({
    task: req.body.followUpNote || 'Follow up',
    dueDate: req.body.followUpDate,
    assignedTo: 'Student'
  });

  request.status = 'Follow-up Required';

  pushStatusHistory(
    request,
    'Follow-up Required',
    req.body.followUpNote || '',
    req.user.id
  );

  await request.save();

  res.json({ request: await repopulate(request) });
};

export const closeCounselling = async (req, res) => {
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  request.closingNote = req.body.closingNote;
  request.status = 'Closed';
  request.closedAt = new Date();
  request.closedBy = req.user.id || req.user._id;

  pushStatusHistory(
    request,
    'Closed',
    req.body.closingNote || '',
    req.user.id
  );

  await request.save();

  res.json({
    message: 'Counselling closed',
    request: await repopulate(request)
  });
};

export const addRecommendations = async (req, res) => {
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  if (req.body.recommendations) {
    request.recommendations.push(...req.body.recommendations);

    pushStatusHistory(
      request,
      'Recommendation Added',
      `Added ${req.body.recommendations.length} college recommendation(s)`,
      req.user.id || req.user._id
    );
  }

  await request.save();

  res.json({ request: await repopulate(request) });
};

/**
 * Personalised recommendations for the Counselling Wizard.
 *
 * The route (POST /api/counselling/recommend) and the response shape are kept
 * exactly as they were, but the scoring is no longer done here. It is delegated
 * to the shared recommendation engine so there is only ONE source of truth.
 *
 * The request body is merged over the student's saved personalization profile,
 * so the wizard personalises immediately from what the student just typed while
 * still respecting anything already saved.
 *
 * Nothing is written to the Counselling document here - the manual
 * `recommendations` array there stays owned by the counsellor/admin.
 */
export const getRecommendations = async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id).select(
    'personalization'
  );

  const saved =
    user?.personalization?.toObject
      ? user.personalization.toObject()
      : user?.personalization || {};

  const body = req.body || {};
  const bodyProfile = {};
  const copyIfPresent = (key, target = key) => {
    if (body[key] !== undefined && body[key] !== '') bodyProfile[target] = body[key];
  };

  copyIfPresent('qualification');
  copyIfPresent('tenthPercentage');
  copyIfPresent('twelfthPercentage');
  copyIfPresent('graduationPercentage');
  copyIfPresent('passingYear');
  copyIfPresent('subjects');
  copyIfPresent('score');
  copyIfPresent('rank');
  copyIfPresent('category');
  copyIfPresent('gender');
  copyIfPresent('preferredState');
  copyIfPresent('preferredCity');
  copyIfPresent('budgetRange');
  copyIfPresent('careerInterest');
  copyIfPresent('examId');

  if (body.courseId) bodyProfile.preferredCourseIds = [body.courseId];

  const profile = { ...saved, ...bodyProfile };

  // The wizard treats course and career as optional, so intent is not required
  // here and the score floor is lowered: a student who only answered the
  // mandatory questions can still max out around 22/100, and they should see
  // real results rather than an empty page, exactly as before this engine.
  const result = await generateRecommendations(profile, {
    requireIntent: false,
    minScore: 1,
  });

  // Keep the exact shape the Counselling Wizard already consumes.
  res.json({
    courses: result.courses.map(serializeCourse),
    colleges: result.colleges.map(serializeCollege),
  });
};

// Guidance Person Management

export const getAllCounsellors = async (req, res) => {
  const counsellors = await User.find({
    role: 'Counsellor'
  }).select('-password');

  res.json({ counsellors });
};

export const getActiveCounsellors = async (req, res) => {
  const counsellors = await User.find({
    role: 'Counsellor',
    isActive: true
  }).select('-password');

  res.json({ counsellors });
};

export const createCounsellor = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    image,
    expertise
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }

  const existing = await User.findOne({
    email: email.toLowerCase()
  });

  if (existing) {
    return res.status(400).json({
      message: 'Email already in use'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const counsellor = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    phone: phone || '',
    image: image || '',
    role: 'Counsellor',
    expertise: expertise
      ? Array.isArray(expertise)
        ? expertise
        : [expertise]
      : [],
    isActive: true
  });

  res.status(201).json({
    counsellor: {
      ...counsellor.toObject(),
      password: undefined
    }
  });
};

export const updateCounsellor = async (req, res) => {
  const {
    name,
    email,
    phone,
    image,
    expertise
  } = req.body;

  const updates = {};

  if (name) updates.name = name.trim();
  if (email) updates.email = email.toLowerCase();
  if (phone !== undefined) updates.phone = phone;
  if (image !== undefined) updates.image = image;
  if (expertise !== undefined) {
    updates.expertise = Array.isArray(expertise)
      ? expertise
      : [expertise];
  }

  const counsellor = await User.findByIdAndUpdate(
    req.params.id,
    updates,
   
  ).select('-password');

  if (!counsellor) {
    return res.status(404).json({
      message: 'Guidance Person not found'
    });
  }

  res.json({ counsellor });
};

export const toggleCounsellorStatus = async (req, res) => {
  const counsellor = await User.findById(req.params.id);

  if (!counsellor) {
    return res.status(404).json({
      message: 'Guidance Person not found'
    });
  }

  counsellor.isActive = !counsellor.isActive;

  await counsellor.save();

  res.json({
    counsellor: {
      ...counsellor.toObject(),
      password: undefined
    }
  });
};

// Guidance Person Side

export const getMyAssignedRequests = async (req, res) => {
  const requests = await Counselling.find({
    counsellorId: req.user.id || req.user._id
  }).populate(counsellingPopulate);

  res.json({ requests });
};

export const saveGuidance = async (req, res) => {
  const {
    collegeSuggestions,
    courseSuggestions,
    examGuidance,
    collegeComparison,
    finalRecommendation,
    counsellorNotes
  } = req.body;

  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  const counsellorId = req.user.id || req.user._id;

  if (String(request.counsellorId) !== String(counsellorId)) {
    return res.status(403).json({
      message: 'Not authorized'
    });
  }

  request.guidance = {
    collegeSuggestions: collegeSuggestions || [],
    courseSuggestions: courseSuggestions || [],
    examGuidance: examGuidance || [],
    collegeComparison: collegeComparison || [],
    finalRecommendation: finalRecommendation || '',
    counsellorNotes: counsellorNotes || ''
  };

  if (request.status === 'Assigned') {
    request.status = 'In Progress';

    pushStatusHistory(
      request,
      'In Progress',
      'Guidance Person started working on this request',
      counsellorId
    );
  }

  await request.save();

  res.json({
    message: 'Guidance saved successfully',
    request: await repopulate(request)
  });
};

export const markCompleted = async (req, res) => {
  const request = await Counselling.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Request not found'
    });
  }

  const counsellorId = req.user.id || req.user._id;

  if (String(request.counsellorId) !== String(counsellorId)) {
    return res.status(403).json({
      message: 'Not authorized'
    });
  }

  request.status = 'Completed';

  pushStatusHistory(
    request,
    'Completed',
    'Guidance provided and counselling completed',
    counsellorId
  );

  await request.save();

  res.json({
    message: 'Counselling marked as completed',
    request: await repopulate(request)
  });
};

// Admin - Delete Guidance Person
export const deleteCounsellor = async (req, res) => {
  const counsellor = await User.findByIdAndDelete(req.params.id);

  if (!counsellor) {
    return res.status(404).json({
      message: 'Guidance Person not found'
    });
  }

  // Also unassign from any counselling requests
  await Counselling.updateMany(
    { counsellorId: req.params.id },
    { $set: { counsellorId: null, status: 'Requested' } }
  );

  res.json({ message: 'Guidance Person deleted successfully' });
};

// Admin - Delete Counselling Request
export const deleteCounsellingRequest = async (req, res) => {
  const request = await Counselling.findByIdAndDelete(req.params.id);

  if (!request) {
    return res.status(404).json({
      message: 'Counselling request not found'
    });
  }

  res.json({ message: 'Counselling request deleted successfully' });
};

