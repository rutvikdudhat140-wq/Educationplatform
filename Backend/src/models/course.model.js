import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

    },
    fullName: {
      type: String,
      required: true,

    },
    stream: {
      type: String,

      default: '',
    },
    level: {
      type: String,
      required: true,
      enum: ['UG', 'PG', 'Diploma', 'PhD'],
      default: 'UG',
    },
    duration: {
      type: String,
      required: true,
      default: '',
    },
    fees: {
      type: Number,
      default: 0,
    },
    careerOptions: {
      type: String,
      default: '',
    },
    collegeCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    eligibilityCriteria: [{ type: String, default: '' }],
    entranceExams: [{ type: String, default: '' }],
    relatedCareers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
    }],
    topColleges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
    }],
    topUniversities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    }],
    image: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const applyLegacyAliases = (doc) => {
  if (!doc) {
    return doc;
  }

  if (!doc.name && doc.courseName) {
    doc.name = doc.courseName;
  }

  if (!doc.fullName && doc.fullCourseName) {
    doc.fullName = doc.fullCourseName;
  }

  if (typeof doc.isActive !== 'boolean') {
    doc.isActive = true;
  }

  return doc;
};

courseSchema.post('find', function (docs) {
  docs.forEach(applyLegacyAliases);
  return docs;
});

courseSchema.post('findOne', function (doc) {
  return applyLegacyAliases(doc);
});

export default mongoose.model('Course', courseSchema);
