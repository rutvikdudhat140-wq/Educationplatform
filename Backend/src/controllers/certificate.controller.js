import mongoose from 'mongoose';
import Certificate from '../models/certificate.model.js';
import Counter from '../models/counter.model.js';
import User from '../models/user.model.js';

const CERTIFICATE_COUNTER_PREFIX = 'online-course-certificate';

const isDuplicateKeyError = (error) =>
  error?.code === 11000 ||
  error?.code === 11001 ||
  error?.cause?.code === 11000;

const formatDuration = (duration) => {
  const hours = Number(duration) || 0;

  if (!hours) {
    return 'Self paced';
  }

  return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
};

const getCounterKey = (year) => `${CERTIFICATE_COUNTER_PREFIX}-${year}`;

/**
 * Seeds the yearly counter from certificates that were created before the
 * counter collection existed, so upgrading never re-issues an already used ID.
 */
const seedCounterFromExisting = async (key, year) => {
  const last = await Certificate.findOne({
    certificateId: new RegExp(`^CERT-${year}-\\d+$`),
  })
    .sort({ certificateId: -1 })
    .select('certificateId')
    .lean();

  const highestSeq = last ? Number(last.certificateId.split('-')[2]) || 0 : 0;

  await Counter.updateOne({ key }, { $max: { seq: highestSeq } }, { upsert: true });
};

const buildCertificateId = async () => {
  const year = new Date().getFullYear();
  const key = getCounterKey(year);

  await seedCounterFromExisting(key, year);

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `CERT-${year}-${String(counter.seq).padStart(6, '0')}`;
};

const buildCertificatePayload = async (enrollment, course) => {
  const user = await User.findById(enrollment.userId).select('name');

  return {
    userId: enrollment.userId,
    onlineCourseId: course._id,
    studentName: user?.name || '',
    courseName: course.title,
    courseCategory: course.category || '',
    courseDuration: formatDuration(course.duration),
    instructorName: course.instructor || '',
    issuedAt: new Date(),
    completionDate: enrollment.completedAt || new Date(),
    status: 'Valid',
  };
};

export const issueCertificate = async (enrollment, course) => {
  const filter = {
    userId: enrollment.userId,
    onlineCourseId: course._id,
  };

  const existing = await Certificate.findOne(filter);

  if (existing) {
    // A revoked certificate stays revoked - re-issuing must not silently
    // reinstate it, otherwise a revoke would be undone on the next lesson click.
    if (existing.status === 'Revoked') {
      return existing;
    }

    // Keep the denormalised snapshot in sync with the latest course details.
    const payload = await buildCertificatePayload(enrollment, course);

    return Certificate.findOneAndUpdate(filter, payload, { new: true });
  }

  const payload = await buildCertificatePayload(enrollment, course);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Certificate.create({
        ...payload,
        certificateId: await buildCertificateId(),
      });
    } catch (error) {
      // Two concurrent completions (or a legacy duplicate) - the unique
      // (userId, onlineCourseId) index guarantees a single winner.
      if (isDuplicateKeyError(error) && attempt < 4) {
        const winner = await Certificate.findOne(filter);

        if (winner) {
          return winner;
        }

        continue;
      }

      throw error;
    }
  }

  return Certificate.findOne(filter);
};

export const getMyCertificates = async (req, res) => {
  try {
    const data = await Certificate.find({ userId: req.user.id })
      .populate('onlineCourseId', 'title thumbnail category level instructor')
      .sort({ issuedAt: -1 });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCertificateById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid certificate id' });
    }

    const certificate = await Certificate.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate(
      'onlineCourseId',
      'title thumbnail category level instructor'
    );

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({ data: certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Public verification endpoint - anyone holding a certificate ID can confirm
 * whether it was genuinely issued by the platform and is still valid.
 */
export const verifyCertificate = async (req, res) => {
  try {
    const certificateId = String(req.params.certificateId || '').trim();

    if (!certificateId) {
      return res.status(400).json({ message: 'Certificate id is required' });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase(),
    }).populate('userId', 'name email');

    if (!certificate) {
      return res.status(404).json({
        message: 'No certificate found for this id',
        valid: false,
      });
    }

    res.status(200).json({
      valid: certificate.status === 'Valid',
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        courseCategory: certificate.courseCategory,
        courseDuration: certificate.courseDuration,
        instructorName: certificate.instructorName,
        issuedAt: certificate.issuedAt,
        completionDate: certificate.completionDate,
        status: certificate.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminCertificates = async (req, res) => {
  try {
    const { search, status, courseId } = req.query;
    const filter = {};

    if (status && ['Valid', 'Revoked'].includes(status)) {
      filter.status = status;
    }

    if (courseId && mongoose.isValidObjectId(courseId)) {
      filter.onlineCourseId = courseId;
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escaped, 'i');

      filter.$or = [
        { certificateId: pattern },
        { studentName: pattern },
        { courseName: pattern },
      ];
    }

    const data = await Certificate.find(filter)
      .populate('userId', 'name email')
      .populate('onlineCourseId', 'title thumbnail')
      .sort({ issuedAt: -1 });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminCertificateById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid certificate id' });
    }

    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('onlineCourseId', 'title thumbnail');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({ data: certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCertificateStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid certificate id' });
    }

    const { status } = req.body;

    if (!['Valid', 'Revoked'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Valid or Revoked' });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('onlineCourseId', 'title thumbnail');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({
      message: `Certificate ${status === 'Revoked' ? 'revoked' : 'restored'}`,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
