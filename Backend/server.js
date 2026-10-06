import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import collegeRoutes from './src/routes/college.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import cutoffRoutes from './src/routes/cutoff.routes.js';
import careerRoutes from './src/routes/career.routes.js';
import universityRoutes from "./src/routes/university.routes.js";
import admissionRoutes from './src/routes/admission.routes.js';
import adminAdmissionRoutes from './src/routes/adminAdmission.routes.js';
import universityApplicationRoutes from './src/routes/universityApplication.routes.js';
import examRoutes from './src/routes/examRoutes.js';
import examSessionRoutes from './src/routes/examSessionRoutes.js';
import examDateRoutes from './src/routes/examDateRoutes.js';
import examEligibilityRoutes from './src/routes/examEligibilityRoutes.js';
import examPreparationRoutes from './src/routes/examPreparationRoutes.js';
import predictionRoutes from './src/routes/prediction.routes.js';
import examPatternRoutes from './src/routes/exam-patternRoutes.js';
import reviewRoutes from './src/routes/review.routes.js';
import rankingRoutes from './src/routes/ranking.routes.js';
import counsellingRoutes from './src/routes/counselling.routes.js';
import adminCounsellingRoutes from './src/routes/adminCounselling.routes.js';
import recommendationRoutes from './src/routes/recommendation.routes.js';
import scholarshipRoutes from './src/routes/scholarship.routes.js';
import adminScholarshipRoutes from './src/routes/adminScholarship.routes.js';
import educationLoanRoutes from './src/routes/educationLoanRoutes.js';
import onlineCourseRoutes from './src/routes/onlineCourse.routes.js';
import certificateRoutes from './src/routes/certificate.routes.js';
import adminOnlineCourseRoutes from './src/routes/adminOnlineCourse.routes.js';
import educationUpdateRoutes from './src/routes/educationUpdate.routes.js';
import educationAlertRoutes from './src/routes/educationAlert.routes.js';
import adminEducationUpdateRoutes from './src/routes/adminEducationUpdate.routes.js';
import questionRoutes from './src/routes/question.routes.js';
import adminQuestionRoutes from './src/routes/adminQuestion.routes.js';
import {
  buildRouter as buildExamResourceRouter,
  resourceTypeFromMount,
} from './src/routes/examResourceRoutes.js';

const EXAM_RESOURCE_MOUNTS = [
  '/api/exam-syllabus',
  '/api/exam-sample-paper',
  '/api/exam-mock-test',
  '/api/exam-faq',
];

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/cutoffs', cutoffRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/careers', careerRoutes);
app.use("/api/university", universityRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/admin/admissions', adminAdmissionRoutes);
app.use('/api/university-applications', universityApplicationRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/exam-session', examSessionRoutes);
app.use('/api/exam-date', examDateRoutes);
app.use('/api/exam-eligibility', examEligibilityRoutes);
app.use('/api/exam-preparation', examPreparationRoutes);
app.use('/api', predictionRoutes);
app.use('/api/exam-pattern', examPatternRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/counselling', counsellingRoutes);
app.use('/api/admin/counselling', adminCounsellingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/admin', adminScholarshipRoutes);
app.use('/api/education-loan', educationLoanRoutes);
app.use('/api/online-courses', onlineCourseRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminOnlineCourseRoutes);
app.use('/api', educationUpdateRoutes);
app.use('/api', educationAlertRoutes);
app.use('/api/admin', adminEducationUpdateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminQuestionRoutes);

for (const mount of EXAM_RESOURCE_MOUNTS) {
  app.use(mount, buildExamResourceRouter(mount, resourceTypeFromMount(mount)));
}

const PORT = process.env.PORT || 5001;

await connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (Listening on 0.0.0.0 for local network & mobile devices)`);
});
