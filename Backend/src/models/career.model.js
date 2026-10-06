import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stream: {
      type: String,
      trim: true,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    averageSalary: {
      type: String,
      default: '',
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryUnit: {
      type: String,
      enum: ['LPA', 'Per Month'],
      default: 'LPA',
    },
    workType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Freelance', 'Remote'],
      default: 'Full Time',
    },
    growthLevel: {
      type: String,
      default: 'Moderate',
    },
    demandLevel: {
      type: String,
      default: '',
    },
    relatedStream: {
      type: String,
      default: '',
      trim: true,
    },
    workType: {
      type: String,
      enum: ["Full Time", "Part Time", "Freelance", "Remote"],
      default: "Full Time",
    },

    salaryUnit: {
      type: String,
      enum: ["LPA", "Per Month"],
      default: "LPA",
    },
    careerPath: {
      type: String,
      default: '',
    },
    roadmaps: [{
      pathName: { type: String, required: true },
      steps: [{
        stepNumber: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String, default: '' },
        duration: { type: String, default: '' },
        skills: { type: [String], default: [] },
        recommendedExams: { type: [String], default: [] },
        recommendedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        relatedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }]
      }]
    }],
    mentors: [{
      name: { type: String, required: true },
      profilePhoto: { type: String, default: '' },
      college: { type: String, default: '' },
      graduationYear: { type: String, default: '' },
      currentRole: { type: String, default: '' },
      company: { type: String, default: '' },
      experience: { type: String, default: '' },
      about: { type: String, default: '' },
      areasOfHelp: { type: [String], default: [] }
    }],
    relatedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
    topCompanies: {
      type: [String],
      default: [],
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

const Career = mongoose.model('Career', careerSchema);

export default Career;
