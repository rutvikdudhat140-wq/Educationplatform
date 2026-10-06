import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
  const location = [university.city, university.state]
    .filter(Boolean)
    .join(', ');

  const programs =
    university.programTypes?.length ||
    university.numberOfPrograms ||
    university.departments?.length ||
    university.numberOfDepartments ||
    0;

  const ranking = university.nirfRanking
    ? university.nirfRanking
    : '—';

  const accreditation =
    university.accreditation ||
    university.recognition?.[0] ||
    'UGC Approved';

  return (
    <Card className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 shadow-none transition hover:shadow-md ">

      <Link to={`/universities/${university._id}`}>
        <div className='relative h-30 overflow-hidden bg-zinc-100'>
          <img src={
            university.coverImage ||
            university.logo ||
            'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
          }
            alt={university.name}
            className='h-full w-full object-cover transition-transform duration-300'
          />
          <div className='absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow'>
            <span className='text-[#0F766E]'>
              {ranking}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-3.5">
        <Link to={`/universities/${university._id}`}>
          <h3 className='line-clamp-2 min-h-[40px] text-base font-bold leading-6 text-zinc-900 hover:text-[#0F766E]'>{university.name}</h3>
          {university.shortName && (
            <p className='text-xs text-zinc-400'>
              ({university.shortName})
            </p>
          )}
        </Link>

        <div className='mt-1.5 flex items-center gap-1 text-sm text-zinc-500'>
          <MapPin size={13} />
          <span className='truncate'>
            {location || 'Location not avelibele'}
          </span>
        </div>

        <div className='mt-2 flex flex-wrap gap-1.5'>
          <Badge className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 hover-bg-zinc-100">
            {university.universityType || 'Public'}
          </Badge>

          <Badge className=" rounded-full bg-[#ECFDF5] PX-2.5 py-0.5 text-xs text-[#0F766E] hover:bg-[#ECFDF5]">
            {accreditation}
          </Badge>
        </div>

        <div className='mt-3 grid grid-cols-2 gap-2'>
          <p className='text-[11px] text-zinc-400'> Established</p>
          <p className='mt-0.5 text-sm font-semibold'>{university.establishedYear}</p>
        </div>

        <div className='rounded-lg bg-zinc-50 px-2.5 py-2'>
          <p className='text-[11px]' text-zinc-500>Programs</p>
          <p className='mt-0.5 text-sm font-semibold'>{programs}</p>
        </div>
      </div>

      <div className="border-t border-zinc-100 p-2.5">
        <Button
          className="h-9 w-full rounded-full bg-[#1E3A5F] text-sm hover:bg-[#16293F]"
          onClick={() => onApply(university)}
        >
          Apply
        </Button>
      </div>

    </Card>
  );
};



const FilterSection = ({
  title,
  options,
  selected,
  onToggle,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b border-zinc-100 py-4"
    >

      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <span className="text-sm font-semibold text-zinc-800">
          {title}
        </span>

        <ChevronDown
          size={16}
          className={`transition ${open ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-3 space-y-2">

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
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600"
              >
                <Checkbox
                  checked={selected.includes(value)}
                  onCheckedChange={() => onToggle(value)}
                />

                <span>{label}</span>
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
        ? `http://localhost:5001/api/university?category=$(category)`
        : 'http://localhost:5001/api/university';

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
      'http://localhost:5001/api/university-applications',
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
    <div className="min-h-screen bg-[#FAFAFA]">

      <div className="border-b bg-white">

        <div className="mx-auto max-w-[1280px] px-5 py-5 lg:px-0">

          <div className="mb-4 flex items-center gap-2 text-[13px]">

            <Link
              to="/"
              className="flex items-center gap-1 text-zinc-500"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <span className="text-zinc-300">›</span>

            <span className="font-semibold text-zinc-800">
              Universities
            </span>

          </div>


          <h1 className="text-[25px] font-bold text-zinc-900">
            {category
              ? `Top ${category} Universities in India`
              : 'All Universities in India'}
          </h1>


          <div className="mt-4 flex gap-2">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <Input
                placeholder="Search universities by name, location..."
                className="h-10 rounded-full pl-11"
              />

            </div>

            <Button className="h-10 rounded-full bg-[#1E3A5F] px-7">
              Search
            </Button>

          </div>

        </div>

      </div>


      <main className="mx-auto max-w-[1280px] px-5 py-7 lg:px-0">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[312px_minmax(0,1fr)]">

          <aside className="hidden h-fit rounded-[20px] border bg-white lg:block">

            <div className="flex items-center justify-between border-b px-5 py-4">
              
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <h2 className="text-sm font-semibold">
                  Filters
                </h2>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#0F766E]"
                >
                  Clear All
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

          </aside>


          <section>
            {filteredUniversities.length === 0 ? (
              <div className="rounded-[20px] border bg-white py-20 text-center">
                <h3 className="text-lg font-semibold">
                  No universities found
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2  md:grid-cols-4 xl:grid-cols-3">
                {filteredUniversities.map((university) => (
                  <div key={university._id} className="max-w-[280px]">
                    <UniversityCard
                      university={university}
                      onApply={openApplyModal}
                    />
                  </div>
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
