import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    resourceUrl: { type: String, default: '' },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: false }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    order: { type: Number, default: 0 },
    lessons: { type: [lessonSchema], default: [] },
  },
  { timestamps: false }
);

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, default: '' },
    options: { type: [String], default: [] },
    correctAnswer: { type: Number, default: 0 },
  },
  { timestamps: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: '' },
    answer: { type: String, default: '' },
  },
  { timestamps: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    comment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const onlineCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    instructor: {
      type: String,
      default: '',
    },
    instructorTitle: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    studentCount: {
      type: Number,
      default: 0,
    },

    learningOutcomes: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    targetAudience: { type: [String], default: [] },
    faqs: { type: [faqSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },

    modules: { type: [moduleSchema], default: [] },

    // Final assessment (only used when hasAssessment is true)
    hasAssessment: {
      type: Boolean,
      default: false,
    },
    assessmentTitle: {
      type: String,
      default: 'Final Assessment',
    },
    passingScore: {
      type: Number,
      default: 60,
    },
    questions: { type: [questionSchema], default: [] },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

onlineCourseSchema.virtual('lessonCount').get(function () {
  return (this.modules || []).reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );
});

export default mongoose.model('OnlineCourse', onlineCourseSchema);
