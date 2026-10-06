import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { createEmptyApplicationForm } from "@/components/application/ApplyApplicationModal";

import { ReviewTab } from "./ReviewTab";
import CollegeRankingTab from "./CollegeRankingTab";


const INK = "#101828";
const NAVY = "#1E3A5F";
const NAVY_DARK = "#16293F";
const GOLD = "#B8860B";

const TABS = [
  "Overview",
  "Courses & Fees",
  "Admissions",
  "Placements",
  "Facilities",
  "Cutoff",
  "Q/A",
  "Review",
  "Ranking",
  "News & Latest",
  "Contact / Location",
  "FAQ",
];

const SectionLabel = ({ children }) => (
  <h2 className="mb-3 text-[15px] font-semibold text-slate-900">{children}</h2>
);

const Stat = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2">
    <p className="text-[11px] text-slate-500">{label}</p>
    <p className="mt-0.5 text-[13px] font-semibold text-slate-800">{value ?? "—"}</p>
  </div>
);


const CoursesTab = ({ courses }) => {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {courses.length} course{courses.length === 1 ? "" : "s"} found
      </p>

      {courses.map((course, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-3.5">
            <div>
              <h3 className="text-[14px] font-semibold text-slate-900">
                {course.courseName}
              </h3>

              {course.specialization && (
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {course.specialization}
                </p>
              )}

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                {course.duration && <span>{course.duration}</span>}
                {course.eligibility && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{course.eligibility}</span>
                  </>
                )}
                {course.totalSemesters && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{course.totalSemesters} semesters</span>
                  </>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[14px] font-semibold" style={{ color: NAVY }}>
                ₹ {course.fees}
              </p>
              <p className="text-[10px] text-slate-400">total fees</p>
            </div>
          </div>

          {course.semesters?.length > 0 && (
            <SemesterSection semesters={course.semesters} />
          )}
        </div>
      ))}
    </div>
  );
};

const SemesterSection = ({ semesters }) => {
  const [selectedSemester, setSelectedSemester] = useState(0);
  const semester = semesters[selectedSemester];

  return (
    <div className="p-3.5">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {semesters.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedSemester(index)}
            className="rounded px-2.5 py-1 text-[11px] font-medium transition-colors"
            style={
              selectedSemester === index
                ? { backgroundColor: NAVY, color: "#fff" }
                : { backgroundColor: "#F1F3F5", color: "#475569" }
            }
          >
            {item.semesterName || `Sem ${item.semesterNumber || index + 1}`}
          </button>
        ))}
      </div>

      {semester?.semesterFees && (
        <div className="mb-2.5 flex items-center justify-between rounded-md border border-amber-200/60 bg-amber-50/70 px-3 py-1.5">
          <span className="text-[11px] font-medium text-amber-700">
            {semester.semesterName || `Semester ${selectedSemester + 1}`} fees
          </span>
          <span className="text-[13px] font-semibold text-amber-800">
            {semester.semesterFees}
          </span>
        </div>
      )}

      {semester?.subjects?.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-slate-100">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
                <th className="px-3 py-1.5 font-medium">#</th>
                <th className="px-3 py-1.5 font-medium">Subject</th>
                <th className="px-3 py-1.5 font-medium">Code</th>
                <th className="px-3 py-1.5 font-medium">Credits</th>
                <th className="px-3 py-1.5 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {semester.subjects.map((subject, index) => (
                <tr key={index} className="border-b border-slate-50 last:border-0">
                  <td className="px-3 py-1.5 text-slate-400">{index + 1}</td>
                  <td className="px-3 py-1.5 font-medium text-slate-700">{subject.name}</td>
                  <td className="px-3 py-1.5 text-slate-500">{subject.code}</td>
                  <td className="px-3 py-1.5 text-slate-500">{subject.credits}</td>
                  <td className="px-3 py-1.5 text-slate-500">{subject.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[11px] text-slate-400">No subjects listed for this semester.</p>
      )}
    </div>
  );
};

const FeesTab = ({ courses }) => {
  if (!courses.length) {
    return <p className="text-[13px] text-slate-500">No fee data available.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
              <th className="px-3.5 py-2.5 font-medium">#</th>
              <th className="px-3.5 py-2.5 font-medium">Course</th>
              <th className="px-3.5 py-2.5 font-medium">Duration</th>
              <th className="px-3.5 py-2.5 text-right font-medium">Total fees</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                <td className="px-3.5 py-2.5 text-slate-400">{index + 1}</td>
                <td className="px-3.5 py-2.5">
                  <p className="font-medium text-slate-800">{course.courseName}</p>
                  {course.specialization && (
                    <p className="text-[11px] text-slate-400">{course.specialization}</p>
                  )}
                </td>
                <td className="px-3.5 py-2.5 text-slate-500">{course.duration}</td>
                <td className="px-3.5 py-2.5 text-right font-semibold" style={{ color: NAVY }}>
                  {course.fees ? `₹ ${course.fees}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.map((course, index) => {
        const semesters = course.semesters?.filter((s) => s.semesterFees) || [];
        if (!semesters.length) return null;

        return (
          <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5">
              <h4 className="text-[12.5px] font-semibold text-slate-800">
                {course.courseName} — semester-wise fees
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <tbody>
                  {semesters.map((semester, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="px-3.5 py-2.5">
                        {semester.semesterName || `Semester ${semester.semesterNumber || i + 1}`}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-semibold text-amber-700">
                        {semester.semesterFees}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [university, setUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createEmptyApplicationForm());

  const [cutoffs, setCutoffs] = useState([]);
  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/college/${id}`)
      .then((res) => setCollege(res.data.college))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!college?.university) return;
    axios
      .get(`http://localhost:5001/api/university/${college.university}`)
      .then((res) => setUniversity(res.data.data))
      .catch(() => {});
  }, [college?.university]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/course")
      .then((res) => setCourses(res.data.courses || res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/cutoffs?collegeId=${id}`)
      .then((res) => setCutoffs(res.data.cutoffs || res.data.data || []))
      .catch(() => {});
  }, [id]);

  const handleApply = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setForm(createEmptyApplicationForm());
    setOpen(true);
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5001/api/applications", { collegeId: id, ...form })
      .catch(() => {});
    setOpen(false);
  };

  const getCourseName = (course) => {
    if (typeof course === "object" && course !== null) {
      return course.courseName || course.name || course.fullName || "Course";
    }
    const found = courses.find((item) => item._id === course);
    return found?.courseName || found?.name || found?.fullName || "Course";
  };

  if (!college) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <p className="text-[13px] text-red-500">Could not load college details.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const city = typeof college.location === "object" ? college.location?.city || "" : "";
  const state = typeof college.location === "object" ? college.location?.state || "" : "";
  const country = typeof college.location === "object" ? college.location?.country || "" : "";

  const location =
    city && state
      ? `${city}, ${state}`
      : city ||
        state ||
        country ||
        (typeof college.location === "string" ? college.location : "Location not available");

  const rating = college.rating ? Number(college.rating).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-10">
      {/* Compact hero strip instead of a tall image banner */}
      <div
        className="h-24 w-full md:h-28"
        style={
          college.coverImage
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(16,24,40,.55), rgba(16,24,40,.55)), url(${college.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: `linear-gradient(120deg, ${NAVY}, ${NAVY_DARK})` }
        }
      />

      <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
        <nav className="mb-2.5 flex items-center gap-1.5 text-[11.5px] text-slate-500">
          <button onClick={() => navigate(-1)} className="hover:text-slate-800">
            Back
          </button>
          <span className="text-slate-300">/</span>
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to="/colleges" className="hover:text-slate-800">Colleges</Link>
          <span className="text-slate-300">/</span>
          <span className="max-w-xs truncate font-medium text-slate-700">{college.name}</span>
        </nav>

        <Card className="mb-3.5 rounded-lg border-slate-200 p-3.5 shadow-sm">
          <div className="flex flex-col gap-3.5 md:flex-row">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
              {college.logo ? (
                <img src={college.logo} alt={college.name} className="h-full w-full object-contain p-1.5" />
              ) : (
                <span className="text-xl font-semibold text-slate-300">{college.name?.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                <div>
                  <h1 className="text-[19px] font-semibold leading-tight text-slate-900 md:text-[21px]">
                    {college.name}
                  </h1>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] text-slate-500">
                    <span>{location}</span>
                    {college.establishedYear && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>Est. {college.establishedYear}</span>
                      </>
                    )}
                    {college.collegeType && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>{college.collegeType}</span>
                      </>
                    )}
                    {university && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>{university.name}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex h-fit items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1">
                  <span className="text-[12px]" style={{ color: GOLD }}>★</span>
                  <span className="text-[12.5px] font-semibold text-amber-800">{rating}</span>
                </div>
              </div>

              {college.accreditations?.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {college.accreditations.map((item, index) => (
                    <span
                      key={index}
                      className="rounded px-2 py-0.5 text-[10.5px] font-medium"
                      style={
                        index === 0
                          ? { backgroundColor: NAVY, color: "#fff" }
                          : { backgroundColor: "#F1F3F5", color: "#475569" }
                      }
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="-mx-3.5 -mb-3.5 mt-3.5 overflow-x-auto border-t border-slate-100 px-3.5">
            <div className="flex min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="border-b-2 px-3 py-2.5 text-[12.5px] font-medium transition-colors"
                  style={
                    activeTab === tab
                      ? { borderColor: NAVY, color: NAVY }
                      : { borderColor: "transparent", color: "#667085" }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === "Overview" && (
              <div className="space-y-3.5">
                <Card className="rounded-lg border-slate-200 p-3.5">
                  <SectionLabel>Quick highlights</SectionLabel>
                  <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                    <Stat label="Faculty strength" value={college.highlights?.facultyStrength} />
                    <Stat label="Campus size" value={college.highlights?.campusSize} />
                    <Stat label="Total courses" value={college.courses?.length || 0} />
                    <Stat label="Status" value={college.status} />
                  </div>
                </Card>

                <Card className="rounded-lg border-slate-200 p-3.5">
                  <SectionLabel>About {college.name}</SectionLabel>
                  <p className="text-[13px] leading-6 text-slate-600">{college.description}</p>
                </Card>

                {college.accreditations?.length > 0 && (
                  <Card className="rounded-lg border-slate-200 p-3.5">
                    <SectionLabel>Accreditation</SectionLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {college.accreditations.map((item, index) => (
                        <span key={index} className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {college.facilities?.length > 0 && (
                  <Card className="rounded-lg border-slate-200 p-3.5">
                    <SectionLabel>Facilities</SectionLabel>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {college.facilities.map((facility, index) => (
                        <div key={index} className="rounded-md bg-slate-50 px-3 py-2 text-[12.5px] text-slate-700">
                          {facility}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "Courses & Fees" && (
              <div className="space-y-5">
                <div>
                  <SectionLabel>Courses & fees ({college.courses?.length || 0})</SectionLabel>
                  <CoursesTab courses={college.courses || []} />
                </div>
                <div>
                  <SectionLabel>Fee structure</SectionLabel>
                  <FeesTab courses={college.courses || []} />
                </div>
              </div>
            )}

            {activeTab === "Admissions" && (
              <Card className="rounded-lg border-slate-200 p-3.5">
                <SectionLabel>Admissions</SectionLabel>
                <div className="space-y-3.5">
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-700">Admission process</p>
                    <p className="mt-1 text-[13px] text-slate-600">{college.admissions?.admissionDetails}</p>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-700">Accepted exams</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {college.admissions?.entranceExams?.length > 0 ? (
                        college.admissions.entranceExams.map((exam, index) => (
                          <span key={index} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px]">
                            {exam}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">Not available</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-700">Important dates</p>
                    <p className="mt-1 text-[13px] text-slate-600">{college.admissions?.importantDates}</p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "Placements" && (
              <Card className="rounded-lg border-slate-200 p-3.5">
                <SectionLabel>Placements</SectionLabel>
                {college.placements?.length > 0 ? (
                  [...college.placements]
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .map((placement, index) => (
                      <div key={index} className="mb-3.5 rounded-md border border-slate-200 p-3.5 last:mb-0">
                        <p className="text-[12.5px] font-semibold text-slate-700">
                          Placement year {placement.year}
                        </p>
                        <div className="mt-2.5 grid grid-cols-2 gap-2 md:grid-cols-4">
                          <Stat label="Average package" value={placement.averagePackage} />
                          <Stat label="Highest package" value={placement.highestPackage} />
                          <Stat label="Median package" value={placement.medianPackage} />
                          <Stat label="Total offers" value={placement.totalOffers} />
                        </div>

                        {placement.topRecruiters?.length > 0 && (
                          <div className="mt-2.5">
                            <p className="text-[11px] font-medium text-slate-500">Top recruiters</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {placement.topRecruiters.map((recruiter, i) => (
                                <span key={i} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px]">
                                  {recruiter}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {placement.description && (
                          <p className="mt-2.5 text-[12.5px] text-slate-600">{placement.description}</p>
                        )}
                      </div>
                    ))
                ) : (
                  <p className="text-[13px] text-slate-500">Placement information is not available.</p>
                )}
              </Card>
            )}

            {activeTab === "Ranking" && <CollegeRankingTab college={college} />}

            {activeTab === "Facilities" && (
              <Card className="rounded-lg border-slate-200 p-3.5">
                <SectionLabel>Facilities</SectionLabel>
                {college.facilities?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {college.facilities.map((facility, index) => (
                      <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-center text-[12.5px] text-slate-700">
                        {facility}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-500">No facility information available.</p>
                )}
              </Card>
            )}

            {activeTab === "Cutoff" && (
              <Card className="rounded-lg border-slate-200 p-3.5">
                <div className="mb-3.5">
                  <SectionLabel>Cutoff</SectionLabel>
                  <p className="text-[12px] text-slate-500">Previous year cutoff ranks for {college.name}</p>
                </div>

                {cutoffs.length === 0 ? (
                  <div className="rounded-md border border-slate-100 bg-slate-50 p-6 text-center">
                    <p className="text-[12.5px] text-slate-500">No cutoff data available.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-md border border-slate-100">
                    <table className="w-full min-w-[900px] text-[12px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
                          <th className="px-3 py-2 font-medium">Exam</th>
                          <th className="px-3 py-2 font-medium">Session</th>
                          <th className="px-3 py-2 font-medium">Course</th>
                          <th className="px-3 py-2 font-medium">Category</th>
                          <th className="px-3 py-2 font-medium">Gender</th>
                          <th className="px-3 py-2 font-medium">Quota</th>
                          <th className="px-3 py-2 font-medium">Round</th>
                          <th className="px-3 py-2 font-medium">Year</th>
                          <th className="px-3 py-2 font-medium">Opening</th>
                          <th className="px-3 py-2 font-medium">Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cutoffs.map((cutoff) => (
                          <tr key={cutoff._id} className="border-b border-slate-50 hover:bg-slate-50/70">
                            <td className="px-3 py-2 font-medium text-slate-700">
                              {cutoff.examId?.name || cutoff.examId?.shortName}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{cutoff.examSessionId?.academicYear || cutoff.year}</td>
                            <td className="px-3 py-2 text-slate-600">{getCourseName(cutoff.courseId)}</td>
                            <td className="px-3 py-2 text-slate-600">{cutoff.category || "OPEN"}</td>
                            <td className="px-3 py-2 text-slate-600">{cutoff.gender || "ALL"}</td>
                            <td className="px-3 py-2 text-slate-600">{cutoff.quota || "HOME_STATE"}</td>
                            <td className="px-3 py-2 text-slate-600">{cutoff.round}</td>
                            <td className="px-3 py-2 text-slate-600">{cutoff.year}</td>
                            <td className="px-3 py-2 font-semibold" style={{ color: NAVY }}>{cutoff.openingRank}</td>
                            <td className="px-3 py-2 font-semibold text-red-600">{cutoff.closingRank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {activeTab === "Review" && <ReviewTab college={college} />}

            {activeTab === "Contact / Location" && (
              <div className="space-y-3.5">
                <Card className="rounded-lg border-slate-200 p-3.5">
                  <SectionLabel>Location</SectionLabel>
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                    <Stat label="City" value={city} />
                    <Stat label="State" value={state} />
                    <Stat label="Country" value={country} />
                    <Stat label="Full address" value={college.address} />
                  </div>
                </Card>

                <Card className="rounded-lg border-slate-200 p-3.5">
                  <SectionLabel>Contact information</SectionLabel>
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                    {college.phone && <Stat label="Phone" value={college.phone} />}
                    {college.email && <Stat label="Email" value={college.email} />}
                    {college.website && (
                      <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2">
                        <p className="text-[11px] text-slate-500">Website</p>
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-block text-[13px] font-semibold hover:underline"
                          style={{ color: NAVY }}
                        >
                          {college.website}
                        </a>
                      </div>
                    )}
                    {university && (
                      <div className="md:col-span-2">
                        <Stat label="Affiliated university" value={university.name} />
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="rounded-lg border-slate-200 p-3.5">
                  <SectionLabel>Map</SectionLabel>
                  <div className="rounded-md bg-slate-50 p-6 text-center">
                    <p className="text-[12.5px] text-slate-500">{location}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Map integration coming soon</p>
                  </div>
                </Card>
              </div>
            )}

            {["Syllabus", "Preparation", "Mock Test", "FAQ", "News & Latest", "Q/A"].includes(activeTab) && (
              <Card className="rounded-lg border-slate-200 p-8 text-center">
                <p className="text-[13px] text-slate-500">{activeTab} section coming soon.</p>
              </Card>
            )}
          </div>

          <div>
            <div className="space-y-3.5 lg:sticky lg:top-4">
              <Card className="rounded-lg border-slate-200 p-3.5">
                <h3 className="text-[13px] font-semibold text-slate-900">Interested in this college?</h3>
                <p className="mb-3 mt-1 text-[11.5px] text-slate-500">
                  Get admission assistance and expert counselling
                </p>
                <Button
                  onClick={handleApply}
                  className="w-full text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  Apply now
                </Button>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  style={{ borderColor: NAVY, color: NAVY }}
                >
                  Add to compare
                </Button>
              </Card>

              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11.5px] text-emerald-700">
                Session booked
              </div>

              <Card className="rounded-lg border-slate-200 p-3.5">
                <h3 className="mb-2.5 text-[13px] font-semibold text-slate-900">Quick stats</h3>
                <div className="space-y-2 text-[12px]">
                  {[
                    ["Established", college.establishedYear],
                    ["Type", college.collegeType],
                    ["Campus size", college.highlights?.campusSize],
                    ["Courses", college.courses?.length || 0],
                    ["Rating", rating],
                    ["Status", college.status],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-medium text-slate-800">{value ?? "—"}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-500">Website</span>
                    {college.website ? (
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium"
                        style={{ color: NAVY }}
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="font-medium text-slate-800">N/A</span>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle style={{ color: INK }}>Apply to {college.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 py-3.5">
              <div>
                <Label>Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
              </div>
              <div>
                <Label>Phone number</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" required />
              </div>
              <div>
                <Label>Email id</Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Enter your message" required />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="text-white" style={{ backgroundColor: NAVY }}>
                Apply now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegeDetail;
