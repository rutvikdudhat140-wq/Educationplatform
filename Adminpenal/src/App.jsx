import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AddCollege from './pages/admin/college/AddCollege';
import CollegeList from './pages/admin/college/CollegeList';
import EditCollege from './pages/admin/college/EditCollege';
import CollegeApplications from './pages/admin/college/CollegeApplications';
import CollegeReviews from './pages/admin/college/CollegeReviews';
import AddUniversity from './pages/admin/univercity/AddUniversity';
import UniversityList from './pages/admin/univercity/UniversityList';
import EditUniversity from './pages/admin/univercity/EditUniversity';
import UniversityApplications from './pages/admin/univercity/UniversityApplications';
import AddCourse from './pages/admin/course/AddCourse';
import CourseList from './pages/admin/course/CourseList';
import EditCourse from './pages/admin/course/EditCourse';
import CareerList from './pages/admin/career/CareerList';
import AddCareer from './pages/admin/career/AddCareer';
import EditCareer from './pages/admin/career/EditCareer';
import ExamList from './pages/admin/exam/ExamList';
import AddExam from './pages/admin/exam/AddExam';
import EditExam from './pages/admin/exam/EditExam';
import ExamSessionList from './pages/admin/examSession/ExamSessionList';
import AddExamSession from './pages/admin/examSession/AddExamSession';
import EditExamSession from './pages/admin/examSession/EditExamSession';
import ExamDateList from './pages/admin/examDate/ExamDateList';
import AddExamDate from './pages/admin/examDate/AddExamDate';
import EditExamDate from './pages/admin/examDate/EditExamDate';
import ExamEligibilityList from './pages/admin/examEligibility/ExamEligibilityList';
import AddExamEligibility from './pages/admin/examEligibility/AddExamEligibility';
import EditExamEligibility from './pages/admin/examEligibility/EditExamEligibility';
import ExamPreparationList from './pages/admin/examPreparation/ExamPreparationList';
import AddExamPreparation from './pages/admin/examPreparation/AddExamPreparation';
import EditExamPreparation from './pages/admin/examPreparation/EditExamPreparation';
import { Toaster } from '@/components/ui/sonner';
import PredictionManagement from './pages/admin/prediction/PredictionManagement';
import ExamPatternList from './pages/admin/exampattern/ExamPatternList';
import AddExamPattern from './pages/admin/exampattern/AddExamPattern';
import EditExamPattern from './pages/admin/exampattern/EditExamPattern';
import ExamSyllabusList from './pages/admin/examsyllabus/ExamSyllabusList';
import AddExamSyllabus from './pages/admin/examsyllabus/AddExamSyllabus';
import EditExamSyllabus from './pages/admin/examsyllabus/EditExamSyllabus';
import ExamSamplePaperList from './pages/admin/examsamplepaper/ExamSamplePaperList';
import AddExamSamplePaper from './pages/admin/examsamplepaper/AddExamSamplePaper';
import EditExamSamplePaper from './pages/admin/examsamplepaper/EditExamSamplePaper';
import ExamMockTestList from './pages/admin/exammocktest/ExamMockTestList';
import AddExamMockTest from './pages/admin/exammocktest/AddExamMockTest';
import EditExamMockTest from './pages/admin/exammocktest/EditExamMockTest';
import ExamFaqList from './pages/admin/examfaq/ExamFaqList';
import AddExamFaq from './pages/admin/examfaq/AddExamFaq';
import EditExamFaq from './pages/admin/examfaq/EditExamFaq';
import RankingList from './pages/admin/ranking/RankingList';
import AddRanking from './pages/admin/ranking/AddRanking';
import EditRanking from './pages/admin/ranking/EditRanking';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/colleges" element={<Navigate to="/admin/college/list" />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/college/list"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CollegeList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/college/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddCollege />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/college/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditCollege />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/college/:id/applications"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CollegeApplications />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/college/reviews"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CollegeReviews />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/univercity/list"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UniversityList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/univercity/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddUniversity />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/univercity/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditUniversity />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/univercity/:id/applications"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UniversityApplications />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/course/list"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CourseList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/course/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddCourse />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/course/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditCourse />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/career/list"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CareerList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/career/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddCareer />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/career/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditCareer />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/admin/exam/list" element={<ProtectedRoute><AdminLayout><ExamList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam/add" element={<ProtectedRoute><AdminLayout><AddExam /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam/edit/:id" element={<ProtectedRoute><AdminLayout><EditExam /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/exam-session/list" element={<ProtectedRoute><AdminLayout><ExamSessionList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-session/add" element={<ProtectedRoute><AdminLayout><AddExamSession /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-session/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamSession /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/exam-date/list" element={<ProtectedRoute><AdminLayout><ExamDateList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-date/add" element={<ProtectedRoute><AdminLayout><AddExamDate /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-date/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamDate /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/exam-eligibility/list" element={<ProtectedRoute><AdminLayout><ExamEligibilityList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-eligibility/add" element={<ProtectedRoute><AdminLayout><AddExamEligibility /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-eligibility/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamEligibility /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/exam-preparation/list" element={<ProtectedRoute><AdminLayout><ExamPreparationList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-preparation/add" element={<ProtectedRoute><AdminLayout><AddExamPreparation /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/exam-preparation/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamPreparation /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/exam-pattern/list" element={<ProtectedRoute><AdminLayout><ExamPatternList /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-pattern/add" element={<ProtectedRoute><AdminLayout><AddExamPattern /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-pattern/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamPattern /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-syllabus/list" element={<ProtectedRoute><AdminLayout><ExamSyllabusList /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-syllabus/add" element={<ProtectedRoute><AdminLayout><AddExamSyllabus /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-syllabus/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamSyllabus /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-sample-paper/list" element={<ProtectedRoute><AdminLayout><ExamSamplePaperList /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-sample-paper/add" element={<ProtectedRoute><AdminLayout><AddExamSamplePaper /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-sample-paper/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamSamplePaper /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-mock-test/list" element={<ProtectedRoute><AdminLayout><ExamMockTestList /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-mock-test/add" element={<ProtectedRoute><AdminLayout><AddExamMockTest /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-mock-test/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamMockTest /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-faq/list" element={<ProtectedRoute><AdminLayout><ExamFaqList /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-faq/add" element={<ProtectedRoute><AdminLayout><AddExamFaq /></AdminLayout></ProtectedRoute>} />
<Route path="/admin/exam-faq/edit/:id" element={<ProtectedRoute><AdminLayout><EditExamFaq /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/prediction-management" element={<ProtectedRoute><AdminLayout><PredictionManagement /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/ranking/list" element={<ProtectedRoute><AdminLayout><RankingList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/ranking/add" element={<ProtectedRoute><AdminLayout><AddRanking /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/ranking/edit/:id" element={<ProtectedRoute><AdminLayout><EditRanking /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
