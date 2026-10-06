import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Trophy,
  X,
  Layers,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { SafeImage } from '@/components/ui/safe-image';
import EmptyState from '@/components/ui/empty-state';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import LocationSelector, { getLocation, setLocation } from '@/components/common/LocationSelector';
import { useCompare } from '@/context/CompareContext';

const ratings = [
  { label: '4.5 & Above', value: 4.5 },
  { label: '4.0 & Above', value: 4 },
  { label: '3.5 & Above', value: 3.5 },
  { label: '3.0 & Above', value: 3 },
];

const placementRates = [
  { label: '90% & Above', value: 90 },
  { label: '75% & Above', value: 75 },
  { label: '60% & Above', value: 60 },
  { label: '50% & Above', value: 50 },
];

const entranceExams = [
  'JEE Main',
  'NEET',
  'CAT',
  'GATE',
  'CUET',
  'CLAT',
  'GUJCET',
];

const hostelOptions = [
  'Available',
  'Not Available',
];

const getLatestPlacement = (item) => {
  const list = item?.placements || [];
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return [...list].sort((a, b) => (b.year || 0) - (a.year || 0))[0];
};

const FilterSection = ({ title, options, selected, onChange, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b border-[#E5E7EB] last:border-b-0"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3.5 py-3 transition-colors hover:bg-[#F8FAFC]">
        <span className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-[#172554]">
          {title}
          {selected.length > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-[#2563EB] px-1 text-[0.625rem] font-bold text-white">
              {selected.length}
            </span>
          )}
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 text-[#64748B] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="max-h-52 space-y-0.5 overflow-y-auto px-3.5 pb-3">
          {options.map((option) => {
            const value = typeof option === 'object' ? option.value : option;
            const label = typeof option === 'object' ? option.label : option;

            return (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[0.8125rem] text-slate-700 transition-colors hover:bg-[#EFF6FF] hover:text-[#172554]"
              >
                <Checkbox
                  checked={selected.includes(value)}
                  onCheckedChange={() => onChange(value)}
                  className="rounded-[3px] border-[#E5E7EB]"
                />
                <span className="truncate">{label}</span>
              </label>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* Unified Institution Card (handles both College and University) */
const InstitutionCard = ({ item, onApply }) => {
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const inCompare = isInCompare(item._id);

  const location = [
    item.location?.city,
    item.location?.state,
  ].filter(Boolean).join(', ');

  const rating = Number(item.rating || 4.5).toFixed(1);
  const isUniversity = item.institutionType === 'university';
  const detailUrl = isUniversity ? `/universities/${item._id}` : `/colleges/${item._id}`;

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(item._id);
    } else {
      addToCompare(item.raw || item);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="md:hidden">
        <div className="w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-white p-3 transition-colors active:border-[#93C5FD] shadow-xs">
          <div className="flex gap-3">
            <Link to={detailUrl} className="block shrink-0">
              <div className="relative h-20 w-20 overflow-hidden rounded-[5px] bg-[#F8FAFC] border border-[#E5E7EB]">
                <SafeImage
                  entity={item.raw || item}
                  alt={item.name || ""}
                  className="h-full w-full object-cover"
                  fallback={
                    isUniversity ? (
                      <GraduationCap className="size-6 text-slate-400" />
                    ) : (
                      <Building2 className="size-6 text-slate-400" />
                    )
                  }
                  fallbackClassName="h-full w-full flex items-center justify-center bg-[#F8FAFC]"
                />
                <span
                  className={`absolute left-1 top-1 rounded-[3px] px-1 py-0.2 text-[8px] font-extrabold text-white ${
                    isUniversity ? 'bg-[#7C3AED]' : 'bg-[#172554]'
                  }`}
                >
                  {isUniversity ? 'Univ' : 'College'}
                </span>
              </div>
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link to={detailUrl}>
                  <h3 className="line-clamp-1 text-[0.875rem] font-bold text-[#172554] hover:text-[#2563EB]">
                    {item.name}
                  </h3>
                </Link>

                <div className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-[#64748B]">
                  <MapPin size={11} className="shrink-0 text-slate-400" />
                  <span className="truncate">{location || "India"}</span>
                </div>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-1">
                {item.ranking && (
                  <span className="rounded bg-[#FEF3C7] border border-[#FDE68A] px-1.5 py-0.2 text-[9px] font-bold text-amber-900">
                    🏆 {item.ranking}
                  </span>
                )}
                {item.accreditation && (
                  <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.2 text-[9px] font-bold text-[#1E40AF]">
                    {item.accreditation}
                  </span>
                )}
                {item.averagePackage && item.averagePackage !== '—' && (
                  <span className="text-[0.6875rem] font-semibold text-[#16A34A]">
                    Avg {item.averagePackage}
                  </span>
                )}
                {item.coursesCount && item.coursesCount !== '—' && (
                  <span className="text-[0.6875rem] font-semibold text-slate-600">
                    {item.coursesCount} Programs
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#E5E7EB] pt-2">
            <Button
              type="button"
              size="sm"
              onClick={(e) => { e.preventDefault(); onApply?.(item); }}
              className="flex-1 h-7.5 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-[0.75rem] font-bold shadow-none"
            >
              Apply Now
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCompareToggle}
              className={`flex-1 h-7.5 rounded-[4px] text-[0.75rem] font-semibold transition-colors ${
                inCompare
                  ? 'border-[#172554] bg-[#EFF6FF] text-[#172554]'
                  : 'border-[#E5E7EB] text-[#172554] hover:bg-[#F8FAFC]'
              }`}
            >
              {inCompare ? '✓ In Compare' : '+ Compare'}
            </Button>
            <Link
              to={detailUrl}
              className="inline-flex h-7.5 items-center justify-center rounded-[4px] border border-[#E5E7EB] px-2 text-[0.75rem] font-medium text-slate-600 hover:text-[#2563EB]"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Card Layout */}
      <div className="hidden md:block">
        <div className="group flex h-full flex-col overflow-hidden rounded-md border border-[#E5E7EB] bg-white transition-all duration-150 hover:border-[#93C5FD] hover:shadow-[0_6px_20px_rgba(37,99,235,0.06)]">
          <Link to={detailUrl} className="block shrink-0">
            <div className="relative h-40 w-full overflow-hidden bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <SafeImage
                entity={item.raw || item}
                alt={item.name || ''}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                fallback={
                  isUniversity ? (
                    <GraduationCap className="size-8 text-slate-300" />
                  ) : (
                    <Building2 className="size-8 text-slate-300" />
                  )
                }
                fallbackClassName="h-full w-full flex items-center justify-center bg-[#F8FAFC]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

              {/* Institution Type Badge */}
              <span
                className={`absolute left-2.5 top-2.5 rounded-[4px] border px-2 py-0.5 text-[0.6875rem] font-bold shadow-xs flex items-center gap-1 ${
                  isUniversity
                    ? 'border-purple-200 bg-purple-50 text-purple-900'
                    : 'border-white/40 bg-white/95 text-[#172554]'
                }`}
              >
                {isUniversity ? '🎓 University' : '🏛️ College'}
                <span className="text-slate-400">·</span>
                <span className="truncate max-w-[100px]">{item.subType}</span>
              </span>

              {/* Ranking Badge */}
              {item.ranking && (
                <span className="absolute right-2.5 top-2.5 rounded-[4px] border border-amber-300 bg-amber-400/95 px-2 py-0.5 text-[0.6875rem] font-extrabold text-amber-950 shadow-xs flex items-center gap-1">
                  <Trophy size={11} className="text-amber-950" />
                  {item.ranking}
                </span>
              )}

              {item.accreditation && (
                <span className="absolute bottom-2.5 left-2.5 rounded-[3px] bg-[#172554]/90 px-2 py-0.5 text-[0.625rem] font-bold text-white backdrop-blur-xs">
                  {item.accreditation}
                </span>
              )}

              {/* Match / Verified Indicator */}
              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-[3px] bg-white/95 px-2 py-0.5 text-[0.625rem] font-bold text-[#16A34A] shadow-xs">
                <span className="size-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>Verified</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-1 flex-col p-3.5">
            <Link to={detailUrl}>
              <h3 className="line-clamp-1 text-[0.9375rem] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors">
                {item.name}
              </h3>
            </Link>

            <div className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-[#64748B]">
              <MapPin size={11} className="shrink-0 text-slate-400" />
              <span className="truncate">{location || 'India'}</span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] p-2 text-[0.6875rem]">
              <div>
                <span className="block text-[#64748B] text-[0.6rem] font-semibold uppercase tracking-wider">
                  {isUniversity ? 'Programs' : 'Avg. Package'}
                </span>
                <span className="block truncate font-bold text-[#172554]">
                  {isUniversity ? (item.coursesCount !== '—' ? `${item.coursesCount} Courses` : '—') : item.averagePackage}
                </span>
              </div>
              <div className="border-l border-[#E5E7EB] pl-2">
                <span className="block text-[#64748B] text-[0.6rem] font-semibold uppercase tracking-wider">
                  {isUniversity ? 'Campus Type' : 'Highest Pkg'}
                </span>
                <span className="block truncate font-bold text-[#16A34A]">
                  {isUniversity ? (item.campusType || 'Urban / Res.') : item.highestPackage}
                </span>
              </div>
            </div>

            {/* Quick Specs Strip */}
            <div className="mt-2 flex items-center justify-between text-[10.5px] text-slate-600 border-t border-[#F1F5F9] pt-1.5">
              <span>🏛️ {item.coursesCount !== '—' ? `${item.coursesCount} Programs` : 'Programs Listed'}</span>
              <span>⭐ {rating} Rating</span>
              <span className="text-[#16A34A] font-semibold">⚡ Verified</span>
            </div>

            {/* Actions */}
            <div className="mt-auto grid grid-cols-2 gap-2 pt-2.5 border-t border-[#E5E7EB]">
              <Button
                type="button"
                size="sm"
                onClick={() => onApply?.(item)}
                className="h-8 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-[0.75rem] font-bold shadow-none"
              >
                Apply Now
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCompareToggle}
                className={`h-8 rounded-[4px] text-[0.75rem] font-semibold transition-colors ${
                  inCompare
                    ? 'border-[#172554] bg-[#EFF6FF] text-[#172554]'
                    : 'border-[#E5E7EB] text-[#172554] hover:bg-[#F8FAFC]'
                }`}
              >
                {inCompare ? '✓ In Compare' : '+ Compare'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollegeList = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Institution type switcher: 'all' | 'college' | 'university'
  const initialType = searchParams.get('institutionType') || searchParams.get('type') || 'all';
  const [institutionType, setInstitutionType] = useState(initialType);

  const [colleges, setColleges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => getLocation());

  useEffect(() => {
    const handleLocationChange = (e) => {
      setSelectedLocation(e.detail?.city || '');
    };
    window.addEventListener('user_location_changed', handleLocationChange);
    return () => window.removeEventListener('user_location_changed', handleLocationChange);
  }, []);

  const [filters, setFilters] = useState({
    subType: [],
    stream: [],
    state: [],
    city: searchParams.get('city') ? [searchParams.get('city')] : [],
    rating: [],
    placementRate: [],
    entranceExams: [],
    hostel: [],
    approvals: [],
    facilities: [],
  });

  // Sync type from URL query params
  useEffect(() => {
    const typeFromUrl = searchParams.get('institutionType') || searchParams.get('type');
    if (typeFromUrl && ['all', 'college', 'university'].includes(typeFromUrl)) {
      setInstitutionType(typeFromUrl);
    }
  }, [searchParams]);

  // Fetch both Colleges and Universities
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const course = searchParams.get('course');
        let collegeUrl = 'http://localhost:5001/api/college';
        if (category) {
          collegeUrl += `?category=${encodeURIComponent(category)}`;
        } else if (course) {
          collegeUrl += `?course=${encodeURIComponent(course)}`;
        }

        let universityUrl = 'http://localhost:5001/api/university';
        if (category) {
          universityUrl += `?category=${encodeURIComponent(category)}`;
        }

        const [collegesRes, universitiesRes] = await Promise.allSettled([
          axios.get(collegeUrl),
          axios.get(universityUrl),
        ]);

        if (collegesRes.status === 'fulfilled') {
          const rawColleges = collegesRes.value.data?.colleges || collegesRes.value.data?.data || [];
          setColleges(rawColleges.filter((c) => c.status !== 'Inactive'));
        }

        if (universitiesRes.status === 'fulfilled') {
          const rawUnivs = universitiesRes.value.data?.data || universitiesRes.value.data?.universities || [];
          setUniversities(rawUnivs.filter((u) => u.status !== 'Inactive'));
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, searchParams]);

  // Normalize into a single unified list
  const allInstitutions = useMemo(() => {
    const normalizedColleges = colleges.map((c) => {
      const latestPlacement = getLatestPlacement(c);
      return {
        _id: c._id,
        name: c.name || c.collegeName,
        institutionType: 'college',
        subType: c.collegeType || c.category || 'Autonomous',
        stream: c.category || 'General',
        location: {
          city: c.location?.city || c.city || '',
          state: c.location?.state || c.state || '',
        },
        rating: Number(c.rating || 4.5),
        accreditation: c.accreditations?.[0] || c.accreditation || (c.naacGrade ? `NAAC ${c.naacGrade}` : 'NAAC A+'),
        ranking: c.highlights?.nirfRank ? `NIRF #${c.highlights.nirfRank}` : (c.ranking ? `#${c.ranking}` : null),
        averagePackage: latestPlacement?.averagePackage || c.highlights?.averagePackage || c.averagePackage || '—',
        highestPackage: latestPlacement?.highestPackage || c.highlights?.highestPackage || c.highestPackage || '—',
        coursesCount: c.courses?.length || c.highlights?.totalCourses || '—',
        facilities: c.facilities || [],
        entranceExams: c.admissions?.entranceExams || [],
        placementRate: latestPlacement?.placementRate ? Number(latestPlacement.placementRate) : null,
        raw: c,
      };
    });

    const normalizedUniversities = universities.map((u) => ({
      _id: u._id,
      name: u.name || u.universityName,
      institutionType: 'university',
      subType: u.universityType || u.category || 'State University',
      stream: u.category || 'Comprehensive',
      location: {
        city: u.city || u.location?.city || '',
        state: u.state || u.location?.state || '',
      },
      rating: Number(u.rating || 4.6),
      accreditation: u.naacGrade ? `NAAC ${u.naacGrade}` : (u.recognition?.[0] || 'UGC Approved'),
      ranking: u.ranking ? `#${u.ranking} NIRF` : null,
      averagePackage: u.averagePackage || u.highlights?.averagePackage || '—',
      highestPackage: u.highestPackage || u.highlights?.highestPackage || '—',
      coursesCount: u.programs || u.courses?.length || '—',
      facilities: u.facilities || [],
      entranceExams: ['CUET', 'GATE', 'CAT', 'JEE Main'],
      placementRate: u.placementRate ? Number(u.placementRate) : null,
      campusType: u.campusType || 'Campus',
      raw: u,
    }));

    return [...normalizedColleges, ...normalizedUniversities];
  }, [colleges, universities]);

  const collegesCount = colleges.length;
  const universitiesCount = universities.length;
  const totalCount = allInstitutions.length;

  const toggleFilter = (name, value) => {
    const values = filters[name];
    if (values.includes(value)) {
      setFilters({
        ...filters,
        [name]: values.filter((item) => item !== value),
      });
    } else {
      setFilters({
        ...filters,
        [name]: [...values, value],
      });
    }
  };

  // Dynamic filter options aggregated from institutions
  const dynamicOptions = useMemo(() => {
    const subTypes = new Set();
    const streams = new Set();
    const states = new Set();
    const cities = new Set();
    const facilities = new Set();

    allInstitutions.forEach((item) => {
      if (item.subType) subTypes.add(item.subType);
      if (item.stream && item.stream !== 'General') streams.add(item.stream);
      if (item.location.state) states.add(item.location.state);
      if (item.location.city) cities.add(item.location.city);
      (item.facilities || []).forEach((f) => facilities.add(f));
    });

    return {
      subTypes: Array.from(subTypes).sort(),
      streams: Array.from(streams).sort(),
      states: Array.from(states).sort(),
      cities: Array.from(cities).sort(),
      facilities: Array.from(facilities).sort(),
    };
  }, [allInstitutions]);

  // Filter application
  const filteredInstitutions = useMemo(() => {
    return allInstitutions.filter((item) => {
      // Filter by Top Segment (All / Colleges / Universities)
      if (institutionType === 'college' && item.institutionType !== 'college') return false;
      if (institutionType === 'university' && item.institutionType !== 'university') return false;

      // Text search
      const text = `${item.name || ''} ${item.location?.city || ''} ${item.location?.state || ''} ${item.subType || ''} ${item.stream || ''}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;

      // Filters
      if (filters.subType.length && !filters.subType.includes(item.subType)) return false;
      if (filters.stream.length && !filters.stream.includes(item.stream)) return false;
      if (filters.state.length && !filters.state.includes(item.location?.state)) return false;
      if (filters.city.length && !filters.city.includes(item.location?.city)) return false;

      // Global Location Selector
      if (selectedLocation && !filters.city.length) {
        const itemCity = (item.location?.city || '').toLowerCase();
        const targetCity = selectedLocation.toLowerCase();
        if (itemCity && !itemCity.includes(targetCity) && !targetCity.includes(itemCity)) {
          return false;
        }
      }

      if (filters.rating.length) {
        const r = Number(item.rating || 0);
        if (!filters.rating.some((v) => r >= v)) return false;
      }

      if (filters.placementRate.length) {
        const p = Number(item.placementRate || 0);
        if (!filters.placementRate.some((v) => p >= v)) return false;
      }

      if (filters.entranceExams.length) {
        const exams = item.entranceExams || [];
        if (!filters.entranceExams.some((exam) => exams.includes(exam))) return false;
      }

      if (filters.hostel.length) {
        const hasHostel = (item.facilities || []).some((f) => f.toLowerCase().includes('hostel'));
        if (filters.hostel.includes('Available') && !hasHostel) return false;
        if (filters.hostel.includes('Not Available') && hasHostel) return false;
      }

      if (filters.facilities.length) {
        const facs = item.facilities || [];
        if (!filters.facilities.some((f) => facs.includes(f))) return false;
      }

      return true;
    });
  }, [allInstitutions, institutionType, search, filters, selectedLocation]);

  // Sorting
  const sortedInstitutions = useMemo(() => {
    return [...filteredInstitutions].sort((a, b) => {
      if (sortBy === 'rating') {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'courses') {
        return (b.coursesCount || 0) - (a.coursesCount || 0);
      }
      return 0;
    });
  }, [filteredInstitutions, sortBy]);

  const openApply = (item) => {
    if (item.institutionType === 'university') {
      navigate(`/universities/${item._id}`);
    } else {
      navigate(`/apply?collegeId=${item._id}`);
    }
  };

  const handleTabChange = (type) => {
    setInstitutionType(type);
    const newParams = new URLSearchParams(searchParams);
    if (type === 'all') {
      newParams.delete('institutionType');
      newParams.delete('type');
    } else {
      newParams.set('institutionType', type);
    }
    setSearchParams(newParams, { replace: true });
  };

  const activeFilterCount = Object.values(filters).reduce(
    (total, values) => total + values.length,
    0
  ) + (selectedLocation ? 1 : 0);

  const clearFilters = () => {
    setLocation('');
    setSelectedLocation('');
    setFilters({
      subType: [],
      stream: [],
      state: [],
      city: [],
      rating: [],
      placementRate: [],
      entranceExams: [],
      hostel: [],
      approvals: [],
      facilities: [],
    });
  };

  const pageTitle = category
    ? `Top ${category} Colleges & Universities in India`
    : 'Colleges & Universities in India';

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Header Banner - Desktop */}
      <div className="hidden md:block border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="edu-container py-5">
          <nav className="flex items-center gap-1.5 text-[0.75rem] text-[#64748B]">
            <Link to="/" className="hover:text-[#2563EB] flex items-center gap-1">
              <ArrowLeft size={13} />
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#172554]">Colleges &amp; Universities</span>
          </nav>

          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[1.625rem] font-bold tracking-tight text-[#172554]">
                {pageTitle}
              </h1>
              <p className="mt-0.5 text-[0.8125rem] text-[#64748B]">
                Discover and compare verified colleges and premier universities across NIRF rankings, courses, and admissions.
              </p>
            </div>

            {/* Desktop Quick Search & Sort & Location */}
            <div className="flex items-center gap-2">
              <LocationSelector triggerClassName="h-8.5 px-3 rounded-[4px] border border-[#E5E7EB] bg-white text-[0.78125rem] font-medium text-slate-700 hover:bg-[#F8FAFC] flex items-center gap-1.5 shrink-0" />

              <div className="relative w-56">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search college, university..."
                  className="h-8.5 rounded-[4px] pl-8 text-[0.78125rem]"
                />
              </div>

              <select
                aria-label="Sort institutions"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8.5 rounded-[4px] border border-[#E5E7EB] bg-white px-2.5 text-[0.78125rem] font-medium text-slate-700 outline-none focus:border-[#2563EB]"
              >
                <option value="rating">Top Rated</option>
                <option value="courses">Most Programs</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Unified Institution Segment Switcher */}
          <div className="mt-4 flex items-center gap-1.5 border-t border-[#E5E7EB] pt-3">
            <span className="text-[0.75rem] font-semibold text-[#64748B] mr-1 flex items-center gap-1">
              <Layers size={13} /> View:
            </span>
            <button
              onClick={() => handleTabChange('all')}
              className={`rounded-[4px] px-3 py-1 text-xs font-semibold transition-colors ${
                institutionType === 'all'
                  ? 'bg-[#172554] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-slate-700 hover:bg-[#F8FAFC]'
              }`}
            >
              All Institutions ({totalCount})
            </button>
            <button
              onClick={() => handleTabChange('college')}
              className={`rounded-[4px] px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${
                institutionType === 'college'
                  ? 'bg-[#172554] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-slate-700 hover:bg-[#F8FAFC]'
              }`}
            >
              <Building2 size={12} />
              Colleges ({collegesCount})
            </button>
            <button
              onClick={() => handleTabChange('university')}
              className={`rounded-[4px] px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${
                institutionType === 'university'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-slate-700 hover:bg-[#F8FAFC]'
              }`}
            >
              <GraduationCap size={13} />
              Universities ({universitiesCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="edu-container py-3.5 md:py-5">
        {/* Mobile Search & Filter Toolbar */}
        <div className="md:hidden mb-3 space-y-2">
          {/* Mobile Segment Filter */}
          <div className="grid grid-cols-3 gap-1 rounded-[5px] bg-[#F1F5F9] p-1">
            <button
              onClick={() => handleTabChange('all')}
              className={`rounded py-1 text-center text-[11.5px] font-bold transition-colors ${
                institutionType === 'all' ? 'bg-white text-[#172554] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => handleTabChange('college')}
              className={`rounded py-1 text-center text-[11.5px] font-bold transition-colors ${
                institutionType === 'college' ? 'bg-[#172554] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Colleges ({collegesCount})
            </button>
            <button
              onClick={() => handleTabChange('university')}
              className={`rounded py-1 text-center text-[11.5px] font-bold transition-colors ${
                institutionType === 'university' ? 'bg-[#7C3AED] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Universities ({universitiesCount})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges, universities..."
              className="w-full h-9 pl-9 pr-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[5px] text-[13px]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <LocationSelector triggerClassName="flex-1 h-8 px-2 rounded-[4px] border border-[#E5E7EB] bg-white text-[0.75rem] font-semibold text-[#172554] flex items-center justify-center gap-1 shrink-0" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileSheetOpen(true)}
              className="flex-1 h-8 rounded-[4px] border-[#E5E7EB] text-[0.75rem] font-semibold text-[#172554] flex items-center justify-center gap-1"
            >
              <SlidersHorizontal size={12} className="text-[#2563EB]" />
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded bg-[#2563EB] px-1 py-0.1 text-[0.625rem] text-white font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <select
              aria-label="Sort mobile"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 h-8 rounded-[4px] border border-[#E5E7EB] bg-white px-2 text-[0.75rem] font-medium text-slate-700 outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="courses">Programs</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Mobile Filter Drawer / Bottom Sheet */}
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetContent side="bottom" className="h-[82vh] rounded-t-lg p-0 flex flex-col">
              <SheetHeader className="flex-row items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                <SheetTitle className="text-[0.9375rem] font-bold text-[#172554]">
                  Filter Institutions ({activeFilterCount})
                </SheetTitle>
                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-[0.75rem] font-bold text-[#2563EB]"
                    >
                      Clear All
                    </button>
                  )}
                  <SheetClose className="text-[0.75rem] font-semibold text-slate-600">
                    Close
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <FilterSection title="Institution Type / Category" options={dynamicOptions.subTypes} selected={filters.subType} onChange={(value) => toggleFilter('subType', value)} />
                <FilterSection title="Stream / Discipline" options={dynamicOptions.streams} selected={filters.stream} onChange={(value) => toggleFilter('stream', value)} />
                <FilterSection title="State" options={dynamicOptions.states} selected={filters.state} onChange={(value) => toggleFilter('state', value)} />
                <FilterSection title="City" options={dynamicOptions.cities} selected={filters.city} onChange={(value) => toggleFilter('city', value)} />
                <FilterSection title="Rating" options={ratings} selected={filters.rating} onChange={(value) => toggleFilter('rating', value)} />
                <FilterSection title="Placement Rate" options={placementRates} selected={filters.placementRate} onChange={(value) => toggleFilter('placementRate', value)} />
                <FilterSection title="Entrance Exams" options={entranceExams} selected={filters.entranceExams} onChange={(value) => toggleFilter('entranceExams', value)} />
                <FilterSection title="Hostel Facility" options={hostelOptions} selected={filters.hostel} onChange={(value) => toggleFilter('hostel', value)} />
              </div>

              <div className="border-t border-[#E5E7EB] bg-white p-3">
                <Button
                  onClick={() => setMobileSheetOpen(false)}
                  className="w-full h-9 rounded-[4px] bg-[#172554] text-white font-semibold text-[0.8125rem] hover:bg-[#0F172A]"
                >
                  Show {sortedInstitutions.length} Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Split View: Left Filters Rail + Right Results */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[15.5rem_1fr]">
          {/* Left Filters Rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-md border border-[#E5E7EB] bg-white overflow-hidden shadow-none">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5">
                <div className="flex items-center gap-1.5 text-[0.78125rem] font-bold uppercase tracking-wider text-[#172554]">
                  <SlidersHorizontal size={13} className="text-[#2563EB]" />
                  Filters
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[0.71875rem] font-semibold text-[#2563EB] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                <FilterSection title="Institution Type / Category" options={dynamicOptions.subTypes} selected={filters.subType} onChange={(value) => toggleFilter('subType', value)} />
                <FilterSection title="Stream / Discipline" options={dynamicOptions.streams} selected={filters.stream} onChange={(value) => toggleFilter('stream', value)} />
                <FilterSection title="State" options={dynamicOptions.states} selected={filters.state} onChange={(value) => toggleFilter('state', value)} />
                <FilterSection title="City" options={dynamicOptions.cities} selected={filters.city} onChange={(value) => toggleFilter('city', value)} />
                <FilterSection title="Rating" options={ratings} selected={filters.rating} onChange={(value) => toggleFilter('rating', value)} />
                <FilterSection title="Placement Rate" options={placementRates} selected={filters.placementRate} onChange={(value) => toggleFilter('placementRate', value)} />
                <FilterSection title="Entrance Exams" options={entranceExams} selected={filters.entranceExams} onChange={(value) => toggleFilter('entranceExams', value)} />
                <FilterSection title="Hostel" options={hostelOptions} selected={filters.hostel} onChange={(value) => toggleFilter('hostel', value)} />
              </div>
            </div>
          </aside>

          {/* Right Results Column */}
          <section>
            {/* Active Filters Row */}
            <div className="mb-3.5 hidden md:flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2.5">
              <p className="text-[0.8125rem] text-[#64748B]">
                Showing <span className="font-bold text-[#172554]">{sortedInstitutions.length}</span> institutions
                {totalCount > 0 && ` of ${totalCount}`}
              </p>

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[0.75rem] text-[#64748B]">Active:</span>
                  {selectedLocation && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#1E40AF]">
                      <MapPin size={11} className="text-[#2563EB]" />
                      City: {selectedLocation}
                      <X
                        size={11}
                        className="cursor-pointer hover:text-red-600 ml-0.5"
                        onClick={() => {
                          setLocation('');
                          setSelectedLocation('');
                        }}
                      />
                    </span>
                  )}
                  {Object.entries(filters).map(([k, vals]) =>
                    vals.map((v) => (
                      <span
                        key={`${k}-${v}`}
                        className="inline-flex items-center gap-1 rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#1E40AF]"
                      >
                        {String(v)}
                        <X
                          size={11}
                          className="cursor-pointer hover:text-red-600"
                          onClick={() => toggleFilter(k, v)}
                        />
                      </span>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[0.75rem] font-semibold text-[#2563EB] hover:underline ml-1"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Results Grid */}
            {sortedInstitutions.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sortedInstitutions.map((item) => (
                  <InstitutionCard
                    key={`${item.institutionType}-${item._id}`}
                    item={item}
                    onApply={openApply}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Institutions Found"
                description="No colleges or universities match your current criteria. Try changing or clearing filters to explore more options."
                actionText="Clear All Filters"
                onAction={clearFilters}
                icon={Building2}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CollegeList;
