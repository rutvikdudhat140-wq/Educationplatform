
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  User,
  UserCheck,
  Video
} from 'lucide-react';
import StatusTimeline from '@/components/ui/StatusTimeline';

const CounsellingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchRequest = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/counselling/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setRequest(res.data.request);
      } catch {
        setRequest(null);
      }
    };

    fetchRequest();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    const colors = {
      Requested: 'bg-blue-100 text-blue-800 border-blue-200',
      Assigned: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Completed: 'bg-green-100 text-green-800 border-green-200',
      'Follow-up Required': 'bg-orange-100 text-orange-800 border-orange-200',
      Closed: 'bg-gray-100 text-gray-800 border-gray-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getModeIcon = (mode) => {
    const icons = {
      Video: <Video className="w-4 h-4" />,
      Phone: <Phone className="w-4 h-4" />,
      Chat: <MessageSquare className="w-4 h-4" />,
      'In Person': <User className="w-4 h-4" />
    };

    return icons[mode] || <Calendar className="w-4 h-4" />;
  };

  const resolveRef = (ref) =>
    typeof ref === 'object' && ref !== null ? ref : null;

  const currentUserId = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored).id : null;
    } catch {
      return null;
    }
  })();

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4 text-center text-ink-muted">
        Counselling request not found.
      </div>
    );
  }

  const counsellor = resolveRef(request.counsellorId);
  const guidance = request.guidance;
  const isCounsellorOwner =
    counsellor && currentUserId === String(counsellor._id);

  const hasGuidance =
    guidance &&
    (
      guidance.collegeSuggestions?.length > 0 ||
      guidance.courseSuggestions?.length > 0 ||
      guidance.examGuidance?.length > 0 ||
      guidance.finalRecommendation
    );

  const formatBudget = (fees) => {
    if (typeof fees === 'number' && fees > 0) {
      return `₹${fees.toLocaleString('en-IN')}`;
    }
    if (typeof fees === 'string' && fees && fees !== '0') {
      return fees;
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-4">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/my-counselling')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-ink">
              {request.counsellingNumber || 'Counselling Details'}
            </h1>

            <p className="text-sm text-ink-muted">
              Created on{' '}
              {new Date(request.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-sm py-1 px-4 ${getStatusColor(request.status)}`}
        >
          {request.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">

          {/* Assigned Guidance Person */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCheck className="w-5 h-5 text-brand" />
                Assigned Guidance Person
              </CardTitle>
            </CardHeader>

            <CardContent>
              {counsellor ? (
                <div className="bg-brand-softest rounded-lg border border-brand-border p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {counsellor.image ? (
                      <img
                        src={counsellor.image}
                        alt={counsellor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-brand-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center text-brand font-bold text-xl flex-shrink-0">
                        {counsellor.name?.charAt(0) || 'G'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink">
                          {counsellor.name || 'Guidance Person'}
                        </p>

                        {counsellor.isActive !== false ? (
                          <Badge className="bg-green-100 text-brand border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 space-y-1.5 text-sm text-ink-muted">
                        {counsellor.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                            {counsellor.email}
                          </p>
                        )}

                        {counsellor.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                            {counsellor.phone}
                          </p>
                        )}
                      </div>

                      {counsellor.expertise?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1.5">
                            Expertise
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {counsellor.expertise.map((exp, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-white text-brand border-brand-border"
                              >
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {counsellor.availableDays?.length > 0 && (
                        <p className="mt-3 text-xs text-ink-muted">
                          <span className="font-semibold text-ink-muted">
                            Available:
                          </span>{' '}
                          {counsellor.availableDays.join(', ')}
                        </p>
                      )}

                      {isCounsellorOwner && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link to={`/counselling/${request._id}/guidance`}>
                            <Button className="bg-brand hover:bg-brand-dark">
                              Edit Guidance
                            </Button>
                          </Link>

                          {request.followUpTasks?.length > 0 && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                document
                                  .getElementById('follow-up-section')
                                  ?.scrollIntoView({ behavior: 'smooth' })
                              }
                            >
                              View Follow-ups
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-surface rounded-lg">
                  <User className="w-10 h-10 text-ink-muted mx-auto mb-2" />
                  <p className="text-ink-muted font-medium">
                    Guidance Person not assigned yet.
                  </p>
                  <p className="text-sm text-ink-muted mt-1">
                    Our admin will assign a Guidance Person to your request shortly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidance */}
          {hasGuidance ? (
            <>
              {/* College Suggestions */}
              {guidance.collegeSuggestions?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="w-5 h-5 text-brand" />
                      Recommended Colleges
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {guidance.collegeSuggestions.map((s, i) => {
                      const college = resolveRef(s.collegeId);

                      return (
                        <div
                          key={i}
                          className="border border-line rounded-md overflow-hidden bg-white"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="flex items-start gap-4 p-4 flex-1">
                              {college?.logo ? (
                                <div className="w-16 h-16 rounded-md bg-surface border border-line p-1.5 flex items-center justify-center flex-shrink-0">
                                  <img
                                    src={college.logo}
                                    alt={college.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-md bg-brand-softest border border-brand-border flex items-center justify-center flex-shrink-0">
                                  <Building2 className="w-7 h-7 text-brand" />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-ink">
                                    {college?.name || 'College'}
                                  </h4>

                                  {college?.collegeType && (
                                    <Badge className="bg-brand-softest text-ink-muted border-line">
                                      {college.collegeType}
                                    </Badge>
                                  )}

                                  {college?.isTopCollege && (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                      <Award className="w-3 h-3 mr-1" />
                                      Top College
                                    </Badge>
                                  )}
                                </div>

                                {(college?.location?.city ||
                                  college?.location?.state) && (
                                  <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {[college.location.city, college.location.state]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-ink-muted">
                                  {college?.rating > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                      <span className="font-medium">
                                        {college.rating}/5
                                      </span>
                                    </span>
                                  )}

                                  {college?.establishedYear && (
                                    <span>
                                      Est. {college.establishedYear}
                                    </span>
                                  )}

                                  {college?.category && (
                                    <span>{college.category}</span>
                                  )}

                                  {college?.accreditations?.length > 0 && (
                                    <span>
                                      {college.accreditations.join(', ')}
                                    </span>
                                  )}
                                </div>

                                {college?.description && (
                                  <p className="text-sm text-ink-muted mt-2 line-clamp-2">
                                    {college.description}
                                  </p>
                                )}

                                {s.note && (
                                  <div className="mt-2 bg-brand-softest border border-brand-border rounded-md px-3 py-2">
                                    <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-0.5">
                                      Why we suggest this
                                    </p>
                                    <p className="text-sm text-ink italic">
                                      "{s.note}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {college?._id && (
                              <div className="flex sm:flex-col justify-end gap-2 p-4 pt-0 sm:pt-4 sm:border-l border-line">
                                <Link to={`/colleges/${college._id}`}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                  >
                                    View Details
                                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                  </Button>
                                </Link>

                                <Link
                                  to={`/apply?collegeId=${college._id}${
                                    request.courseId?._id
                                      ? `&courseId=${request.courseId._id}`
                                      : ''
                                  }`}
                                >
                                  <Button
                                    size="sm"
                                    className="w-full bg-brand hover:bg-brand-dark"
                                  >
                                    Apply Now
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Course Suggestions */}
              {guidance.courseSuggestions?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <GraduationCap className="w-5 h-5 text-brand" />
                      Suggested Courses
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {guidance.courseSuggestions.map((s, i) => {
                      const course = resolveRef(s.courseId);

                      return (
                        <div
                          key={i}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-ink">
                                {course?.fullName || course?.name || 'Course'}
                              </h4>

                              {course?.name && course?.fullName && (
                                <p className="text-xs text-ink-muted">
                                  {course.name}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-ink-muted">
                                {course?.level && (
                                  <Badge variant="outline" className="bg-surface">
                                    {course.level}
                                  </Badge>
                                )}

                                {course?.stream && (
                                  <span>{course.stream}</span>
                                )}

                                {course?.duration && (
                                  <span>
                                    <Clock className="w-3.5 h-3.5 inline mr-1 text-brand" />
                                    {course.duration}
                                  </span>
                                )}

                                {formatBudget(course?.fees) && (
                                  <span className="font-medium text-ink">
                                    ₹ Fees: {formatBudget(course.fees)}
                                  </span>
                                )}
                              </div>

                              {course?.description && (
                                <p className="text-sm text-ink-muted mt-2 line-clamp-2">
                                  {course.description}
                                </p>
                              )}
                            </div>

                            {course?._id && (
                              <Link
                                to={`/courses/${course._id}`}
                                className="flex-shrink-0"
                              >
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                            )}
                          </div>

                          {s.note && (
                            <div className="mt-3 bg-brand-softest border border-brand-border rounded-md px-3 py-2">
                              <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-0.5">
                                Why we suggest this
                              </p>
                              <p className="text-sm text-ink italic">
                                "{s.note}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Exam Guidance */}
              {guidance.examGuidance?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Exam Guidance
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {guidance.examGuidance.map((s, i) => {
                      const exam = resolveRef(s.examId);

                      return (
                        <div key={i} className="border rounded-lg p-4 bg-white">
                          <h4 className="font-semibold text-ink">
                            {exam?.name || 'Exam'}

                            {exam?.shortName && (
                              <span className="text-xs text-ink-muted ml-1">
                                ({exam.shortName})
                              </span>
                            )}
                          </h4>

                          {(exam?.level ||
                            exam?.examType ||
                            exam?.conductingBody) && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {exam?.level && (
                                <Badge variant="outline" className="bg-surface">
                                  {exam.level}
                                </Badge>
                              )}

                              {exam?.examType && (
                                <Badge variant="outline" className="bg-surface">
                                  {exam.examType}
                                </Badge>
                              )}

                              {exam?.stream && (
                                <Badge variant="outline" className="bg-surface">
                                  {exam.stream}
                                </Badge>
                              )}
                            </div>
                          )}

                          {exam?.conductingBody && (
                            <p className="text-xs text-ink-muted mt-1.5">
                              Conducted by: {exam.conductingBody}
                            </p>
                          )}

                          {s.note && (
                            <div className="mt-3 bg-brand-softest border border-brand-border rounded-md px-3 py-2">
                              <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-0.5">
                                Counsellor note
                              </p>
                              <p className="text-sm text-ink italic">
                                "{s.note}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* College Comparison */}
              {guidance.collegeComparison?.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      College Comparison
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {guidance.collegeComparison.map((c, i) => {
                        const college = resolveRef(c.collegeId);

                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 border rounded-lg p-3 bg-surface"
                          >
                            {college?.logo ? (
                              <div className="w-10 h-10 rounded-md bg-white border border-line p-1 flex items-center justify-center flex-shrink-0">
                                <img
                                  src={college.logo}
                                  alt={college.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-brand-softest border border-brand-border flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-brand" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-medium text-ink text-sm truncate">
                                {college?.name || 'College'}
                              </p>

                              {college?.rating > 0 && (
                                <p className="flex items-center gap-1 text-xs text-ink-muted">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {college.rating}/5
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/compare?ids=${guidance.collegeComparison
                          .map((c) => c.collegeId?._id)
                          .filter(Boolean)
                          .join(',')}`}
                      >
                        <Button size="sm" variant="outline">
                          Compare These Colleges
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Final Recommendation */}
              {guidance.finalRecommendation && (
                <Card className="border-brand-border bg-brand-softest">
                  <CardHeader>
                    <CardTitle className="text-base text-brand-dark">
                      Final Recommendation
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-ink whitespace-pre-wrap leading-relaxed">
                      {guidance.finalRecommendation}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            counsellor && (
              <Card>
                <CardContent className="py-8 text-center bg-surface rounded-lg">
                  <p className="text-ink-muted font-medium">
                    No guidance provided yet
                  </p>

                  <p className="text-sm text-ink-muted mt-1 mb-4">
                    Your Guidance Person is working on recommendations for you.
                  </p>

                  {isCounsellorOwner && (
                    <Link to={`/counselling/${request._id}/guidance`}>
                      <Button className="bg-brand hover:bg-brand-dark">
                        Provide Guidance Now
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          )}

          {/* Session Details */}
          {request.sessionDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand" />
                  Session Details
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="bg-surface rounded-lg p-4 grid sm:grid-cols-3 grid-cols-2 gap-4">

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ink-muted" />

                    <div>
                      <p className="text-xs text-ink-muted">Date</p>
                      <p className="font-medium text-ink text-sm">
                        {new Date(request.sessionDate).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink-muted" />

                    <div>
                      <p className="text-xs text-ink-muted">Time</p>
                      <p className="font-medium text-ink text-sm">
                        {request.sessionTime || 'TBD'}
                      </p>
                    </div>
                  </div>

                  {request.sessionMode && (
                    <div className="flex items-center gap-2">
                      {getModeIcon(request.sessionMode)}

                      <div>
                        <p className="text-xs text-ink-muted">Mode</p>
                        <p className="font-medium text-ink text-sm">
                          {request.sessionMode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {request.sessionTopic && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-ink-muted mb-1">
                      Session Topic
                    </p>

                    <p className="text-sm text-ink">
                      {request.sessionTopic}
                    </p>
                  </div>
                )}

                {request.sessionNotes && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-ink-muted mb-1">
                      Session Notes
                    </p>

                    <p className="text-sm text-ink">
                      {request.sessionNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {request.recommendations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand" />
                  Recommendations
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {request.recommendations.map((rec, index) => {
                  const college = resolveRef(rec.collegeId);
                  const course = resolveRef(rec.courseId);

                  return (
                    <div
                      key={index}
                      className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface"
                    >
                      <div className="flex gap-4 items-start w-full">
                        {college?.logo ? (
                          <div className="hidden sm:block w-16 h-16 rounded-md bg-white border border-line p-1 flex items-center justify-center flex-shrink-0">
                            <img
                              src={college.logo}
                              alt={college.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="hidden sm:flex w-16 h-16 rounded-md bg-brand-softest border border-brand-border items-center justify-center flex-shrink-0">
                            <Building2 className="w-7 h-7 text-brand" />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-lg text-ink">
                              {college?.name || 'College'}
                            </h4>

                            {rec.priority && (
                              <Badge
                                className={
                                  rec.priority === 'High'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : rec.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-brand-softest text-ink-muted border-line'
                                }
                              >
                                {rec.priority} priority
                              </Badge>
                            )}

                            {rec.isShortlisted && (
                              <Badge className="bg-brand-soft text-brand border-brand-border">
                                Shortlisted
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-ink-muted">
                            {course?.name && (
                              <span>
                                <span className="font-medium">Course:</span>{' '}
                                {course.name}
                              </span>
                            )}

                            {college?.location?.city && (
                              <span>
                                <span className="font-medium">Location:</span>{' '}
                                {college.location.city},{' '}
                                {college.location.state}
                              </span>
                            )}

                            {college?.collegeType && (
                              <span>
                                <span className="font-medium">Type:</span>{' '}
                                {college.collegeType}
                              </span>
                            )}

                            {college?.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">Rating:</span>{' '}
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {college.rating}/5
                              </span>
                            )}

                            {course?.duration && (
                              <span>
                                <span className="font-medium">Duration:</span>{' '}
                                {course.duration}
                              </span>
                            )}
                          </div>

                          {(rec.reason || rec.counsellorNote || rec.note) && (
                            <p className="text-sm mt-2 italic text-ink bg-white p-2 rounded border border-line whitespace-pre-wrap">
                              💬 "{rec.reason || rec.counsellorNote || rec.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      {college?._id && (
                        <div className="flex gap-2 w-full sm:w-auto sm:flex-col lg:flex-row">
                          <Link
                            to={`/colleges/${college._id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              View College
                            </Button>
                          </Link>

                          <Link
                            to={`/apply?collegeId=${college._id}${
                              course?._id
                                ? `&courseId=${course._id}`
                                : ''
                            }`}
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-brand hover:bg-brand-dark"
                            >
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Follow-up Tasks */}
          {request.followUpTasks?.length > 0 && (
            <Card id="follow-up-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand" />
                  Follow-up Tasks
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {request.followUpTasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 border rounded-lg p-3 bg-surface"
                  >
                    <div>
                      <p className="font-medium text-ink text-sm">
                        {task.task}
                      </p>

                      <p className="text-xs text-ink-muted mt-0.5">
                        Assigned to: {task.assignedTo || 'Student'}
                        {task.dueDate && (
                          <>
                            {' · '}
                            Due:{' '}
                            {new Date(task.dueDate).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }
                            )}
                          </>
                        )}
                      </p>
                    </div>

                    <Badge
                      className={
                        task.status === 'Completed'
                          ? 'bg-green-100 text-brand border-green-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }
                    >
                      {task.status || 'Pending'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium">{request.qualification || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Passing Year</p>
                <p className="font-medium">{request.passingYear || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Course Interest</p>
                <p className="font-medium">
                  {request.courseId?.name ||
                    request.courseId?.fullName ||
                    '-'
                  }
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Exam</p>
                <p className="font-medium">
                  {request.examId?.name || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Score / Rank</p>
                <p className="font-medium">
                  {request.score
                    ? `${request.score} (Score)`
                    : ''}
                  {request.score && request.rank ? ' / ' : ''}
                  {request.rank
                    ? `${request.rank} (Rank)`
                    : ''}
                  {!request.score && !request.rank && '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">10th / 12th (%)</p>
                <p className="font-medium">
                  {request.tenthPercentage
                    ? `${request.tenthPercentage}%`
                    : '-'}
                  {request.tenthPercentage &&
                    request.twelfthPercentage
                    ? ' / '
                    : ''}
                  {request.twelfthPercentage
                    ? `${request.twelfthPercentage}%`
                    : ''}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">
                  {request.category || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Preferred Location
                </p>
                <p className="font-medium">
                  {request.preferredCity || ''}
                  {request.preferredCity &&
                    request.preferredState
                    ? ', '
                    : ''}
                  {request.preferredState || '-'}
                </p>
              </div>

              {request.budgetRange && (
                <div>
                  <p className="text-sm text-gray-500">Budget Range</p>
                  <p className="font-medium">{request.budgetRange}</p>
                </div>
              )}

              {request.careerInterest && (
                <div>
                  <p className="text-sm text-gray-500">Career Interest</p>
                  <p className="font-medium">{request.careerInterest}</p>
                </div>
              )}

              {request.studentMessage && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">
                    Your Message
                  </p>

                  <p className="font-medium bg-surface p-3 rounded-lg mt-1">
                    {request.studentMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">
                Status Timeline
              </CardTitle>
            </CardHeader>

            <CardContent>
              <StatusTimeline
                currentStatus={request.status}
                statusHistory={request.statusHistory || []}
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="pt-6 space-y-3">

              <Link to="/my-counselling" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Requests
                </Button>
              </Link>

              <Link to="/counselling" className="block">
                <Button className="w-full bg-brand hover:bg-brand-dark">
                  Request New Counselling
                </Button>
              </Link>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default CounsellingDetail;
