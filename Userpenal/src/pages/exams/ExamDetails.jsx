import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Bookmark,
  BellRing,
  HelpCircle,
  FileCode,
  Award,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "dates", label: "Exam Dates", icon: CalendarDays },
  { id: "eligibility", label: "Eligibility", icon: ClipboardCheck },
  { id: "application", label: "Application", icon: ClipboardCheck },
  { id: "pattern", label: "Exam Pattern", icon: Layers },
  { id: "syllabus", label: "Syllabus", icon: BookOpen },
  { id: "sessions", label: "Sessions", icon: GraduationCap },
  { id: "preparation", label: "Preparation", icon: Sparkles },
  { id: "previous-papers", label: "Previous Papers", icon: FileCode },
  { id: "sample-papers", label: "Sample Papers", icon: FileText },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "mock-tests", label: "Mock Tests", icon: Award },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DetailRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="border-b border-[#E5E7EB] py-1.5 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
        {label}
      </p>
      <p className="mt-0.5 text-xs sm:text-[13px] font-semibold text-[#172554]">
        {value}
      </p>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="rounded-md border border-[#E5E7EB] bg-white p-3 sm:p-4">
      {title && (
        <div className="mb-2.5 flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
          {Icon && (
            <div className="flex size-6 items-center justify-center rounded-[4px] bg-[#EFF6FF] text-[#172554]">
              <Icon className="size-3.5 text-[#172554]" />
            </div>
          )}
          <h2 className="text-[13px] sm:text-[15px] font-bold text-[#172554] tracking-tight">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-[4px] border border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-center text-xs text-[#64748B]">
      {text}
    </div>
  );
};

export default function ExamDetails() {
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [preparations, setPreparations] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [samplePapers, setSamplePapers] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam/${id}`)
      .then((res) => {
        const fetchedExam = res.data.exam;
        setExam(fetchedExam);

        if (fetchedExam && fetchedExam._id) {
          const examId = fetchedExam._id;

          axios
            .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam-preparation?exam=${examId}&status=Active`)
            .then((res) => setPreparations(res.data.examPreparations || []))
            .catch(() => {});

          axios
            .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam-pattern?exam=${examId}&status=Active`)
            .then((res) => setPatterns(res.data.data || []))
            .catch(() => {});

          axios
            .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam-syllabus?exam=${examId}&status=Active`)
            .then((res) => setSyllabuses(res.data.data || []))
            .catch(() => {});

          axios
            .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam-sample-paper?exam=${examId}&status=Active`)
            .then((res) => setSamplePapers(res.data.data || []))
            .catch(() => {});

          axios
            .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam-mock-test?exam=${examId}&status=Active`)
            .then((res) => setMockTests(res.data.data || []))
            .catch(() => {});

          axios
            .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/exam-faq?exam=${examId}&status=Active`)
            .then((res) => setFaqs(res.data.data || []))
            .catch(() => {});
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!exam) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2.5 bg-white">
        <div className="size-6 animate-spin rounded-full border-2 border-[#172554] border-t-transparent" />
        <p className="text-xs text-[#64748B]">Loading entrance exam details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-14 text-[#111827]">
      {/* Top Banner / Cover */}
      <div className="relative h-20 w-full bg-[#172554] sm:h-28">
        <div className="edu-container flex h-full items-center justify-between text-white/80">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-300">
            <Link to="/" className="flex items-center gap-1 hover:text-white">
              <ArrowLeft size={11} />
              Home
            </Link>
            <span>/</span>
            <Link to="/exams" className="hover:text-white">
              Exams
            </Link>
            <span>/</span>
            <span className="max-w-[150px] sm:max-w-xs truncate font-medium text-white">
              {exam.shortName || exam.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Exam Identity Bar & Integrated Tabs */}
      <div className="edu-container relative z-10 -mt-5 mb-3 sm:-mt-8 sm:mb-4">
        <div className="rounded-md border border-[#E5E7EB] bg-white p-3 sm:p-5 shadow-none">
          {/* Main Identity Box */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2.5 sm:gap-3">
              {/* Logo / Icon Box */}
              <div className="flex size-11 sm:size-14 shrink-0 items-center justify-center rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#172554]">
                <GraduationCap className="size-5 sm:size-7 text-[#172554]" />
              </div>

              {/* Title & Details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h1 className="text-[15px] sm:text-[1.25rem] font-bold tracking-tight text-[#172554] leading-tight">
                    {exam.name}
                  </h1>
                  {exam.shortName && (
                    <span className="rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold text-[#172554]">
                      {exam.shortName}
                    </span>
                  )}
                </div>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-[#64748B]">
                  {exam.stream && <span>Stream: <strong className="text-[#172554]">{exam.stream}</strong></span>}
                  {exam.level && (
                    <>
                      <span>·</span>
                      <span>Level: <strong className="text-[#172554]">{exam.level}</strong></span>
                    </>
                  )}
                  {exam.conductingBody && (
                    <>
                      <span>·</span>
                      <span className="truncate max-w-[200px] sm:max-w-none">
                        By {exam.conductingBody}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-1.5 flex flex-wrap gap-1">
                  {exam.examType && (
                    <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                      {exam.examType}
                    </span>
                  )}
                  {exam.category && (
                    <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.2 text-[10px] font-medium text-slate-600">
                      {exam.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB]">
              <button
                onClick={() => alert("Exam notification alert activated!")}
                className="flex items-center gap-1 rounded-[4px] border border-[#E5E7EB] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#172554] hover:bg-[#F8FAFC] transition-colors"
              >
                <BellRing size={12} className="text-[#172554]" />
                <span>Updates</span>
              </button>
              <button
                onClick={() => alert("Exam saved to your bookmarks!")}
                className="flex items-center gap-1 rounded-[4px] bg-[#172554] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#0F172A] transition-colors shadow-none"
              >
                <Bookmark size={12} />
                Save Exam
              </button>
            </div>
          </div>

          {/* Clean Integrated Horizontal Tabs */}
          <div className="mt-3 -mx-3 -mb-3 sm:-mx-5 sm:-mb-5 overflow-x-auto border-t border-[#E5E7EB] px-3 sm:px-5 no-scrollbar">
            <div className="flex min-w-max gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-[#172554] text-[#172554] font-bold"
                        : "border-transparent text-[#64748B] hover:text-[#172554]"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tab Content + Right Info Sidebar */}
      <div className="edu-container">
        <div className="grid grid-cols-1 gap-3 md:gap-5 lg:grid-cols-3">
          {/* Main Tab Panels */}
          <main className="space-y-2.5 sm:space-y-3 lg:col-span-2">
            {activeTab === "overview" && (
              <>
                {exam.description && (
                  <SectionCard title="About Exam" icon={FileText}>
                    <div className="rounded-[4px] border-l-2 border-[#172554] bg-[#F8FAFC] p-2.5 text-xs leading-relaxed text-slate-700">
                      {exam.description}
                    </div>
                  </SectionCard>
                )}

                <SectionCard title={`${exam.shortName || exam.name} Quick Facts`} icon={GraduationCap}>
                  <dl className="grid sm:grid-cols-2 gap-x-4">
                    <DetailRow label="Exam Name" value={exam.name} />
                    <DetailRow label="Short Name" value={exam.shortName} />
                    <DetailRow label="Stream" value={exam.stream} />
                    <DetailRow label="Exam Level" value={exam.level} />
                    <DetailRow label="Exam Type" value={exam.examType || exam.category} />
                    <DetailRow label="Conducting Body" value={exam.conductingBody} />
                  </dl>
                </SectionCard>

                {exam.otherInformation && (
                  <SectionCard title="Other Information" icon={BookOpen}>
                    <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
                      {exam.otherInformation}
                    </p>
                  </SectionCard>
                )}
              </>
            )}

            {activeTab === "dates" && (
              <SectionCard title={`${exam.shortName || exam.name} Important Dates`} icon={CalendarDays}>
                <p className="-mt-1 mb-2 text-[10px] text-[#64748B]">
                  Check live timeline and examination schedules.
                </p>

                {exam.dates?.length ? (
                  <div className="space-y-2.5">
                    {exam.dates.map((date) => (
                      <div
                        key={date._id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5"
                      >
                        {date.examSession && (
                          <div className="mb-1.5 inline-flex items-center rounded-[4px] bg-[#172554] px-1.5 py-0.2 text-[10px] font-bold text-white">
                            {date.examSession.sessionName} ({date.examSession.academicYear})
                          </div>
                        )}

                        <dl className="grid sm:grid-cols-2 gap-x-4">
                          <DetailRow label="Registration Start" value={formatDate(date.registrationStartDate)} />
                          <DetailRow label="Registration End" value={formatDate(date.registrationEndDate)} />
                          <DetailRow label="Correction Start" value={formatDate(date.correctionStartDate)} />
                          <DetailRow label="Correction End" value={formatDate(date.correctionEndDate)} />
                          <DetailRow label="Admit Card Date" value={formatDate(date.admitCardDate)} />
                          <DetailRow label="Exam Start" value={formatDate(date.examStartDate)} />
                          <DetailRow label="Exam End" value={formatDate(date.examEndDate)} />
                          <DetailRow label="Answer Key" value={formatDate(date.answerKeyDate)} />
                          <DetailRow label="Result Announcement" value={formatDate(date.resultDate)} />
                        </dl>

                        {date.description && (
                          <p className="mt-1.5 border-t border-[#E5E7EB] pt-1.5 text-[11px] text-slate-600">
                            {date.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Exam dates have not been officially announced yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "eligibility" && (
              <SectionCard title="Eligibility Criteria" icon={ClipboardCheck}>
                <p className="-mt-1 mb-2 text-[10px] text-[#64748B]">
                  Verify academic qualifications and criteria before applying.
                </p>

                {exam.eligibility?.length ? (
                  <div className="space-y-2.5">
                    {exam.eligibility.map((item) => (
                      <div key={item._id} className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
                        <dl className="grid sm:grid-cols-2 gap-x-4">
                          <DetailRow label="Educational Qualification" value={item.minimumQualification} />
                          <DetailRow label="Minimum Marks" value={item.minimumPercentage} />
                          <DetailRow label="Age Limit" value={item.ageLimit} />
                          <DetailRow label="Subjects Required" value={item.requiredSubjects?.join(", ")} />
                          <DetailRow label="Number of Attempts" value={item.numberOfAttempts} />
                          <DetailRow label="Nationality" value={item.nationality} />
                          <DetailRow label="Additional Requirements" value={item.otherRequirements} />
                          <DetailRow label="Description" value={item.description} />
                        </dl>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Eligibility details have not been added yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "application" && (
              <SectionCard title="Application Process" icon={ClipboardCheck}>
                <EmptyState text="Official application guidelines and links will be updated once registration opens." />
              </SectionCard>
            )}

            {activeTab === "pattern" && (
              <SectionCard title="Exam Pattern & Marking" icon={Layers}>
                {patterns.length ? (
                  <div className="space-y-2.5">
                    {patterns.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5 sm:p-3"
                      >
                        <h3 className="text-xs sm:text-[13px] font-bold text-[#172554]">
                          {item.paperName}
                        </h3>

                        <div className="mt-1.5 grid sm:grid-cols-2 gap-x-4">
                          <DetailRow
                            label="Duration"
                            value={item.duration ? `${item.duration} Minutes` : ""}
                          />
                          <DetailRow label="Total Questions" value={item.totalQuestions} />
                          <DetailRow label="Total Marks" value={item.totalMarks} />
                          <DetailRow label="Question Types" value={item.questionTypes} />
                          <DetailRow label="Marking Scheme" value={item.markingScheme} />
                          <DetailRow label="Negative Marking" value={item.negativeMarking} />
                          <DetailRow
                            label="Subjects"
                            value={
                              Array.isArray(item.subjects)
                                ? item.subjects.join(", ")
                                : item.subjects
                            }
                          />
                        </div>

                        {item.description && (
                          <p className="mt-2 whitespace-pre-line text-xs text-slate-600 border-t border-[#E5E7EB] pt-1.5">
                            {item.description}
                          </p>
                        )}

                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#172554] underline hover:text-[#2563EB]"
                          >
                            View Pattern Document &rarr;
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Exam pattern information is not available yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "syllabus" && (
              <SectionCard title="Official Syllabus" icon={BookOpen}>
                {syllabuses.length ? (
                  <div className="space-y-2.5">
                    {syllabuses.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5 sm:p-3"
                      >
                        <h3 className="text-xs sm:text-[13px] font-bold text-[#172554]">{item.title}</h3>
                        <p className="mt-1 whitespace-pre-line text-xs text-slate-600">
                          {item.description}
                        </p>
                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 rounded-[4px] bg-[#172554] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0F172A]"
                          >
                            Download Syllabus PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
                    {exam.syllabus || "Syllabus details will be announced with the official notification."}
                  </p>
                )}
              </SectionCard>
            )}

            {activeTab === "sessions" && (
              <SectionCard title="Academic Sessions" icon={GraduationCap}>
                <p className="-mt-1 mb-2 text-[10px] text-[#64748B]">
                  Upcoming & active examination sessions.
                </p>

                {exam.sessions?.length ? (
                  <div className="space-y-2">
                    {exam.sessions.map((session) => (
                      <div
                        key={session._id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-[#172554]">
                            {session.sessionName}
                          </h3>
                          <span className="rounded-[4px] bg-[#172554] px-1.5 py-0.2 text-[10px] font-bold text-white">
                            {session.academicYear}
                          </span>
                        </div>
                        {session.description && (
                          <p className="mt-1 text-xs text-slate-600">
                            {session.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No specific sessions announced yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "preparation" && (
              <SectionCard title="Preparation Guide & Strategy" icon={Sparkles}>
                {preparations.length ? (
                  <div className="space-y-3">
                    {preparations.map((prep) => (
                      <div
                        key={prep._id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-white overflow-hidden"
                      >
                        <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] p-2.5 sm:p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-[#172554]">
                              {prep.title}
                            </h3>
                            {prep.examSession && (
                              <span className="rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-1.5 py-0.2 text-[10px] font-bold text-[#172554]">
                                {prep.examSession.academicYear} - {prep.examSession.sessionName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2.5 p-2.5 sm:p-3">
                          {prep.overview && (
                            <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                                Overview
                              </h4>
                              <p className="mt-0.5 whitespace-pre-line text-xs text-slate-700 leading-relaxed">
                                {prep.overview}
                              </p>
                            </div>
                          )}

                          {(prep.preparationStrategy || prep.subjectWisePreparation) && (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {prep.preparationStrategy && (
                                <div className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
                                  <h5 className="text-[11px] font-bold text-[#172554]">Preparation Strategy</h5>
                                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{prep.preparationStrategy}</p>
                                </div>
                              )}
                              {prep.subjectWisePreparation && (
                                <div className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
                                  <h5 className="text-[11px] font-bold text-[#172554]">Subject-wise Strategy</h5>
                                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{prep.subjectWisePreparation}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {(prep.bestBooks || prep.previousYearPapers || prep.mockTest) && (
                            <div className="rounded-[4px] border border-[#E5E7EB] p-2.5">
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                                Recommended Resources
                              </h4>
                              <div className="grid gap-2 sm:grid-cols-3 text-xs">
                                {prep.bestBooks && (
                                  <div>
                                    <span className="font-bold text-[#172554]">Best Books:</span>
                                    <p className="text-slate-600 mt-0.5">{prep.bestBooks}</p>
                                  </div>
                                )}
                                {prep.previousYearPapers && (
                                  <div>
                                    <span className="font-bold text-[#172554]">PYQ Papers:</span>
                                    <p className="text-slate-600 mt-0.5">{prep.previousYearPapers}</p>
                                  </div>
                                )}
                                {prep.mockTest && (
                                  <div>
                                    <span className="font-bold text-[#172554]">Mock Tests:</span>
                                    <p className="text-slate-600 mt-0.5">{prep.mockTest}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Preparation strategy and tips have not been added yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "previous-papers" && (
              <SectionCard title="Previous Year Papers" icon={FileCode}>
                <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
                  {exam.questionPaper || "Previous year papers will be made available for download soon."}
                </p>
              </SectionCard>
            )}

            {activeTab === "sample-papers" && (
              <SectionCard title="Sample Papers" icon={FileText}>
                {samplePapers.length ? (
                  <div className="space-y-2">
                    {samplePapers.map((paper) => (
                      <div
                        key={paper._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5"
                      >
                        <div>
                          <h3 className="text-xs font-bold text-[#172554]">
                            {paper.title}
                          </h3>
                          {paper.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{paper.description}</p>
                          )}
                        </div>
                        {paper.fileUrl && (
                          <a
                            href={paper.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 rounded-[4px] bg-[#172554] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#0F172A]"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Sample papers are not available yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "books" && (
              <SectionCard title="Recommended Reference Books" icon={BookOpen}>
                <EmptyState text="Book recommendations will be published shortly." />
              </SectionCard>
            )}

            {activeTab === "mock-tests" && (
              <SectionCard title="Practice Mock Tests" icon={Award}>
                {mockTests.length ? (
                  <div className="space-y-2">
                    {mockTests.map((test) => (
                      <div
                        key={test._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5"
                      >
                        <div>
                          <h3 className="text-xs font-bold text-[#172554]">
                            {test.title}
                          </h3>
                          {test.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{test.description}</p>
                          )}
                        </div>
                        {test.fileUrl && (
                          <a
                            href={test.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 rounded-[4px] bg-[#172554] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#0F172A]"
                          >
                            Take Mock Test
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Mock tests are not available yet." />
                )}
              </SectionCard>
            )}

            {activeTab === "faqs" && (
              <SectionCard title="Frequently Asked Questions" icon={HelpCircle}>
                {faqs.length ? (
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <div
                        key={faq._id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2.5"
                      >
                        <h3 className="text-xs font-bold text-[#172554]">
                          Q: {faq.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                          A: {faq.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Frequently asked questions are not available yet." />
                )}
              </SectionCard>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="space-y-2.5">
            {/* Quick Links Card */}
            <div className="hidden lg:block rounded-md border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#172554]">
                  Exam Navigation
                </h2>
              </div>
              <div className="p-1 space-y-0.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center justify-between rounded-[4px] px-2 py-1.5 text-left text-xs transition-colors ${
                        isActive
                          ? "bg-[#EFF6FF] font-bold text-[#172554]"
                          : "text-slate-600 hover:bg-[#F8FAFC] hover:text-[#172554]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon className="size-3 text-slate-400" />
                        {tab.label}
                      </span>
                      <ChevronRight size={11} className="text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exam Information Summary Card */}
            <div className="rounded-md border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#172554]">
                  Exam Summary
                </h2>
              </div>
              <div className="px-3 py-1.5">
                <DetailRow label="Stream" value={exam.stream} />
                <DetailRow label="Exam Type" value={exam.examType || exam.category} />
                <DetailRow label="Level" value={exam.level} />
                <DetailRow label="Conducting Body" value={exam.conductingBody} />
              </div>
            </div>

            {/* Quick CTA Card */}
            <div className="rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-3 text-center">
              <h3 className="text-xs font-bold text-[#172554]">Need Exam Guidance?</h3>
              <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">
                Connect with our expert mentors for college cutoff predictions & preparation.
              </p>
              <Link
                to="/counselling"
                className="mt-2 inline-block w-full rounded-[4px] bg-[#172554] py-1 text-xs font-bold text-white hover:bg-[#0F172A] transition-colors"
              >
                Book Free Counselling
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-[49px] left-0 right-0 px-3 py-1.5 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] shadow-md z-30 flex gap-2 h-11 items-center">
        <button
          onClick={() => alert("Exam Saved successfully!")}
          className="flex-1 bg-white border border-[#CBD5E1] text-[#172554] text-[11px] font-bold rounded-[6px] h-8 active:bg-gray-50 transition-colors"
        >
          Save Exam
        </button>
        <button
          onClick={() => alert("You will now receive updates for this exam!")}
          className="flex-1 bg-[#172554] active:bg-[#0F172A] text-white text-[11px] font-bold rounded-[6px] h-8 transition-colors"
        >
          Get Updates
        </button>
      </div>
    </div>
  );
}
