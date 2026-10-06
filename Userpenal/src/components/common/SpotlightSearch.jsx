import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';
import {
  Search,
  Building2,
  BookOpen,
  GraduationCap,
  Award,
  ArrowRight,
  X,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';

export const SpotlightSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open_spotlight_search', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open_spotlight_search', handleCustomOpen);
    };
  }, []);

  // Fetch initial search data
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);

      if (colleges.length === 0) {
        fetch(createApiUrl('/college?status=Active'))
          .then((res) => res.json())
          .then((res) => {
            setColleges(res.data?.colleges || res.data?.data || []);
          })
          .catch(() => {});

        fetch(createApiUrl('/course'))
          .then((res) => res.json())
          .then((res) => {
            setCourses(res.data?.courses || res.data?.data || []);
          })
          .catch(() => {});

        fetch(createApiUrl('/exam'))
          .then((res) => res.json())
          .then((res) => {
            setExams(res.data?.exams || res.data?.data || []);
          })
          .catch(() => {});

        fetch(createApiUrl('/scholarship'))
          .then((res) => res.json())
          .then((res) => {
            setScholarships(res.data?.scholarships || res.data?.data || []);
          })
          .catch(() => {});
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items
  const cleanQ = query.trim().toLowerCase();

  const matchedColleges = colleges.filter((c) =>
    !cleanQ ||
    c.name?.toLowerCase().includes(cleanQ) ||
    c.location?.city?.toLowerCase().includes(cleanQ) ||
    c.collegeType?.toLowerCase().includes(cleanQ)
  ).slice(0, 4).map((c) => ({
    id: c._id,
    type: 'college',
    title: c.name,
    subtitle: `${c.location?.city || 'India'} · ${c.collegeType || 'College'}`,
    icon: Building2,
    badge: 'College',
    path: `/colleges/${c._id}`,
  }));

  const matchedCourses = courses.filter((c) =>
    !cleanQ ||
    c.courseName?.toLowerCase().includes(cleanQ) ||
    c.specialization?.toLowerCase().includes(cleanQ)
  ).slice(0, 4).map((c) => ({
    id: c._id,
    type: 'course',
    title: c.courseName,
    subtitle: c.specialization || c.duration || 'Degree Program',
    icon: BookOpen,
    badge: 'Course',
    path: `/courses`,
  }));

  const matchedExams = exams.filter((e) =>
    !cleanQ ||
    e.name?.toLowerCase().includes(cleanQ) ||
    e.shortName?.toLowerCase().includes(cleanQ) ||
    e.stream?.toLowerCase().includes(cleanQ)
  ).slice(0, 4).map((e) => ({
    id: e._id,
    type: 'exam',
    title: e.name,
    subtitle: `${e.stream || 'Entrance'} · Level: ${e.level || 'National'}`,
    icon: GraduationCap,
    badge: 'Exam',
    path: `/exams/${e._id}`,
  }));

  const matchedScholarships = scholarships.filter((s) =>
    !cleanQ ||
    s.name?.toLowerCase().includes(cleanQ) ||
    s.scholarshipName?.toLowerCase().includes(cleanQ) ||
    s.provider?.toLowerCase().includes(cleanQ)
  ).slice(0, 3).map((s) => ({
    id: s._id,
    type: 'scholarship',
    title: s.scholarshipName || s.name || 'Scholarship',
    subtitle: s.provider || 'Financial Aid',
    icon: Award,
    badge: 'Scholarship',
    path: `/scholarships/${s._id}`,
  }));

  let allResults = [];
  if (activeTab === 'all') {
    allResults = [...matchedColleges, ...matchedCourses, ...matchedExams, ...matchedScholarships];
  } else if (activeTab === 'colleges') {
    allResults = matchedColleges;
  } else if (activeTab === 'courses') {
    allResults = matchedCourses;
  } else if (activeTab === 'exams') {
    allResults = matchedExams;
  } else if (activeTab === 'scholarships') {
    allResults = matchedScholarships;
  }

  const handleSelect = (item) => {
    setIsOpen(false);
    navigate(item.path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-[#CBD5E1] bg-white shadow-2xl animate-in zoom-in-95 duration-150 text-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#E5E7EB] px-3.5 py-3">
          <Search className="size-5 text-[#2563EB] shrink-0 mr-2.5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search colleges, courses, entrance exams, scholarships..."
            className="w-full bg-transparent text-sm sm:text-base font-medium outline-none placeholder:text-[#64748B] text-[#111827]"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-flex items-center rounded border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-bold text-[#64748B]">
              ESC
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="size-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-[#F8FAFC]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Category Tabs Strip */}
        <div className="flex items-center gap-1 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'colleges', label: '🏛️ Colleges' },
            { id: 'courses', label: '📚 Courses' },
            { id: 'exams', label: '🎓 Exams' },
            { id: 'scholarships', label: '💰 Scholarships' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#172554] text-white'
                  : 'text-slate-600 hover:bg-white hover:text-[#172554]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[#F1F5F9]">
          {allResults.length > 0 ? (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between rounded-md p-2.5 hover:bg-[#EFF6FF] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#172554] group-hover:bg-[#172554] group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#172554] truncate">
                          {item.title}
                        </h4>
                        <span className="rounded bg-[#F8FAFC] border border-[#E5E7EB] px-1.5 py-0.2 text-[9px] font-bold text-slate-600 uppercase tracking-wide">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={14} className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-[#64748B]">
              <Search size={28} className="mx-auto text-slate-300 mb-2" />
              <p>No results found for "{query}".</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try searching for "IIT", "B.Tech", "MBA", "JEE Main", or "Scholarship".
              </p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2 text-[11px] text-[#64748B]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-white px-1 py-0.2 text-[9px] font-semibold">↵</kbd> Select
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="rounded border bg-white px-1 py-0.2 text-[9px] font-semibold">⌘K</kbd> Toggle
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500">
            Instant Education Search
          </span>
        </div>
      </div>
    </div>
  );
};
export default SpotlightSearch;
