import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import StatusTimeline from '@/components/ui/StatusTimeline';
import { Star, MapPin, IndianRupee, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';

const statusBadgeClass = (status) => {
  const map = {
    Requested: 'bg-blue-50 text-blue-700 border-blue-200',
    Assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'In Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Completed: 'bg-green-50 text-brand border-green-200',
    Closed: 'bg-brand-softest text-ink-muted',
    Cancelled: 'bg-red-50 text-red-700',
  };

  return map[status] || 'bg-brand-softest text-ink-muted';
};

const AdminCounsellingDetail = () => {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [statusData, setStatusData] = useState({ status: '',note: '',});

  const [sessionData, setSessionData] = useState({sessionDate: '',sessionTime: '',sessionMode: '',sessionNotes: '',});

  const [recData, setRecData] = useState({collegeId: '',courseId: '',reason: '',counsellorNote: '',priority: 'Medium',isShortlisted: false,});

  const [followData, setFollowData] = useState({followUpDate: '',followUpNote: '',});

  const [closeData, setCloseData] = useState({closingNote: '',});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {

    const [requestRes, collegeRes, courseRes] = await Promise.all([
      axios.get(`/api/admin/counselling/${id}`),
      axios.get('/api/college'),
      axios.get('/api/course'),
    ]);

    const data = requestRes.data.request;

    setRequest(data);
    setColleges(collegeRes.data.colleges || []);
    setCourses(courseRes.data.courses || []);

    setStatusData({
      status: data.status,
      note: '',
    });
  };

  const handleAction = async (endpoint, data) => {

    const res = await axios.put(
      `/api/admin/counselling/${id}/${endpoint}`,
      data
    );

    setRequest(res.data.request);

    // Reset form after adding recommendation
    if (endpoint === 'recommendations') {
      setRecData({
        collegeId: '',
        courseId: '',
        reason: '',
        counsellorNote: '',
        priority: 'Medium',
        isShortlisted: false,
      });
    }
  };

  const handleRemoveRecommendation = async (index) => {
   
    const updatedRecs = [...(request.recommendations || [])];
    updatedRecs.splice(index, 1);

    const res = await axios.put(
      `/api/admin/counselling/${id}`,
      { recommendations: updatedRecs }
    );

    setRequest(res.data.request);
  };

  if (!request) {
    return null;
  }

  const counsellor = request.counsellorId;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">
            Request: {request.counsellingNumber}
          </h1>

          <p className="text-sm text-ink-muted mt-0.5">
            Submitted on{' '}
            {new Date(request.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <Badge
          variant="outline"
          className={`px-4 py-1.5 text-sm font-medium ${statusBadgeClass(
            request.status
          )}`}
        >
          {request.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-ink-muted uppercase tracking-wider font-semibold">
                Student Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {request.studentId?.name?.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold">{request.studentId?.name}</p>
                  <p className="text-xs text-ink-muted">
                    {request.studentId?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <span className="text-ink-muted">Phone</span>
                  <p className="font-medium">
                    {request.studentId?.phone}
                  </p>
                </div>

                <div>
                  <span className="text-ink-muted">Category</span>
                  <p className="font-medium">{request.category}</p>
                </div>

                <div>
                  <span className="text-ink-muted">10th %</span>
                  <p className="font-medium">
                    {request.tenthPercentage
                      ? `${request.tenthPercentage}%`
                      : '-'}
                  </p>
                </div>

                <div>
                  <span className="text-ink-muted">12th %</span>
                  <p className="font-medium">
                    {request.twelfthPercentage
                      ? `${request.twelfthPercentage}%`
                      : '-'}
                  </p>
                </div>

                <div>
                  <span className="text-ink-muted">Course</span>
                  <p className="font-medium">
                    {request.courseId?.name}
                  </p>
                </div>

                <div>
                  <span className="text-ink-muted">Location</span>
                  <p className="font-medium">
                    {[
                      request.preferredCity,
                      request.preferredState,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {request.studentMessage && (
                <div className="mt-2 bg-surface rounded p-2 text-xs text-ink-muted italic border border-line">
                  "{request.studentMessage}"
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-ink-muted uppercase tracking-wider font-semibold">
                Guidance Person
              </CardTitle>
            </CardHeader>

            <CardContent>
              {counsellor ? (
                <div className="flex items-start gap-3">
                  {counsellor.image ? (
                    <img
                      src={counsellor.image}
                      alt={counsellor.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-brand-border"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-brand-soft flex items-center justify-center text-brand font-bold">
                      {counsellor.name?.charAt(0)}
                    </div>
                  )}

                  <div className="text-sm">
                    <p className="font-semibold text-ink">
                      {counsellor.name}
                    </p>

                    <p className="text-xs text-ink-muted">
                      {counsellor.email}
                    </p>

                    {counsellor.phone && (
                      <p className="text-xs text-ink-muted">
                        {counsellor.phone}
                      </p>
                    )}

                    {counsellor.expertise?.length > 0 && (
                      <p className="text-xs text-brand mt-1">
                        {counsellor.expertise.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-ink-muted">
                  <div className="w-10 h-10 rounded-full bg-brand-softest flex items-center justify-center mx-auto mb-2">
                    <span className="text-ink-muted text-lg">?</span>
                  </div>
                  Not Assigned Yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-ink-muted uppercase tracking-wider font-semibold">
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
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="status">
            <TabsList className="mb-4 w-full grid grid-cols-4">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="recommendations">
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
            </TabsList>

            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Update Status
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Select
                    value={statusData.status}
                    onValueChange={(value) =>
                      setStatusData({
                        ...statusData,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>

                    <SelectContent>
                      {[
                        'Requested',
                        'Assigned',
                        'In Progress',
                        'Completed',
                        'Closed',
                        'Cancelled',
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Add a note (optional)"
                    value={statusData.note}
                    onChange={(e) =>
                      setStatusData({
                        ...statusData,
                        note: e.target.value,
                      })
                    }
                  />

                  <Button
                    className="bg-brand hover:bg-brand-dark"
                    onClick={() =>
                      handleAction('status', statusData)
                    }
                  >
                    Update Status
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="session">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Schedule Session
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-ink-muted mb-1 block">
                        Date
                      </label>

                      <Input
                        type="date"
                        value={sessionData.sessionDate}
                        onChange={(e) =>
                          setSessionData({
                            ...sessionData,
                            sessionDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-ink-muted mb-1 block">
                        Time
                      </label>

                      <Input
                        type="time"
                        value={sessionData.sessionTime}
                        onChange={(e) =>
                          setSessionData({
                            ...sessionData,
                            sessionTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Select
                    value={sessionData.sessionMode}
                    onValueChange={(value) =>
                      setSessionData({
                        ...sessionData,
                        sessionMode: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>

                    <SelectContent>
                      {['Phone', 'Video', 'Chat', 'In Person'].map(
                        (mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Session notes…"
                    value={sessionData.sessionNotes}
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        sessionNotes: e.target.value,
                      })
                    }
                    rows={3}
                  />

                  <Button
                    className="bg-brand hover:bg-brand-dark"
                    onClick={() =>
                      handleAction('session', sessionData)
                    }
                  >
                    Schedule Session
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Recommendations
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Existing Recommendations Display */}
                  {request.recommendations && request.recommendations.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-ink mb-2">
                        Current Recommendations ({request.recommendations.length})
                      </h4>
                      {request.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-line rounded-lg p-4 hover:border-brand-border transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-ink">
                                  {rec.collegeId?.name || 'Unknown College'}
                                </span>
                                {rec.isShortlisted && (
                                  <Badge variant="default" className="bg-yellow-100 text-yellow-700">
                                    <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                    Shortlisted
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className={
                                    rec.priority === 'High'
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : rec.priority === 'Medium'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-green-50 text-brand border-green-200'
                                  }
                                >
                                  {rec.priority} Priority
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-ink-muted">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                                  <span>
                                    {rec.collegeId?.location?.city || ''}{rec.collegeId?.location?.city && rec.collegeId?.location?.state ? ', ' : ''}
                                    {rec.collegeId?.location?.state || ''}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="w-3.5 h-3.5 text-ink-muted" />
                                  <span>
                                    ₹{rec.collegeId?.averageFees ? rec.collegeId.averageFees.toLocaleString() : '—'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-ink-muted">Course:</span>
                                  <span className="font-medium">
                                    {rec.courseId?.name || '—'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-ink-muted">Type:</span>
                                  <span className="font-medium">
                                    {rec.collegeId?.type || '—'}
                                  </span>
                                </div>
                              </div>

                              {rec.reason && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                  <p className="text-sm text-blue-800 font-medium mb-1">Reason:</p>
                                  <p className="text-sm text-blue-700">{rec.reason}</p>
                                </div>
                              )}

                              {rec.counsellorNote && (
                                <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                                  <p className="text-sm text-purple-800 font-medium mb-1">Counsellor Note:</p>
                                  <p className="text-sm text-purple-700">{rec.counsellorNote}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {rec.collegeId?.website && (
                                <a
                                  href={rec.collegeId.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-ink-muted hover:text-brand hover:bg-brand-softest rounded-lg transition-colors"
                                  title="Visit Website"
                                >
                                  <ExternalLink className="w-4.5 h-4.5" />
                                </a>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleRemoveRecommendation(idx)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-ink-muted">
                      <p className="text-sm">No recommendations added yet.</p>
                    </div>
                  )}

                  {/* Add New Recommendation Form */}
                  <div className="border-t border-line pt-4">
                    <h4 className="text-sm font-semibold text-ink mb-3">
                      Add New Recommendation
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-ink-muted mb-1 block">
                            College
                          </label>
                          <Select
                            value={recData.collegeId}
                            onValueChange={(value) =>
                              setRecData({
                                ...recData,
                                collegeId: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select College" />
                            </SelectTrigger>
                            <SelectContent>
                              {colleges.map((college) => (
                                <SelectItem
                                  key={college._id}
                                  value={college._id}
                                >
                                  {college.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink-muted mb-1 block">
                            Course
                          </label>
                          <Select
                            value={recData.courseId}
                            onValueChange={(value) =>
                              setRecData({
                                ...recData,
                                courseId: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem
                                  key={course._id}
                                  value={course._id}
                                >
                                  {course.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-ink-muted mb-1 block">
                            Priority
                          </label>
                          <Select
                            value={recData.priority}
                            onValueChange={(value) =>
                              setRecData({
                                ...recData,
                                priority: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High Priority</SelectItem>
                              <SelectItem value="Medium">Medium Priority</SelectItem>
                              <SelectItem value="Low">Low Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink-muted mb-1 block">
                            Shortlist
                          </label>
                          <Select
                            value={recData.isShortlisted ? 'true' : 'false'}
                            onValueChange={(value) =>
                              setRecData({
                                ...recData,
                                isShortlisted: value === 'true',
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Shortlist?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes, Shortlist</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-ink-muted mb-1 block">
                          Reason for Recommendation
                        </label>
                        <Textarea
                          placeholder="Why is this college recommended for this student?"
                          value={recData.reason}
                          onChange={(e) =>
                            setRecData({
                              ...recData,
                              reason: e.target.value,
                            })
                          }
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-ink-muted mb-1 block">
                          Counsellor Note (Private)
                        </label>
                        <Textarea
                          placeholder="Internal notes for counsellor only"
                          value={recData.counsellorNote}
                          onChange={(e) =>
                            setRecData({
                              ...recData,
                              counsellorNote: e.target.value,
                            })
                          }
                          rows={2}
                        />
                      </div>

                      <Button
                        className="bg-brand hover:bg-brand-dark"
                        onClick={() =>
                          handleAction('recommendations', {
                            recommendations: [recData],
                          })
                        }
                      >
                        Add Recommendation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="followup">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Set Follow-up
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <Input
                      type="date"
                      value={followData.followUpDate}
                      onChange={(e) =>
                        setFollowData({
                          ...followData,
                          followUpDate: e.target.value,
                        })
                      }
                    />

                    <Input
                      placeholder="Follow-up note"
                      value={followData.followUpNote}
                      onChange={(e) =>
                        setFollowData({
                          ...followData,
                          followUpNote: e.target.value,
                        })
                      }
                    />

                    <Button
                      className="bg-brand hover:bg-brand-dark"
                      onClick={() =>
                        handleAction('follow-up', followData)
                      }
                    >
                      Set Follow-up
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle className="text-base text-red-600">
                      Close Counselling
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Closing note"
                      value={closeData.closingNote}
                      onChange={(e) =>
                        setCloseData({
                          ...closeData,
                          closingNote: e.target.value,
                        })
                      }
                    />

                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleAction('close', closeData)
                      }
                    >
                      Close Counselling
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCounsellingDetail;
