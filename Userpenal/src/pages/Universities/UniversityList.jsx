import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

import ApplyApplicationModal, {
  createEmptyApplicationForm,
} from '@/components/application/ApplyApplicationModal';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';


const FILTER_OPTIONS = {
  universityType: ['Public', 'Private'],
  category: [
    'Central University',
    'State University',
    'Private University',
    'Deemed University',
    'Open University',
  ],
  campusType: ['Urban', 'Rural', 'Semi-Urban', 'Residential'],
  nirfRanking: [
    { label: 'Top 10', value: 10 },
    { label: 'Top 25', value: 25 },
    { label: 'Top 50', value: 50 },
    { label: 'Top 100', value: 100 },
  ],
};

const EMPTY_FILTERS = {
  universityType: [],
  category: [],
  state: [],
  city: [],
  nirfRanking: [],
  naacGrade: [],
  campusType: [],
  recognition: [],
  facilities: [],
};


const getValues = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};


const getUniqueValues = (universities, field) => {
  return [
    ...new Set(
      universities.flatMap((university) => getValues(university[field]))
    ),
  ].sort();
};

const UniversityCard = ({ university, onApply }) => {
  const location = [university.city, university.state].filter(Boolean).join(', ');

  const programs =
    university.programTypes?.length ||
    university.numberOfPrograms ||
    university.departments?.length ||
    university.numberOfDepartments ||
    '15+';

  const ranking = university.nirfRanking
    ? `NIRF #${university.nirfRanking}`
    : 'Top Ranked';

  const accreditation =
    university.accreditation ||
    university.recognition?.[0] ||
    'UGC Approved';

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 rounded-md border border-[#E5E7EB] bg-white transition-all duration-150 hover:border-[#93C5FD] hover:shadow-[0_4px_16px_rgba(37,99,235,0.06)]">

      <Link to={`/universities/${university._id}`} className="block">
        <div className="relative h-38 overflow-hidden bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <img
            src={
              university.coverImage ||
              university.logo ||
              'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
            }
            alt={university.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-[4px] bg-white/95 px-2 py-0.5 text-[0.6875rem] font-bold text-[#172554] shadow-xs">
            {university.universityType || 'State University'}
          </span>

          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-[4px] bg-[#172554]/90 px-2 py-0.5 text-[0.6875rem] font-bold text-white backdrop-blur-xs">
            <Trophy className="size-3 text-amber-400" />
            {ranking}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/universities/${university._id}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[0.9375rem] font-bold leading-snug text-[#172554] transition-colors duration-150 group-hover:text-[#2563EB]">
            {university.name}
          </h3>

          {university.shortName && (
            <p className="mt-0.5 text-[0.75rem] font-medium text-[#64748B]">
              ({university.shortName})
            </p>
          )}
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-[#64748B]">
          <MapPin size={13} className="shrink-0 text-slate-400" />
          <span className="truncate">
            {location || 'India'}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[0.6875rem] font-bold text-[#1E40AF]">
            {accreditation}
          </span>
          {university.establishedYear && (
            <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-0.5 text-[0.6875rem] font-medium text-slate-600">
              Estd. {university.establishedYear}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2 text-[0.6875rem]">
          <div>
            <span className="block text-[#64748B] text-[0.625rem] font-semibold uppercase tracking-wider">Programs</span>
            <span className="font-bold text-[#172554]">{programs} Courses</span>
          </div>
          <div className="border-l border-[#E5E7EB] pl-2">
            <span className="block text-[#64748B] text-[0.625rem] font-semibold uppercase tracking-wider">Campus Type</span>
            <span className="font-bold text-[#172554] truncate block">{university.campusType || 'Urban / Res.'}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#E5E7EB] p-3">
        <Button
          size="sm"
          className="h-8.5 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-[0.78125rem] font-semibold shadow-none"
          onClick={() => onApply(university)}
        >
          Apply Now
        </Button>
        <Link
          to={`/universities/${university._id}`}
          className="inline-flex h-8.5 items-center justify-center rounded-[4px] border border-[#E5E7EB] bg-white text-[0.78125rem] font-medium text-[#172554] hover:bg-[#F8FAFC]"
        >
          View Details
        </Link>
      </div>

    </Card>
  );
};


const FilterSection = ({
  title,
  options = [],
  selected,
  onToggle,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b border-line last:border-b-0"
    >

      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 py-3.5 text-left">
        <span className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink">
          {title}

          {selected.length > 0 && (
            <span className="edu-count">
              {selected.length}
            </span>
          )}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-ink-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="max-h-44 space-y-0.5 overflow-y-auto pr-1 pb-3.5">

          {options.map((option) => {
            const value =
              typeof option === 'string'
                ? option
                : option.value;

            const label =
              typeof option === 'string'
                ? option
                : option.label;

            return (
              <label
                key={value}
                className="edu-check-row"
              >
                <Checkbox
                  checked={selected.includes(value)}
                  onCheckedChange={() => onToggle(value)}
                />

                <span className="text-[0.8125rem] text-ink-muted">
                  {label}
                </span>
              </label>
            );
          })}

        </div>
      </CollapsibleContent>

    </Collapsible>
  );
};


const UniversityList = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [applyForm, setApplyForm] = useState(
    createEmptyApplicationForm()
  );

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const getUniversities = async () => {
      const url = category
        ? `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/university?category=${encodeURIComponent(category)}`
        : `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/university`;

      const response = await axios.get(url);

      const data = response.data?.data || [];
      const activeUniversities = data.filter(
        (university) => university.status !== 'Inactive'
      );

      setUniversities(
        activeUniversities.length > 0 ? activeUniversities : data
      );
    };

    getUniversities();
  }, [category]);



  const openApplyModal = (university) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setSelectedUniversity(university);
    setApplyForm(createEmptyApplicationForm());
  };

  const handleApplySubmit = async (event) => {
    event.preventDefault();

    if (!selectedUniversity) {
      return;
    }

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/university-applications`,
      {
        universityId: selectedUniversity._id,
        ...applyForm,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedUniversity(null);
    setApplyForm(createEmptyApplicationForm());
  };

  const filterOptions = useMemo(() => {
    return {
      state: getUniqueValues(universities, 'state'),
      city: getUniqueValues(universities, 'city'),
      naacGrade: getUniqueValues(universities, 'naacGrade'),
      recognition: getUniqueValues(universities, 'recognition'),
      facilities: getUniqueValues(universities, 'facilities'),
    };
  }, [universities]);

  const toggleFilter = (name, value) => {
    setFilters((current) => {
      const selected = current[name];

      const values = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      return {
        ...current,
        [name]: values,
      };
    });
  };

  const filteredUniversities = useMemo(() => {
    return universities.filter((university) => {

      const check = (selected, value) => {
        if (selected.length === 0) {
          return true;
        }

        return getValues(value).some((item) =>
          selected.includes(item)
        );
      };

      const rankingMatch =
        filters.nirfRanking.length === 0 ||
        filters.nirfRanking.some(
          (max) =>
            Number(university.nirfRanking) > 0 &&
            Number(university.nirfRanking) <= max
        );


      return (
        check(filters.universityType, university.universityType) &&
        check(filters.category, university.category) &&
        check(filters.state, university.state) &&
        check(filters.city, university.city) &&
        rankingMatch &&
        check(filters.naacGrade, university.naacGrade) &&
        check(filters.campusType, university.campusType) &&
        check(filters.recognition, university.recognition) &&
        check(filters.facilities, university.facilities)
      );
    });
  }, [universities, filters]);

  const hasFilters = Object.values(filters).some(
    (items) => items.length > 0
  );

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="min-h-screen bg-surface">

      <div className="edu-page-head">

        <div className="edu-container">

          <div className="edu-breadcrumb">

            <Link
              to="/"
              className="edu-breadcrumb-link"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <ChevronRight className="size-3.5 text-line-strong" />

            <span className="font-semibold text-ink">
              Universities
            </span>

          </div>

          <h1 className="edu-h1 mt-2.5">
            {category
              ? `Top ${category} Universities in India`
              : 'All Universities in India'}
          </h1>

          <div className="mt-3.5 flex gap-2">

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <Input
                placeholder="Search universities by name, location..."
                className="pl-9"
              />

            </div>

            <Button className="shrink-0">
              Search
            </Button>

          </div>

        </div>
      </div>

      <main className="edu-container py-5 md:py-6">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[15rem_1fr] lg:gap-6">

          <aside className="hidden lg:block">
            <div className="edu-rail edu-card overflow-hidden">

              <div className="edu-panel-head">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-brand" />
                  <h2 className="text-[0.8125rem] font-semibold text-ink">
                    Filters
                  </h2>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[0.75rem] font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="px-4">

                <FilterSection
                  title="University Type"
                  options={FILTER_OPTIONS.universityType}
                  selected={filters.universityType}
                  onToggle={(value) =>
                    toggleFilter('universityType', value)
                  }
                />

                <FilterSection
                  title="Category"
                  options={FILTER_OPTIONS.category}
                  selected={filters.category}
                  onToggle={(value) =>
                    toggleFilter('category', value)
                  }
                />

                <FilterSection
                  title="State"
                  options={filterOptions.state}
                  selected={filters.state}
                  onToggle={(value) =>
                    toggleFilter('state', value)
                  }
                />

                <FilterSection
                  title="City"
                  options={filterOptions.city}
                  selected={filters.city}
                  onToggle={(value) =>
                    toggleFilter('city', value)
                  }
                />

                <FilterSection
                  title="NIRF Ranking"
                  options={FILTER_OPTIONS.nirfRanking}
                  selected={filters.nirfRanking}
                  onToggle={(value) =>
                    toggleFilter('nirfRanking', value)
                  }
                />

                <FilterSection
                  title="NAAC Grade"
                  options={filterOptions.naacGrade}
                  selected={filters.naacGrade}
                  onToggle={(value) =>
                    toggleFilter('naacGrade', value)
                  }
                />

                <FilterSection
                  title="Campus Type"
                  options={FILTER_OPTIONS.campusType}
                  selected={filters.campusType}
                  onToggle={(value) =>
                    toggleFilter('campusType', value)
                  }
                />

                <FilterSection
                  title="Recognition"
                  options={filterOptions.recognition}
                  selected={filters.recognition}
                  onToggle={(value) =>
                    toggleFilter('recognition', value)
                  }
                />

                <FilterSection
                  title="Facilities"
                  options={filterOptions.facilities}
                  selected={filters.facilities}
                  onToggle={(value) =>
                    toggleFilter('facilities', value)
                  }
                />

              </div>
            </div>
          </aside>


          <section>

            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.8125rem] text-ink-muted">
                Showing{' '}
                <span className="font-semibold text-ink">
                  {filteredUniversities.length}
                </span>{' '}
                {filteredUniversities.length === 1
                  ? 'university'
                  : 'universities'}
                {universities.length > 0 && (
                  <>
                    {' '}out of{' '}
                    <span className="font-semibold text-ink">
                      {universities.length}
                    </span>
                  </>
                )}
              </p>

              {hasFilters && (
                <span className="edu-chip">
                  Filters applied
                </span>
              )}
            </div>

            {filteredUniversities.length === 0 ? (
              <div className="edu-empty">
                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  No universities found.
                </h2>
                <p className="text-[0.8125rem] text-ink-muted">
                  Try removing or changing a few filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredUniversities.map((university) => (
                  <UniversityCard
                    key={university._id}
                    university={university}
                    onApply={openApplyModal}
                  />
                ))}
              </div>
            )}
          </section>

        </div>

      </main>

      <ApplyApplicationModal
        open={Boolean(selectedUniversity)}
        title={`Apply to ${selectedUniversity?.name || ''}`}
        form={applyForm}
        setForm={setApplyForm}
        onClose={() => setSelectedUniversity(null)}
        onSubmit={handleApplySubmit}
        submitLabel="Apply Now"
      />

    </div>
  );
};


export default UniversityList;
