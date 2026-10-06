import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createApiUrl } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronRight,
  Clock3,
  GraduationCap,
  IndianRupee,
  MapPin,
  SlidersHorizontal,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/safe-image';
import RecommendationProfileForm from './RecommendationProfileForm';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
});

const formatFee = (value) => {
  const fee = Number(value);
  return Number.isFinite(fee) && fee > 0 ? `\u20B9${fee.toLocaleString('en-IN')}` : null;
};

const CourseCard = ({ course, onRemove }) => (
  <article className="bg-white rounded-md border border-brand-border flex flex-col p-4 mb-2 md:mb-0 relative">
    <button onClick={() => onRemove('courses', course._id)} className="absolute top-3 right-3 text-ink-muted hover:text-red-600 bg-surface rounded-md p-1.5 transition-colors border border-brand-border">
      <X size={13} />
    </button>
    <div className="flex items-start justify-between gap-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-brand-border bg-brand-softest text-brand">
        <GraduationCap className="size-4" />
      </div>
    </div>

    <h3 className="mt-3 text-[0.9375rem] font-semibold leading-5 text-ink pr-6">
      {course.name || course.fullName}
    </h3>
    <p className="mt-1 line-clamp-2 text-[0.78125rem] leading-5 text-ink-soft">
      {course.fullName || course.name}
    </p>

    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {course.stream && <span className="edu-tag">{course.stream}</span>}
      {course.level && <span className="edu-tag">{course.level}</span>}
      {course.duration && (
        <span className="edu-tag">
          <Clock3 className="size-3" />
          {course.duration}
        </span>
      )}
    </div>

    <Link
      to={`/courses/${course._id}`}
      className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[0.75rem] font-semibold text-brand"
    >
      <span>View Course</span>
      <ChevronRight className="size-3.5" />
    </Link>
  </article>
);

const CollegeCard = ({ college, comparing, onToggleCompare, onRemove }) => {
  const location = [college.location?.city, college.location?.state].filter(Boolean).join(', ');

  return (
    <article className="bg-white rounded-md border border-brand-border flex flex-col overflow-hidden mb-2 md:mb-0 relative">
      <button onClick={() => onRemove('colleges', college._id)} className="absolute top-2 right-2 text-white/90 hover:text-white bg-black/50 hover:bg-black/70 rounded-md p-1.5 transition-colors z-10">
        <X size={13} />
      </button>
      <div className="relative h-36 overflow-hidden bg-brand-softest">
        <SafeImage
          entity={college}
          alt={college.name || college.collegeName || ''}
          className="h-full w-full object-cover"
          fallback={<Building2 className="size-9" />}
          fallbackClassName="h-full w-full text-brand"
        />
        <span className="absolute left-2.5 top-2.5 inline-flex h-[1.375rem] items-center rounded-md bg-white/95 px-2 text-[0.6875rem] font-semibold text-brand-dark">
          {college.collegeType || college.type || 'College'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 text-[0.875rem] font-semibold leading-5 text-ink">
          {college.name || college.collegeName}
        </h3>

        <p className="mt-1.5 flex items-start gap-1 text-[0.75rem] text-ink-muted">
          <MapPin className="mt-0.5 size-3 shrink-0" />
          <span className="line-clamp-1">{location || 'Location not available'}</span>
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <div className="edu-stat">
            <p className="edu-label">Rating</p>
            <p className="edu-stat-value flex items-center gap-1">
              <Star className="size-3" />
              {Number(college.rating || 0).toFixed(1)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Link
            to={`/colleges/${college._id}`}
            className="flex-1 rounded-md bg-brand px-2 py-2 text-center text-[0.75rem] font-semibold text-white"
          >
            View College
          </Link>
          <Button
            size="sm"
            variant={comparing ? 'default' : 'outline'}
            className="flex-1 text-[0.75rem]"
            onClick={onToggleCompare}
          >
            {comparing ? 'Added' : 'Compare'}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default function Recommendations() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState([]);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [generatedAt, setGeneratedAt] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [activeTab, setActiveTab] = useState('colleges');

    const handleRemove = async (type, id) => {
    try {
      await fetch(createApiUrl(`/recommendations/${type}/${id}`), {
        method: 'DELETE',
        headers: authHeaders().headers,
      });
      if (type === 'courses') {
        setCourses(prev => prev.filter(c => c._id !== id));
      } else {
        setColleges(prev => prev.filter(c => c._id !== id));
      }
    } catch (e) {
      console.error('Failed to remove recommendation', e);
    }
  };

  const loadRecommendations = async () => {
    try {
      const res = await fetch(createApiUrl('/recommendations'), { headers: authHeaders().headers });
      const data = await res.json();

      setReady(data.ready);
      setMissing(data.missing || []);
      setCourses(data.courses || []);
      setColleges(data.colleges || []);
      setGeneratedAt(data.generatedAt);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await fetch(createApiUrl('/recommendations/profile'), { headers: authHeaders().headers });
      const data = await res.json();
      setProfile(data.profile || {});
    } catch (error) {
      console.error(error.message);
    }
  };

useEffect(() => {
    loadProfile();
  }, []);

   const handleProfileSaved = (data) => {
    setProfile(data.profile || {});
    setReady(data.ready);
    setMissing(data.missing || []);
    setCourses(data.courses || []);
    setColleges(data.colleges || []);
    setGeneratedAt(data.generatedAt);
    setEditing(false);
    setLoading(false);
  };

  const toggleCompare = (collegeId) => {
    setCompareIds((prev) =>
      prev.includes(collegeId)
        ? prev.filter((id) => id !== collegeId)
        : [...prev, collegeId].slice(0, 3)
    );
  };

  const openCompare = () => {
    navigate(`/compare?ids=${compareIds.join(',')}`);
  };

  return (
    <div className="min-h-screen bg-surface-subtle pb-[80px] py-4 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mobile Hero */}
        <div className="md:hidden bg-brand-navy rounded-md p-4 text-white mb-5 relative overflow-hidden border border-brand-navy">
          <div className="relative z-10">
            <p className="text-[11px] font-semibold bg-white/10 rounded-md px-2 py-0.5 inline-block mb-2 text-brand-soft">✨ AI-Powered</p>
            <h1 className="text-[18px] font-bold leading-tight mb-1">Your Recommendations</h1>
            <p className="text-[12px] text-white/80">Based on your profile, academics &amp; interests</p>
          </div>
        </div>
        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold text-ink">Personalized Recommendations</h1>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            Based on your profile, academics, entrance exam, location, budget and career interest.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setEditing((prev) => !prev)}
              className="text-brand"
            >
              <SlidersHorizontal className="size-4" />
              {editing ? 'Close Preferences' : 'Update Preferences'}
            </Button>

            {ready && (
              <></>
            )}

            {compareIds.length > 0 && (
              <Button className="bg-brand" onClick={openCompare}>
                Compare {compareIds.length} Selected
              </Button>
            )}
          </div>

          {generatedAt && (
            <p className="mt-3 text-[0.75rem] text-ink-muted">
              Last updated {new Date(generatedAt).toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* Update Preferences */}
        {editing && (
          <div className="mb-10 rounded-md border border-line bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-ink">Update Preferences</h2>
            <RecommendationProfileForm
              profile={profile}
              onSaved={handleProfileSaved}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        {/* Cold start */}
        {!loading && !ready && (
          <div className="rounded-md border border-line bg-white p-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-md bg-brand-softest text-brand">
              <GraduationCap className="size-8" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-ink">
              Complete your profile to get personalized recommendations
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-[0.875rem] text-ink-muted">
              We only ask for the details the recommendation engine actually uses.
              Nothing is recommended until this is filled in.
            </p>

            {missing.length > 0 && (
              <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left">
                {missing.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-[0.8125rem] text-ink"
                  >
                    <span className="size-1.5 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <Button className="mt-6 bg-brand" onClick={() => setEditing(true)}>
              Complete My Profile
            </Button>
          </div>
        )}

{loading && (
          <div className="rounded-md border border-line bg-white p-16 text-center">
            <p className="text-ink-muted">Finding the best matches for you...</p>
          </div>
        )}

        {/* Manual trigger for recommendations when ready but not loaded */}
        {!loading && ready && courses.length === 0 && colleges.length === 0 && (
          <div className="rounded-md border border-line bg-white p-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-md bg-brand-softest text-brand mb-4">
              <GraduationCap className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-ink">
              Ready for your personalized recommendations
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-[0.875rem] text-ink-muted">
              Click the button below to generate course and college recommendations based on your profile.
            </p>
            <Button className="mt-6 bg-brand" onClick={loadRecommendations}>
              Get My Recommendations
            </Button>
          </div>
        )}

        {/* Results */}
        {!loading && ready && (
          <div className="space-y-6 md:space-y-12">
            {missing.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
                <SlidersHorizontal className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] text-amber-900 font-medium">
                    Add {missing.join(', ').toLowerCase()} to improve these recommendations.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="mt-1.5 text-[12px] font-bold text-amber-700 underline"
                  >
                    Update preferences
                  </button>
                </div>
              </div>
            )}

            {/* App-like Tabs */}
            <div className="flex bg-surface-muted p-1 rounded-md md:hidden mb-4 border border-brand-border">
              <button
                onClick={() => setActiveTab('colleges')}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${activeTab === 'colleges' ? 'bg-brand text-white shadow-none' : 'text-ink-muted shadow-none'}`}
              >
                Colleges ({colleges.length})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${activeTab === 'courses' ? 'bg-brand text-white shadow-none' : 'text-ink-muted shadow-none'}`}
              >
                Courses ({courses.length})
              </button>
            </div>

            {/* Courses */}
            <section className={activeTab !== 'courses' ? 'hidden md:block' : ''}>
              <div className="mb-4 hidden md:block">
                <h2 className="text-2xl font-bold text-ink">Recommended Courses</h2>
                <p className="mt-1 text-[0.875rem] text-ink-muted">
                  Matched against your eligibility, interests and academics.
                </p>
              </div>

              {courses.length === 0 ? (
                <div className="rounded-md border border-brand-border bg-white p-10 text-center">
                  <p className="text-ink-muted text-[14px] font-medium">
                    No courses matched your profile yet. Try adding more academic details.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <CourseCard key={course._id} course={course} onRemove={handleRemove} />
                  ))}
                </div>
              )}
            </section>

            {/* Colleges */}
            <section className={activeTab !== 'colleges' ? 'hidden md:block' : ''}>
              <div className="mb-4 hidden md:block">
                <h2 className="text-2xl font-bold text-ink">Recommended Colleges</h2>
                <p className="mt-1 text-[0.875rem] text-ink-muted">
                  Colleges that offer your courses and fit your rank, location and budget.
                </p>
              </div>

              {colleges.length === 0 ? (
                <div className="rounded-md border border-brand-border bg-white p-10 text-center">
                  <p className="text-ink-muted text-[14px] font-medium">
                    No colleges matched your profile yet. Widen your location or budget preference.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {colleges.map((college) => (
                    <CollegeCard
                      key={college._id}
                      college={college}
                      comparing={compareIds.includes(college._id)}
                      onToggleCompare={() => toggleCompare(college._id)} onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Mobile Floating Actions */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 px-4 flex gap-2 pointer-events-none z-40">
        <div className="flex-1"></div>
        {compareIds.length > 0 && (
          <button onClick={openCompare} className="pointer-events-auto bg-brand hover:bg-brand-hover text-white px-4 py-2.5 rounded-md font-semibold border border-brand-border flex items-center gap-2 text-[13px] shadow-sm">
            <SlidersHorizontal size={16} />
            Compare ({compareIds.length})
          </button>
        )}
      </div>
    </div>
  );
}









