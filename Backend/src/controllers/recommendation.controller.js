
import mongoose from 'mongoose';
import User from '../models/user.model.js';

import {
  generateRecommendations,
  saveRecommendations,
  getSavedRecommendations,
  serializeCourse,
  serializeCollege,
  getMissingProfileFields,
  isProfileReady,
} from '../services/recommendation.service.js';

const getUser = (req) => User.findById(req.user.id || req.user._id);

const getProfile = (user) => user.personalization?.toObject?.() || {};

const stringFields = [
  'qualification',
  'passingYear',
  'category',
  'gender',
  'quota',
  'preferredState',
  'preferredCity',
  'budgetRange',
];

const numberFields = [
  'tenthPercentage',
  'twelfthPercentage',
  'graduationPercentage',
  'score',
  'rank',
  'percentile',
  'budgetAmount',
];

const idFields = ['examId', 'examSessionId', 'careerInterest'];

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const toId = (value) => {
  const id = String(value || '').trim();

  return mongoose.isValidObjectId(id) ? id : null;
};

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const toIdList = (value) => {
  return toList(value).filter((id) => mongoose.isValidObjectId(id));
};

const createProfile = (body = {}) => {
  const profile = {};

  stringFields.forEach((field) => {
    if (field in body) {
      profile[field] = String(body[field] || '').trim();
    }
  });

  numberFields.forEach((field) => {
    if (field in body) {
      profile[field] = toNumber(body[field]);
    }
  });

  idFields.forEach((field) => {
    if (field in body) {
      profile[field] = toId(body[field]);
    }
  });

  if ('subjects' in body) {
    profile.subjects = toList(body.subjects);
  }

  if ('preferredCourseIds' in body) {
    profile.preferredCourseIds = toIdList(body.preferredCourseIds);
  }

  if ('preferredCollegeIds' in body) {
    profile.preferredCollegeIds = toIdList(body.preferredCollegeIds);
  }

  return profile;
};

const profileData = (user) => {
  const profile = getProfile(user);

  return {
    profile,
    ready: isProfileReady(profile),
    missing: getMissingProfileFields(profile),
    lastUpdated: profile.updatedAt || null,
  };
};

const emptyResponse = (profile, fields) => ({
  ready: false,
  missing: getMissingProfileFields(profile),
  generatedAt: null,
  ...Object.fromEntries(fields.map((field) => [field, []])),
});

const courses = (result) => result.courses.map(serializeCourse);
const colleges = (result) => result.colleges.map(serializeCollege);

const generateAndSave = async (user) => {
  const result = await generateRecommendations(getProfile(user));

  if (result.ready) {
    await saveRecommendations(user._id, result);
  }

  return result;
};


// GET PROFILE
export const getMyProfile = async (req, res) => {
  const user = await getUser(req);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(profileData(user));
};


// UPDATE PROFILE
export const updateMyProfile = async (req, res) => {
  const user = await getUser(req);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const profile = {
    ...getProfile(user),
    ...createProfile(req.body),
    updatedAt: new Date(),
  };

  user.set('personalization', profile);

  await user.save();

  const result = await generateAndSave(user);

  res.json({
    message: 'Profile saved',
    ...profileData(user),
    generatedAt: result.generatedAt,
    courses: courses(result),
    colleges: colleges(result),
  });
};


export const getMyRecommendations = async (req, res) => {
  try {
    const user = await getUser(req);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = getProfile(user);

    if (!isProfileReady(profile)) {
      return res.json(emptyResponse(profile, ['courses', 'colleges']));
    }

    const result = await generateRecommendations(profile);

    saveRecommendations(user._id, result).catch(console.error);

    res.json({
      ready: true,
      missing: result.missing,
      generatedAt: result.generatedAt,
      courses: result.courses,
      colleges: result.colleges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};;


const getSingleRecommendations = (type, limits) => async (req, res) => {
  const user = await getUser(req);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const profile = getProfile(user);

  if (!isProfileReady(profile)) {
    return res.json(emptyResponse(profile, [type]));
  }

  const result = await generateRecommendations(profile, limits);

  res.json({
    ready: true,
    missing: getMissingProfileFields(profile),
    generatedAt: result.generatedAt,
    [type]:
      type === 'courses'
        ? courses(result)
        : colleges(result),
  });
};

export const getMyCourseRecommendations = getSingleRecommendations(
  'courses',
  { courses: 20, colleges: 0 }
);

export const getMyCollegeRecommendations = getSingleRecommendations(
  'colleges',
  { courses: 0, colleges: 20 }
);


export const removeRecommendation = async (req, res) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { type, id } = req.params;

    if (!user.personalization) {
      user.personalization = {};
    }

    if (!user.personalization.hiddenRecommendations) {
      user.personalization.hiddenRecommendations = [];
    }

    if (!user.personalization.hiddenRecommendations.includes(id)) {
      user.personalization.hiddenRecommendations.push(id);
      await user.save();
    }

    res.json({ success: true, message: 'Recommendation removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

