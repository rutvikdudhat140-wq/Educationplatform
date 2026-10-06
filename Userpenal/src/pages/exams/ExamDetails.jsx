import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "dates", label: "Exam Dates", icon: CalendarDays },
  { id: "eligibility", label: "Eligibility", icon: ClipboardCheck },
  { id: "application", label: "Application", icon: ClipboardCheck },
  { id: "pattern", label: "Exam Pattern", icon: FileText },
  { id: "syllabus", label: "Syllabus", icon: BookOpen },
  { id: "sessions", label: "Sessions", icon: GraduationCap },
  { id: "preparation", label: "Preparation", icon: BookOpen },
  { id: "previous-papers", label: "Previous Papers", icon: FileText },
  { id: "sample-papers", label: "Sample Papers", icon: FileText },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "mock-tests", label: "Mock Tests", icon: FileText },
  { id: "faqs", label: "FAQs", icon: FileText },
];

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DetailRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="border-b border-slate-100 py-2.5 last:border-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {title && (
        <div className="mb-3 flex items-center gap-2.5">
          {Icon && (
            <div className="flex size-7 items-center justify-center rounded-md bg-teal-50">
              <Icon className="size-4 text-teal-700" />
            </div>
          )}

          <h2 className="text-base font-bold text-slate-900">
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
    <p className="mt-3 rounded-md bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
      {text}
    </p>
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
    axios
      .get(`http://localhost:5001/api/exam/${id}`)
      .then((res) => {
        const fetchedExam = res.data.exam;
        setExam(fetchedExam);

        if (fetchedExam && fetchedExam._id) {
          const examId = fetchedExam._id;

          axios
            .get(`http://localhost:5001/api/exam-preparation?exam=${examId}&status=Active`)
            .then((res) => setPreparations(res.data.examPreparations || []));

          axios
            .get(`http://localhost:5001/api/exam-pattern?exam=${examId}&status=Active`)
            .then((res) => setPatterns(res.data.data || []));

          axios
            .get(`http://localhost:5001/api/exam-syllabus?exam=${examId}&status=Active`)
            .then((res) => setSyllabuses(res.data.data || []));

          axios
            .get(`http://localhost:5001/api/exam-sample-paper?exam=${examId}&status=Active`)
            .then((res) => setSamplePapers(res.data.data || []));

          axios
            .get(`http://localhost:5001/api/exam-mock-test?exam=${examId}&status=Active`)
            .then((res) => setMockTests(res.data.data || []));

          axios
            .get(`http://localhost:5001/api/exam-faq?exam=${examId}&status=Active`)
            .then((res) => setFaqs(res.data.data || []));
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!exam) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Link to="/exams"className="hover:text-teal-700">Home</Link>

            <span>/</span>
            <span>{exam.stream}</span>
            <span>/</span>

            <span className="font-medium text-slate-600">{exam.shortName || exam.name}</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div className="max-w-3xl">

              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{exam.stream} Entrance Exam</p>

              <h1 className="mt-1.5 text-xl font-bold leading-tight text-slate-900 sm:text-2xl lg:text-3xl">{exam.name}</h1>

              {exam.shortName && (
                <p className="mt-1.5 text-sm text-slate-500">{exam.shortName}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">

                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">{exam.stream}</span>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">{exam.examType || exam.category}
                </span>

                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">{exam.level}
                </span>

              </div>
            </div>

            <div className="min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">conducting Body</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{exam.conductingBody}</p>
            </div>

          </div>

          <Link
            to="/exams"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-700"
          >
            All entrance exams
          </Link>

        </div>
      </div>


      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">

        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">

          <nav className="flex min-w-max">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-800"
                    }`}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}

          </nav>

        </div>
      </div>


      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">

          <main className="space-y-4">

            {activeTab === "overview" && (
              <>
                <SectionCard>

                  <div className="rounded-md border-l-4 border-teal-600 bg-teal-50/50 px-3.5 py-2.5">

                    <p className="text-sm leading-6 text-slate-600">
                      {exam.description}
                    </p>

                  </div>

                </SectionCard>

                <SectionCard title={`About ${exam.name}`}>

                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                    {exam.description}
                  </p>

                </SectionCard>

                <SectionCard title={`${exam.name} Overview`}>

                  <dl className="grid sm:grid-cols-2 sm:gap-x-6">

                    <DetailRow label="Exam Name"value={exam.name}/>

                    <DetailRow label="Short Name"value={exam.shortName}/>

                    <DetailRow label="Stream"value={exam.stream}/>

                    <DetailRow label="Level"value={exam.level}/>

                    <DetailRow label="Exam Type"value={exam.examType || exam.category}/>

                    <DetailRow label="Conducting Body"value={exam.conductingBody}/>

                  </dl>
                </SectionCard>

                <SectionCard title="Other Information">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{exam.otherInformation}</p>
                </SectionCard>
              </>
            )}


            {activeTab === "dates" && (
              <SectionCard
                title={`${exam.name} Exam Dates`}
                icon={CalendarDays}
              >
                <p className="-mt-2 mb-2 text-xs text-slate-500">Important dates related to the examination.</p>

                {exam.dates?.length ? (
                  exam.dates.map((date) => (
                    <div
                      key={date._id}
                      className="border-b border-slate-100 py-4 last:border-0"
                    >

                      {date.examSession && (
                        <p className="mb-2 inline-flex rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                          {date.examSession.sessionName} (
                          {date.examSession.academicYear})
                        </p>
                      )}

                      <dl className="grid sm:grid-cols-2 sm:gap-x-6">

                        <DetailRow label="Registration Start"value={formatDate(date.registrationStartDate)}/>

                        <DetailRow label="Registration End"value={formatDate(date.registrationEndDate)}/>

                        <DetailRow label="Correction Start"value={formatDate(date.correctionStartDate)}/>

                        <DetailRow label="Correction End"value={formatDate(date.correctionEndDate)}/>

                        <DetailRow label="Admit Card"value={formatDate(date.admitCardDate)}/>

                        <DetailRow label="Exam Start"value={formatDate(date.examStartDate)}/>

                        <DetailRow label="Exam End"value={formatDate(date.examEndDate)}/>

                        <DetailRow label="Answer Key"value={formatDate(date.answerKeyDate)}/>

                        <DetailRow label="Result"value={formatDate(date.resultDate)}/>

                      </dl>
                      <p className="pt-2 text-sm leading-6 text-slate-600">{date.description}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState text="Exam dates have not been announced." />
                )}
              </SectionCard>
            )}

            {activeTab === "eligibility" && (
              <SectionCard
                title={`${exam.name} Eligibility`}
                icon={ClipboardCheck}
              >
                <p className="-mt-2 mb-2 text-xs text-slate-500">Check the eligibility criteria before applying.</p>

                {exam.eligibility?.length ? (
                  exam.eligibility.map((item) => (
                    <dl
                      key={item._id}
                      className="grid border-b border-slate-100 py-3 last:border-0 sm:grid-cols-2 sm:gap-x-6"
                    >

                      <DetailRow label="Educational Qualification"value={item.minimumQualification}/>

                      <DetailRow label="Minimum Marks"value={item.minimumPercentage}/>

                      <DetailRow label="Age Limit"value={item.ageLimit}/>

                      <DetailRow label="Subjects Required"value={item.requiredSubjects?.join(", ")}/>

                      <DetailRow label="Number of Attempts"value={item.numberOfAttempts}/>

                      <DetailRow label="Nationality"value={item.nationality}/>

                      <DetailRow label="Additional Requirements"value={item.otherRequirements}/>

                      <DetailRow label="Description"value={item.description}/>

                    </dl>
                  ))
                ) : (
                  <EmptyState text="Eligibility details have not been added." />
                )}

              </SectionCard>
            )}

            {activeTab === "application" && (
              <SectionCard
                title={`${exam.name} Application`}
                icon={ClipboardCheck}
              >
                <EmptyState text="Application information will be updated soon." />
              </SectionCard>
            )}

            {activeTab === "pattern" && (
              <SectionCard
                title={`${exam.name} Exam Pattern`}
                icon={FileText}
              >
                {patterns.length ? (
                  <div className="space-y-4">
                    {patterns.map((item) => (
                      <div
                        key={item._id}
                        className="border-b border-slate-100 pb-4 last:border-0"
                      >
                        <h3 className="text-base font-bold text-slate-800">
                          {item.paperName}
                        </h3>

                        <div className="mt-3 grid sm:grid-cols-2 sm:gap-x-6">
                          <DetailRow
                            label="Duration"
                            value={
                              item.duration
                                ? `${item.duration} Minutes`
                                : ""
                            }
                          />
                          <DetailRow label="Total Questions"value={item.totalQuestions}/>

                          <DetailRow label="Total Marks"value={item.totalMarks}/>

                          <DetailRow label="Question Types"value={item.questionTypes}/>

                          <DetailRow label="Marking Scheme"value={item.markingScheme}/>

                          <DetailRow label="Negative Marking"value={item.negativeMarking}/>

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
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>
                        )}

                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block text-sm font-medium text-teal-700"
                          >
                            View Details
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
              <SectionCard
                title="Syllabus"
                icon={BookOpen}
              >

                {syllabuses.length ? (
                  <div className="space-y-4">

                    {syllabuses.map((item) => (
                      <div
                        key={item._id}
                        className="border-b pb-3 last:border-0">

                        <h3 className="font-bold text-slate-800">{item.title}</h3>

                        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{item.description}</p>

                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-sm text-teal-600">Download Syllabus</a>
                        )}

                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                    {exam.syllabus}
                  </p>
                )}

              </SectionCard>
            )}


            {activeTab === "sessions" && (
              <SectionCard
                title={`${exam.name} Sessions`}
                icon={GraduationCap}
              >

                <p className="-mt-2 mb-3 text-xs text-slate-500">
                  Academic year and session information.
                </p>

                {exam.sessions?.length ? (
                  <div className="space-y-2">

                    {exam.sessions.map((session) => (
                      <div
                        key={session._id}
                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <h3 className="text-sm font-semibold text-slate-900">
                            {session.sessionName}
                          </h3>

                          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                            {session.academicYear}
                          </span>

                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {session.description}
                        </p>

                      </div>
                    ))}

                  </div>
                ) : (
                  <EmptyState text="No sessions have been announced." />
                )}

              </SectionCard>
            )}

            {activeTab === "preparation" && (
              <SectionCard
                title={`${exam.name} Information & Preparation`}
                icon={BookOpen}
              >
                {preparations.length ? (
                  <div className="space-y-8">
                    {preparations.map((prep) => (
                      <div
                        key={prep._id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        {/* Header */}
                        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800">
                                {prep.title}
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                Complete preparation guide for{" "}
                                <span className="font-semibold text-slate-700">
                                  {exam.name}
                                </span>
                              </p>
                            </div>

                            {prep.examSession && (
                              <div>
                                <span className="inline-flex items-center rounded-md border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                                  Session:{" "}
                                  {prep.examSession.academicYear
                                    ? `${prep.examSession.academicYear} - ${prep.examSession.sessionName}`
                                    : prep.examSession.sessionName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-7 p-5">
                          {/* Overview */}
                          {prep.overview && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                                Overview
                              </h4>

                              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                {prep.overview}
                              </p>
                            </div>
                          )}

                          {/* Strategy + Subject Preparation */}
                          {(prep.preparationStrategy ||
                            prep.subjectWisePreparation) && (
                              <div className="grid gap-5 lg:grid-cols-2">
                                {prep.preparationStrategy && (
                                  <div className="rounded-lg border border-slate-200 p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-teal-600" />
                                      <h4 className="text-sm font-bold text-slate-800">
                                        Preparation Strategy
                                      </h4>
                                    </div>

                                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                      {prep.preparationStrategy}
                                    </p>
                                  </div>
                                )}

                                {prep.subjectWisePreparation && (
                                  <div className="rounded-lg border border-slate-200 p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-teal-600" />
                                      <h4 className="text-sm font-bold text-slate-800">
                                        Subject-wise Preparation
                                      </h4>
                                    </div>

                                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                      {prep.subjectWisePreparation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Important Topics + Study Plan */}
                          {(prep.importantTopics || prep.studyPlan) && (
                            <div className="grid gap-5 lg:grid-cols-2">
                              {prep.importantTopics && (
                                <div className="rounded-lg border border-slate-200 p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-600" />
                                    <h4 className="text-sm font-bold text-slate-800">
                                      Important Topics
                                    </h4>
                                  </div>

                                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                    {prep.importantTopics}
                                  </p>
                                </div>
                              )}

                              {prep.studyPlan && (
                                <div className="rounded-lg border border-slate-200 p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-600" />
                                    <h4 className="text-sm font-bold text-slate-800">
                                      Study Plan
                                    </h4>
                                  </div>

                                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                    {prep.studyPlan}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Books / Previous Papers / Mock Test */}
                          {(prep.bestBooks ||
                            prep.previousYearPapers ||
                            prep.mockTest) && (
                              <div>
                                <div className="mb-4">
                                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                                    Preparation Resources
                                  </h4>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Recommended resources and practice methods
                                  </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {prep.bestBooks && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                      <h5 className="mb-2 text-sm font-bold text-slate-800">
                                        Best Books
                                      </h5>

                                      <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {prep.bestBooks}
                                      </p>
                                    </div>
                                  )}

                                  {prep.previousYearPapers && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                      <h5 className="mb-2 text-sm font-bold text-slate-800">
                                        Previous Year Papers
                                      </h5>

                                      <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {prep.previousYearPapers}
                                      </p>
                                    </div>
                                  )}

                                  {prep.mockTest && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                      <h5 className="mb-2 text-sm font-bold text-slate-800">
                                        Mock Test
                                      </h5>

                                      <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {prep.mockTest}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Preparation Details Table */}
                          {(prep.timeManagement ||
                            prep.revisionStrategy ||
                            prep.lastMinuteTips ||
                            prep.examDayTips ||
                            prep.commonMistakes) && (
                              <div>
                                <div className="mb-4">
                                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                                    Preparation Details
                                  </h4>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                  <div className="hidden grid-cols-[220px_1fr] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid">
                                    <div>Topic</div>
                                    <div>Details</div>
                                  </div>

                                  <div className="divide-y divide-slate-200">
                                    {prep.timeManagement && (
                                      <div className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_1fr]">
                                        <div className="text-sm font-semibold text-slate-700">
                                          Time Management
                                        </div>

                                        <div className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                          {prep.timeManagement}
                                        </div>
                                      </div>
                                    )}

                                    {prep.revisionStrategy && (
                                      <div className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_1fr]">
                                        <div className="text-sm font-semibold text-slate-700">
                                          Revision Strategy
                                        </div>

                                        <div className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                          {prep.revisionStrategy}
                                        </div>
                                      </div>
                                    )}

                                    {prep.lastMinuteTips && (
                                      <div className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_1fr]">
                                        <div className="text-sm font-semibold text-slate-700">
                                          Last Minute Tips
                                        </div>

                                        <div className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                          {prep.lastMinuteTips}
                                        </div>
                                      </div>
                                    )}

                                    {prep.examDayTips && (
                                      <div className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_1fr]">
                                        <div className="text-sm font-semibold text-slate-700">
                                          Exam Day Tips
                                        </div>

                                        <div className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                          {prep.examDayTips}
                                        </div>
                                      </div>
                                    )}

                                    {prep.commonMistakes && (
                                      <div className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_1fr]">
                                        <div className="text-sm font-semibold text-slate-700">
                                          Common Mistakes
                                        </div>

                                        <div className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                          {prep.commonMistakes}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* FAQs */}
                          {prep.faqs?.length > 0 && (
                            <div>
                              <div className="mb-4">
                                <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                                  Frequently Asked Questions
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                  Common questions related to {exam.name} preparation
                                </p>
                              </div>

                              <div className="space-y-3">
                                {prep.faqs.map((faq, index) => (
                                  <details
                                    key={index}
                                    className="group rounded-lg border border-slate-200 bg-white"
                                  >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                                      <span className="text-sm font-semibold text-slate-800">
                                        <span className="mr-2 text-teal-600">
                                          Q{index + 1}.
                                        </span>
                                        {faq.question}
                                      </span>

                                      <span className="shrink-0 text-lg text-slate-400 transition-transform group-open:rotate-45">
                                        +
                                      </span>
                                    </summary>

                                    <div className="border-t border-slate-100 px-4 py-4">
                                      <p className="text-sm leading-6 text-slate-600">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </details>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Description */}
                          {prep.description && (
                            <div className="border-t border-slate-200 pt-6">
                              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                                About This Preparation Guide
                              </h4>

                              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                {prep.description}
                              </p>
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

            {/* Previous Papers */}
            {activeTab === "previous-papers" && (
              <SectionCard
                title="Previous Year Papers"
                icon={FileText}
              >

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {exam.questionPaper}
                </p>

                {!exam.questionPaper && (
                  <EmptyState text="Previous year papers are not available yet." />
                )}

              </SectionCard>
            )}

            {/* Sample Papers */}
            {activeTab === "sample-papers" && (
              <SectionCard
                title="Sample Papers"
                icon={FileText}
              >

                {samplePapers.length ? (
                  <div className="space-y-4">

                    {samplePapers.map((paper) => (
                      <div
                        key={paper._id}
                        className="border-b pb-3 last:border-0"
                      >

                        <h3 className="font-bold text-slate-800">
                          {paper.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                          {paper.description}
                        </p>

                        {paper.fileUrl && (
                          <a
                            href={paper.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-sm text-teal-600"
                          >
                            Download Paper
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

            {/* Books */}
            {activeTab === "books" && (
              <SectionCard
                title="Best Books"
                icon={BookOpen}
              >
                <EmptyState text="Book recommendations are not available yet." />
              </SectionCard>
            )}

            {/* Mock Tests */}
            {activeTab === "mock-tests" && (
              <SectionCard
                title="Mock Tests"
                icon={FileText}
              >

                {mockTests.length ? (
                  <div className="space-y-4">

                    {mockTests.map((test) => (
                      <div
                        key={test._id}
                        className="border-b pb-3 last:border-0"
                      >

                        <h3 className="font-bold text-slate-800">
                          {test.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                          {test.description}
                        </p>

                        {test.fileUrl && (
                          <a
                            href={test.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-sm text-teal-600"
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

            {/* FAQs */}
            {activeTab === "faqs" && (
              <SectionCard
                title="FAQs"
                icon={FileText}
              >

                {faqs.length ? (
                  <div className="space-y-4">

                    {faqs.map((faq) => (
                      <div
                        key={faq._id}
                        className="border-b pb-3 last:border-0"
                      >

                        <h3 className="font-bold text-slate-800">
                          Q: {faq.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                          A: {faq.description}
                        </p>

                      </div>
                    ))}

                  </div>
                ) : (
                  <EmptyState text="FAQs are not available yet." />
                )}

              </SectionCard>
            )}

          </main>

          {/* Sidebar */}
          <aside className="space-y-4">

            {/* Quick Links */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 bg-slate-50 px-3.5 py-2.5">

                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Quick Links
                </h2>

              </div>

              <div className="p-1.5">

                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm ${activeTab === tab.id
                        ? "bg-teal-50 font-semibold text-teal-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >

                      <Icon className="size-3.5" />

                      <span className="truncate">
                        {exam.shortName || exam.name}{" "}
                        {tab.label}
                      </span>

                    </button>
                  );
                })}

              </div>

            </div>


            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-3.5 py-2.5">

                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Exam Information
                </h2>

              </div>

              <div className="px-3.5 py-1">

                <DetailRow
                  label="Stream"
                  value={exam.stream}
                />

                <DetailRow
                  label="Exam Type"
                  value={exam.examType || exam.category}
                />

                <DetailRow
                  label="Level"
                  value={exam.level}
                />

                <DetailRow
                  label="Conducting Body"
                  value={exam.conductingBody}
                />

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
