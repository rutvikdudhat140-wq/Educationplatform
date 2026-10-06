import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  Home,
  IndianRupee,
  Share2,
  TrendingUp,
  Building2,
  Bookmark,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourse = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/course/${id}`
        );
        setCourse(response.data.data || response.data.course || null);
      } catch (err) {
        console.error('Error fetching course details', err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent mx-auto" />
          <p className="text-sm text-ink-muted">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-surface p-6 md:p-10">
        <div className="mx-auto max-w-lg rounded-md border border-line bg-white p-8 text-center shadow-none">
          <GraduationCap size={36} className="mx-auto text-ink-muted mb-3" />
          <h2 className="text-xl font-bold text-ink">Course Not Found</h2>
          <p className="text-sm text-ink-muted mt-1">
            The course you are looking for does not exist or has been updated.
          </p>
          <Link
            to="/courses"
            className="mt-5 inline-block rounded-md bg-brand px-4 py-2 text-xs font-semibold text-white shadow-none hover:bg-brand-dark"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink pb-20 md:pb-12">
      {/* Header / Breadcrumb */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-ink transition-colors mr-1"
            >
              <ArrowLeft size={13} /> Back
            </button>
            <span>/</span>
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-ink">Courses</Link>
            <span>/</span>
            <span className="font-semibold text-ink truncate max-w-[200px] sm:max-w-none">
              {course.name}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Course Banner Card */}
        <div className="mb-6 rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-blue-50 border border-blue-100 text-brand font-bold text-lg uppercase">
                {course.shortName ? course.shortName.slice(0, 3) : (course.name?.slice(0, 3) || 'CRS')}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge className="rounded text-[11px] font-semibold bg-blue-50 text-brand hover:bg-blue-100 border-none">
                    {course.stream || 'General'}
                  </Badge>
                  <Badge variant="outline" className="rounded text-[11px] border-line text-ink-muted">
                    {course.level || 'UG Degree'}
                  </Badge>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-ink">
                  {course.name}
                </h1>
                {course.fullName && course.fullName !== course.name && (
                  <p className="text-xs sm:text-sm text-ink-muted mt-1">
                    {course.fullName}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link to={`/colleges?stream=${encodeURIComponent(course.stream || '')}`}>
                <Button variant="outline" className="rounded-md border-line text-xs font-semibold h-10 px-4 shadow-none">
                  <Building2 size={14} className="mr-1.5" /> Find Colleges
                </Button>
              </Link>
              <Link to={`/counselling/wizard`}>
                <Button className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-5 shadow-none">
                  Get Guidance
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center gap-4 md:gap-8 text-xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-brand" />
              <span>Duration: <strong className="text-ink font-semibold">{course.duration || '3-4 Years'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <IndianRupee size={14} className="text-brand" />
              <span>Average Fee: <strong className="text-ink font-semibold">{course.fees ? `₹${course.fees}/yr` : '₹1.5L - ₹4L/yr'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-brand" />
              <span>Available in: <strong className="text-ink font-semibold">{course.collegeCount || '50'}+ Colleges</strong></span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Content Details */}
          <div className="space-y-6">
            {/* About Course */}
            <div className="rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
              <h2 className="text-base md:text-lg font-bold text-ink mb-3 flex items-center gap-2">
                <BookOpen size={17} className="text-brand" /> About {course.name}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted">
                {course.description ||
                  `${course.name} is a comprehensive program designed to equip students with specialized knowledge and practical skills required in modern industries. The curriculum focuses on theoretical foundations alongside real-world applications.`}
              </p>
            </div>

            {/* Eligibility Criteria */}
            <div className="rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
              <h2 className="text-base md:text-lg font-bold text-ink mb-3 flex items-center gap-2">
                <Check size={17} className="text-brand" /> Eligibility Criteria
              </h2>

              {course.eligibilityCriteria && course.eligibilityCriteria.length > 0 ? (
                <ul className="space-y-2.5">
                  {course.eligibilityCriteria.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-ink-muted">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-50 text-brand">
                        <Check size={11} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2.5 text-xs sm:text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-50 text-brand">
                      <Check size={11} />
                    </div>
                    <span>Minimum 50% aggregate marks in 10+2 or equivalent from a recognized board.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-50 text-brand">
                      <Check size={11} />
                    </div>
                    <span>Relevant subject combinations required according to specialization.</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Career Opportunities */}
            <div className="rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
              <h2 className="text-base md:text-lg font-bold text-ink mb-3 flex items-center gap-2">
                <TrendingUp size={17} className="text-brand" /> Career Opportunities & Outcomes
              </h2>

              {course.relatedCareers && course.relatedCareers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
                  {course.relatedCareers.map((career) => (
                    <div
                      key={career._id || career}
                      onClick={() => {
                        const relatedCourseId = career.relatedCourses?.[0]?._id;
                        if (relatedCourseId) {
                          navigate(`/courses/${relatedCourseId}`);
                        } else {
                          navigate('/careers');
                        }
                      }}
                      className="rounded-md border border-line bg-surface p-3.5 text-left hover:border-brand/40 hover:bg-blue-50/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-ink">{career.name}</h3>
                        <span className="rounded bg-blue-50 text-brand text-[10px] font-semibold px-2 py-0.5">
                          {career.growthLevel || 'High Demand'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-brand">
                        ₹{career.salaryMin || 3} - ₹{career.salaryMax || 8} {career.salaryUnit || 'LPA'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-ink-muted">
                  Graduates of this program can pursue diverse opportunities in technology firms, corporate consultancies, research laboratories, and entrepreneurship.
                </p>
              )}
            </div>
          </div>

          {/* Right Rail Info Box */}
          <aside className="space-y-6">
            {/* Quick Facts */}
            <div className="rounded-md border border-line bg-white p-5 shadow-none">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3 mb-4">
                Course Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-line/60 pb-2">
                  <span className="text-ink-muted">Level</span>
                  <span className="font-semibold text-ink">{course.level || 'UG'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-line/60 pb-2">
                  <span className="text-ink-muted">Duration</span>
                  <span className="font-semibold text-ink">{course.duration || '3-4 Years'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-line/60 pb-2">
                  <span className="text-ink-muted">Stream</span>
                  <span className="font-semibold text-ink">{course.stream || 'General'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-line/60 pb-2">
                  <span className="text-ink-muted">Est. Annual Fees</span>
                  <span className="font-semibold text-brand">{course.fees ? `₹${course.fees}` : '₹1.5L - ₹4L'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">Colleges Offering</span>
                  <span className="font-semibold text-ink">{course.collegeCount || '50'}+ Institutions</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-line">
                <Link to={`/colleges?stream=${encodeURIComponent(course.stream || '')}`} className="w-full">
                  <Button className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none">
                    View Colleges For {course.shortName || 'Course'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Entrance Exams */}
            {course.entranceExams && course.entranceExams.length > 0 && (
              <div className="rounded-md border border-line bg-white p-5 shadow-none">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3 mb-3">
                  Accepted Entrance Exams
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {course.entranceExams.map((exam, index) => (
                    <span
                      key={index}
                      className="rounded bg-surface px-2.5 py-1 text-xs font-medium text-ink border border-line"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-[49px] left-0 right-0 px-3 py-1.5 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] shadow-md z-30 flex items-center gap-2 h-11">
        <Link to={`/colleges?stream=${encodeURIComponent(course.stream || '')}`} className="flex-1">
          <Button variant="outline" className="w-full rounded-[6px] border-[#CBD5E1] text-[11px] font-bold h-8 shadow-none">
            Find Colleges
          </Button>
        </Link>
        <Link to={`/counselling/wizard`} className="flex-1">
          <Button className="w-full rounded-[6px] bg-[#172554] hover:bg-[#0F172A] text-white text-[11px] font-bold h-8 shadow-none">
            Get Guidance
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseDetails;
