import mongoose from 'mongoose';
import applyRelaxedValidation from '../utils/relaxedValidation.js';

const educationLoanArticleSchema = new mongoose.Schema(
  {
    title: { type: String },
    slug: { type: String, unique: true, sparse: true },
    summary: { type: String },
    category: { type: String }, // e.g., 'Step by Step Guide', 'Country Guide'
    country: { type: String, default: null }, // e.g., 'USA', 'UK'
    coverImage: { type: String, default: '' },
    coverImageAlt: { type: String, default: '' },
    author: { type: String, default: 'Admin' },
    content: { type: Object }, // Tiptap JSON content
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    seoTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

applyRelaxedValidation(educationLoanArticleSchema);

const EducationLoanArticle = mongoose.model('EducationLoanArticle', educationLoanArticleSchema);
export default EducationLoanArticle;
