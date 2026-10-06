import EducationLoanArticle from '../models/EducationLoanArticle.js';
import EducationLoanEnquiry from '../models/EducationLoanEnquiry.js';
import { stripEmptyValues } from '../utils/relaxedValidation.js';

export const getArticles = async (req, res) => {
  try {
    const { status, category, country } = req.query;
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (country) query.country = country;

    const articles = await EducationLoanArticle.find(query).sort({ createdAt: -1 }).select('-content');
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await EducationLoanArticle.findOne({ slug });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await EducationLoanArticle.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    let slug = req.body.slug;
    let existing = await EducationLoanArticle.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
      req.body.slug = slug;
    }

    const article = new EducationLoanArticle(stripEmptyValues(req.body));
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await EducationLoanArticle.findByIdAndUpdate(id, stripEmptyValues(req.body), { returnDocument: 'after' });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await EducationLoanArticle.findByIdAndDelete(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createEnquiry = async (req, res) => {
  try {
    const enquiry = new EducationLoanEnquiry(stripEmptyValues(req.body));
    await enquiry.save();
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await EducationLoanEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = await EducationLoanEnquiry.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
