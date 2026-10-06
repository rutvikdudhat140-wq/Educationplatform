import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BellOff,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const timeAgo = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  return formatDate(value) || '';
};

const relatedOf = (item = {}) => {
  if (item.examId?.shortName || item.examId?.name) {
    return { name: item.examId.shortName || item.examId.name, type: 'exam' };
  }
  if (item.collegeId?.name) {
    return { name: item.collegeId.name, type: 'college' };
  }
  if (item.courseId?.name) {
    return { name: item.courseId.fullName || item.courseId.name, type: 'course' };
  }
  if (item.scholarshipId?.name) {
    return { name: item.scholarshipId.name, type: 'scholarship' };
  }
  return { name: 'Official Platform Update', type: 'general' };
};

const ALERT_CATEGORIES = [
  { key: 'Exam Alert', label: 'Exam Updates & Dates', icon: BookOpen, color: 'text-[#2563EB]' },
  { key: 'Admission Alert', label: 'Admission Notifications', icon: Building2, color: 'text-[#EA580C]' },
  { key: 'Application Deadline', label: 'Application Deadlines', icon: Clock, color: 'text-[#DC2626]' },
  { key: 'Result Alert', label: 'Results & Merit Cutoffs', icon: Trophy, color: 'text-[#16A34A]' },
  { key: 'Scholarship Alert', label: 'Scholarship Schemes', icon: GraduationCap, color: 'text-[#7C3AED]' },
  { key: 'Counselling Alert', label: 'Counselling & Seat Allotment', icon: Layers, color: 'text-[#0284C7]' },
  { key: 'College Alert', label: 'College & Campus News', icon: Building2, color: 'text-[#475569]' },
  { key: 'General Education Alert', label: 'General Education Alerts', icon: Bell, color: 'text-[#172554]' },
];

const getCategoryIcon = (type = '') => {
  const found = ALERT_CATEGORIES.find((c) => c.key.toLowerCase() === (type || '').toLowerCase());
  if (found) {
    const Icon = found.icon;
    return <Icon className={`size-4 ${found.color}`} />;
  }
  return <Bell className="size-4 text-[#172554]" />;
};

const FilterOption = ({ label, value, selected, onToggle, count, icon: Icon, iconColor }) => (
  <label className="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 text-[0.8125rem] text-slate-700 transition-colors hover:bg-[#EFF6FF] hover:text-[#172554]">
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <Checkbox
        checked={selected}
        onCheckedChange={() => onToggle(value)}
        className="rounded-[3px] border-[#E5E7EB]"
      />
      {Icon && <Icon size={13} className={`shrink-0 ${iconColor || 'text-slate-500'}`} />}
      <span className="truncate">{label}</span>
    </div>
    {count !== undefined && count !== null && (
      <span className="shrink-0 text-[0.6875rem] font-semibold text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.2 rounded">
        {count}
      </span>
    )}
  </label>
);

const TABS = [
  { value: 'all', label: 'All Alerts' },
  { value: 'false', label: 'Unread' },
  { value: 'important', label: 'Urgent & Deadlines' },
  { value: 'true', label: 'Read History' },
];

export default function EducationAlerts() {
  const navigate = useNavigate();
  const isSignedIn = Boolean(localStorage.getItem('userToken'));

  const [alerts, setAlerts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, unread: 0, important: 0, types: [] });
  const [tab, setTab] = useState('all');
  const [searchDraft, setSearchDraft] = useState('');
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    const load = async () => {

      try {
        const baseUrl = typeof window !== 'undefined' && window.location && window.location.hostname
          ? `http://${window.location.hostname}:5001/api`
          : 'http://localhost:5001/api';
        const token = localStorage.getItem('userToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (types.length) params.set('type', types.join(','));
        if (tab === 'false') params.set('read', 'false');
        else if (tab === 'true') params.set('read', 'true');

        const { data } = await axios.get(`${baseUrl}/education-alerts`, { params, headers });
        setAlerts(data.data || []);
        setMeta(data.meta || { total: 0, unread: 0, important: 0, types: [] });
      } catch {
        setAlerts([]);
        toast.error('Could not load education alerts.');
      }
    };

    load();
  }, [isSignedIn, search, types, tab]);

  const visible = useMemo(
    () => (tab === 'important' ? alerts.filter((item) => item.priority === 'IMPORTANT') : alerts),
    [alerts, tab]
  );


  const categoryCounts = useMemo(() => {
    const counts = {};
    alerts.forEach((alert) => {
      const t = alert.type || alert.category || 'General Education Alert';
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [alerts]);

  const clearFilters = () => {
    setTypes([]);
    setSearch('');
    setSearchDraft('');
    setTab('all');
  };

  const toggleType = (value) => {
    setTypes((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const handleRead = (alert, navigateAfter = false) => {
    const openRelated = () => {
      if (alert.updateId?._id) {
        navigate(`/education-updates/${alert.updateId._id}`);
      } else if (alert.examId?._id) {
        navigate(`/exams/${alert.examId._id}`);
      } else if (alert.collegeId?._id) {
        navigate(`/colleges/${alert.collegeId._id}`);
      } else if (alert.scholarshipId?._id) {
        navigate(`/scholarships/${alert.scholarshipId._id}`);
      } else {
        navigate('/education-updates');
      }
    };

    if (alert.read) {
      if (navigateAfter) openRelated();
      return;
    }
    markAlertRead(alert._id)
      .then(() => {
        setAlerts((rows) =>
          rows.map((row) => (row._id === alert._id ? { ...row, read: true } : row))
        );

        setMeta((current) => ({
          ...current,
          unread: Math.max(0, current.unread - 1),
        }));

        if (navigateAfter) openRelated();
      })
      .catch(() => {
        toast.error('Could not mark the alert as read.');
      });
  };

  const handleMarkAllAsRead = async () => {
    const unreadAlerts = alerts.filter((a) => !a.read);
    if (unreadAlerts.length === 0) {
      toast.info('All alerts are already marked as read.');
      return;
    }

    try {
      await Promise.all(unreadAlerts.map((a) => markAlertRead(a._id)));
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      setMeta((prev) => ({ ...prev, unread: 0 }));
      toast.success('All alerts marked as read.');
    } catch {
      toast.error('Failed to mark all alerts as read.');
    }
  };

  const chips = useMemo(() => {
    const list = [];
    if (search) list.push({ key: 'search', label: search });
    types.forEach((item) => {
      const match = ALERT_CATEGORIES.find((c) => c.key === item);
      list.push({ key: `type:${item}`, label: match?.label || item });
    });
    return list;
  }, [search, types]);

  const removeChip = (key) => {
    if (key === 'search') {
      setSearch('');
      setSearchDraft('');
      return;
    }
    const [head, tail] = key.split(':');
    if (head === 'type') toggleType(tail);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Top Banner / Breadcrumb Area */}
      <div className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="edu-container py-4 md:py-5">
          <nav className="flex items-center gap-1.5 text-[0.75rem] text-[#64748B]">
            <Link to="/" className="hover:text-[#2563EB] flex items-center gap-1">
              <ArrowLeft size={13} />
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#172554]">Education Alerts</span>
          </nav>

          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[1.375rem] md:text-[1.625rem] font-bold tracking-tight text-[#172554]">
                  Education Alerts &amp; Deadlines
                </h1>
                <span className="flex items-center gap-1 rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[0.6875rem] font-bold text-[#1E40AF]">
                  <span className="size-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="mt-0.5 text-[0.8125rem] text-[#64748B] max-w-2xl leading-relaxed">
                Official notifications for exam dates, admission cutoffs, application deadlines, results, and scholarships.
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-[0.75rem] font-bold text-[#1E40AF]">
                <Bell size={13} />
                <span>{meta.unread} Unread Alerts</span>
              </div>

              {meta.important > 0 && (
                <div className="flex items-center gap-1.5 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1 text-[0.75rem] font-bold text-[#DC2626]">
                  <AlertTriangle size={13} />
                  <span>{meta.important} Urgent</span>
                </div>
              )}

              {isSignedIn && meta.unread > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="h-7.5 rounded-[4px] border-[#E5E7EB] text-xs font-semibold text-[#172554] hover:bg-white"
                >
                  <CheckCheck size={13} className="mr-1 text-[#2563EB]" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          {/* Segment Tabs */}
          <div className="mt-3.5 flex items-center gap-1.5 border-t border-[#E5E7EB] pt-3 overflow-x-auto no-scrollbar">
            {TABS.map((item) => (
              <button
                key={item.value}
                onClick={() => setTab(item.value)}
                className={`rounded-[4px] px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${tab === item.value
                  ? 'bg-[#172554] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-slate-700 hover:bg-[#F8FAFC]'
                  }`}
              >
                {item.label}
                {item.value === 'false' && meta.unread > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#2563EB] px-1.5 py-0.2 text-[0.625rem] text-white font-bold">
                    {meta.unread}
                  </span>
                )}
                {item.value === 'important' && meta.important > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#DC2626] px-1.5 py-0.2 text-[0.625rem] text-white font-bold">
                    {meta.important}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="edu-container py-3.5 md:py-5">
        {/* Mobile Search & Filter Toolbar */}
        <div className="md:hidden mb-3 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchDraft.trim());
            }}
            className="flex gap-1.5"
          >
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                placeholder="Search exam, college alerts..."
                className="w-full h-8.5 pl-9 pr-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[4px] text-[13px]"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-8.5 rounded-[4px] bg-[#172554] text-white text-xs font-semibold px-3"
            >
              Search
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 h-8 rounded-[4px] border-[#E5E7EB] text-xs font-semibold text-[#172554] flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal size={12} className="text-[#2563EB]" />
              Filter Categories
              {types.length > 0 && (
                <span className="rounded bg-[#2563EB] px-1.5 py-0.2 text-[0.625rem] text-white font-bold">
                  {types.length}
                </span>
              )}
            </Button>

            {isSignedIn && meta.unread > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 rounded-[4px] border-[#E5E7EB] text-xs font-semibold text-[#172554]"
              >
                Mark All Read
              </Button>
            )}
          </div>

          {/* Mobile Filter Sheet */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetContent side="bottom" className="h-[78vh] rounded-t-lg p-0 flex flex-col">
              <SheetHeader className="flex-row items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                <SheetTitle className="text-[0.9375rem] font-bold text-[#172554]">
                  Filter Alert Categories ({types.length})
                </SheetTitle>
                <div className="flex items-center gap-3">
                  {types.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTypes([])}
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

              <div className="flex-1 overflow-y-auto p-3.5 divide-y divide-[#E5E7EB]">
                <div className="pb-3 space-y-1">
                  <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-1">
                    Categories
                  </p>
                  {ALERT_CATEGORIES.map((cat) => (
                    <FilterOption
                      key={cat.key}
                      label={cat.label}
                      value={cat.key}
                      icon={cat.icon}
                      iconColor={cat.color}
                      count={categoryCounts[cat.key] || 0}
                      selected={types.includes(cat.key)}
                      onToggle={toggleType}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] bg-white p-3">
                <Button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full h-9 rounded-[4px] bg-[#172554] text-white font-semibold text-xs hover:bg-[#0F172A]"
                >
                  Show Alerts ({visible.length})
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Split View: Left Filters Rail + Right Alert Feed */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[15.5rem_1fr]">
          {/* Left Rail (Desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-md border border-[#E5E7EB] bg-white overflow-hidden shadow-none">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5">
                <div className="flex items-center gap-1.5 text-[0.78125rem] font-bold uppercase tracking-wider text-[#172554]">
                  <SlidersHorizontal size={13} className="text-[#2563EB]" />
                  Alert Categories
                </div>
                {types.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTypes([])}
                    className="text-[0.71875rem] font-semibold text-[#2563EB] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="p-2 space-y-0.5 max-h-[calc(100vh-180px)] overflow-y-auto">
                {ALERT_CATEGORIES.map((cat) => (
                  <FilterOption
                    key={cat.key}
                    label={cat.label}
                    value={cat.key}
                    icon={cat.icon}
                    iconColor={cat.color}
                    count={categoryCounts[cat.key] || 0}
                    selected={types.includes(cat.key)}
                    onToggle={toggleType}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Feed Column */}
          <section>
            {/* Desktop Search Bar & Active Filters */}
            <div className="hidden md:flex items-center gap-2 mb-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearch(searchDraft.trim());
                }}
                className="relative flex-1"
              >
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Search alerts by title, college, exam, or scholarship..."
                  className="h-8.5 pl-9 pr-3 rounded-[4px] text-[0.8125rem]"
                />
              </form>
              <Button
                onClick={() => setSearch(searchDraft.trim())}
                className="h-8.5 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-xs font-semibold px-4"
              >
                Search
              </Button>
            </div>

            {/* Active Filter Chips */}
            {chips.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-[#E5E7EB] pb-2.5">
                <span className="text-[0.75rem] text-[#64748B]">Active Filters:</span>
                {chips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#1E40AF]"
                  >
                    {chip.label}
                    <X
                      size={11}
                      className="cursor-pointer hover:text-red-600 ml-0.5"
                      onClick={() => removeChip(chip.key)}
                    />
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[0.75rem] font-semibold text-[#2563EB] hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Not Signed In State */}
            {!isSignedIn && (
              <div className="flex flex-col items-center justify-center rounded-md border border-[#E5E7EB] bg-white py-12 px-4 text-center">
                <div className="flex size-12 items-center justify-center rounded bg-[#EFF6FF] text-[#2563EB] mb-3">
                  <Bell size={24} />
                </div>
                <h2 className="text-[1rem] font-bold text-[#172554]">Sign In to View Alerts</h2>
                <p className="mt-1 max-w-sm text-[0.8125rem] text-[#64748B] leading-relaxed">
                  Sign in to get real-time alerts for your shortlisted colleges, entrance exam dates, and scholarship deadlines.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="mt-4 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] font-semibold text-xs px-5"
                >
                  Sign In to Account
                </Button>
              </div>
            )}

            {/* Empty State */}
            {isSignedIn && visible.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-[#D1D5DB] bg-white py-14 px-4 text-center">
                <div className="flex size-12 items-center justify-center rounded bg-[#F8FAFC] text-slate-400 mb-3 border border-[#E5E7EB]">
                  <BellOff size={22} />
                </div>
                <h3 className="text-[1rem] font-bold text-[#172554]">No Alerts Available</h3>
                <p className="mt-1 max-w-sm text-[0.8125rem] text-[#64748B]">
                  {chips.length > 0 || tab !== 'all'
                    ? 'No alerts match your current filters. Try resetting filters to view all updates.'
                    : "You're all caught up! New alerts on exam dates, admission cutoffs, and scholarships will appear here automatically."}
                </p>
                {(chips.length > 0 || tab !== 'all') && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="mt-4 rounded-[4px] border-[#E5E7EB] text-xs font-semibold text-[#172554]"
                  >
                    Reset All Filters
                  </Button>
                )}
              </div>
            )}

            {/* Alerts Feed List */}
            {isSignedIn && visible.length > 0 && (
              <div className="space-y-2.5">
                {visible.map((alert) => {
                  const important = alert.priority === 'IMPORTANT';
                  const isUnread = !alert.read;
                  const related = relatedOf(alert);

                  return (
                    <article
                      key={alert._id}
                      className={`group relative rounded-md border transition-all duration-150 p-3 sm:p-3.5 bg-white ${isUnread
                        ? 'border-[#BFDBFE] bg-[#F8FAFC]/50 shadow-xs hover:border-[#93C5FD]'
                        : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Icon Badge */}
                        <div
                          className={`flex size-8.5 shrink-0 items-center justify-center rounded-[5px] border ${important
                            ? 'border-[#FECACA] bg-[#FEF2F2]'
                            : isUnread
                              ? 'border-[#BFDBFE] bg-[#EFF6FF]'
                              : 'border-[#E5E7EB] bg-[#F8FAFC]'
                            }`}
                        >
                          {getCategoryIcon(alert.type || alert.category)}
                        </div>

                        {/* Alert Main Body */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="rounded-[3px] border border-[#E5E7EB] bg-[#F8FAFC] px-1.5 py-0.2 text-[0.625rem] font-bold text-[#172554]">
                              {alert.type || 'Platform Alert'}
                            </span>

                            {important && (
                              <span className="rounded-[3px] bg-[#DC2626] px-1.5 py-0.2 text-[0.625rem] font-bold text-white flex items-center gap-1">
                                <AlertTriangle size={10} />
                                URGENT
                              </span>
                            )}

                            {isUnread && (
                              <span className="flex items-center gap-1 text-[0.625rem] font-bold text-[#2563EB]">
                                <span className="size-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                                New
                              </span>
                            )}
                          </div>

                          <h2
                            onClick={() => handleRead(alert, true)}
                            className={`cursor-pointer text-[0.9rem] sm:text-[0.9375rem] leading-snug transition-colors group-hover:text-[#2563EB] ${isUnread ? 'font-bold text-[#172554]' : 'font-semibold text-slate-800'
                              }`}
                          >
                            {alert.title}
                          </h2>

                          {alert.message && (
                            <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#64748B] line-clamp-2">
                              {alert.message}
                            </p>
                          )}

                          {/* Metadata Strip */}
                          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.6875rem] text-[#64748B] pt-1.5 border-t border-[#F1F5F9]">
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="text-slate-400" />
                              {timeAgo(alert.startDate || alert.createdAt)}
                            </span>

                            <span>·</span>

                            <span className="flex items-center gap-1 truncate max-w-xs font-medium text-slate-700">
                              {related.name}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant={alert.read ? 'outline' : 'default'}
                            onClick={() => handleRead(alert, false)}
                            className={`h-7 px-2 text-xs rounded-[4px] shadow-none ${alert.read
                              ? 'border-[#E5E7EB] text-slate-600 hover:bg-[#F8FAFC]'
                              : 'bg-[#172554] text-white hover:bg-[#0F172A] font-semibold'
                              }`}
                          >
                            {alert.read ? (
                              <span className="flex items-center gap-1 text-[#16A34A]">
                                <Check size={12} />
                                Read
                              </span>
                            ) : (
                              'Mark Read'
                            )}
                          </Button>

                          <button
                            type="button"
                            onClick={() => handleRead(alert, true)}
                            className="text-[0.6875rem] font-semibold text-[#2563EB] hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            View Details &rarr;
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
