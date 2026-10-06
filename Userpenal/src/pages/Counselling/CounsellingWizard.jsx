import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Building2, GraduationCap, MapPin, Search, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';

const steps = [
  "Profile", "Course Suggestions", "College Suggestions", "Exam Guidance", "Compare", "Final Decision"
];

const CounsellingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [exams, setExams] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedCollegesToCompare, setSelectedCollegesToCompare] = useState([]);
  const [finalCollege, setFinalCollege] = useState(null);
  const [finalCourse, setFinalCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', dob: '', gender: '', state: '', city: '',
    qualification: '', tenthPercentage: '', twelfthPercentage: '', graduationPercentage: '', passingYear: '', subjects: '',
    examId: '', score: '', rank: '', category: '',
    courseId: '', careerInterest: '', preferredStream: '',
    preferredState: '', preferredCity: '', preferredColleges: '', budgetRange: '', hostelRequirement: '',
    studentMessage: ''
  });

  const fetchBaseData = async () => {
    const token = localStorage.getItem('userToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const [courseRes, collegeRes, examRes, careerRes] = await Promise.all([
        axios.get('http://localhost:5001/api/course', { headers }),
        axios.get('http://localhost:5001/api/college', { headers }),
        axios.get('http://localhost:5001/api/exam', { headers }),
        axios.get('http://localhost:5001/api/career?limit=200', { headers })
      ]);
      setCourses(courseRes.data.courses || courseRes.data.data || []);
      setColleges(collegeRes.data.colleges || collegeRes.data.data || []);
      setExams(examRes.data.exams || examRes.data.data || []);
      setCareers(careerRes.data.careers || careerRes.data.data || []);
    } catch (err) {
      console.error('Error fetching base counselling data', err);
    }
  };

  useEffect(() => {
    fetchBaseData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelect = (name, value) => setFormData({ ...formData, [name]: value });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const startOver = () => {
    setCurrentStep(0);
    setFinalCollege(null);
    setFinalCourse(null);
    setSelectedCollegesToCompare([]);
    setFormData({
      name: '', email: '', phone: '', dob: '', gender: '', state: '', city: '',
      qualification: '', tenthPercentage: '', twelfthPercentage: '', graduationPercentage: '', passingYear: '', subjects: '',
      examId: '', score: '', rank: '', category: '',
      courseId: '', careerInterest: '', preferredStream: '',
      preferredState: '', preferredCity: '', preferredColleges: '', budgetRange: '', hostelRequirement: '',
      studentMessage: ''
    });
  };

  const submitProfile = async () => {
    if (!formData.name || formData.name.length < 2) {
      alert('Please enter your full name');
      return;
    }
    if (!formData.email || formData.email.length < 3) {
      alert('Please enter a valid email');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const token = localStorage.getItem('userToken');

    if (token) {
      try {
        await axios.post('http://localhost:5001/api/counselling', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const recRes = await axios.post('http://localhost:5001/api/counselling/recommend', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (recRes.data.courses) setCourses(recRes.data.courses);
        if (recRes.data.colleges) setColleges(recRes.data.colleges);
      } catch (err) {
        console.error('Error submitting counselling profile', err);
      }
    }
    nextStep();
  };

  const getMatchScore = (item) => {
    if (item.matchScore) return item.matchScore;
    return 75;
  };

  const renderProfile = () => (
    <div className="space-y-6 rounded-md border border-line bg-white p-6 shadow-none">
      <div>
        <h2 className="text-base font-bold text-ink border-b border-line pb-2 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Input name="name" placeholder="Full Name *" onChange={handleChange} value={formData.name} className="h-10 text-xs rounded-md" />
          <Input name="email" placeholder="Email *" onChange={handleChange} value={formData.email} className="h-10 text-xs rounded-md" />
          <Input name="phone" placeholder="Mobile Number *" onChange={handleChange} value={formData.phone} className="h-10 text-xs rounded-md" />
          <Input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} value={formData.dob} className="h-10 text-xs rounded-md" />
          <Select value={formData.gender} onValueChange={(v) => handleSelect('gender', v)}>
            <SelectTrigger className="h-10 text-xs rounded-md"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input name="state" placeholder="State" onChange={handleChange} value={formData.state} className="h-10 text-xs rounded-md" />
          <Input name="city" placeholder="City" onChange={handleChange} value={formData.city} className="h-10 text-xs rounded-md" />
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-ink border-b border-line pb-2 mb-4">
          Academic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Input name="qualification" placeholder="Current Qualification (e.g. 12th PCM)" onChange={handleChange} value={formData.qualification} className="h-10 text-xs rounded-md" />
          <Input name="tenthPercentage" placeholder="10th Percentage (%)" type="number" onChange={handleChange} value={formData.tenthPercentage} className="h-10 text-xs rounded-md" />
          <Input name="twelfthPercentage" placeholder="12th Percentage (%)" type="number" onChange={handleChange} value={formData.twelfthPercentage} className="h-10 text-xs rounded-md" />
          <Input name="graduationPercentage" placeholder="Graduation Percentage (if applicable)" type="number" onChange={handleChange} value={formData.graduationPercentage} className="h-10 text-xs rounded-md" />
          <Input name="passingYear" placeholder="Passing Year" type="number" onChange={handleChange} value={formData.passingYear} className="h-10 text-xs rounded-md" />
          <Input name="subjects" placeholder="Major Subjects" onChange={handleChange} value={formData.subjects} className="h-10 text-xs rounded-md" />
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-ink border-b border-line pb-2 mb-4">
          Entrance Exam Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Select value={formData.examId} onValueChange={(v) => handleSelect('examId', v)}>
            <SelectTrigger className="h-10 text-xs rounded-md"><SelectValue placeholder="Exam Appeared" /></SelectTrigger>
            <SelectContent>
              {exams.map(e => <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input name="score" placeholder="Exam Score" type="number" onChange={handleChange} value={formData.score} className="h-10 text-xs rounded-md" />
          <Input name="rank" placeholder="Exam Rank" type="number" onChange={handleChange} value={formData.rank} className="h-10 text-xs rounded-md" />
          <Select value={formData.category} onValueChange={(v) => handleSelect('category', v)}>
            <SelectTrigger className="h-10 text-xs rounded-md"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General / OPEN</SelectItem>
              <SelectItem value="OBC">OBC-NCL</SelectItem>
              <SelectItem value="SC/ST">SC / ST</SelectItem>
              <SelectItem value="EWS">EWS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-ink border-b border-line pb-2 mb-4">
          Course & Location Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Select value={formData.courseId} onValueChange={(v) => handleSelect('courseId', v)}>
            <SelectTrigger className="h-10 text-xs rounded-md"><SelectValue placeholder="Interested Course" /></SelectTrigger>
            <SelectContent>
              {courses.map(c => <SelectItem key={c._id} value={c._id}>{c.name || c.fullName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input name="preferredState" placeholder="Preferred State" onChange={handleChange} value={formData.preferredState} className="h-10 text-xs rounded-md" />
          <Input name="preferredCity" placeholder="Preferred City" onChange={handleChange} value={formData.preferredCity} className="h-10 text-xs rounded-md" />
          <Select value={formData.budgetRange} onValueChange={(v) => handleSelect('budgetRange', v)}>
            <SelectTrigger className="h-10 text-xs rounded-md"><SelectValue placeholder="Annual Budget Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Under ₹2,00,000 / year</SelectItem>
              <SelectItem value="Medium">₹2,00,000 - ₹5,00,000 / year</SelectItem>
              <SelectItem value="High">Above ₹5,00,000 / year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={formData.careerInterest} onValueChange={(v) => handleSelect('careerInterest', v)}>
            <SelectTrigger className="h-10 text-xs rounded-md"><SelectValue placeholder="Career Goal" /></SelectTrigger>
            <SelectContent>
              {careers.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-ink border-b border-line pb-2 mb-4">
          Additional Guidance Requirements
        </h2>
        <Textarea
          name="studentMessage"
          placeholder="Mention specific questions, preferred colleges, scholarship queries or concerns..."
          onChange={handleChange}
          value={formData.studentMessage}
          rows={3}
          className="rounded-md border-line text-xs"
        />
      </div>

      <div className="pt-2">
        <Button
          className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-11 shadow-none flex items-center justify-center gap-1.5"
          onClick={submitProfile}
        >
          Save Profile & Generate Recommendations <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 bg-white p-5 rounded-md border">
        <h2 className="text-lg font-bold text-ink">Recommended Courses For Your Profile</h2>
        <p className="text-xs text-ink-muted mt-0.5">Calculated based on your academic eligibility, stream choice and career interests.</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-md border border-line">
          <p className="text-xs text-ink-muted mb-4">No course recommendations available for these criteria.</p>
          <Button variant="outline" onClick={prevStep} className="rounded-md text-xs h-9">
            ← Modify Profile
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.slice(0, 6).map(course => {
              const score = getMatchScore(course);
              return (
                <div key={course._id} className="rounded-md border border-line bg-white p-4 shadow-none flex flex-col justify-between hover:border-brand/40 transition-colors">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-sm text-ink">{course.name || course.fullName}</h3>
                      <span className="rounded bg-blue-50 text-brand text-[10px] font-bold px-2 py-0.5 border border-blue-100 shrink-0">
                        {score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mb-3">{course.stream} • {course.duration || '3-4 Years'}</p>
                    <div className="text-xs text-ink-muted space-y-1 mb-3">
                      <p><span className="font-semibold text-ink">Eligibility:</span> {course.eligibilityCriteria?.[0] || '10+2 with minimum 50%'}</p>
                      <p><span className="font-semibold text-ink">Employment Scope:</span> High Industry Demand</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-md border-line text-xs font-semibold h-8 text-brand hover:bg-blue-50/50 shadow-none"
                    onClick={() => {
                      setFinalCourse(course);
                      nextStep();
                    }}
                  >
                    Select Course & View Colleges
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={prevStep} className="rounded-md text-xs h-9 border-line">
              ← Back to Profile
            </Button>
            <Button onClick={nextStep} className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none">
              Skip to College Suggestions →
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderColleges = () => (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 bg-white p-5 rounded-md border">
        <h2 className="text-lg font-bold text-ink">Top College Recommendations</h2>
        <p className="text-xs text-ink-muted mt-0.5">Matched according to location preferences, entrance cutoffs, and selected course.</p>
      </div>

      {colleges.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-md border border-line">
          <p className="text-xs text-ink-muted mb-4">No colleges matched these exact criteria.</p>
          <Button variant="outline" onClick={prevStep} className="rounded-md text-xs h-9">
            ← Back
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colleges.slice(0, 6).map(college => {
              const score = getMatchScore(college);
              const isSelected = selectedCollegesToCompare.find(c => c._id === college._id);
              return (
                <div key={college._id} className="rounded-md border border-line bg-white p-4 shadow-none flex flex-col justify-between hover:border-brand/40 transition-colors">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-ink truncate">{college.name || college.collegeName}</h3>
                        <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {college.location?.city || 'Location N/A'}, {college.location?.state || ''}
                        </p>
                      </div>
                      <span className="rounded bg-blue-50 text-brand text-[10px] font-bold px-2 py-0.5 shrink-0">
                        {score}% Match
                      </span>
                    </div>

                    <div className="flex gap-2 my-2 text-xs">
                      <span className="rounded bg-surface px-2 py-0.5 border border-line text-ink-muted">
                        {college.collegeType || college.type || 'Private'}
                      </span>
                      <span className="rounded bg-surface px-2 py-0.5 border border-line text-ink-muted">
                        Rating: {college.rating || '4.2'}/5
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex-1 rounded-md text-xs font-semibold h-8 shadow-none ${
                        isSelected ? 'bg-blue-50 border-brand text-brand' : 'border-line'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCollegesToCompare(prev => prev.filter(c => c._id !== college._id));
                        } else {
                          if (selectedCollegesToCompare.length < 2) {
                            setSelectedCollegesToCompare(prev => [...prev, college]);
                          } else {
                            alert('You can compare up to 2 colleges at a time.');
                          }
                        }
                      }}
                    >
                      {isSelected ? '✓ Added to Compare' : '+ Compare'}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-8 shadow-none"
                      onClick={() => {
                        setFinalCollege(college);
                        setCurrentStep(5);
                      }}
                    >
                      Choose College
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center bg-white border border-line p-4 rounded-md sticky bottom-4 shadow-sm">
            <Button variant="outline" onClick={prevStep} className="rounded-md text-xs h-9 border-line">
              ← Back
            </Button>
            <div className="flex items-center gap-3">
              {selectedCollegesToCompare.length > 0 && (
                <span className="text-xs text-ink-muted hidden sm:inline">
                  {selectedCollegesToCompare.length} selected for comparison
                </span>
              )}
              <Button onClick={nextStep} className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none">
                Next: Exam Guidance →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderExamGuidance = () => (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 bg-white p-5 rounded-md border">
        <h2 className="text-lg font-bold text-ink">Exam & Rank Guidance</h2>
        <p className="text-xs text-ink-muted mt-0.5">Performance assessment and cutoff probability.</p>
      </div>

      <div className="rounded-md border border-line bg-white p-6 shadow-none">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Your Score Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-surface rounded-md border border-line">
            <span className="text-[11px] text-ink-muted block">Exam</span>
            <p className="font-bold text-sm text-ink mt-0.5">{exams.find(e => e._id === formData.examId)?.name || 'Entrance Exam'}</p>
          </div>
          <div className="p-3 bg-surface rounded-md border border-line">
            <span className="text-[11px] text-ink-muted block">Score</span>
            <p className="font-bold text-sm text-ink mt-0.5">{formData.score || 'N/A'}</p>
          </div>
          <div className="p-3 bg-surface rounded-md border border-line">
            <span className="text-[11px] text-ink-muted block">Rank</span>
            <p className="font-bold text-sm text-ink mt-0.5">{formData.rank || 'N/A'}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
            <span className="text-[11px] text-brand block">Eligible Options</span>
            <p className="font-bold text-sm text-brand mt-0.5">{colleges.length} Colleges</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button variant="outline" onClick={prevStep} className="rounded-md text-xs h-9 border-line">
          ← Back
        </Button>
        <Button onClick={nextStep} className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none">
          Proceed to College Compare →
        </Button>
      </div>
    </div>
  );

  const renderCompare = () => (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 bg-white p-5 rounded-md border">
        <h2 className="text-lg font-bold text-ink">Side-by-Side Comparison</h2>
        <p className="text-xs text-ink-muted mt-0.5">Evaluate your shortlisted colleges side-by-side.</p>
      </div>

      {selectedCollegesToCompare.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-md border border-line max-w-md mx-auto">
          <p className="text-xs sm:text-sm text-ink-muted mb-4">No colleges selected for comparison yet.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setCurrentStep(2)} className="rounded-md text-xs h-9 border-line">
              Select Colleges
            </Button>
            <Button onClick={nextStep} className="rounded-md bg-brand text-white text-xs h-9">
              Proceed to Decision
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-line bg-white p-6 text-center max-w-lg mx-auto shadow-none">
          <div className="w-12 h-12 bg-blue-50 text-brand rounded-md flex items-center justify-center mx-auto mb-3">
            <Search size={22} />
          </div>
          <h3 className="text-base font-bold text-ink mb-1">Ready to Compare</h3>
          <p className="text-xs text-ink-muted mb-5">
            You have selected {selectedCollegesToCompare.length} college{selectedCollegesToCompare.length === 1 ? '' : 's'}. Open the full comparison matrix or lock your final decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Button
              variant="outline"
              className="rounded-md text-xs font-semibold h-9 border-line text-brand"
              onClick={() => {
                const ids = selectedCollegesToCompare.map(c => c._id).join(',');
                navigate(`/compare?ids=${ids}`);
              }}
            >
              Open Full Compare Matrix
            </Button>
            <Button
              className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none"
              onClick={nextStep}
            >
              Final Selection
            </Button>
          </div>
          <Button variant="ghost" onClick={prevStep} className="text-xs text-ink-muted">
            ← Back to Suggestions
          </Button>
        </div>
      )}
    </div>
  );

  const renderFinalDecision = () => {
    if (!finalCollege) {
      return (
        <div className="space-y-6 max-w-2xl mx-auto text-center">
          <div className="rounded-md border border-line bg-white p-6">
            <h2 className="text-lg font-bold text-ink mb-1">Select Final Target College</h2>
            <p className="text-xs text-ink-muted mb-5">Pick your preferred choice from your shortlisted options.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {colleges.slice(0, 4).map(college => (
                <div
                  key={college._id}
                  onClick={() => setFinalCollege(college)}
                  className="rounded-md border border-line p-3.5 hover:border-brand cursor-pointer bg-surface"
                >
                  <h4 className="text-xs font-bold text-ink truncate">{college.name}</h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">{college.location?.city}, {college.location?.state}</p>
                  <Button size="sm" className="w-full mt-3 rounded-md bg-brand text-white text-xs h-8">
                    Select This College
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" onClick={prevStep} className="rounded-md text-xs h-9">
            ← Back
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-xl mx-auto text-center">
        <div className="rounded-md border border-line bg-white p-8 shadow-none">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center mx-auto mb-3">
            <Check size={24} />
          </div>
          <h2 className="text-xl font-bold text-ink">Guidance Session Plan Complete!</h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 mb-6">
            Your customized admission and counselling roadmap has been generated.
          </p>

          <div className="rounded-md border border-line bg-surface p-4 text-left mb-6 space-y-2 text-xs">
            <div>
              <span className="text-ink-muted block text-[11px]">Target Institution:</span>
              <strong className="text-ink text-sm font-bold">{finalCollege?.name}</strong>
            </div>
            <div>
              <span className="text-ink-muted block text-[11px]">Selected Program:</span>
              <span className="font-semibold text-ink">{finalCourse ? (finalCourse.name || finalCourse.fullName) : 'General Program'}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[11px]">Campus Location:</span>
              <span className="text-ink-muted">{finalCollege?.location?.city}, {finalCollege?.location?.state}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 px-5 shadow-none"
              onClick={() => navigate(`/apply?collegeId=${finalCollege?._id}&courseId=${finalCourse?._id || ''}`)}
            >
              Proceed to Application
            </Button>
            <Button
              variant="outline"
              className="rounded-md border-line text-xs font-semibold h-10 px-5 shadow-none"
              onClick={() => navigate('/my-counselling')}
            >
              View In My Requests
            </Button>
          </div>

          <div className="mt-5 pt-4 border-t border-line flex justify-center gap-3">
            <Button variant="ghost" onClick={prevStep} className="text-xs text-ink-muted">
              ← Back
            </Button>
            <Button variant="ghost" onClick={startOver} className="text-xs text-red-600 hover:text-red-700">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface py-8 text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Header */}
        <div className="mb-6 rounded-md border border-line bg-white p-4 shadow-none">
          <div className="flex items-center justify-between overflow-x-auto pb-1">
            {steps.map((stepName, idx) => {
              const isActive = currentStep === idx;
              const isPassed = currentStep > idx;
              return (
                <div
                  key={idx}
                  className="flex items-center cursor-pointer shrink-0"
                  onClick={() => { if (idx <= currentStep) setCurrentStep(idx); }}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold transition-colors ${
                    isPassed
                      ? 'bg-brand text-white'
                      : isActive
                      ? 'border-2 border-brand text-brand bg-blue-50'
                      : 'bg-surface text-ink-muted border border-line'
                  }`}>
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span className={`ml-2 text-xs font-semibold whitespace-nowrap hidden sm:inline ${
                    isActive ? 'text-brand' : isPassed ? 'text-ink' : 'text-ink-muted'
                  }`}>
                    {stepName}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className="w-6 md:w-12 h-0.5 bg-line mx-2 md:mx-3">
                      <div className="h-full bg-brand" style={{ width: isPassed ? '100%' : '0%' }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Per Step */}
        {currentStep === 0 && renderProfile()}
        {currentStep === 1 && renderCourses()}
        {currentStep === 2 && renderColleges()}
        {currentStep === 3 && renderExamGuidance()}
        {currentStep === 4 && renderCompare()}
        {currentStep === 5 && renderFinalDecision()}
      </div>
    </div>
  );
};

export default CounsellingWizard;
