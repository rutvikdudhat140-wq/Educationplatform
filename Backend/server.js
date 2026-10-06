import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import collegeRoutes from './src/routes/college.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import careerRoutes from './src/routes/career.routes.js';
import universityRoutes from "./src/routes/university.routes.js";
import applicationRoutes from './src/routes/application.routes.js';
import universityApplicationRoutes from './src/routes/universityApplication.routes.js';
import examRoutes from './src/routes/examRoutes.js';
import examSessionRoutes from './src/routes/examSessionRoutes.js';
import examDateRoutes from './src/routes/examDateRoutes.js';
import examEligibilityRoutes from './src/routes/examEligibilityRoutes.js';
import examPreparationRoutes from './src/routes/examPreparationRoutes.js';
import predictionRoutes from './src/routes/prediction.routes.js';
import examPatternRoutes from './src/routes/exam-patternRoutes.js';
import examSyllabusRoutes from './src/routes/exam-syllabusRoutes.js';
import examSamplePaperRoutes from './src/routes/exam-sample-paperRoutes.js';
import examMockTestRoutes from './src/routes/exam-mock-testRoutes.js';
import examFaqRoutes from './src/routes/exam-faqRoutes.js';
import reviewRoutes from './src/routes/review.routes.js';
import rankingRoutes from './src/routes/ranking.routes.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/careers', careerRoutes);
app.use("/api/university", universityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/university-applications', universityApplicationRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/exam-session', examSessionRoutes);
app.use('/api/exam-date', examDateRoutes);
app.use('/api/exam-eligibility', examEligibilityRoutes);
app.use('/api/exam-preparation', examPreparationRoutes);
app.use('/api', predictionRoutes);
app.use('/api/exam-pattern', examPatternRoutes);
app.use('/api/exam-syllabus', examSyllabusRoutes);
app.use('/api/exam-sample-paper', examSamplePaperRoutes);
app.use('/api/exam-mock-test', examMockTestRoutes);
app.use('/api/exam-faq', examFaqRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rankings', rankingRoutes);




const PORT = process.env.PORT || 5001;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
