import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AddCollege from './pages/admin/college/AddCollege';
import CollegeList from './pages/admin/college/CollegeList';
import EditCollege from './pages/admin/college/EditCollege';
import AdminAdmissionList from './pages/admin/admissions/AdminAdmissionList';
import AdminAdmissionDetail from './pages/admin/admissions/AdminAdmissionDetail';
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
import MentorshipRequests from './pages/admin/career/MentorshipRequests';
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
import PredictionManagement from './pages/admin/prediction/PredictionManagement';
import UpcomingExamsHome from './pages/admin/upcomingExams/UpcomingExamsHome';
import UpcomingExamList from './pages/admin/upcomingExams/UpcomingExamList';
import ExamPatternList from './pages/admin/exampattern/ExamPatternList';
import AddExamPattern from './pages/admin/exampattern/AddExamPattern';
import EditExamPattern from './pages/admin/exampattern/EditExamPattern';
import RankingList from './pages/admin/ranking/RankingList';
import AddRanking from './pages/admin/ranking/AddRanking';
import EditRanking from './pages/admin/ranking/EditRanking';
import AdminCounsellingList from './pages/Counselling/AdminCounsellingList';
import AdminCounsellingDetail from './pages/Counselling/AdminCounsellingDetail';
import GuidancePersonList from './pages/Counselling/GuidancePersonList';
import ScholarshipList from './pages/admin/scholarships/ScholarshipList';
import ScholarshipForm from './pages/admin/scholarships/ScholarshipForm';
import ScholarshipApplications from './pages/admin/scholarships/ScholarshipApplications';
import ScholarshipApplicationDetail from './pages/admin/scholarships/ScholarshipApplicationDetail';
import AdminEducationLoanList from './pages/admin/educationLoans/AdminEducationLoanList';
import AdminEducationLoanForm from './pages/admin/educationLoans/AdminEducationLoanForm';
import OnlineCourseList from './pages/admin/onlineCourses/OnlineCourseList';
import OnlineCourseForm from './pages/admin/onlineCourses/OnlineCourseForm';
import OnlineCourseEnrollments from './pages/admin/onlineCourses/OnlineCourseEnrollments';
import OnlineCourseCertificates from './pages/admin/onlineCourses/OnlineCourseCertificates';
import EducationUpdateList from './pages/admin/educationUpdates/EducationUpdateList';
import EducationUpdateForm from './pages/admin/educationUpdates/EducationUpdateForm';
import EducationAlertList from './pages/admin/educationUpdates/EducationAlertList';
import QAQuestionList from './pages/admin/qa/QAQuestionList';



function ProtectedRoute({ children }) {
  return localStorage.getItem("adminToken") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
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
          path="/admin/admissions"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminAdmissionList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/admissions/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminAdmissionDetail />
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
        <Route
          path="/admin/mentorship-requests"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <MentorshipRequests />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

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


        <Route path="/admin/prediction-management" element={<ProtectedRoute><AdminLayout><PredictionManagement /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/upcoming-exams" element={<ProtectedRoute><AdminLayout><UpcomingExamsHome /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/upcoming-exams/list" element={<ProtectedRoute><AdminLayout><UpcomingExamList /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/ranking/list" element={<ProtectedRoute><AdminLayout><RankingList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/ranking/add" element={<ProtectedRoute><AdminLayout><AddRanking /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/ranking/edit/:id" element={<ProtectedRoute><AdminLayout><EditRanking /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/counselling" element={<ProtectedRoute><AdminLayout><AdminCounsellingList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/counselling/guidance-persons" element={<ProtectedRoute><AdminLayout><GuidancePersonList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/counselling/:id" element={<ProtectedRoute><AdminLayout><AdminCounsellingDetail /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/scholarships" element={<ProtectedRoute><AdminLayout><ScholarshipList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/scholarships/add" element={<ProtectedRoute><AdminLayout><ScholarshipForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/scholarships/edit/:id" element={<ProtectedRoute><AdminLayout><ScholarshipForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/scholarship-applications" element={<ProtectedRoute><AdminLayout><ScholarshipApplications /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/scholarship-applications/:id" element={<ProtectedRoute><AdminLayout><ScholarshipApplicationDetail /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/education-loans" element={<ProtectedRoute><AdminLayout><AdminEducationLoanList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/education-loans/add" element={<ProtectedRoute><AdminLayout><AdminEducationLoanForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/education-loans/edit/:id" element={<ProtectedRoute><AdminLayout><AdminEducationLoanForm /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/online-courses" element={<ProtectedRoute><AdminLayout><OnlineCourseList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/online-course/add" element={<ProtectedRoute><AdminLayout><OnlineCourseForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/online-course/edit/:id" element={<ProtectedRoute><AdminLayout><OnlineCourseForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/online-course-enrollments" element={<ProtectedRoute><AdminLayout><OnlineCourseEnrollments /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/online-course-certificates" element={<ProtectedRoute><AdminLayout><OnlineCourseCertificates /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/education-updates" element={<ProtectedRoute><AdminLayout><EducationUpdateList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/education-updates/add" element={<ProtectedRoute><AdminLayout><EducationUpdateForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/education-updates/edit/:id" element={<ProtectedRoute><AdminLayout><EducationUpdateForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/education-alerts" element={<ProtectedRoute><AdminLayout><EducationAlertList /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/qa" element={<ProtectedRoute><AdminLayout><QAQuestionList /></AdminLayout></ProtectedRoute>} />




        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
