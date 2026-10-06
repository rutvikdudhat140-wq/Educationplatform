import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  Calendar,
  Building2,
  ChevronDown,
  ChevronRight,
  FilterX,
  GraduationCap,
  IndianRupee,
  Search,
  SlidersHorizontal,
  Filter,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const uniqueItems = (values) => {
  const unique = [];

  values.forEach((value) => {
    if (value && !unique.includes(value)) {
      unique.push(value);
    }
  });

  return unique;
};

const FilterSection = ({ title, options, selected, onChange }) => {
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
          className={`shrink-0 text-ink-muted transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="max-h-44 space-y-0.5 overflow-y-auto pr-1 pb-3.5">
          {options.map((option) => {
            const label =
              typeof option === "object" ? option.label : option;

            const value =
              typeof option === "object" ? option.value : option;

            return (
              <label
                key={label}
                className="edu-check-row"
              >
                <Checkbox
                  checked={selected.includes(value)}
                  onCheckedChange={() => onChange(value)}
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

const FilterPanel = ({
  filters,
  options,
  toggleFilter,
  clearFilters,
  hasFilters,
}) => {
  return (
    <>
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
            onClick={() => {}}
            className="flex items-center gap-1 text-[0.75rem] font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            <FilterX size={13} />
            Clear
          </button>
        )}
      </div>

      <div className="px-4">
        <FilterSection
          title="Scholarship Type"
          options={options.types}
          selected={filters.type}
          onChange={(value) => toggleFilter("type", value)}
        />

        <FilterSection
          title="Provider"
          options={options.providers}
          selected={filters.provider}
          onChange={(value) => toggleFilter("provider", value)}
        />

        <FilterSection
          title="State"
          options={options.states}
          selected={filters.state}
          onChange={(value) => toggleFilter("state", value)}
        />

        <FilterSection
          title="Category"
          options={options.categories}
          selected={filters.category}
          onChange={(value) => toggleFilter("category", value)}
        />

        <FilterSection
          title="Study Level"
          options={options.studyLevels}
          selected={filters.studyLevel}
          onChange={(value) => toggleFilter("studyLevel", value)}
        />

        <FilterSection
          title="Amount Type"
          options={options.amountTypes}
          selected={filters.amountType}
          onChange={(value) => toggleFilter("amountType", value)}
        />

        <FilterSection
          title="College"
          options={options.colleges}
          selected={filters.college}
          onChange={(value) => toggleFilter("college", value)}
        />

        <FilterSection
          title="Course"
          options={options.courses}
          selected={filters.course}
          onChange={(value) => toggleFilter("course", value)}
        />
      </div>
    </>
  );
};

const ScholarshipCard = ({ scholarship }) => {
  const navigate = useNavigate();

  const formatDeadline = (date) => {
    if (!date) return "No deadline";

    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    return `${diffDays} days left`;
  };

  const getDeadlineColor = (date) => {
    if (!date) return "text-ink-muted";

    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 7) return "text-accent";

    return "text-brand";
  };

  return (
    <Card
      className="group flex cursor-pointer p-4 gap-3.5 border border-line rounded-md bg-white shadow-none hover:border-brand/40 transition-all"
      onClick={() => navigate(`/scholarships/${scholarship._id}`)}
    >
      {/* Left Icon */}
      <div className="w-10 h-10 bg-blue-50 text-brand rounded-md border border-blue-100 flex items-center justify-center shrink-0">
        <GraduationCap size={18} />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded bg-blue-50 text-brand text-[10px] font-bold px-2 py-0.5 border border-blue-100">
            {scholarship.type || 'Scholarship'}
          </span>

          <div className="shrink-0 text-right">
            <p className="flex items-center justify-end text-xs font-bold text-brand">
              <IndianRupee size={12} className="text-brand mr-0.5" />
              {scholarship.amount || "N/A"}
            </p>

            {scholarship.amountType && (
              <p className="text-[10px] text-ink-muted">
                {scholarship.amountType}
              </p>
            )}
          </div>
        </div>

        <h3 className="mt-2 line-clamp-1 text-sm font-bold text-ink group-hover:text-brand transition-colors">
          {scholarship.name}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
          <Building2 size={12} className="shrink-0 text-ink-muted" />
          <span className="truncate">{scholarship.provider}</span>
        </p>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">
          {scholarship.description}
        </p>

        {(scholarship.eligibility?.minimumMarks ||
          scholarship.eligibility?.maximumFamilyIncome) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {scholarship.eligibility?.minimumMarks && (
              <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium border border-line text-ink-muted">
                Min: {scholarship.eligibility.minimumMarks}
              </span>
            )}

            {scholarship.eligibility?.maximumFamilyIncome && (
              <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium border border-line text-ink-muted">
                Income: {scholarship.eligibility.maximumFamilyIncome}
              </span>
            )}
          </div>
        )}

        {scholarship.collegeIds?.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-ink-muted">
              Institutions:
            </span>

            <span className="max-w-[180px] truncate rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-ink-muted">
              {scholarship.collegeIds[0].name}
            </span>

            {scholarship.collegeIds.length > 1 && (
              <span className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-ink-muted">
                +{scholarship.collegeIds.length - 1} more
              </span>
            )}
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-line pt-2.5">
          <span className="flex items-center gap-1 text-xs font-semibold">
            <Calendar size={12} className="text-ink-muted" />
            <span className={getDeadlineColor(scholarship.applicationDeadline)}>
              {formatDeadline(scholarship.applicationDeadline)}
            </span>
          </span>

          <Button
            size="sm"
            className="h-7 px-2.5 text-xs font-semibold rounded-md bg-brand hover:bg-brand-dark text-white shadow-none"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/scholarships/${scholarship._id}`);
            }}
          >
            Details
            <ChevronRight size={12} className="ml-0.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const INITIAL_FILTERS = {
  type: [],
  provider: [],
  state: [],
  category: [],
  studyLevel: [],
  amountType: [],
  college: [],
  course: [],
};

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/scholarships"
        );

        setScholarships(response.data?.data || []);
      } catch (error) {
        console.error("Fetch scholarships failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

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

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const text =
      `${scholarship.name || ""} ${scholarship.provider || ""} ` +
      `${scholarship.type || ""} ${scholarship.description || ""}`;

    if (search && !text.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (
      filters.type.length &&
      !filters.type.includes(scholarship.type)
    ) {
      return false;
    }

    if (
      filters.provider.length &&
      !filters.provider.includes(scholarship.provider)
    ) {
      return false;
    }

    if (filters.state.length) {
      const states = scholarship.eligibility?.state || [];
      const matches = filters.state.some((item) => states.includes(item));

      if (!matches) {
        return false;
      }
    }

    if (filters.category.length) {
      const categories = scholarship.eligibility?.category || [];
      const matches = filters.category.some((item) =>
        categories.includes(item)
      );

      if (!matches) {
        return false;
      }
    }

    if (filters.studyLevel.length) {
      const levels = scholarship.eligibility?.studyLevel || [];
      const matches = filters.studyLevel.some((item) => levels.includes(item));

      if (!matches) {
        return false;
      }
    }

    if (
      filters.amountType.length &&
      !filters.amountType.includes(scholarship.amountType)
    ) {
      return false;
    }

    if (filters.college.length) {
      const collegeNames = (scholarship.collegeIds || []).map(
        (college) => college.name
      );
      const matches = filters.college.some((item) =>
        collegeNames.includes(item)
      );

      if (!matches) {
        return false;
      }
    }

    if (filters.course.length) {
      const courseNames = (scholarship.courseIds || []).map(
        (course) => course.name
      );
      const matches = filters.course.some((item) =>
        courseNames.includes(item)
      );

      if (!matches) {
        return false;
      }
    }

    return true;
  });

  const options = {
    types: uniqueItems(scholarships.map((s) => s.type)),
    providers: uniqueItems(scholarships.map((s) => s.provider)),
    states: uniqueItems(
      scholarships.flatMap((s) => s.eligibility?.state || [])
    ),
    categories: uniqueItems(
      scholarships.flatMap((s) => s.eligibility?.category || [])
    ),
    studyLevels: uniqueItems(
      scholarships.flatMap((s) => s.eligibility?.studyLevel || [])
    ),
    amountTypes: uniqueItems(
      scholarships.map((s) => s.amountType)
    ),
    colleges: uniqueItems(
      scholarships.flatMap((s) => (s.collegeIds || []).map((c) => c.name))
    ),
    courses: uniqueItems(
      scholarships.flatMap((s) => (s.courseIds || []).map((c) => c.name))
    ),
  };

  const hasFilters = Object.values(filters).some((list) => list.length > 0);

  const activeFilterCount = Object.values(filters).reduce(
    (total, list) => total + list.length,
    0
  );

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

            <span className="font-semibold text-ink">Scholarships</span>
          </div>

          <h1 className="edu-h1 mt-2.5">Scholarships</h1>

          <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
            Find funding opportunities for your education
          </p>

          <div className="mt-3.5 flex gap-2">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="shrink-0 flex items-center gap-2 h-10 w-10 p-0 sm:w-auto sm:px-4">
                        <Filter size={18} />
                        <span className="hidden sm:inline">Filters</span>
                        {false && (
                          <span className="ml-1 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            0
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
                      <SheetHeader className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                        <SheetTitle className="text-left flex justify-between items-center">
                          <span>Filters</span>
                          {false && (
                            <button onClick={() => {}} className="text-sm font-medium text-brand">Clear all</button>
                          )}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="overflow-y-auto p-4 pb-20 max-h-[calc(85vh-60px)]">
                        <div className="text-gray-500 text-sm">Mobile filters for Scholarships</div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                        <SheetTrigger asChild>
                          <Button className="w-full bg-[#4F2DFF]">Apply Filters</Button>
                        </SheetTrigger>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships..."
                className="pl-9"
              />
            </div>

            <Button className="shrink-0">Search</Button>
          </div>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[15rem_1fr] lg:gap-6">
          <aside className="hidden lg:block">
            <div className="edu-rail edu-card overflow-hidden">
              <FilterPanel
                filters={filters}
                options={options}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          <section>
            {/* Mobile Filter Chips */}
                <div className="lg:hidden flex overflow-x-auto [&::-webkit-scrollbar]:hidden space-x-2 mb-4 -mx-4 px-4 pb-2">
                  {["All","College Specific","Government","Merit"].map(type => {
                    const isSelected = type === "All" ? filters.type.length === 0 : filters.type.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          if (type === "All") {
                            toggleFilter("type", "");
                          } else {
                            toggleFilter("type", type);
                          }
                        }}
                        className={`shrink-0 px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${
                          isSelected
                            ? "bg-brand text-white border-brand shadow-none"
                            : "bg-white text-ink border-line hover:border-brand/40"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.8125rem] text-ink-muted">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {filteredScholarships.length}
                </span>{" "}
                scholarship opportunities
              </p>

              <div className="flex items-center gap-2">
                {false && (
                  <span className="edu-chip">
                    0 filter
                    {activeFilterCount === 1 ? "" : "s"} applied
                  </span>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </Button>
              </div>
            </div>

            {isLoading ? (
              <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
                <Spinner className="size-6 text-brand" />
                <p className="text-[0.8125rem] text-ink-muted">
                  Loading scholarships...
                </p>
              </Card>
            ) : filteredScholarships.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship._id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            ) : (
              <div className="edu-empty">
                <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-brand-softest text-brand">
                  <GraduationCap size={22} />
                </span>

                <h3 className="text-[0.9375rem] font-semibold text-ink">
                  No scholarships found
                </h3>

                <p className="mt-1 text-[0.8125rem] text-ink-muted">
                  Try changing your filters to find more scholarship
                  opportunities.
                </p>

                {hasFilters && (
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    size="sm"
                    className="mt-4 h-8 text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile filters */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[300px] overflow-y-auto p-0"
        >
          <div className="edu-panel-head">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-brand" />
              <h2 className="text-[0.8125rem] font-semibold text-ink">
                Filters
              </h2>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <FilterPanel
            filters={filters}
            options={options}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            hasFilters={hasFilters}
          />

          <div className="border-t p-4">
            <Button
              className="w-full"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filteredScholarships.length} Scholarships
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ScholarshipList;
