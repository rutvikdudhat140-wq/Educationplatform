
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2 } from 'lucide-react';

const SuggestionList = ({
  title,
  items,
  selected,
  onAdd,
  onRemove,
  renderItem,
  placeholder
}) => {
  const [query, setQuery] = useState('');

  const filtered = items.filter(
    (item) =>
      renderItem(item).toLowerCase().includes(query.toLowerCase()) &&
      !selected.find((s) => s._id === item._id)
  );

  return (
    <div>
      {title && (
        <p className="text-sm font-semibold text-ink mb-2">
          {title}
        </p>
      )}

      {selected.length > 0 && (
        <div className="space-y-2 mb-3">
          {selected.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-brand-softest border border-brand-border rounded-md px-3 py-2"
            >
              <span className="text-sm flex-1">
                {renderItem(item)}
              </span>

              {item.note !== undefined && (
                <Input
                  className="h-7 text-xs w-48"
                  placeholder="Add a note..."
                  value={item.note || ''}
                  onChange={(e) =>
                    onAdd(
                      {
                        ...item,
                        note: e.target.value
                      },
                      index
                    )
                  }
                />
              )}

              <button
                onClick={() => onRemove(index)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-sm"
      />

      {query && filtered.length > 0 && (
        <div className="border rounded-md mt-1 bg-white shadow-sm max-h-40 overflow-y-auto">
          {filtered.slice(0, 8).map((item) => (
            <button
              key={item._id}
              className="w-full text-left px-3 py-2 text-sm hover:bg-surface border-b last:border-b-0"
              onClick={() => {
                onAdd({
                  ...item,
                  note: item.note !== undefined ? '' : undefined
                });
                setQuery('');
              }}
            >
              {renderItem(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CounsellingGuidanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  const [allColleges, setAllColleges] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allExams, setAllExams] = useState([]);

  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [examGuidance, setExamGuidance] = useState([]);
  const [collegeComparison, setCollegeComparison] = useState([]);

  const [finalRecommendation, setFinalRecommendation] = useState('');
  const [counsellorNotes, setCounsellorNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
  });

  const fetchData = async () => {
    try {
      const [requestRes, collegeRes, courseRes, examRes] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/counselling/${id}`,
            getAuthHeaders()
          ),
          axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/college`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/course`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam`)
        ]);

      const data = requestRes.data.request;

      setRequest(data);
      setAllColleges(collegeRes.data.colleges || []);
      setAllCourses(courseRes.data.courses || []);
      setAllExams(examRes.data.exams || []);

      if (data.guidance) {
        setCollegeSuggestions(
          (data.guidance.collegeSuggestions || []).map((item) => ({
            ...(item.collegeId || {}),
            _id: item.collegeId?._id || item.collegeId,
            note: item.note || ''
          }))
        );

        setCourseSuggestions(
          (data.guidance.courseSuggestions || []).map((item) => ({
            ...(item.courseId || {}),
            _id: item.courseId?._id || item.courseId,
            note: item.note || ''
          }))
        );

        setExamGuidance(
          (data.guidance.examGuidance || []).map((item) => ({
            ...(item.examId || {}),
            _id: item.examId?._id || item.examId,
            note: item.note || ''
          }))
        );

        setCollegeComparison(
          (data.guidance.collegeComparison || []).map((item) => ({
            ...(item.collegeId || {}),
            _id: item.collegeId?._id || item.collegeId
          }))
        );

        setFinalRecommendation(
          data.guidance.finalRecommendation || ''
        );

        setCounsellorNotes(
          data.guidance.counsellorNotes || ''
        );
      }
    } catch {
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/counselling/${id}/guidance`,
        {
          collegeSuggestions: collegeSuggestions.map((item) => ({
            collegeId: item._id,
            note: item.note || ''
          })),

          courseSuggestions: courseSuggestions.map((item) => ({
            courseId: item._id,
            note: item.note || ''
          })),

          examGuidance: examGuidance.map((item) => ({
            examId: item._id,
            note: item.note || ''
          })),

          collegeComparison: collegeComparison.map((item) => ({
            collegeId: item._id
          })),

          finalRecommendation,
          counsellorNotes
        },
        getAuthHeaders()
      );

      fetchData();
    } catch {
    }
  };

  const handleComplete = async () => {
   

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/counselling/${id}/complete`,
        null,
        getAuthHeaders()
      );

      navigate('/counselling');
    } catch {
    }
  };

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4 text-ink-muted">
        Request not found.
      </div>
    );
  }

  const student = request.studentId;
  const isCompleted = request.status === 'Completed';

  const updateItem = (setter, list) => (item, index) => {
    if (index !== undefined) {
      const updated = [...list];
      updated[index] = item;
      setter(updated);
    } else {
      setter([...list, item]);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/counselling/${id}`)}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">
            {request.counsellingNumber}
          </h1>
          <p className="text-sm text-ink-muted">
            Provide guidance for this student
          </p>
        </div>

        <Badge
          className={`ml-auto ${
            isCompleted
              ? 'bg-green-100 text-brand'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {request.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Student Information
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <p><strong>Name:</strong> {student?.name}</p>
              <p><strong>Email:</strong> {student?.email}</p>
              <p><strong>Phone:</strong> {student?.phone || '-'}</p>
              <p><strong>Qualification:</strong> {request.qualification || '-'}</p>
              <p><strong>10th:</strong> {request.tenthPercentage ? `${request.tenthPercentage}%` : '-'}</p>
              <p><strong>12th:</strong> {request.twelfthPercentage ? `${request.twelfthPercentage}%` : '-'}</p>
              <p><strong>Category:</strong> {request.category || '-'}</p>
              <p><strong>Score:</strong> {request.score || '-'}</p>
              <p><strong>Rank:</strong> {request.rank || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Preferences
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <p><strong>Course:</strong> {request.courseId?.name || '-'}</p>
              <p><strong>Exam:</strong> {request.examId?.name || '-'}</p>

              <p>
                <strong>Location:</strong>{' '}
                {[
                  request.preferredCity,
                  request.preferredState
                ].filter(Boolean).join(', ') || '-'}
              </p>

              <p><strong>Budget:</strong> {request.budgetRange || '-'}</p>
              <p><strong>Career:</strong> {request.careerInterest || '-'}</p>

              {request.studentMessage && (
                <div className="mt-2 bg-surface p-2 rounded text-ink-muted italic text-xs">
                  "{request.studentMessage}"
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-5">
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 text-brand text-sm rounded-md px-4 py-3">
              This counselling is <strong>Completed</strong>.
              You can still update the guidance below.
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                College Suggestions
              </CardTitle>
            </CardHeader>

            <CardContent>
              <SuggestionList
                items={allColleges}
                selected={collegeSuggestions}
                placeholder="Search colleges..."
                renderItem={(college) =>
                  `${college.name}${
                    college.location?.city
                      ? ` (${college.location.city})`
                      : ''
                  }`
                }
                onAdd={updateItem(
                  setCollegeSuggestions,
                  collegeSuggestions
                )}
                onRemove={(index) =>
                  setCollegeSuggestions(
                    collegeSuggestions.filter(
                      (_, i) => i !== index
                    )
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Course Suggestions
              </CardTitle>
            </CardHeader>

            <CardContent>
              <SuggestionList
                items={allCourses}
                selected={courseSuggestions}
                placeholder="Search courses..."
                renderItem={(course) =>
                  course.fullName || course.name
                }
                onAdd={updateItem(
                  setCourseSuggestions,
                  courseSuggestions
                )}
                onRemove={(index) =>
                  setCourseSuggestions(
                    courseSuggestions.filter(
                      (_, i) => i !== index
                    )
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Exam Guidance
              </CardTitle>
            </CardHeader>

            <CardContent>
              <SuggestionList
                items={allExams}
                selected={examGuidance}
                placeholder="Search exams..."
                renderItem={(exam) =>
                  `${exam.name}${
                    exam.shortName
                      ? ` (${exam.shortName})`
                      : ''
                  }`
                }
                onAdd={updateItem(
                  setExamGuidance,
                  examGuidance
                )}
                onRemove={(index) =>
                  setExamGuidance(
                    examGuidance.filter(
                      (_, i) => i !== index
                    )
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                College Comparison
              </CardTitle>
            </CardHeader>

            <CardContent>
              <SuggestionList
                items={allColleges}
                selected={collegeComparison}
                placeholder="Add colleges to compare..."
                renderItem={(college) =>
                  `${college.name}${
                    college.location?.city
                      ? ` (${college.location.city})`
                      : ''
                  }`
                }
                onAdd={(item, index) => {
                  if (index === undefined) {
                    setCollegeComparison([
                      ...collegeComparison,
                      item
                    ]);
                  }
                }}
                onRemove={(index) =>
                  setCollegeComparison(
                    collegeComparison.filter(
                      (_, i) => i !== index
                    )
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Final Recommendation
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Textarea
                rows={4}
                placeholder="Write your final recommendation for the student..."
                value={finalRecommendation}
                onChange={(e) =>
                  setFinalRecommendation(e.target.value)
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Counsellor Notes
                <span className="text-xs font-normal text-ink-muted ml-2">
                  (Private)
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Textarea
                rows={3}
                placeholder="Internal notes for your reference..."
                value={counsellorNotes}
                onChange={(e) =>
                  setCounsellorNotes(e.target.value)
                }
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 pb-8">
            <Button
              onClick={handleSave}
              className="flex-1 bg-brand hover:bg-brand-dark"
            >
              Save Guidance
            </Button>

            {!isCompleted && (
              <Button
                variant="outline"
                className="border-green-500 text-brand hover:bg-green-50"
                onClick={handleComplete}
              >
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellingGuidanceForm;
