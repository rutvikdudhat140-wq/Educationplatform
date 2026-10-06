import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    name: {
      type: String,
      required: true,

    },
    phone: {
      type: String,
      default: '',

    },
    email: {
      type: String,
      default: '',

      lowercase: true,
    },
    course: {
      type: String,
      default: '',

    },
    address: {
      type: String,
      default: '',

    },
    qualification: {
      type: String,
      default: '',

    },
    image: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,

    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'accepted', 'rejected'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ userId: 1, collegeId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
