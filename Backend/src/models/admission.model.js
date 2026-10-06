import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ['Missing', 'Uploaded', 'Under Review', 'Accepted', 'Rejected', 'Replacement Required'],
    default: 'Uploaded'
  },
  remark: { type: String }
}, { _id: true });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const academicHistorySchema = new mongoose.Schema({
  institutionName: { type: String },
  institutionType: { type: String },
  country: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  qualification: { type: String },
  fieldOfStudy: { type: String },
  graduationStatus: { type: String },
  grade: { type: String },
}, { _id: true });

const workExperienceSchema = new mongoose.Schema({
  organizationName: { type: String },
  jobTitle: { type: String },
  employmentType: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  responsibilities: { type: String },
}, { _id: true });

const admissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicationNumber: { type: String, unique: true, sparse: true },

    // Step 1: Program Selection
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    academicYear: { type: String },
    intake: { type: String },
    campus: { type: String },
    studyMode: { type: String },

    // Step 2: Personal Information
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    preferredName: { type: String },
    dob: { type: Date },
    gender: { type: String },
    nationality: { type: String },
    countryOfBirth: { type: String },
    governmentId: { type: String },
    maritalStatus: { type: String },
    profilePhotoUrl: { type: String },

    // Step 3: Contact Information
    primaryEmail: { type: String },
    alternateEmail: { type: String },
    primaryPhone: { type: String },
    alternatePhone: { type: String },
    residentialAddress: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    mailingAddressSame: { type: Boolean, default: true },
    mailingAddress: { type: String },

    // Step 4: Emergency Contact
    emergencyFullName: { type: String },
    emergencyRelationship: { type: String },
    emergencyPhone: { type: String },
    emergencyEmail: { type: String },
    emergencyAddress: { type: String },

    // Step 5: Academic History
    academicHistory: [academicHistorySchema],

    // Step 6: Work Experience
    workExperience: [workExperienceSchema],

    // Step 7: Additional Information
    referralSource: { type: String },
    previouslyApplied: { type: Boolean, default: false },
    applyingForFinancialAid: { type: Boolean, default: false },
    requiresAccommodation: { type: Boolean, default: false },
    accessibilityDetails: { type: String },
    internationalApplicant: { type: Boolean, default: false },
    requiresVisaSupport: { type: Boolean, default: false },

    // Step 8: Documents
    documents: [documentSchema],

    // Step 9: Personal Statement
    personalStatement: { type: String },

    // State Tracking & Payment
    currentStep: { type: Number, default: 1 },
    progressPercent: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    netPayable: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Pending', 'Processing', 'Paid', 'Failed'], default: 'Pending' },

    // Workflow
    status: {
      type: String,
      enum: [
        "DRAFT",
        "IN_PROGRESS",
        "PAYMENT_PENDING",
        "SUBMITTED",
        "UNDER_REVIEW",
        "CHANGES_REQUESTED",
        "APPROVED",
        "REJECTED",
        "WAITLISTED",
        "OFFER_ACCEPTED",
        "ENROLLED",
        "WITHDRAWN",
      ],
      default: "DRAFT",
    },

    statusHistory: [statusHistorySchema],
    adminNotes: { type: String },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    submittedAt: { type: Date },
    admissionDate: { type: Date },

    // Keeping legacy fields so we don't break old frontend completely until we migrate it
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    admissionYear: { type: Number },
  },
  {
    timestamps: true,
  }
);



export default mongoose.model("Admission", admissionSchema);
