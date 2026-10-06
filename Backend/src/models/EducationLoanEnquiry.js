import mongoose from 'mongoose';
import applyRelaxedValidation from '../utils/relaxedValidation.js';

const educationLoanEnquirySchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    destinationCountry: { type: String },
    message: { type: String },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  },
  { timestamps: true }
);

applyRelaxedValidation(educationLoanEnquirySchema);

const EducationLoanEnquiry = mongoose.model('EducationLoanEnquiry', educationLoanEnquirySchema);
export default EducationLoanEnquiry;
