import mongoose from 'mongoose';
import College from '../models/college.model.js';
import Course from '../models/course.model.js';
import Career from '../models/career.model.js';
import Recommendation from '../models/recommendation.model.js';

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || '')) && String(value).length === 24;

export const getMissingProfileFields = (profile = {}) => {
  const missing = [];
  if (!profile.preferredState) missing.push('Preferred state');
  if (!profile.careerInterest && !(profile.preferredCourseIds || []).length) missing.push('Career interest or Preferred course');
  return missing;
};

export const isProfileReady = (profile = {}) => {
  return true; // Always return true so it doesn't block the screen
};

export const serializeCourse = (course) => ({
  _id: course._id,
  name: course.name,
  fullName: course.fullName,
  stream: course.stream,
  level: course.level,
  duration: course.duration,
  fees: course.fees,
  eligibilityCriteria: course.eligibilityCriteria || []
});

export const serializeCollege = (college) => ({
  _id: college._id,
  name: college.name,
  collegeName: college.collegeName,
  collegeType: college.collegeType,
  type: college.type,
  location: college.location,
  rating: college.rating,
  images: college.images,
  logo: college.logo,
  courses: (college.courses || []).slice(0, 1) // Just basic info
});

export const generateRecommendations = async (profile = {}, { limit = { courses: 6, colleges: 10 } } = {}) => {
  const missing = getMissingProfileFields(profile);
  const ready = isProfileReady(profile);

  if (!ready) {
    return { ready: false, missing, courses: [], colleges: [], generatedAt: null };
  }

  // 1. Resolve basic intents
  let targetCourseIds = (profile.preferredCourseIds || []).filter(isObjectId);
  let careerStream = null;

  if (isObjectId(profile.careerInterest)) {
    const career = await Career.findById(profile.careerInterest).lean();
    if (career) {
      careerStream = career.stream || career.name;
      if (!targetCourseIds.length && career.relatedCourses) {
        targetCourseIds = career.relatedCourses.filter(isObjectId);
      }
    }
  }

  const hiddenIds = profile.hiddenRecommendations || [];

  // 2. Fetch Courses (Simple Matching)
  let courseQuery = { status: 'Active' };
  
  if (targetCourseIds.length > 0) {
    courseQuery._id = { $in: targetCourseIds };
  } else if (careerStream) {
    courseQuery.$or = [
      { stream: new RegExp(careerStream, 'i') },
      { name: new RegExp(careerStream, 'i') }
    ];
  }

  if (hiddenIds.length > 0) {
    courseQuery._id = courseQuery._id || {};
    courseQuery._id.$nin = hiddenIds;
  }

  const rawCourses = await Course.find(courseQuery).limit(limit.courses).lean();
  const courses = rawCourses.map(serializeCourse);

  // 3. Fetch Colleges (Simple Matching)
  let collegeQuery = {};
  let orConditions = [];

  // Match Location
  if (profile.preferredState) {
    orConditions.push({ 'location.state': new RegExp(profile.preferredState, 'i') });
  }
  if (profile.preferredCity) {
    orConditions.push({ 'location.city': new RegExp(profile.preferredCity, 'i') });
  }

  // Match Courses
  const resolvedCourseIds = rawCourses.map(c => c._id);
  if (resolvedCourseIds.length > 0) {
    orConditions.push({ courses: { $in: resolvedCourseIds } });
  }

  if (orConditions.length > 0) {
    collegeQuery.$or = orConditions;
  }

  if (hiddenIds.length > 0) {
    collegeQuery._id = { $nin: hiddenIds };
  }

  const rawColleges = await College.find(collegeQuery)
    .populate('courses', 'name fees')
    .limit(limit.colleges)
    .lean();
    
  const colleges = rawColleges.map(serializeCollege);

  return {
    ready: true,
    missing,
    courses,
    colleges,
    generatedAt: new Date()
  };
};

export const saveRecommendations = async (userId, data) => {
  if (!isObjectId(userId)) return null;

  const doc = await Recommendation.findOneAndUpdate(
    { userId },
    {
      userId,
      courses: data.courses.map((c) => c._id),
      colleges: data.colleges.map((c) => c._id),
      generatedAt: data.generatedAt || new Date(),
    },
    { upsert: true, returnDocument: 'after' }
  );

  return doc;
};

export const getSavedRecommendations = async (userId) => {
  if (!isObjectId(userId)) return null;
  return Recommendation.findOne({ userId }).lean();
};

