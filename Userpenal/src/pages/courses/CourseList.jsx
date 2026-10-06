import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowRight,
  ChevronRight,
  Home,
  Search,
  SlidersHorizontal,
  BookOpen,
  Clock,
  IndianRupee,
  GraduationCap,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STREAM_OPTIONS = [
  'Engineering',
  'Technology',
  'Management',
  'Science',
  'Commerce',
  'Arts',
  'Education',
  'Agriculture',
  'Design',
  'Pharmacy',
  'Medical',
  'Law',
  'Hotel Management',
  'Computer Applications',
];

const LEVEL_OPTIONS = ['UG', 'PG', 'Diploma', 'PhD'];

const formatFees = (fees) => {
  if (!fees) return 'Fees on request';
  return `₹${Number(fees).toLocaleString('en-IN')}`;
};

const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [stream, setStream] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearFilters = () => {
    setLevel('');
    setStream('');
    setSearch('');
  };

  useEffect(() => {
    const getCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/course?search=${encodeURIComponent(search)}&level=${encodeURIComponent(level)}&stream=${encodeURIComponent(stream)}`
        );
        setCourses(response.data?.data || response.data?.courses || []);
      } catch (err) {
        console.error('Error fetching courses', err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    getCourses();
  }, [search, level, stream]);

  const handleSearch = (e) => {
    e?.preventDefault();
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Page Header / Search Banner */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-1.5 text-xs text-ink-muted">
            <Link to="/" className="flex items-center gap-1 hover:text-ink transition-colors">
              <Home size={13} /> Home
            </Link>
            <ChevronRight size={12} className="text-line-strong" />
            <span className="font-semibold text-ink">Courses</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-brand text-xs font-semibold mb-2">
                <BookOpen size={13} /> Course Explorer
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-ink">
                Find Degree & Diploma Courses
              </h1>
              <p className="mt-1 text-xs md:text-sm text-ink-muted">
                Explore undergraduate, postgraduate, and specialized programs across top streams.
              </p>
            </div>

            {/* Desktop / Tablet Search Box */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto md:min-w-[360px]">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, degrees..."
                  className="h-10 pl-9 rounded-md border-line bg-surface text-sm focus-visible:ring-brand shadow-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="h-10 rounded-md bg-brand hover:bg-brand-dark text-white px-4 text-xs font-semibold shadow-none shrink-0"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]">
          {/* Desktop Left Rail Filters */}
          <aside className="hidden lg:block">
            <div className="rounded-md border border-line bg-white p-4 shadow-none sticky top-20">
              <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-brand" />
                  <h2 className="text-sm font-bold text-ink">Filter Courses</h2>
                </div>
                {(level || stream || search) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Level Filter */}
              <div className="border-b border-line pb-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                  Degree Level
                </p>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-ink hover:text-brand cursor-pointer">
                    <Checkbox
                      checked={!level}
                      onCheckedChange={() => setLevel('')}
                    />
                    <span>All Levels</span>
                  </label>
                  {LEVEL_OPTIONS.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-xs text-ink hover:text-brand cursor-pointer"
                    >
                      <Checkbox
                        checked={level === item}
                        onCheckedChange={() => setLevel(level === item ? '' : item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stream Filter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                  Stream
                </p>
                <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1">
                  <label className="flex items-center gap-2 text-xs text-ink hover:text-brand cursor-pointer">
                    <Checkbox
                      checked={!stream}
                      onCheckedChange={() => setStream('')}
                    />
                    <span>All Streams</span>
                  </label>
                  {STREAM_OPTIONS.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-xs text-ink hover:text-brand cursor-pointer"
                    >
                      <Checkbox
                        checked={stream === item}
                        onCheckedChange={() => setStream(stream === item ? '' : item)}
                      />
                      <span className="truncate">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Course Results Section */}
          <section className="min-w-0">
            {/* Mobile Filter Button and Active Filter Chips */}
            <div className="lg:hidden flex items-center justify-between gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="rounded-md border-line h-9 text-xs font-semibold flex items-center gap-1.5 shadow-none"
              >
                <SlidersHorizontal size={14} className="text-brand" />
                Filters {(level || stream) ? '(Active)' : ''}
              </Button>

              {(level || stream) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Results Status Bar */}
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-line pb-3">
              <p className="text-xs md:text-sm text-ink-muted">
                Showing <span className="font-bold text-ink">{courses.length}</span> course{courses.length === 1 ? '' : 's'}
              </p>
              <div className="flex items-center gap-2">
                {level && (
                  <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    Level: {level}
                    <button onClick={() => setLevel('')} className="hover:text-ink"><X size={11} /></button>
                  </span>
                )}
                {stream && (
                  <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    {stream}
                    <button onClick={() => setStream('')} className="hover:text-ink"><X size={11} /></button>
                  </span>
                )}
              </div>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="rounded-md border border-line bg-white p-4 animate-pulse space-y-3">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-md shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-md border border-line bg-white p-10 text-center shadow-none">
                <BookOpen size={36} className="mx-auto mb-3 text-ink-muted" />
                <h3 className="text-base font-bold text-ink">No courses found</h3>
                <p className="text-xs md:text-sm text-ink-muted mt-1 max-w-sm mx-auto">
                  We could not find courses matching your search criteria. Try removing some filters or search for another keyword.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-md text-xs font-semibold shadow-none border-line"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className="group rounded-md border border-line bg-white p-4 shadow-none hover:border-brand/50 hover:bg-blue-50/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges & Short Code */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand font-bold text-xs uppercase border border-blue-100">
                            {course.shortName ? course.shortName.slice(0, 3) : (course.name?.slice(0, 3) || 'CRS')}
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-sm font-bold text-ink group-hover:text-brand transition-colors truncate">
                              {course.name}
                            </h2>
                            {course.fullName && course.fullName !== course.name && (
                              <p className="text-xs text-ink-muted truncate mt-0.5">
                                {course.fullName}
                              </p>
                            )}
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="shrink-0 rounded text-[10px] font-semibold border-line bg-surface text-ink-muted px-2 py-0.5"
                        >
                          {course.level || 'UG'}
                        </Badge>
                      </div>

                      {/* Course Metadata Pill Row */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-ink-muted">
                        <span className="flex items-center gap-1 rounded bg-surface px-2 py-1 border border-line/60">
                          <Clock size={12} className="text-ink-muted" />
                          {course.duration || '3-4 Years'}
                        </span>
                        {course.stream && (
                          <span className="rounded bg-surface px-2 py-1 border border-line/60 truncate max-w-[140px]">
                            {course.stream}
                          </span>
                        )}
                        {course.collegeCount && (
                          <span className="rounded bg-surface px-2 py-1 border border-line/60">
                            {course.collegeCount}+ Colleges
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Fees & CTA */}
                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-ink-muted block">Average Fee</span>
                        <span className="text-xs font-bold text-brand flex items-center">
                          {course.fees ? `₹${course.fees}/yr` : '₹1.5L - ₹4L/yr'}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand group-hover:translate-x-0.5 transition-transform">
                        Explore <ChevronRight size={13} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filters Drawer / Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="bottom" className="rounded-t-md p-5 bg-white max-h-[85vh] overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between border-b border-line pb-3 mb-4">
            <SheetTitle className="text-base font-bold text-ink">Filter Courses</SheetTitle>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1 rounded text-ink-muted hover:text-ink"
            >
              <X size={18} />
            </button>
          </SheetHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
                Degree Level
              </label>
              <Select value={level} onValueChange={(val) => setLevel(val === 'All' ? '' : val)}>
                <SelectTrigger className="w-full rounded-md border-line h-10 text-sm">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  {LEVEL_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
                Stream
              </label>
              <Select value={stream} onValueChange={(val) => setStream(val === 'All' ? '' : val)}>
                <SelectTrigger className="w-full rounded-md border-line h-10 text-sm">
                  <SelectValue placeholder="All Streams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Streams</SelectItem>
                  {STREAM_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex gap-3 border-t border-line">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 rounded-md text-xs font-semibold h-10 border-line"
              >
                Reset
              </Button>
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-10 shadow-none"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CourseList;
