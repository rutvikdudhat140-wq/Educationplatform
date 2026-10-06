import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  Users,
  Briefcase,
  Mail,
  IndianRupee,
  Award,
  Sparkles,
  ArrowDown,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const DEFAULT_CAREER_JOURNEY = [
  { step: '10th Standard', phase: 'Secondary Education', description: 'Build strong basics in mathematics, science, and languages.', tag: 'Foundation' },
  { step: '12th Standard', phase: 'Higher Secondary', description: 'Choose relevant stream (Science / Commerce / Arts) based on specialization requirements.', tag: 'Prerequisite' },
  { step: 'Undergraduate Degree', phase: 'Core Education', description: 'Pursue Bachelor degree (B.Tech, B.Sc, BBA, MBBS, LLB, etc.) in the respective discipline.', tag: 'Degree' },
  { step: 'Skill Acquisition', phase: 'Practical Competencies', description: 'Master practical industry tools, software suites, problem solving, and analytical skills.', tag: 'Skills' },
  { step: 'Professional Certification', phase: 'Industry Credential', description: 'Earn recognized domain credentials to validate expertise and boost credibility.', tag: 'Certification' },
  { step: 'Internship / Apprenticeship', phase: 'Workplace Exposure', description: 'Complete 3-6 months practical industry projects under mentorship.', tag: 'Experience' },
  { step: 'Full-Time Job Role', phase: 'Career Launch', description: 'Join as an Associate / Entry-level specialist and advance into leadership roles.', tag: 'Job Role' },
];

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  // For Mentor Request
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requesting, setRequesting] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchCareerDetails();
  }, [id]);

  const fetchCareerDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/career/${id}`);
      setCareer(res.data.career || res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching career details:', error);
      setLoading(false);
    }
  };

  const handleMentorshipRequest = async (e) => {
    e.preventDefault();
    setRequesting(true);
    try {
      const payload = {
        careerId: id,
        mentorId: selectedMentor?._id || '64abca56822e607c3c1e67fa',
        mentorName: selectedMentor?.name || 'Mentor',
        topic: requestTopic,
        message: requestMessage,
        studentName: user ? user.name : 'Guest',
        studentEmail: user ? user.email : 'guest@example.com',
      };
      if (user && user._id) {
        payload.studentId = user._id;
      }
      await axios.post(`http://localhost:5001/api/career/${id}/mentor-request`, payload);
      alert('Mentorship request sent successfully!');
      setSelectedMentor(null);
      setRequestTopic('');
      setRequestMessage('');
    } catch (error) {
      alert('Error sending request. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent mx-auto" />
          <p className="text-sm text-ink-muted">Loading career roadmap...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-surface p-6 md:p-10">
        <div className="mx-auto max-w-lg rounded-md border border-line bg-white p-8 text-center shadow-none">
          <Briefcase size={36} className="mx-auto text-ink-muted mb-3" />
          <h2 className="text-xl font-bold text-ink">Career Profile Not Found</h2>
          <p className="text-sm text-ink-muted mt-1">
            This career roadmap does not exist or has been modified.
          </p>
          <Link
            to="/careers"
            className="mt-5 inline-block rounded-md bg-brand px-4 py-2 text-xs font-semibold text-white shadow-none hover:bg-brand-dark"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  // Derive roadmap steps: If backend has roadmaps, use them, otherwise use standard 7-step sequence
  const customRoadmap = career.roadmaps?.[0]?.steps;
  const roadmapSteps = (customRoadmap && customRoadmap.length > 0)
    ? customRoadmap.map((s, idx) => ({
        step: s.name || `Step ${idx + 1}`,
        phase: s.duration || `Level ${idx + 1}`,
        description: s.description || '',
        tag: `Step ${idx + 1}`,
      }))
    : DEFAULT_CAREER_JOURNEY;

  const mentorsList = career.mentors?.length ? career.mentors : [
    {
      _id: 'm1',
      name: "Rahul Sharma",
      currentRole: career.name,
      company: "Leading Tech Firm",
      college: "Top University",
      graduationYear: "2021",
      about: `Experienced ${career.name}. Happy to guide aspiring students on interview prep, skill sets, and college selection.`,
      areasOfHelp: ["Career Guidance", "Resume Review"]
    },
    {
      _id: 'm2',
      name: "Priya Patel",
      currentRole: `Senior ${career.name}`,
      company: "Global Enterprise",
      college: "National Institute",
      graduationYear: "2019",
      about: `Passionate about helping students navigate their path to becoming a successful ${career.name}.`,
      areasOfHelp: ["Interview Prep", "Skill Roadmap"]
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-ink pb-16">
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
            <Link to="/careers" className="hover:text-ink">Careers</Link>
            <span>/</span>
            <span className="font-semibold text-ink truncate max-w-[200px] sm:max-w-none">
              {career.name}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Career Header Banner */}
        <div className="mb-6 rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="rounded text-[11px] font-semibold bg-blue-50 text-brand hover:bg-blue-100 border-none">
                  {career.stream || 'General'}
                </Badge>
                {career.growthLevel && (
                  <Badge className="rounded text-[11px] font-semibold bg-orange-50 text-accent border border-orange-100">
                    {career.growthLevel}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-ink">
                {career.name}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
                {career.description || career.shortDescription || `Explore complete roadmap, educational requirements, salary milestones, and mentorship for a career as a ${career.name}.`}
              </p>
            </div>

            {/* Salary Package Callout */}
            <div className="shrink-0 rounded-md border border-line bg-surface p-4 text-left md:text-right min-w-[200px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
                Estimated Salary
              </span>
              <div className="mt-1 flex items-center text-lg md:text-xl font-bold text-brand md:justify-end">
                <IndianRupee size={16} />
                <span>{career.salaryMin || 3} - {career.salaryMax || 12} {career.salaryUnit || 'LPA'}</span>
              </div>
              <span className="text-[11px] text-ink-muted block mt-0.5">
                Entry to Experienced Roles
              </span>
            </div>
          </div>
        </div>

        {/* Career Journey Timeline Section */}
        <div className="mb-8">
          <div className="rounded-md border border-line bg-white p-5 md:p-8 shadow-none">
            <div className="border-b border-line pb-4 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-brand text-xs font-semibold mb-1">
                <Layers size={13} /> Visual Career Pathway
              </div>
              <h2 className="text-lg md:text-xl font-bold text-ink">
                Step-by-Step Educational & Career Journey
              </h2>
              <p className="text-xs md:text-sm text-ink-muted mt-1">
                From high school foundation to securing your target professional role.
              </p>
            </div>

            {/* Vertical Timeline Journey */}
            <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-line">
              {roadmapSteps.map((step, index) => {
                const isFinal = index === roadmapSteps.length - 1;
                return (
                  <div key={index} className="relative group">
                    {/* Bullet marker */}
                    <div className={`absolute -left-6 md:-left-8 top-1 flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold transition-colors ${
                      isFinal
                        ? 'bg-accent text-white border-accent'
                        : index === 0
                        ? 'bg-ink text-white border-ink'
                        : 'bg-white text-brand border-brand'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Step Card */}
                    <div className={`rounded-md border p-4 transition-all ${
                      isFinal
                        ? 'border-orange-200 bg-orange-50/20'
                        : 'border-line bg-white hover:border-brand/40'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm md:text-base font-bold text-ink">
                            {step.step}
                          </h3>
                          {step.tag && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isFinal
                                ? 'bg-orange-100 text-accent'
                                : 'bg-blue-50 text-brand'
                            }`}>
                              {step.tag}
                            </span>
                          )}
                        </div>

                        {step.phase && (
                          <span className="text-xs font-medium text-ink-muted">
                            {step.phase}
                          </span>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mentors & Guidance Section */}
        <div className="rounded-md border border-line bg-white p-5 md:p-6 shadow-none">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Users size={17} className="text-brand" /> Connect with Industry Mentors
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Get one-on-one guidance from working professionals in {career.name}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorsList.map((mentor) => (
              <div
                key={mentor._id || mentor.name}
                className="rounded-md border border-line bg-surface p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-ink">{mentor.name}</h3>
                      <p className="text-xs text-brand font-medium">{mentor.currentRole}</p>
                      <p className="text-xs text-ink-muted mt-0.5">{mentor.company} • {mentor.college}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand font-bold text-sm border border-blue-100">
                      {mentor.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                    {mentor.about}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {(mentor.areasOfHelp || []).map((area, i) => (
                      <span key={i} className="text-[10px] font-medium bg-white border border-line rounded px-2 py-0.5 text-ink-muted">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60">
                  <Button
                    size="sm"
                    onClick={() => setSelectedMentor(mentor)}
                    className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-8 shadow-none"
                  >
                    Request Guidance Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentor Request Dialog */}
      {selectedMentor && (
        <Dialog open={Boolean(selectedMentor)} onOpenChange={() => setSelectedMentor(null)}>
          <DialogContent className="rounded-md p-6 max-w-md bg-white border border-line">
            <DialogHeader className="border-b border-line pb-3 mb-4">
              <DialogTitle className="text-base font-bold text-ink">
                Request Mentorship Session
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-muted mt-1">
                Send your inquiry to {selectedMentor.name} ({selectedMentor.currentRole})
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleMentorshipRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                  Guidance Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portfolio advice, Course prerequisites, Interview prep"
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  className="w-full rounded-md border border-line px-3 py-2 text-xs focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                  Your Message & Questions
                </label>
                <Textarea
                  required
                  placeholder="Briefly describe what guidance you are seeking..."
                  rows={4}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="rounded-md border-line text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-line">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedMentor(null)}
                  className="flex-1 rounded-md text-xs font-semibold h-9 border-line shadow-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={requesting}
                  className="flex-1 rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none"
                >
                  {requesting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
