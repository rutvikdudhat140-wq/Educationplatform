import mongoose from 'mongoose';
import applyRelaxedValidation from '../utils/relaxedValidation.js';

const scholarshipApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    
    // Personal Details
    personalDetails: {
      fullName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      mobile: {
        type: String,
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
      },
      address: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    
    // Academic Details
    academicDetails: {
      college: {
        type: String,
      },
      course: {
        type: String,
      },
      currentYear: {
        type: String,
      },
      admissionYear: {
        type: Number,
      },
      tenthPercentage: {
        type: String,
      },
      twelfthPercentage: {
        type: String,
      },
      currentCGPA: {
        type: String,
      },
    },
    
    // Eligibility Details
    eligibilityDetails: {
      category: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      },
      annualFamilyIncome: {
        type: String,
      },
      domicileState: {
        type: String,
      },
      disabilityStatus: {
        type: String,
        enum: ['None', 'Yes'],
        default: 'None',
      },
      otherDetails: {
        type: String,
        default: '',
      },
    },
    
    // Documents
    documents: [{
      documentType: {
        type: String,
      },
      documentUrl: {
        type: String,
      },
      documentName: {
        type: String,
      },
    }],
    
    // Application Status and Management
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Documents Verification',
        'Approved',
        'Rejected',
        'Disbursed'
      ],
      default: 'Submitted',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    
    // Status History
    statusHistory: [{
      status: {
        type: String,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Generate unique application ID before validation so required check passes
scholarshipApplicationSchema.pre('validate', function() {
  if (!this.applicationId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.applicationId = `SCH${timestamp}${random}`;
  }
});

// Clear empty strings/nulls so blank fields (e.g. courseId: "") never fail
// validation or trigger an ObjectId cast error.
applyRelaxedValidation(scholarshipApplicationSchema);

// Indexes for better performance
scholarshipApplicationSchema.index({ userId: 1 });
scholarshipApplicationSchema.index({ scholarshipId: 1 });
scholarshipApplicationSchema.index({ status: 1 });
scholarshipApplicationSchema.index({ appliedAt: 1 });

// Compound index to prevent duplicate applications
scholarshipApplicationSchema.index({ userId: 1, scholarshipId: 1 }, { unique: true });

const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);

export default ScholarshipApplication;
