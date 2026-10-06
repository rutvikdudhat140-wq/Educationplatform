import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';

import Login from './pages/auth/Login';
import Signup from "./pages/auth/SignUp";
import ChangePassword from './pages/auth/ChangePassword';
import ProfilePage from './pages/Profile/ProfilePage';
import Home from './pages/Home/Home';
import Navbar from './components/Header/Navbar';
import BottomNav from './components/Header/BottomNav';
import MobileHeader from './components/Header/MobileHeader';
import CollegeList from './pages/Colleges/CollegeList';
import CollegeDetail from './pages/Colleges/CollegeDetail';
import ComparePage from './pages/Colleges/ComparePage';
import UniversityList from './pages/Universities/UniversityList';
import UniversityDetail from './pages/Universities/UniversityDetail';
import CourseList from './pages/courses/CourseList';
import CourseDetails from './pages/courses/CourseDetails';
import CareerExplorer from './pages/careers/CareerExplorer';
import CareerDetail from './pages/careers/CareerDetail';
import ExamDetails from './pages/exams/ExamDetails';
import ExamList from './pages/exams/ExamList';
import Footer from './components/Footer/Footer';
import { Toaster } from './components/ui/sonner';
import RankPredictor from './pages/predictors/RankPredictor';
import CollegePredictor from './pages/predictors/CollegePredictor';
import CollegePredictorResults from './pages/predictors/CollegePredictorResults';
import Predictors from "./pages/predictors/Predictors";
import RankingPage from "./pages/rankings/RankingPage";
import OnlineCourseList from './pages/onlineCourses/OnlineCourseList';
import OnlineCourseDetail from './pages/onlineCourses/OnlineCourseDetail';
import LearnOnlineCourse from './pages/onlineCourses/LearnOnlineCourse';
import MyLearning from './pages/onlineCourses/MyLearning';
import MyCertificates from './pages/onlineCourses/MyCertificates';
import VerifyCertificate from './pages/onlineCourses/VerifyCertificate';
import EducationLoanList from './pages/EducationLoan/EducationLoanList';
import EducationLoanDetail from './pages/EducationLoan/EducationLoanDetail';
import ScholarshipList from './pages/Scholarships/ScholarshipList';
import ScholarshipDetail from './pages/Scholarships/ScholarshipDetail';
import ScholarshipApplicationForm from './pages/Scholarships/ScholarshipApplicationForm';
import ApplicationSuccess from './pages/Scholarships/ApplicationSuccess';
import MyScholarships from './pages/Scholarships/MyScholarships';
import ScholarshipApplicationDetails from './pages/Scholarships/ScholarshipApplicationDetails';
import MyAdmissions from './pages/Admissions/MyAdmissions';
import AdmissionDetails from './pages/Admissions/AdmissionDetails';
import ApplyNowFlow from './pages/Admissions/ApplyNowFlow';
import CounsellingLanding from './pages/Counselling/CounsellingLanding';
import CounsellingWizard from './pages/Counselling/CounsellingWizard';
import MyCounselling from './pages/Counselling/MyCounselling';
import CounsellingDetail from './pages/Counselling/CounsellingDetail';
import CounsellingGuidanceForm from './pages/Counselling/CounsellingGuidanceForm';
import EducationUpdates from './pages/EducationUpdates/EducationUpdates';
import EducationUpdateDetail from './pages/EducationUpdates/EducationUpdateDetail';
import EducationAlerts from './pages/EducationUpdates/EducationAlerts';
import MyUpdates from './pages/EducationUpdates/MyUpdates';
import Recommendations from './pages/Recommendations/Recommendations';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import ScrollToTop from './components/common/ScrollToTop';
import { CompareProvider } from './context/CompareContext';
import CompareDock from './components/common/CompareDock';
import SpotlightSearch from './components/common/SpotlightSearch';

function ProtectedRoute({ children }) {
  return localStorage.getItem('userToken')
    ? children
    : <Navigate to="/login" />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop />
      <SpotlightSearch />
      <CompareDock />
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <MobileHeader />}
      <main className={isAuthPage ? 'flex-grow flex flex-col' : 'min-h-[calc(100vh-16rem)] flex-grow pb-16 md:pb-0'}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="/colleges/all-colleges" element={<CollegeList />} />
            <Route path="/colleges" element={<CollegeList />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/Colleges/all-collages" element={<CollegeList />} />
            <Route path="/colleges/category/:category" element={<CollegeList />} />
            <Route path="/colleges/:id" element={<CollegeDetail />} />
            <Route path="/college/:id" element={<CollegeDetail />} />
            <Route path="/universities/all-universities" element={<CollegeList />} />
            <Route path="/universities/category/:category" element={<CollegeList />} />
            <Route path="/universities/:id" element={<UniversityDetail />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/course-details/:id" element={<CourseDetails />} />
            <Route path="/coursedetails/:id" element={<CourseDetails />} />
            <Route path="/careers" element={<CareerExplorer />} />
            <Route path="/careers/:id" element={<CareerDetail />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/:id" element={<ExamDetails />} />
            <Route path="/rank-predictor" element={<RankPredictor />} />
            <Route path="/college-predictor" element={<CollegePredictor />} />
            <Route path="/college-predictor-results" element={<CollegePredictorResults />} />
            <Route path="/predictors" element={<Predictors />} />
            <Route path="/rankings" element={<RankingPage />} />

            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />

            <Route path="/online-courses" element={<OnlineCourseList />} />
            <Route
              path="/online-courses/:id"
              element={<OnlineCourseDetail />}
            />
            <Route
              path="/online-courses/:id/learn"
              element={
                <ProtectedRoute>
                  <LearnOnlineCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-learning"
              element={
                <ProtectedRoute>
                  <MyLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-certificates"
              element={
                <ProtectedRoute>
                  <MyCertificates />
                </ProtectedRoute>
              }
            />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />

            <Route path="/education-loan" element={<EducationLoanList />} />
            <Route
              path="/education-loan/:slug"
              element={<EducationLoanDetail />}
            />

            <Route path="/scholarships" element={<ScholarshipList />} />
            <Route
              path="/scholarships/application-success"
              element={<ApplicationSuccess />}
            />
            <Route
              path="/scholarships/:id/apply"
              element={
                <ProtectedRoute>
                  <ScholarshipApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scholarships/applications/:id"
              element={
                <ProtectedRoute>
                  <ScholarshipApplicationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scholarships/:id"
              element={<ScholarshipDetail />}
            />
            <Route
              path="/my-scholarships"
              element={
                <ProtectedRoute>
                  <MyScholarships />
                </ProtectedRoute>
              }
            />
            <Route path="/apply" element={<ApplyNowFlow />} />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyAdmissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications/:id"
              element={
                <ProtectedRoute>
                  <AdmissionDetails />
                </ProtectedRoute>
              }
            />

            <Route path="/counselling" element={<CounsellingLanding />} />
            <Route
              path="/counselling/wizard"
              element={
                <ProtectedRoute>
                  <CounsellingWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselling/:id/guidance"
              element={
                <ProtectedRoute>
                  <CounsellingGuidanceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselling/:id"
              element={
                <ProtectedRoute>
                  <CounsellingDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-counselling"
              element={
                <ProtectedRoute>
                  <MyCounselling />
                </ProtectedRoute>
              }
            />

            <Route path="/education-updates" element={<EducationUpdates />} />
            <Route
              path="/education-updates/:id"
              element={<EducationUpdateDetail />}
            />
            <Route path="/education-alerts" element={<EducationAlerts />} />
            <Route path="/my-updates" element={<MyUpdates />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <AppContent />
      </CompareProvider>
    </BrowserRouter>
  );
}

export default App;
