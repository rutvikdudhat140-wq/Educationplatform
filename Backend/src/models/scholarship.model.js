import mongoose from 'mongoose';
import applyRelaxedValidation from '../utils/relaxedValidation.js';

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'College Specific',
        'Government',
        'Private',
        'Merit Based',
        'Need Based',
        'State Based',
        'Course Based',
        'Other'
      ],
    },
    description: {
      type: String,
    },
    
    // College and Course Mapping
    collegeIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
    }],
    courseIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
    
    // Benefits
    amount: {
      type: String,
    },
    amountType: {
      type: String,
      enum: ['One Time', 'Per Year', 'Per Semester', 'Full Course'],
      default: 'One Time',
    },
    duration: {
      type: String,
      default: '',
    },
    renewalAvailable: {
      type: Boolean,
      default: false,
    },
    benefitsDescription: {
      type: String,
      default: '',
    },
    
    // Eligibility Criteria
    eligibility: {
      minimumMarks: {
        type: String,
        default: '',
      },
      maximumFamilyIncome: {
        type: String,
        default: '',
      },
      category: [{
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      }],
      gender: {
        type: String,
        enum: ['All', 'Male', 'Female', 'Other'],
        default: 'All',
      },
      state: [{
        type: String,
      }],
      studyLevel: [{
        type: String,
        enum: ['UG', 'PG', 'Diploma', 'PhD'],
      }],
      otherCriteria: {
        type: String,
        default: '',
      },
    },
    
    // Important Dates
    applicationStartDate: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
    },
    
    // Required Documents
    requiredDocuments: [{
      type: String,
      enum: [
        '10th Marksheet',
        '12th Marksheet',
        'College Admission Proof',
        'Income Certificate',
        'Caste Certificate',
        'Domicile Certificate',
        'ID Proof',
        'Bank Details',
        'Other'
      ],
    }],
    
    // Application Information
    applicationProcess: {
      type: String,
      default: '',
    },
    applicationUrl: {
      type: String,
      default: '',
    },
    
    // Status and Management
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
  );
  
  // Clear empty strings/nulls so blank admin form fields never block a save
  applyRelaxedValidation(scholarshipSchema);
  
  // Indexes for better performance
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ status: 1 });
scholarshipSchema.index({ applicationDeadline: 1 });
scholarshipSchema.index({ collegeIds: 1 });
scholarshipSchema.index({ courseIds: 1 });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

export default Scholarship;
