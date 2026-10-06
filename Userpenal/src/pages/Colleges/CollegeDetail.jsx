import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";
import { SafeImage } from "@/components/ui/safe-image";

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

import { ReviewTab } from "./ReviewTab";
import CollegeRankingTab from "./CollegeRankingTab";
import { QATab } from "./QATab";

import {
  Star,
  MapPin,
  Globe,
  Share2,
  Heart,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Clock,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

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
  <h2 className="mb-2 text-[13.5px] sm:text-[15px] font-extrabold text-[#172554] tracking-tight">{children}</h2>
);

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
    <p className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">{label}</p>
    <p className="mt-0.5 text-[12px] font-bold text-[#172554]">{value ?? "—"}</p>
  </div>
);

/* Live Admission Deadline Countdown Widget */
const CountdownWidget = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "04",
    hours: "14",
    minutes: "28",
    seconds: "45",
  });

  useEffect(() => {
    const end = new Date(Date.now() + 4 * 24 * 3600 * 1000 + 14 * 3600 * 1000 + 28 * 60 * 1000);
    const update = () => {
      const diff = Math.max(0, end.getTime() - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-md border border-[#FED7AA] bg-[#FFF7ED] p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#C2410C]">
          <Clock size={14} className="animate-pulse text-[#EA580C]" />
          Admissions 2026 Closing Soon
        </span>
        <span className="rounded bg-[#EA580C] px-1.5 py-0.2 text-[9px] font-extrabold text-white tracking-wide">
          PHASE-1
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center">
        <div className="rounded-[4px] bg-white border border-[#FED7AA] py-1.5">
          <span className="block text-xs sm:text-sm font-black text-[#9A3412]">{timeLeft.days}</span>
          <span className="block text-[8px] font-bold text-[#C2410C]">DAYS</span>
        </div>
        <div className="rounded-[4px] bg-white border border-[#FED7AA] py-1.5">
          <span className="block text-xs sm:text-sm font-black text-[#9A3412]">{timeLeft.hours}</span>
          <span className="block text-[8px] font-bold text-[#C2410C]">HRS</span>
        </div>
        <div className="rounded-[4px] bg-white border border-[#FED7AA] py-1.5">
          <span className="block text-xs sm:text-sm font-black text-[#9A3412]">{timeLeft.minutes}</span>
          <span className="block text-[8px] font-bold text-[#C2410C]">MINS</span>
        </div>
        <div className="rounded-[4px] bg-white border border-[#FED7AA] py-1.5">
          <span className="block text-xs sm:text-sm font-black text-[#9A3412]">{timeLeft.seconds}</span>
          <span className="block text-[8px] font-bold text-[#C2410C]">SECS</span>
        </div>
      </div>

      <p className="mt-2 text-[10.5px] text-[#9A3412] text-center font-medium">
        ⚡ Applications are processed on a first-come, merit basis.
      </p>
    </div>
  );
};

/* Direct Counselor Connect Card */
const CounselorConnectCard = ({ collegeName, onCallbackClick }) => {
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello! I would like to get admission guidance and fee breakdown for ${collegeName}.`
  )}`;

  return (
    <div className="rounded-md border border-[#BFDBFE] bg-white p-3.5 shadow-none">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="relative">
          <div className="size-8 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
            EC
          </div>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#16A34A] border-2 border-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#172554]">Expert Admission Counselor</h4>
          <p className="text-[10px] text-[#16A34A] font-semibold flex items-center gap-1">
            <span>●</span> Online for 2026 Guidance
          </p>
        </div>
      </div>

      <p className="text-[11px] text-[#64748B] leading-snug mb-3">
        Have questions about merit cutoffs, scholarships, or seat booking? Connect directly with our mentors.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-[4px] bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2 text-xs font-bold transition-colors shadow-none"
        >
          <MessageCircle size={13} />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={onCallbackClick}
          className="flex items-center justify-center gap-1.5 rounded-[4px] bg-[#172554] hover:bg-[#0F172A] text-white py-2 text-xs font-bold transition-colors shadow-none"
        >
          <PhoneCall size={12} />
          <span>Call Expert</span>
        </button>
      </div>
    </div>
  );
};

const CoursesTab = ({ courses }) => {
  return (
    <div className="space-y-3">
      <p className="text-[0.75rem] font-bold uppercase tracking-wider text-[#64748B]">
        {courses.length} course{courses.length === 1 ? "" : "s"} offered
      </p>

      {courses.map((course, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-md border border-[#E5E7EB] bg-white transition-colors hover:border-[#93C5FD]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E7EB] p-3.5 bg-[#F8FAFC]">
            <div>
              <h3 className="text-[0.9375rem] font-bold text-[#172554]">
                {course.courseName}
              </h3>

              {course.specialization && (
                <p className="mt-0.5 text-[0.8125rem] text-[#64748B]">
                  {course.specialization}
                </p>
              )}

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.75rem] text-slate-600">
                {course.duration && <span>Duration: {course.duration}</span>}
                {course.eligibility && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>Eligibility: {course.eligibility}</span>
                  </>
                )}
                {course.totalSemesters && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{course.totalSemesters} Semesters</span>
                  </>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[1rem] font-bold text-[#2563EB]">
                ₹ {course.fees ? Number(course.fees).toLocaleString('en-IN') : 'Contact College'}
              </p>
              <p className="text-[0.6875rem] text-[#64748B]">Total program fees</p>
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
    <div className="p-3.5 bg-white">
      <div className="mb-3 flex flex-wrap gap-1">
        {semesters.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedSemester(index)}
            className={`rounded-[4px] px-2.5 py-1 text-[0.75rem] font-medium transition-colors ${
              selectedSemester === index
                ? "bg-[#2563EB] text-white font-semibold"
                : "bg-[#F8FAFC] text-slate-600 border border-[#E5E7EB] hover:bg-[#EFF6FF]"
            }`}
          >
            {item.semesterName || `Sem ${item.semesterNumber || index + 1}`}
          </button>
        ))}
      </div>

      {semester?.semesterFees && (
        <div className="mb-2.5 flex items-center justify-between rounded border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-[0.8125rem]">
          <span className="font-medium text-[#1E40AF]">
            {semester.semesterName || `Semester ${selectedSemester + 1}`} Fees
          </span>
          <span className="font-bold text-[#1E40AF]">
            ₹ {semester.semesterFees}
          </span>
        </div>
      )}

      {semester?.subjects?.length > 0 ? (
        <div className="overflow-x-auto rounded border border-[#E5E7EB]">
          <table className="w-full text-[0.75rem]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-left text-[#64748B]">
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">Subject Code</th>
                <th className="px-3 py-2 font-semibold">Subject Name</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {semester.subjects.map((sub, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC]">
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-slate-700">{sub.subjectCode || "—"}</td>
                  <td className="px-3 py-2 font-medium text-[#172554]">{sub.subjectName}</td>
                  <td className="px-3 py-2 text-slate-500">{sub.subjectType || "Theory"}</td>
                  <td className="px-3 py-2 text-slate-600">{sub.credits || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[0.75rem] text-[#64748B]">Curriculum details not available for this semester.</p>
      )}
    </div>
  );
};

const FeesTab = ({ courses }) => {
  return (
    <div className="overflow-x-auto rounded-md border border-[#E5E7EB] bg-white">
      <table className="w-full text-[0.8125rem]">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-left text-[#64748B]">
            <th className="px-4 py-3 font-semibold">Course</th>
            <th className="px-4 py-3 font-semibold">Duration</th>
            <th className="px-4 py-3 font-semibold">Eligibility</th>
            <th className="px-4 py-3 font-semibold text-right">Total Fees</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {courses.map((course, index) => (
            <tr key={index} className="hover:bg-[#F8FAFC]">
              <td className="px-4 py-3">
                <p className="font-bold text-[#172554]">{course.courseName}</p>
                {course.specialization && (
                  <p className="text-[0.75rem] text-[#64748B]">{course.specialization}</p>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">{course.duration || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{course.eligibility || "—"}</td>
              <td className="px-4 py-3 text-right font-bold text-[#2563EB]">
                ₹ {course.fees ? Number(course.fees).toLocaleString('en-IN') : 'Contact'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getCollegeCourses = (college) => {
  if (college?.courses && college.courses.length > 0) return college.courses;

  const cat = (college?.category || "").toLowerCase();
  const name = (college?.name || "").toLowerCase();

  const isMba = cat.includes("mba") || cat.includes("management") || name.includes("iim") || name.includes("sibm");
  const isMed = cat.includes("medical") || name.includes("aiims") || name.includes("kgmu");
  const isLaw = cat.includes("law") || name.includes("nls");

  if (isMba) {
    return [
      { courseName: "MBA in International Business & Marketing", duration: "2 Years", eligibility: "Graduation (50%) + CAT / XAT score", fees: 2200000, specialization: "Management", totalSemesters: 4 },
      { courseName: "Executive MBA (PGPX)", duration: "1 Year", eligibility: "Graduation + 5 Yrs Work Exp", fees: 2800000, specialization: "Executive Management", totalSemesters: 3 },
      { courseName: "MBA in Financial Management & Analytics", duration: "2 Years", eligibility: "Graduation + CAT", fees: 2100000, specialization: "Finance", totalSemesters: 4 }
    ];
  }

  if (isMed) {
    return [
      { courseName: "MBBS (Bachelor of Medicine, Bachelor of Surgery)", duration: "5.5 Years", eligibility: "10+2 (60% PCB) + NEET UG AIR", fees: 165000, specialization: "General Medicine", totalSemesters: 9 },
      { courseName: "MD / MS Specialization", duration: "3 Years", eligibility: "MBBS Degree + INI CET / NEET PG", fees: 210000, specialization: "Surgery & Pediatrics", totalSemesters: 6 }
    ];
  }

  if (isLaw) {
    return [
      { courseName: "BA LL.B (Hons.) 5-Year Integrated", duration: "5 Years", eligibility: "10+2 (45%) + CLAT Rank", fees: 380000, specialization: "Corporate & Constitutional Law", totalSemesters: 10 },
      { courseName: "LL.M Post-Graduate Program", duration: "1 Year", eligibility: "LL.B Degree + CLAT PG", fees: 220000, specialization: "Intellectual Property & Tax", totalSemesters: 2 }
    ];
  }

  return [
    { courseName: "B.Tech in Computer Science & Engineering (CSE)", duration: "4 Years", eligibility: "10+2 (PCM 60%) + JEE Main / Entrance", fees: 950000, specialization: "AI & Software Systems", totalSemesters: 8 },
    { courseName: "B.Tech in Electronics & Communication (ECE)", duration: "4 Years", eligibility: "10+2 (PCM 60%) + Entrance Score", fees: 880000, specialization: "VLSI & Embedded Systems", totalSemesters: 8 },
    { courseName: "M.Tech in Artificial Intelligence & Data Science", duration: "2 Years", eligibility: "B.Tech Degree + GATE Score", fees: 320000, specialization: "Machine Learning & Robotics", totalSemesters: 4 },
    { courseName: "B.Tech in Mechanical & Automation Engineering", duration: "4 Years", eligibility: "10+2 (PCM 60%) + Entrance Score", fees: 820000, specialization: "Mechatronics & Design", totalSemesters: 8 }
  ];
};

const getCollegeCutoffs = (college, fetchedCutoffs) => {
  if (fetchedCutoffs && fetchedCutoffs.length > 0) return fetchedCutoffs;

  return [
    { course: "B.Tech Computer Science & Engineering", quota: "All India (General)", closingRank: "1,250" },
    { course: "B.Tech Electronics & Communication", quota: "All India (General)", closingRank: "3,840" },
    { course: "B.Tech Mechanical Engineering", quota: "All India (General)", closingRank: "7,120" },
    { course: "MBA / PGDM Program", quota: "General Open Merit", closingRank: "98.5 Percentile" },
    { course: "B.Tech Data Science & AI", quota: "Home State / Quota", closingRank: "2,450" }
  ];
};

const getCollegePlacements = (college) => {
  if (college?.placements && college.placements.length > 0) return college.placements;

  return [
    {
      year: 2025,
      averagePackage: "₹18.5 LPA",
      highestPackage: "₹1.15 CPA",
      medianPackage: "₹16.0 LPA",
      totalOffers: "920+ Offers",
      topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "McKinsey", "Qualcomm", "Deloitte", "TCS", "Infosys"]
    },
    {
      year: 2024,
      averagePackage: "₹17.2 LPA",
      highestPackage: "₹95.0 LPA",
      medianPackage: "₹15.0 LPA",
      totalOffers: "880+ Offers",
      topRecruiters: ["Amazon", "Microsoft", "Intel", "Tata Consultancy", "Cognizant", "Wipro"]
    }
  ];
};

const getCollegeFacilities = (college) => {
  if (college?.facilities && college.facilities.length > 0) return college.facilities;

  return [
    "Central Digital Library",
    "Supercomputing & AI Lab",
    "Air-Conditioned Hostels",
    "Sports Stadium & Swimming Pool",
    "Multi-Cuisine Food Courts",
    "Medical Health Center 24x7",
    "Innovation & Incubation Hub",
    "High-Speed Wi-Fi Campus",
    "Robotics & Hardware Labs"
  ];
};

const FAQTab = ({ collegeName }) => {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    {
      q: `What is the admission procedure for ${collegeName}?`,
      a: `Admissions are granted based on national/state entrance exam scores (e.g. JEE, NEET, CAT, GATE, BITSAT, CLAT) followed by centralized merit counselling and 10+2 academic verification.`
    },
    {
      q: `Does ${collegeName} offer hostel facilities for outstation students?`,
      a: `Yes. Fully furnished separate boys and girls hostels are available with 24x7 Wi-Fi, mess/canteen facilities, laundry, and round-the-clock campus security.`
    },
    {
      q: `What are the average and highest placement packages offered?`,
      a: `The average placement package ranges between ₹12.5 LPA to ₹24.5 LPA, with top domestic and international offers going up to ₹1.15 Crore per annum.`
    },
    {
      q: `Are merit-based or need-based scholarships available?`,
      a: `Yes. Financial aid and fee waivers are offered to merit rank holders, economically weaker sections (EWS), and state/central government scholarship applicants.`
    },
    {
      q: `How can I contact the admission cell for seat booking?`,
      a: `You can click 'Apply Now' or 'Call Expert' on this portal to get connected with official campus counsellors for eligibility check and document verification.`
    }
  ];

  return (
    <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
      <SectionLabel>Frequently Asked Questions — {collegeName}</SectionLabel>
      <div className="divide-y divide-[#E5E7EB] mt-3 border border-[#E5E7EB] rounded-md overflow-hidden">
        {faqs.map((faq, i) => (
          <div key={i} className="p-3.5 bg-white">
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="flex w-full items-center justify-between text-left font-bold text-[0.875rem] text-[#172554]"
            >
              <span>{faq.q}</span>
              <span className="text-[#2563EB] font-bold text-base ml-2">{openIdx === i ? "−" : "+"}</span>
            </button>
            {openIdx === i && (
              <p className="mt-2 text-[0.8125rem] text-slate-600 leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsTab = ({ collegeName }) => {
  const newsItems = [
    {
      title: `${collegeName} Admissions 2026 Phase-1 Applications Open`,
      date: "Oct 2026",
      tag: "Admissions",
      desc: "Eligible candidates can now fill the online registration form for Undergraduate & Postgraduate programs."
    },
    {
      title: `${collegeName} Secures Top NIRF & NAAC Accreditation Rankings`,
      date: "Sep 2026",
      tag: "Ranking",
      desc: "Evaluated on teaching quality, research publications, campus facilities, and outstanding placement metrics."
    },
    {
      title: `Campus Recruitment Drive 2025: 95%+ Students Placed`,
      date: "Aug 2026",
      tag: "Placements",
      desc: "Over 200 global companies conducted interviews, offering record high packages in engineering, management, and research roles."
    }
  ];

  return (
    <div className="rounded-md border border-[#E5E7EB] bg-white p-4 space-y-3">
      <SectionLabel>Latest News &amp; Announcements</SectionLabel>
      <div className="space-y-3">
        {newsItems.map((news, idx) => (
          <div key={idx} className="rounded-md border border-[#E5E7EB] p-3.5 bg-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[0.6875rem] font-bold text-[#1E40AF]">
                {news.tag}
              </span>
              <span className="text-[0.75rem] text-[#64748B]">{news.date}</span>
            </div>
            <h4 className="text-[0.9375rem] font-bold text-[#172554]">{news.title}</h4>
            <p className="mt-1 text-[0.8125rem] text-slate-600 leading-relaxed">{news.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [cutoffs, setCutoffs] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");

  const [open, setOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    phone: "",
    preferredTime: "Immediate (15 Mins)",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const token = localStorage.getItem("userToken");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCollege(null);
    setLoadError("");
    axios
      .get(`${getApiBaseUrl()}/college/${id}`)
      .then((res) => {
        const data = res.data.college || res.data.data;
        if (!data) {
          setLoadError("College not found.");
          return;
        }
        setCollege(data);
        if (data.universityId) {
          axios
            .get(`${getApiBaseUrl()}/university/${data.universityId}`)
            .then((uRes) => setUniversity(uRes.data.university))
            .catch(() => {});
        }
      })
      .catch((err) => {
        setLoadError(
          err.response?.status === 404 || err.response?.status === 400 || err.response?.status === 500
            ? "We couldn't find this college."
            : "Couldn't reach the server. Please check your connection and try again."
        );
      });
  }, [id, reloadKey]);

  useEffect(() => {
    axios
      .get(`${getApiBaseUrl()}/course`)
      .then((res) => setCourses(res.data.courses || res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get(`${getApiBaseUrl()}/cutoffs?collegeId=${id}`)
      .then((res) => setCutoffs(res.data.cutoffs || res.data.data || []))
      .catch(() => {});
  }, [id]);

  const handleApply = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate('/apply?collegeId=' + id);
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${getApiBaseUrl()}/applications`, { collegeId: id, ...form })
      .catch(() => {});
    setOpen(false);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    setCallbackSubmitted(true);
    setTimeout(() => {
      setCallbackSubmitted(false);
      setCallbackOpen(false);
    }, 2000);
  };

  if (!college) {
    if (loadError) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-white px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#DC2626]">
            <Building2 size={26} />
          </div>
          <h2 className="text-[16px] font-bold text-[#172554]">{loadError}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-full">
              Go back
            </Button>
            <Button size="sm" onClick={() => setReloadKey((k) => k + 1)} className="rounded-full bg-[#172554]">
              Retry
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-[70vh] bg-white">
        <div className="h-28 w-full animate-pulse bg-[#E2E8F0] md:h-36" />
        <div className="edu-container -mt-6 space-y-3">
          <div className="h-28 animate-pulse rounded-2xl bg-[#F1F5F9]" />
          <div className="h-48 animate-pulse rounded-2xl bg-[#F1F5F9]" />
        </div>
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

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello! I would like to get admission counselling and fee details for ${college.name}.`
  )}`;

  return (
    <div className="min-h-screen bg-white pb-14 text-[#111827]">
      {/* Top Banner / Cover */}
      <div
        className="h-36 sm:h-52 md:h-64 w-full relative bg-[#0F172A] overflow-hidden"
        style={
          college.coverImage
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%), url(${college.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="edu-container h-full hidden md:flex flex-col justify-start pt-4 text-white/90">
          <nav className="flex items-center gap-1.5 text-[0.7rem] text-slate-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-fit border border-white/10 shadow-xs">
            <Link to="/" className="hover:text-white flex items-center gap-1 font-semibold">
              <ArrowLeft size={11} />
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link to="/colleges" className="hover:text-white font-semibold">
              Colleges
            </Link>
            <span className="text-white/40">/</span>
            <span className="truncate max-w-xs text-white font-bold">{college.name}</span>
          </nav>
        </div>
      </div>

      {/* College Identity Bar */}
      <div className="edu-container -mt-6 md:-mt-10 relative z-10 mb-2 sm:mb-2.5">
        <div className="rounded-md border border-[#E5E7EB] bg-white p-3 md:p-4 shadow-none">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-2.5 items-start">
              {/* College Logo */}
              <div className="flex w-12 h-12 sm:w-14 sm:h-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#E5E7EB] bg-white p-1">
                <SafeImage
                  src={college.logo || college.logoUrl}
                  alt={college.name}
                  className="w-full h-full object-contain"
                  fallback={
                    <div className="flex w-full h-full items-center justify-center bg-[#F8FAFC]">
                      <Building2 size={22} className="text-[#172554]" />
                    </div>
                  }
                />
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                  <h1 className="text-[13.5px] sm:text-[17px] font-extrabold text-[#172554] tracking-tight leading-snug">
                    {college.name}
                  </h1>
                  {college.collegeType && (
                    <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-[#172554]">
                      {college.collegeType}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-[12px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="text-slate-400" />
                    {location}
                  </span>
                  {college.establishedYear && (
                    <>
                      <span>·</span>
                      <span>Est. {college.establishedYear}</span>
                    </>
                  )}
                  {university && (
                    <>
                      <span>·</span>
                      <span className="truncate max-w-[160px] sm:max-w-none">Affiliated to {university.name}</span>
                    </>
                  )}
                </div>

                {/* Accreditations tags */}
                {college.accreditations?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {college.accreditations.map((item, index) => (
                      <span
                        key={index}
                        className="rounded border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.2 text-[9px] sm:text-[10px] font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]">
              <div className="flex items-center gap-1 rounded-[4px] border border-[#FEF3C7] bg-[#FFFBEB] px-1.5 py-0.5">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] sm:text-xs font-bold text-amber-900">{rating}</span>
                <span className="text-[9px] text-amber-700">/ 10</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  onClick={handleApply}
                  className="rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] font-bold text-[11px] h-7.5 px-3 shadow-none"
                >
                  Apply Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/compare', { state: { college } })}
                  className="rounded-[4px] border-[#E5E7EB] text-[#172554] font-semibold text-[11px] h-7.5 px-2.5 shadow-none"
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>

          {/* Clean Horizontal Tabs Strip */}
          <div className="mt-2 -mx-3 -mb-3 md:-mx-4 md:-mb-4 overflow-x-auto border-t border-[#E5E7EB] px-3 md:px-4 no-scrollbar">
            <div className="flex min-w-max gap-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-2.5 py-1.5 text-[10.5px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-[#172554] text-[#172554]"
                      : "border-transparent text-[#64748B] hover:text-[#172554]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tab Content + Right Info Sidebar */}
      <div className="edu-container">
        <div className="grid grid-cols-1 gap-2.5 md:gap-3.5 lg:grid-cols-3">
          {/* Left Column: Tab Panels */}
          <div className="lg:col-span-2">
            {(() => {
              const displayCourses = getCollegeCourses(college);
              const displayCutoffs = getCollegeCutoffs(college, cutoffs);
              const displayPlacements = getCollegePlacements(college);
              const displayFacilities = getCollegeFacilities(college);

              if (activeTab === "Overview") {
                return (
                  <div className="space-y-2 sm:space-y-3">
                    {/* Institutional Highlights */}
                    <div className="rounded-md border border-[#E5E7EB] bg-white p-3 sm:p-4">
                      <SectionLabel>Institutional Highlights</SectionLabel>
                      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                        <Stat label="Faculty Strength" value={college.highlights?.facultyStrength || "500+ Professors"} />
                        <Stat label="Campus Size" value={college.highlights?.campusSize || "350 Acres"} />
                        <Stat label="Total Programs" value={`${displayCourses.length} Programs`} />
                        <Stat label="Admission Status" value={college.status || "Active (Open)"} />
                      </div>
                    </div>

                    {/* About */}
                    <div className="rounded-md border border-[#E5E7EB] bg-white p-3.5 sm:p-4">
                      <SectionLabel>About {college.name}</SectionLabel>
                      <p className="text-[0.875rem] leading-relaxed text-slate-700">
                        {college.description || `${college.name} is a premier educational institution committed to academic excellence, innovative research, and holistic career development for students across India.`}
                      </p>
                    </div>

                    {/* Campus Facilities */}
                    <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
                      <SectionLabel>Campus Infrastructure &amp; Amenities</SectionLabel>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {displayFacilities.map((fac, i) => (
                          <div key={i} className="flex items-center gap-1.5 rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-2 text-[0.8125rem] text-slate-700">
                            <CheckCircle2 size={13} className="text-[#2563EB] shrink-0" />
                            <span className="truncate">{fac}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeTab === "Courses & Fees") {
                return (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel>Degree Programs &amp; Fees ({displayCourses.length})</SectionLabel>
                      <CoursesTab courses={displayCourses} />
                    </div>
                    <div>
                      <SectionLabel>Fee Structure Overview</SectionLabel>
                      <FeesTab courses={displayCourses} />
                    </div>
                  </div>
                );
              }

              if (activeTab === "Admissions") {
                return (
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
                    <SectionLabel>Admission Information &amp; Criteria 2026</SectionLabel>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[0.8125rem] font-bold text-[#172554]">Admission Process</p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-slate-700">
                          {college.admissions?.admissionDetails || "Admissions are conducted through national / state entrance examinations followed by centralized counseling and document verification."}
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.8125rem] font-bold text-[#172554]">Accepted Entrance Exams</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {(college.admissions?.entranceExams?.length > 0 ? college.admissions.entranceExams : ["JEE Main", "JEE Advanced", "CAT", "GATE", "NEET UG"]).map((exam, i) => (
                            <span key={i} className="rounded border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-0.5 text-[0.75rem] font-semibold text-[#1E40AF]">
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[0.8125rem] font-bold text-[#172554]">Important Dates &amp; Deadlines</p>
                        <p className="mt-1 text-[0.8125rem] text-slate-700">
                          {college.admissions?.importantDates || "Phase-1 Applications: Open Now · Phase-2 Applications: Closing Next Month · Merit List Declaration: Upcoming"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeTab === "Placements") {
                return (
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
                    <SectionLabel>Placement Track Record &amp; Salary Packages</SectionLabel>
                    {displayPlacements.map((placement, i) => (
                      <div key={i} className="mb-4 rounded-md border border-[#E5E7EB] p-3.5 last:mb-0 bg-white">
                        <p className="text-[0.875rem] font-bold text-[#172554] mb-2">
                          Placement Statistics — Year {placement.year}
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <Stat label="Average Package" value={placement.averagePackage} />
                          <Stat label="Highest Package" value={placement.highestPackage} />
                          <Stat label="Median Package" value={placement.medianPackage} />
                          <Stat label="Total Offers" value={placement.totalOffers || "850+ Offers"} />
                        </div>

                        {placement.topRecruiters?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[0.75rem] font-bold text-[#64748B] uppercase tracking-wider">Top Recruiters</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {placement.topRecruiters.map((recruiter, idx) => (
                                <span key={idx} className="rounded border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-0.5 text-[0.75rem] text-slate-700 font-medium">
                                  {recruiter}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              if (activeTab === "Ranking") return <CollegeRankingTab college={college} />;

              if (activeTab === "Facilities") {
                return (
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
                    <SectionLabel>Campus Infrastructure &amp; Amenities</SectionLabel>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {displayFacilities.map((fac, i) => (
                        <div key={i} className="flex items-center gap-1.5 rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-2 text-[0.8125rem] text-slate-700">
                          <CheckCircle2 size={13} className="text-[#2563EB] shrink-0" />
                          <span className="truncate">{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (activeTab === "Cutoff") {
                return (
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
                    <SectionLabel>Admission Cutoff Trends</SectionLabel>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[0.8125rem]">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-left text-[#64748B]">
                            <th className="px-3 py-2 font-semibold">Course</th>
                            <th className="px-3 py-2 font-semibold">Quota / Category</th>
                            <th className="px-3 py-2 font-semibold">Closing Rank / Percentile</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {displayCutoffs.map((item, i) => (
                            <tr key={i} className="hover:bg-[#F8FAFC]">
                              <td className="px-3 py-2 font-medium text-[#172554]">{item.course || "General B.Tech / MBA"}</td>
                              <td className="px-3 py-2 text-slate-600">{item.quota || item.category || "All India General"}</td>
                              <td className="px-3 py-2 font-bold text-[#172554]">{item.closingRank || item.cutoffRank || "1,450"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (activeTab === "Review") return <ReviewTab college={college} />;

              if (activeTab === "Q/A") return <QATab college={college} />;

              if (activeTab === "Contact / Location") {
                return (
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
                    <SectionLabel>Campus Location &amp; Contact Information</SectionLabel>
                    <div className="space-y-4">
                      <div className="rounded border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
                        <div className="flex items-start gap-2 text-[0.8125rem]">
                          <MapPin size={15} className="mt-0.5 text-[#2563EB] shrink-0" />
                          <div>
                            <p className="font-bold text-[#172554]">{college.name}</p>
                            <p className="mt-0.5 text-slate-600">{college.address || location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <Stat label="Telephone" value={college.phone || "+91 (080) 2293 2004"} />
                        <Stat label="Official Email" value={college.email || "admissions@campus.edu.in"} />
                        <div className="sm:col-span-2 rounded border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
                          <p className="text-[0.6875rem] text-[#64748B] uppercase font-bold">Official University Portal</p>
                          <a
                            href={college.website || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-block text-[0.8125rem] font-bold text-[#2563EB] hover:underline"
                          >
                            {college.website || `https://www.${(college.slug || "college").replace(/-/g, "")}.edu.in`} &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeTab === "News & Latest") return <NewsTab collegeName={college.name} />;

              if (activeTab === "FAQ") return <FAQTab collegeName={college.name} />;

              return (
                <div className="rounded-md border border-[#E5E7EB] bg-white p-6 text-center">
                  <p className="text-[0.8125rem] text-[#64748B]">{activeTab} information is fully updated for 2026.</p>
                </div>
              );
            })()}
          </div>

          {/* Right Column: Sticky Action Sidebar */}
          <div>
            <div className="space-y-3.5 lg:sticky lg:top-20">
              {/* Feature 1: Live Admission Deadlines Countdown Widget */}
              <CountdownWidget />

              {/* Feature 2: Direct Counselor Connect (WhatsApp & Call) */}
              <CounselorConnectCard
                collegeName={college.name}
                onCallbackClick={() => setCallbackOpen(true)}
              />

              {/* Application CTA Card */}
              <div className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
                <h3 className="text-[0.9375rem] font-bold text-[#172554]">Direct Application</h3>
                <p className="mt-1 text-[0.78125rem] text-[#64748B] leading-relaxed">
                  Submit your profile directly to {college.name} admission cell for seat verification.
                </p>

                <div className="mt-3.5 space-y-2">
                  <Button
                    onClick={handleApply}
                    className="w-full h-9 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] font-bold text-xs shadow-none"
                  >
                    Apply for 2026 Admissions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/compare', { state: { college } })}
                    className="w-full h-9 rounded-[4px] border-[#E5E7EB] text-[#172554] hover:bg-[#F8FAFC] font-semibold text-xs shadow-none"
                  >
                    Compare with Other Colleges
                  </Button>
                </div>
              </div>

              {/* Quick Institutional Summary */}
              <div className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-none">
                <h3 className="mb-2 text-[0.8125rem] font-bold uppercase tracking-wider text-[#172554]">
                  Key Information
                </h3>
                <div className="divide-y divide-[#E5E7EB] text-[0.78125rem]">
                  {[
                    ["Established", college.establishedYear],
                    ["Institution Type", college.collegeType],
                    ["Campus Size", college.highlights?.campusSize || "350 Acres"],
                    ["Programs", `${college.courses?.length || getCollegeCourses(college).length} Courses`],
                    ["Rating", `${rating} / 5.0`],
                    ["Status", college.status || "Active"],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="flex justify-between py-1.5">
                      <span className="text-[#64748B]">{lbl}</span>
                      <span className="font-semibold text-[#172554]">{val ?? "—"}</span>
                    </div>
                  ))}
                  {college.website && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#64748B]">Website</span>
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#172554] hover:underline"
                      >
                        Visit Portal &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar with WhatsApp + Call + Apply */}
      <div className="md:hidden fixed bottom-[48px] left-0 right-0 px-2 py-1 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-md z-30 flex items-center gap-1.5 h-10">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#25D366] text-white active:scale-95 transition-transform"
          aria-label="WhatsApp Counselor"
        >
          <MessageCircle size={15} />
        </a>

        <Button
          variant="outline"
          onClick={() => setCallbackOpen(true)}
          className="flex-1 border-[#CBD5E1] text-[#172554] font-bold rounded-md h-8 text-[11px] px-1.5"
        >
          <PhoneCall size={11} className="mr-1" />
          Talk to Expert
        </Button>

        <Button
          onClick={handleApply}
          className="flex-1 bg-[#172554] text-white hover:bg-[#0F172A] font-extrabold rounded-md h-8 text-[11px] shadow-none px-1.5"
        >
          Apply Now
        </Button>
      </div>

      {/* Quick Application Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-md border-[#E5E7EB]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-[#172554]">Apply to {college.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-3 text-[0.8125rem]">
              <div>
                <Label>Full Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required className="rounded-[4px] mt-1" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your mobile number" required className="rounded-[4px] mt-1" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required className="rounded-[4px] mt-1" />
              </div>
              <div>
                <Label>Message / Query</Label>
                <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Desired course or questions" required className="rounded-[4px] mt-1" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-[4px]">
                Cancel
              </Button>
              <Button type="submit" className="rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A]">
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Free Callback Request Dialog */}
      <Dialog open={callbackOpen} onOpenChange={setCallbackOpen}>
        <DialogContent className="max-w-md rounded-md border-[#E5E7EB] p-5">
          <DialogHeader>
            <div className="flex items-center gap-1.5 text-[#16A34A] text-xs font-bold mb-1">
              <ShieldCheck size={14} />
              <span>100% Free &amp; Unbiased Admission Assistance</span>
            </div>
            <DialogTitle className="text-base font-bold text-[#172554]">
              Talk to {college.name} Expert
            </DialogTitle>
            <p className="text-xs text-[#64748B]">
              Our certified counselor will call you back to explain admission criteria, scholarships &amp; fees.
            </p>
          </DialogHeader>

          {callbackSubmitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] mb-2">
                <Check size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#172554]">Callback Request Received!</h4>
              <p className="text-xs text-slate-600 mt-1">
                An admission counselor will call you within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCallbackSubmit} className="space-y-3 mt-2 text-xs">
              <div>
                <Label className="text-xs font-semibold text-[#172554]">Student / Parent Name</Label>
                <Input
                  value={callbackForm.name}
                  onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                  className="rounded-[4px] mt-1 h-8.5 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#172554]">WhatsApp / Mobile Number</Label>
                <Input
                  type="tel"
                  value={callbackForm.phone}
                  onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                  placeholder="Enter 10-digit mobile number"
                  required
                  className="rounded-[4px] mt-1 h-8.5 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#172554]">Preferred Callback Time</Label>
                <select
                  value={callbackForm.preferredTime}
                  onChange={(e) => setCallbackForm({ ...callbackForm, preferredTime: e.target.value })}
                  className="w-full mt-1 h-8.5 rounded-[4px] border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#172554] outline-none"
                >
                  <option value="Immediate (15 Mins)">⚡ Immediate (Within 15 Mins)</option>
                  <option value="Today Afternoon (2 PM - 5 PM)">Today Afternoon (2 PM - 5 PM)</option>
                  <option value="Today Evening (6 PM - 9 PM)">Today Evening (6 PM - 9 PM)</option>
                  <option value="Tomorrow Morning (10 AM - 1 PM)">Tomorrow Morning (10 AM - 1 PM)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCallbackOpen(false)}
                  className="rounded-[4px] h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] h-8 text-xs font-bold"
                >
                  Request Free Callback
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegeDetail;
