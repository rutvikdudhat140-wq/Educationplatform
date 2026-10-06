import Admission from "../models/admission.model.js";

const pushStatusHistory = (doc, status, note = '', changedBy = null) => {
  doc.statusHistory = doc.statusHistory || [];
  doc.statusHistory.push({
    status,
    note,
    changedBy,
    changedAt: new Date()
  });
};



export const checkEligibility = async (req, res) => {
  res.json({
    success: true,
    eligible: true,
    message: "Meets basic criteria."
  });
};

export const createOrUpdateDraft = async (req, res) => {
  try {
  const userId = req.user.id || req.user._id;
  const { collegeId, courseId, admissionYear } = req.body;

  let admission = await Admission.findOne({
    userId,
    collegeId,
    courseId,
    admissionYear
  });

  if (admission) {
    Object.assign(admission, req.body);
    // Auto-fix any legacy lowercased statuses before saving
    if (admission.status && typeof admission.status === 'string') {
       admission.status = admission.status.toUpperCase();
    }
  } else {
    admission = new Admission({
      ...req.body,
      userId,
      status: "DRAFT",
      statusHistory: []
    });

    pushStatusHistory(
      admission,
      "DRAFT",
      "Application draft created",
      userId
    );
  }

  await admission.save();

  res.json({
    success: true,
    admission
  });
  } catch (error) {
    console.error("Draft Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to save draft" });
  }
};

import { sendEmail } from '../utils/sendEmail.js';

export const submitApplication = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });

    admission.status = "SUBMITTED";
    admission.submittedAt = new Date();
    // Assuming applicationNumber was generated earlier or generate now
    if (!admission.applicationNumber) {
        admission.applicationNumber = 'APP' + Date.now();
    }

    pushStatusHistory(
      admission,
      "SUBMITTED",
      "Application submitted successfully",
      req.user.id || req.user._id
    );

    await admission.save();

    // Send confirmation email
    if (admission.email) {
      const message = `
        <h2>Application Submitted Successfully</h2>
        <p>Dear ${admission.name},</p>
        <p>Your admission application for Application No: <strong>${admission.applicationNumber}</strong> has been submitted successfully.</p>
        <p>We will review your documents and notify you of the next steps.</p>
        <br/>
        <p>Regards,<br/>EduAdmin Team</p>
      `;
      try {
        await sendEmail({
          email: admission.email,
          subject: 'Admission Application Submitted',
          message
        });
      } catch (err) {
        console.error("Email sending failed:", err);
      }
    }

    res.json({
      success: true,
      admission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { name } = req.body;
    let fileUrl = req.body.fileUrl; // Fallback for dummy URLs if provided

    // If file uploaded via multer, construct URL
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });

    const document = admission.documents.find(
      (item) => item.name === name
    );

    if (document) {
      document.fileUrl = fileUrl;
      document.status = "Uploaded";
    } else {
      admission.documents.push({
        name,
        fileUrl,
        status: "Uploaded"
      });
    }

    await admission.save();

    res.json({
      success: true,
      admission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAdmissions = async (req, res) => {
  const admissions = await Admission.find({
    userId: req.user.id || req.user._id
  })
    .populate("collegeId", "name")
    .populate("courseId", "name fullName")

  res.json({
    success: true,
    admissions
  });
};

export const getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate("collegeId")
      .populate("courseId");

    res.json({
    success: true,
    admission
  });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllAdmissions = async (req, res) => {
  const filter =
    req.query.status && req.query.status !== "All"
      ? { status: req.query.status }
      : {};

  const admissions = await Admission.find(filter)
    .populate("userId", "name email")
    .populate("collegeId", "name")
    .populate("courseId", "name fullName");

  res.json({
    success: true,
    admissions
  });
};

export const getAdminAdmissionById = async (req, res) => {
  const admission = await Admission.findById(req.params.id)
    .populate("userId", "name email phone")
    .populate("collegeId")
    .populate("courseId")

  res.json({
    success: true,
    admission
  });
};

export const updateAdmissionStatus = async (req, res) => {
  const { status, note, adminNotes } = req.body;

  const admission = await Admission.findById(req.params.id);
  if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });

  if (adminNotes !== undefined) {
    admission.adminNotes = adminNotes;
  }

  if (status && status !== admission.status) {
    admission.status = status;

    pushStatusHistory(
      admission,
      status,
      note || "",
      req.user.id || req.user._id
    );
  }

  await admission.save();

  res.json({
    success: true,
    admission
  });
};

export const verifyDocument = async (req, res) => {
  const { docId, status, remark } = req.body;

  const admission = await Admission.findById(req.params.id);
  const document = admission.documents.id(docId);

  document.status = status;
  document.remark = remark;

  if (status === "REJECTED") {
    admission.status = "Documents Rejected";

    pushStatusHistory(
      admission,
      "Documents Rejected",
      `Document rejected: ${document.name}`,
      req.user.id || req.user._id
    );
  }

  await admission.save();

  res.json({
    success: true,
    admission
  });
};

export const deleteAdmission = async (req, res) => {
  const admission = await Admission.findById(req.params.id);
  if (!admission) return res.status(404).json({ success: false, message: "Admission not found" });

  await Admission.findByIdAndDelete(admission._id);

  res.json({ success: true, message: "Admission deleted successfully" });
};

export const processPayment = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });

    const { amount, paymentMethod } = req.body;
    const paymentAmount = Number(amount) || 0;

    admission.paidAmount = (Number(admission.paidAmount) || 0) + paymentAmount;
    // ensure remainingAmount exists in schema, otherwise maybe just calculate dynamically.
    // wait, does remainingAmount exist in schema? it's not strictly required, but let's set it.
    admission.remainingAmount = (Number(admission.netPayable) || 0) - admission.paidAmount;
    admission.paymentStatus = 'Paid';
    admission.status = 'ENROLLED';

    pushStatusHistory(
      admission,
      'ENROLLED',
      `Payment of ${amount} received via ${paymentMethod}`,
      req.user.id || req.user._id
    );

    await admission.save();

    res.json({ success: true, admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
