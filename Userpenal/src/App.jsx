import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
// import ChangePassword from './pages/auth/ChangePassword';
import Home from './pages/Home/Home';
import Navbar from './components/Header/Navbar';
import CollegeList from './pages/Colleges/CollegeList';
import CollegeDetail from './pages/Colleges/CollegeDetail';
import ComparePage from './pages/Colleges/ComparePage';
import UniversityList from './pages/Universities/UniversityList';
import UniversityDetail from './pages/Universities/UniversityDetail';
import CourseList from './pages/courses/CourseList';
import CourseDetails from './pages/courses/CourseDetails';
import CareerExplorer from './pages/careers/CareerExplorer';
import ExamDetails from './pages/exams/ExamDetails';
import ExamList from './pages/exams/ExamList';
import Footer from './components/Footer/Footer';
import RankPredictor from './pages/predictors/RankPredictor';
import CollegePredictor from './pages/predictors/CollegePredictor';
import CollegePredictorResults from './pages/predictors/CollegePredictorResults';
import Predictors from "./pages/predictors/Predictors";
import RankingPage from "./pages/rankings/RankingPage";


function ProtectedRoute({ children }) {
  return localStorage.getItem('userToken')
    ? children
    : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="min-h-[calc(100vh-16rem)]">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
            <Route path="/universities/all-universities" element={<UniversityList />} />
            <Route path="/universities/category/:category" element={<UniversityList />} />
            <Route path="/universities/:id" element={<UniversityDetail />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/careers" element={<CareerExplorer />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/:id" element={<ExamDetails />} />
            <Route path="/rank-predictor" element={<RankPredictor />} />
            <Route path="/college-predictor" element={<CollegePredictor />} />
            <Route path="/college-predictor-results" element={<CollegePredictorResults />} />
            <Route path="/predictors" element={<Predictors />} />
            <Route path="/rankings" element={<RankingPage />} />



            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
