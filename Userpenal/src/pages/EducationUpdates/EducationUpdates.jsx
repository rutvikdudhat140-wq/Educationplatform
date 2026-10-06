import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { createApiUrl } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { UpdateCard } from './UpdateCard';

const ALL = 'all';

const UPDATE_CATEGORIES = [
  'Education News',
  'Exam Update',
  'Admission Update',
  'College Update',
  'Scholarship Update',
  'Result',
  'Counselling',
  'Application Deadline',
  'Course Update',
  'Announcement',
];

const SORTS = [
  { value: 'latest', label: 'Latest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'deadline', label: 'Deadline soonest' },
  { value: 'title', label: 'Title A-Z' },
];

const listParam = (value) => (value ? value.split(',').filter(Boolean) : []);

const FilterGroup = ({ title, children, selectedCount = 0, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b border-line last:border-b-0"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 transition-colors duration-150 hover:bg-surface">
        <span className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink">
          {title}
          {selectedCount > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
              {selectedCount}
            </span>
          )}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-ink-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="max-h-60 space-y-0.5 overflow-y-auto px-4 pb-3.5">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const FilterOption = ({ label, value, selected, onToggle, hint }) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-[6px] px-1.5 py-1.5 text-[0.8125rem] text-ink-soft transition-colors duration-150 hover:bg-surface hover:text-ink">
    <Checkbox checked={selected} onCheckedChange={() => onToggle(value)} />

    <span className="min-w-0 flex-1 truncate">{label}</span>

    {hint && <span className="shrink-0 text-[0.6875rem] text-ink-muted">{hint}</span>}
  </label>
);

const ActiveFilters = ({ chips, onRemove, onClear }) => {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[0.75rem] font-medium text-ink-muted">Applied:</span>

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1 rounded-md border border-brand-border bg-brand-softest px-2 py-1 text-[0.6875rem] font-semibold text-brand transition-colors duration-150 hover:bg-brand-soft"
        >
          {chip.key}: {chip.label}
          <X size={11} />
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="text-[0.75rem] font-medium text-ink-muted underline-offset-2 transition-colors duration-150 hover:text-brand hover:underline"
      >
        Clear all
      </button>
    </div>
  );
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-150 hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-current={item === page ? 'page' : undefined}
          className={`size-8 rounded-md border text-xs font-semibold transition-colors duration-150 ${
            item === page
              ? 'border-brand bg-brand text-white'
              : 'border-line bg-white text-ink-soft hover:border-brand hover:text-brand'
          }`}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-150 hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
};

export default function EducationUpdates() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') || '');
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [options, setOptions] = useState({
    exams: [],
    colleges: [],
    courses: [],
    scholarships: [],
    states: [],
  });

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'latest';
  const categories = useMemo(() => listParam(searchParams.get('category')), [searchParams]);
  const isImportant = searchParams.get('isImportant') === 'true';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const applyParams = (patch, { resetPage = true } = {}) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        Object.entries(patch).forEach(([key, value]) => {
          if (!value || value === ALL) next.delete(key);
          else next.set(key, value);
        });

        if (resetPage) next.delete('page');

        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    Promise.all([
      fetch(createApiUrl('/exam')).then(r => r.json()).catch(() => []),
      fetch(createApiUrl('/college?limit=200')).then(r => r.json()).catch(() => []),
      fetch(createApiUrl('/course?limit=200')).then(r => r.json()).catch(() => []),
      fetch(createApiUrl('/scholarships')).then(r => r.json()).catch(() => []),
    ]).then(([exams, colleges, courses, scholarships]) => {
      const states = [...new Set(colleges.data?.colleges || colleges.data?.data || colleges.map?.(c => c?.location?.state).filter(Boolean) || []).filter(Boolean).sort()];
      setOptions({ exams: exams.data?.exams || exams.data?.data || exams, colleges, courses: courses.data?.courses || courses.data?.data || courses, scholarships: scholarships.data?.data || scholarships.data?.scholarships || scholarships, states });
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (categories.length) params.set('category', categories.join(','));
        const examId = searchParams.get('examId') || '';
        if (examId) params.set('examId', examId);
        const collegeId = searchParams.get('collegeId') || '';
        if (collegeId) params.set('collegeId', collegeId);
        const courseId = searchParams.get('courseId') || '';
        if (courseId) params.set('courseId', courseId);
        const scholarshipId = searchParams.get('scholarshipId') || '';
        if (scholarshipId) params.set('scholarshipId', scholarshipId);
        const state = searchParams.get('state') || '';
        if (state) params.set('state', state);
        if (isImportant) params.set('isImportant', 'true');
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        params.set('sort', sort);
        params.set('page', page);
        params.set('limit', '12');

        const res = await fetch(createApiUrl(`/education-updates?${params.toString()}`), { headers });
        const data = await res.json();
        setItems(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, totalPages: 1 });
      } catch {
        setItems([]);
        toast.error('Could not load education updates.');
      }
    };

    load();
  }, [searchParams, search, categories, sort, from, to, isImportant, page]);

  const toggleListValue = (key, value) => {
    const current = listParam(searchParams.get(key));
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    applyParams({ [key]: next.join(',') });
  };

  const handleToggleSave = async (item, nextSaved) => {
    const previous = item.isSaved;

    setItems((rows) =>
      rows.map((row) =>
        row._id === item._id ? { ...row, isSaved: nextSaved } : row)
    );

    try {
      const token = localStorage.getItem('userToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await fetch(createApiUrl(`/education-updates/${item._id}/save`), { method: 'POST', headers });
      toast.success(nextSaved ? 'Update saved' : 'Removed from saved');
    } catch {
      setItems((rows) =>
        rows.map((row) =>
          row._id === item._id ? { ...row, isSaved: previous } : row)
      );
      toast.error('Sign in to save education updates.');
    }
  };

  const clearFilters = () => {
    setSearchDraft('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const nameOf = (list, item, fallbackKeys = ['name']) => {
    if (!item) return null;

    return fallbackKeys.map((key) => item[key]).find(Boolean) || null;
  };

  const chips = useMemo(() => {
    const list = [];

    if (search) list.push({ key: 'search', label: search });

    categories.forEach((item) => list.push({ key: `category:${item}`, label: item }));

    if (isImportant) list.push({ key: 'isImportant', label: 'Important only' });

    if (from || to) {
      list.push({ key: 'from', label: from || 'Any' });
      list.push({ key: 'to', label: to || 'Today' });
    }

    const relation = [
      ['examId', 'Exam', options.exams, ['shortName', 'name']],
      ['collegeId', 'College', options.colleges, ['name']],
      ['courseId', 'Course', options.courses, ['name', 'fullName']],
      ['scholarshipId', 'Scholarship', options.scholarships, ['name']],
      ['state', 'State', options.states.map((item) => ({ name: item })), ['name']],
    ];

    relation.forEach(([key, label, list_, keys]) => {
      const value = searchParams.get(key);

      if (!value) return;

      const match = list_.find((entry) => entry._id === value || entry.name === value);

      list.push({ key, label: `${label}: ${nameOf(list_, match, keys) || value}` });
    });

    return list;
  }, [search, categories, isImportant, from, to, options, searchParams]);

  const removeChip = (key) => {
    const [head, tail] = key.split(':');

    if (head === 'category') {
      toggleListValue('category', tail);
      return;
    }

    if (key === 'search') setSearchDraft('');

    applyParams({ [head]: '' });
  };

  const selectField = (key, label, list, keys) => {
    const value = searchParams.get(key) || ALL;

    return (
      <div className="px-4 py-3">
        <Label className="edu-field-label">{label}</Label>

        <Select
          value={value}
          onValueChange={(next) => applyParams({ [key]: next })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`All ${label.toLowerCase()}`} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL}>All {label.toLowerCase()}</SelectItem>

            {list.map((entry) => (
              <SelectItem key={entry._id || entry.name} value={entry._id || entry.name}>
                {nameOf(list, entry, keys)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const singleFilter = (key, label, optionsList, placeholder) => {
    const value = searchParams.get(key) || ALL;

    return (
      <FilterGroup
        title={label}
        selectedCount={searchParams.get(key) ? 1 : 0}
      >
        <button
          type="button"
          onClick={() => applyParams({ [key]: '' })}
          className={`flex w-full items-center gap-2.5 rounded-[6px] px-1.5 py-1.5 text-left text-[0.8125rem] transition-colors duration-150 ${
            value === ALL ? 'font-semibold text-brand' : 'text-ink-soft hover:bg-surface'
          }`}
        >
          <span className="flex-1">{placeholder}</span>
          {value === ALL && <span className="text-[0.6875rem]">Selected</span>}
        </button>

        {optionsList.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => applyParams({ [key]: entry })}
            className={`flex w-full items-center gap-2.5 rounded-[6px] px-1.5 py-1.5 text-left text-[0.8125rem] transition-colors duration-150 hover:bg-surface ${
              value === entry ? 'font-semibold text-brand' : 'text-ink-soft'
            }`}
          >
            {entry}
          </button>
        ))}
      </FilterGroup>
    );
  };

  return (
    <div className="edu-page min-h-screen bg-[#F7F8FC]">
      <div className="edu-page-head">
        <div className="edu-container edu-page-head-inner">
          <nav className="edu-crumbs">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft size={13} />
              Home
            </Link>

            <ChevronRight size={12} />

            <span className="font-medium text-ink">Education Updates</span>
          </nav>

          <h1 className="edu-h1 mt-2.5">Education News &amp; Updates</h1>

          <p className="mt-1.5 max-w-3xl text-[0.8125rem] leading-relaxed text-ink-muted">
            Exam announcements, admission deadlines, scholarship updates and important
            student information, published by the platform.
          </p>

          <form
            className="mt-3.5 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              applyParams({ search: searchDraft.trim() });
            }}
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <Input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Search by title, summary or content..."
                className="pl-9"
              />
            </div>

            <Button type="submit" className="shrink-0">
              Search
            </Button>
          </form>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[15rem_1fr] lg:gap-6">
          <aside className={`lg:block ${showMobileFilters ? "block mb-4" : "hidden"}`}>
            <div className="edu-rail edu-card overflow-hidden">
              <div className="edu-panel-head">
                <div className="edu-panel-title">
                  <SlidersHorizontal size={15} className="text-brand" />
                  Filters
                </div>

                {chips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[0.75rem] font-medium text-brand transition-colors duration-150 hover:text-brand-dark"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <FilterGroup title="Category" selectedCount={categories.length}>
                <FilterOption
                  label="All categories"
                  value="__all__"
                  selected={categories.length === 0}
                  onToggle={() => applyParams({ category: '' })}
                />

                {UPDATE_CATEGORIES.map((item) => (
                  <FilterOption
                    key={item}
                    label={item}
                    value={item}
                    selected={categories.includes(item)}
                    onToggle={() => toggleListValue('category', item)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Priority" selectedCount={isImportant ? 1 : 0}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-[6px] px-1.5 py-1.5 text-[0.8125rem] text-ink-soft transition-colors duration-150 hover:bg-surface hover:text-ink">
                  <Checkbox
                    checked={isImportant}
                    onCheckedChange={(checked) =>
                      applyParams({ isImportant: checked ? 'true' : '' })
                    }
                  />

                  <span>Important only</span>
                </label>
              </FilterGroup>

              {singleFilter('state', 'State', options.states, 'All states')}

              <div className="border-b border-line">
                {selectField('examId', 'Exam', options.exams, ['shortName', 'name'])}
              </div>

              <div className="border-b border-line">
                {selectField('collegeId', 'College', options.colleges, ['name'])}
              </div>

              <div className="border-b border-line">
                {selectField('courseId', 'Course', options.courses, ['name', 'fullName'])}
              </div>

              <div className="border-b border-line">
                {selectField('scholarshipId', 'Scholarship', options.scholarships, ['name'])}
              </div>

              <FilterGroup title="Published Between" selectedCount={from || to ? 1 : 0}>
                <div className="space-y-2.5 pt-0.5">
                  <div>
                    <Label className="edu-field-label" htmlFor="update-from">
                      From
                    </Label>

                    <Input
                      id="update-from"
                      type="date"
                      value={from}
                      onChange={(event) => applyParams({ from: event.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="edu-field-label" htmlFor="update-to">
                      To
                    </Label>

                    <Input
                      id="update-to"
                      type="date"
                      value={to}
                      onChange={(event) => applyParams({ to: event.target.value })}
                    />
                  </div>
                </div>
              </FilterGroup>
            </div>
          </aside>

                      <section>
              <div className="lg:hidden flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-md border border-brand-border text-[13px] font-semibold text-ink"
                >
                  <SlidersHorizontal size={15} className="text-brand" />
                  {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                {chips.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[12px] font-semibold text-ink-muted hover:text-brand"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Mobile Category Chips */}
            <div className="lg:hidden flex overflow-x-auto [&::-webkit-scrollbar]:hidden gap-2 mb-4 pb-1">
              <button
                onClick={() => applyParams({ category: '' })}
                className={`shrink-0 px-3 py-1.5 rounded-md text-[12px] font-semibold border transition-colors ${
                  categories.length === 0
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-ink-muted border-brand-border hover:border-brand-hover'
                }`}
              >
                All
              </button>
              {UPDATE_CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleListValue('category', cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-md text-[12px] font-semibold border transition-colors ${
                    categories.includes(cat)
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-ink-muted border-brand-border hover:border-brand-hover'
                  }`}
                >
                  {cat.replace(' Update', '').replace(' Alert', '')}
                </button>
              ))}
            </div>

            <div className="mb-3 hidden md:flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.8125rem] text-ink-muted">
                Showing{' '}
                <span className="font-semibold text-ink">{meta.total}</span>{' '}
                {meta.total === 1 ? 'update' : 'updates'}
                {chips.length > 0 ? ' matching your filters' : ''}
              </p>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="update-sort"
                  className="shrink-0 text-[0.75rem] font-medium text-ink-muted"
                >
                  Sort
                </Label>

                <Select
                  value={sort}
                  onValueChange={(next) => applyParams({ sort: next })}
                >
                  <SelectTrigger id="update-sort" size="sm" className="w-[10.5rem]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {SORTS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-3.5">
              <ActiveFilters chips={chips} onRemove={removeChip} onClear={clearFilters} />
            </div>

            {items.length === 0 ? (
              <div className="edu-empty">
                <Search size={22} className="text-ink-muted" />

                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  No updates found
                </h2>

                <p className="text-[0.8125rem] text-ink-muted">
                  {chips.length > 0
                    ? 'Try removing or changing a few filters.'
                    : 'No education updates have been published yet.'}
                </p>

                {chips.length > 0 && (
                  <Button size="sm" variant="outline" className="mt-2" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <UpdateCard
                      key={item._id}
                      item={item}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>

                <Pagination
                  page={meta.page || 1}
                  totalPages={meta.totalPages || 1}
                  onChange={(next) => {
                    applyParams({ page: next }, { resetPage: false });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}


