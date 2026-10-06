
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,

} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


const collegeTypes = [
  'Government',
  'Private',
  'Public',
  'Autonomous',
];

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



const getLatestPlacement = (college) => {
  const list = college?.placements || [];
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return [...list].sort((a, b) => (b.year || 0) - (a.year || 0))[0];
};

const FilterSection = ({ title, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b py-4"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <span className='text-sm font-semibold'>{title}</span>
        <ChevronDown size={16} className={open ? 'rotate-180' : ''} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-3 space-y-2">
          {options.map((option) => {
            const value =
              typeof option === 'object'
                ? option.value
                : option;

            const label =
              typeof option === 'object'
                ? option.label
                : option;

            return (
              <label
                key={label}
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={selected.includes(value)}
                  onCheckedChange={() => onChange(value)}
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


const CollegeCard = ({ college, onApply, onCompare }) => {
  const location = [
    college.location?.city,
    college.location?.state,
  ]

  const rating = Number(college.rating || 0).toFixed(1);

  const latestPlacement = getLatestPlacement(college);
  const averagePackage =
    latestPlacement?.averagePackage ||
    college.highlights?.averagePackage ;

  const courses =
    college.courses?.length ||
    college.highlights?.totalCourses ||
    0;

  const accreditation =
    college.accreditations?.[0] ||
    college.accreditation;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">

      <Link to={`/colleges/${college._id}`}>
        <div className="h-32 overflow-hidden bg-zinc-100">
          <img
            src={
              college.coverImage ||
              college.images?.[0] ||
              college.logo
            }
            alt={college.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 p-4">

        <Link to={`/colleges/${college._id}`}>
          <h3 className="line-clamp-2 text-base font-bold">
            {college.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={13} />

          <span>{location}</span>
        </div>

        <div className="mt-2 flex gap-2">

          <Badge variant="secondary">{college.collegeType}</Badge>

          <Badge className="bg-[#ECFDF5] text-[#0F766E]">{accreditation}</Badge>

        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">

          <div className="rounded bg-gray-50 p-2">
            <p className="text-xs text-gray-400">Avg Package</p>
            <p className="text-sm font-semibold">{averagePackage}</p>
          </div>

          <div className="rounded bg-gray-50 p-2">
            <p className="text-xs text-gray-400">Courses</p>
            <p className="text-sm font-semibold">{courses}</p>
          </div>
        </div>
      </div>

      <div className="border-t p-3">
        <Button
          className="mb-2 h-9 w-full bg-[#0F766E]"
          onClick={() => onApply(college)}>
          Apply
        </Button>


        <Button
          variant="outline"
          className="h-9 w-full border-[#0F766E] text-[#0F766E]"
          onClick={() => onCompare(college)}>
          Compare
        </Button>
      </div>
    </Card>
  );
};


const CollegeList = () => {

  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('userToken');


  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);


  const [filters, setFilters] = useState({
    collegeType: [],
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


  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });



  useEffect(() => {

    const getColleges = async () => {

      const course = searchParams.get('course');

      let url = 'http://localhost:5001/api/college';

      if (category) {
        url += `?category=${category}`;
      } else if (course) {
        url += `?course=${course}`;
      }

      const response = await axios.get(url);

      setColleges(
        (response.data?.colleges || []).filter(
          (college) => college.status !== 'Inactive'
        )
      );
    };

    getColleges();

  }, [category, searchParams]);


  // Compare
  const handleCompare = (college) => {
    navigate('/compare', {
      state: {
        college,
      },
    });
  };



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






  const filteredColleges = colleges.filter((college) => {

    const text =
      `${college.name || ''} ${college.location?.city || ''} ${college.location?.state || ''}`
        .toLowerCase();

    if (
      search &&
      !text.includes(search.toLowerCase())
    ) {
      return false;
    }


    if (
      filters.collegeType.length &&
      !filters.collegeType.includes(college.collegeType)
    ) {
      return false;
    }


    if (
      filters.stream.length &&
      !filters.stream.includes(college.category)
    ) {
      return false;
    }


    if (
      filters.state.length &&
      !filters.state.includes(college.location?.state)
    ) {
      return false;
    }


    if (
      filters.city.length &&
      !filters.city.includes(college.location?.city)
    ) {
      return false;
    }


    if (filters.rating.length) {

      const rating = Number(college.rating || 0);

      let match = false;

      filters.rating.forEach((value) => {
        if (rating >= value) {
          match = true;
        }
      });

      if (!match) {
        return false;
      }
    }


    if (filters.placementRate.length) {

      const placement = Number(
        getLatestPlacement(college)?.placementRate || 0
      );

      let match = false;

      filters.placementRate.forEach((value) => {
        if (placement >= value) {
          match = true;
        }
      });

      if (!match) {
        return false;
      }
    }


    if (filters.entranceExams.length) {

      const exams =
        college.admissions?.entranceExams || [];

      let match = false;

      filters.entranceExams.forEach((exam) => {
        if (exams.includes(exam)) {
          match = true;
        }
      });

      if (!match) {
        return false;
      }
    }


    if (filters.hostel.length) {

      const facilities =
        college.facilities || [];

      const hasHostel =
        facilities.includes('Hostel');


      if (
        filters.hostel.includes('Available') &&
        !hasHostel
      ) {
        return false;
      }


      if (
        filters.hostel.includes('Not Available') &&
        hasHostel
      ) {
        return false;
      }
    }


    if (filters.approvals.length) {

      const approvals =
        college.accreditations || [];

      let match = false;

      filters.approvals.forEach((item) => {
        if (approvals.includes(item)) {
          match = true;
        }
      });

      if (!match) {
        return false;
      }
    }


    if (filters.facilities.length) {

      const facilities =
        college.facilities || [];

      let match = false;

      filters.facilities.forEach((item) => {
        if (facilities.includes(item)) {
          match = true;
        }
      });

      if (!match) {
        return false;
      }
    }


    return true;
  });


  const states = [];

  colleges.forEach((college) => {
    if (
      college.location?.state &&
      !states.includes(college.location.state)
    ) {
      states.push(college.location.state);
    }
  });


  const cities = [];

  colleges.forEach((college) => {
    if (
      college.location?.city &&
      !cities.includes(college.location.city)
    ) {
      cities.push(college.location.city);
    }
  });


  const streams = [];

  colleges.forEach((college) => {
    if (
      college.category &&
      !streams.includes(college.category)
    ) {
      streams.push(college.category);
    }
  });


  const approvals = [];

  colleges.forEach((college) => {

    const list =
      college.accreditations || [];

    list.forEach((item) => {

      if (!approvals.includes(item)) {
        approvals.push(item);
      }

    });

  });


  const facilities = [];

  colleges.forEach((college) => {

    const list =
      college.facilities || [];

    list.forEach((item) => {

      if (!facilities.includes(item)) {
        facilities.push(item);
      }

    });

  });

  const openApply = (college) => {

    if (!token) {
      navigate('/login');
      return;
    }

    setSelectedCollege(college);

    setForm({
      name: '',
      phone: '',
      email: '',
      message: '',
    });

  };

  const submitApplication = (event) => {

    event.preventDefault();

    axios.post(
      'http://localhost:5001/api/applications',
      {
        collegeId: selectedCollege._id,
        ...form,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedCollege(null);

  };


  const title = category
    ? `Top ${category} Colleges in India`
    : 'All Colleges in India';

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="border-b bg-white">

        <div className="mx-auto max-w-6xl px-5 py-5">

          <div className="mb-4 flex items-center gap-2 text-sm">

            <Link
              to="/"
              className="flex items-center gap-1 text-gray-500"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <span>/</span>

            <Link
              to="/"
              className="text-gray-500"
            >
              Home
            </Link>

            <span>/</span>

            <span className="font-semibold">
              Colleges
            </span>

          </div>


          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          <div className="mt-4 flex gap-2">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search colleges..."
                className="pl-11"
              />

            </div>

            <Button className="bg-[#0F766E]">
              Search
            </Button>

          </div>

        </div>

      </div>

      <main className="mx-auto max-w-6xl px-5 py-7">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

          <aside className="hidden h-fit rounded-xl border bg-white lg:block">

            <div className="flex items-center justify-between border-b p-4">

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />

                <h2 className="font-semibold">
                  Filters
                </h2>
              </div>

            </div>

            <div className="px-4">

              <FilterSection
                title="College Type"
                options={collegeTypes}
                selected={filters.collegeType}
                onChange={(value) =>
                  toggleFilter('collegeType', value)
                }
              />

              <FilterSection
                title="Stream"
                options={streams}
                selected={filters.stream}
                onChange={(value) =>
                  toggleFilter('stream', value)
                }
              />

              <FilterSection
                title="State"
                options={states}
                selected={filters.state}
                onChange={(value) =>
                  toggleFilter('state', value)
                }
              />

              <FilterSection
                title="City"
                options={cities}
                selected={filters.city}
                onChange={(value) =>
                  toggleFilter('city', value)
                }
              />

              <FilterSection
                title="Rating"
                options={ratings}
                selected={filters.rating}
                onChange={(value) =>
                  toggleFilter('rating', value)
                }
              />

              <FilterSection
                title="Placement Rate"
                options={placementRates}
                selected={filters.placementRate}
                onChange={(value) =>
                  toggleFilter(
                    'placementRate',
                    value
                  )
                }
              />

              <FilterSection
                title="Entrance Exams"
                options={entranceExams}
                selected={filters.entranceExams}
                onChange={(value) =>
                  toggleFilter(
                    'entranceExams',
                    value
                  )
                }
              />

              <FilterSection
                title="Hostel"
                options={hostelOptions}
                selected={filters.hostel}
                onChange={(value) =>
                  toggleFilter('hostel', value)
                }
              />

              <FilterSection
                title="Approvals"
                options={approvals}
                selected={filters.approvals}
                onChange={(value) =>
                  toggleFilter('approvals', value)
                }
              />

              <FilterSection
                title="Facilities"
                options={facilities}
                selected={filters.facilities}
                onChange={(value) =>
                  toggleFilter(
                    'facilities',
                    value
                  )
                }
              />

            </div>
          </aside>

          <section>

            {filteredColleges.length > 0 ? (

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredColleges.map((college) => (

                  <CollegeCard
                    key={college._id}
                    college={college}
                    onApply={openApply}
                    onCompare={handleCompare}
                  />

                ))}

              </div>

            ) : (

              <Card className="p-10 text-center">
                No colleges found.
              </Card>

            )}
          </section>

        </div>
      </main>

      <Dialog
        open={Boolean(selectedCollege)}
        onOpenChange={() =>
          setSelectedCollege(null)
        }
      >
        <DialogContent>

          <form
            onSubmit={submitApplication}
            className="space-y-4"
          >
            <DialogHeader>

              <DialogTitle>
                Apply to {selectedCollege?.name}
              </DialogTitle>

            </DialogHeader>

            <div>
              <Label>Name</Label>

              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Phone Number</Label>

              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Email ID</Label>

              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Message</Label>

              <Textarea
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                placeholder="I am interested in admission..."
                required
              />
            </div>

            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setSelectedCollege(null)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-[#0F766E]"
              >
                Apply Now
              </Button>

            </DialogFooter>

          </form>

        </DialogContent>

      </Dialog>

    </div>
  );
};

export default CollegeList;
