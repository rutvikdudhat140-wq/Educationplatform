import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    shortName: {
      type: String,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Central University',
        'State University',
        'Private University',
        'Deemed University',
        'Open University',
      ],
    },

    universityType: {
      type: String,
      required: true,
      enum: ['Public', 'Private'],
    },

    establishedYear: {
      type: Number,
      min: 1000,
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },

    logo: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    officialWebsite: {
      type: String,
    },

    accreditation: {
      type: String,
    },

    recognition: {
      type: [String],
      default: [],
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      default: 'India',
    },

    pincode: {
      type: String,
    },

    campusArea: {
      type: String,
    },

    campusType: {
      type: String,
      enum: ['Urban', 'Rural', 'Semi-Urban', 'Residential'],
    },

    numberOfDepartments: {
      type: Number,
      default: 0,
    },

    numberOfFaculties: {
      type: Number,
      default: 0,
    },

    numberOfStudents: {
      type: Number,
      default: 0,
    },

    numberOfPrograms: {
      type: Number,
      default: 0,
    },

    faculties: {
      type: [String],
      default: [],
    },

    departments: {
      type: [String],
      default: [],
    },

    programTypes: {
      type: [String],
      default: [],
    },

    facilities: {
      type: [String],
      default: [],
    },

    nirfRanking: {
      type: Number,
    },

    nirfCategory: {
      type: String,
    },

    naacGrade: {
      type: String,
    },

    naacScore: {
      type: Number,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    admissionEmail: {
      type: String,
    },

    admissionPhone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model('University', universitySchema);

export default University;
