import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  Newspaper,
} from 'lucide-react';
import { toast } from 'sonner';
import { createApiUrl } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { UpdateCard } from './UpdateCard';

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
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  return formatDate(value) || '';
};

const relatedOf = (item = {}) => {
  if (item.examId?.shortName || item.examId?.name) {
    return item.examId.shortName || item.examId.name;
  }

  if (item.collegeId?.name) return item.collegeId.name;

  if (item.courseId?.name) {
    return item.courseId.fullName || item.courseId.name;
  }

  if (item.scholarshipId?.name) return item.scholarshipId.name;

  return 'General';
};

const GRADIENTS = {
  'Education News': 'from-sky-700 to-slate-900',
  'Exam Update': 'from-indigo-700 to-blue-900',
  'Admission Update': 'from-amber-500 to-orange-800',
  'College Update': 'from-emerald-600 to-teal-800',
  'Scholarship Update': 'from-blue-700 to-cyan-700',
  Result: 'from-slate-600 to-blue-900',
  Counselling: 'from-violet-700 to-purple-900',
  'Application Deadline': 'from-rose-600 to-red-800',
  'Course Update': 'from-cyan-600 to-sky-800',
  Announcement: 'from-slate-700 to-slate-900',
  'Exam Alert': 'from-indigo-700 to-blue-900',
  'Admission Alert': 'from-amber-500 to-orange-800',
  'Scholarship Alert': 'from-blue-700 to-cyan-700',
  'Result Alert': 'from-slate-600 to-blue-900',
  'Deadline Alert': 'from-rose-600 to-red-800',
  'Counselling Alert': 'from-violet-700 to-purple-900',
  'College Alert': 'from-emerald-600 to-teal-800',
  'General Education Alert': 'from-sky-700 to-slate-900',
};

const toneOf = (item = {}) =>
  GRADIENTS[item.category] || GRADIENTS[item.type] || 'from-slate-700 to-slate-900';

const TABS = [
  { value: 'saved', label: 'Saved Updates', icon: Bookmark },
  { value: 'alerts', label: 'Important Alerts', icon: Bell },
  { value: 'recent', label: 'Recent Updates', icon: Newspaper },
];

const AlertRow = ({ alert }) => (
  <article className="edu-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${toneOf(
        alert
      )} text-white`}
    >
      <Bell size={17} />
    </span>

    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="edu-chip">{alert.type}</span>

        {alert.priority === 'IMPORTANT' && (
          <span className="rounded bg-red-500 px-1.5 py-0.5 text-[0.55rem] font-bold text-white">
            IMPORTANT
          </span>
        )}
      </div>

      <h2 className="mt-1.5 text-[0.875rem] font-bold leading-snug text-ink">
        {alert.title}
      </h2>

      {alert.message && (
        <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">
          {alert.message}
        </p>
      )}

      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[0.6875rem] text-ink-muted">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {timeAgo(alert.startDate)}
        </span>

        <span>·</span>

        <span>Related: {relatedOf(alert)}</span>
      </p>
    </div>

    <Link
      to={alert.updateId?._id ? `/education-updates/${alert.updateId._id}` : '/education-updates'}
      className="shrink-0 rounded-md border border-line px-3 py-1.5 text-center text-xs font-semibold text-ink-soft transition-colors duration-150 hover:border-brand hover:text-brand"
    >
      View Update
    </Link>
  </article>
);

export default function MyUpdates() {
  const navigate = useNavigate();

  const isSignedIn = Boolean(localStorage.getItem('userToken'));

  const [data, setData] = useState({
    savedUpdates: [],
    importantAlerts: [],
    recentUpdates: [],
  });
  const [tab, setTab] = useState('saved');

  useEffect(() => {
    if (!isSignedIn) return;

    const load = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(createApiUrl('/my-updates'), { headers });
        const data = await res.json();
        setData(data.data || { savedUpdates: [], importantAlerts: [], recentUpdates: [] });
      } catch {
        toast.error('Could not load your updates.');
      }
    };

    load();
  }, [isSignedIn]);

  const items = useMemo(() => {
    if (tab === 'alerts') return data.importantAlerts;
    if (tab === 'recent') return data.recentUpdates;

    return data.savedUpdates;
  }, [tab, data]);

  const handleToggleSave = async (item, nextSaved) => {
    const previous = data.savedUpdates;

    setData((current) => ({
      ...current,
      savedUpdates: nextSaved
        ? [item, ...current.savedUpdates]
        : current.savedUpdates.filter((row) => row._id !== item._id),
    }));

    try {
      const token = localStorage.getItem('userToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await fetch(createApiUrl(`/education-updates/${item._id}/save`), { method: 'POST', headers });
      toast.success(nextSaved ? 'Update saved' : 'Removed from saved updates');
    } catch {
      setData((current) => ({ ...current, savedUpdates: previous }));
      toast.error('Could not update your saved list.');
    }
  };

  const emptyIcon =
    tab === 'alerts' ? (
      <Bell size={22} className="text-ink-muted" />
    ) : tab === 'recent' ? (
      <Newspaper size={22} className="text-ink-muted" />
    ) : (
      <Bookmark size={22} className="text-ink-muted" />
    );

  const emptyTitle =
    tab === 'saved'
      ? 'Nothing saved yet'
      : tab === 'alerts'
        ? 'No important alerts'
        : 'No recent updates';

  const emptyMessage =
    tab === 'saved'
      ? 'Bookmark an update to keep it here for quick access.'
      : 'Nothing to show in this list right now.';

  return (
    <div className="edu-page">
      <div className="edu-page-head">
        <div className="edu-container edu-page-head-inner">
          <nav className="edu-crumbs">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft size={13} />
              Home
            </Link>

            <ChevronRight size={12} />

            <span className="font-medium text-ink">My Updates</span>
          </nav>

          <h1 className="edu-h1 mt-2.5">My Updates</h1>

          <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
            Your saved updates, important alerts and recent news.
          </p>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {TABS.map((item) => {
            const Icon = item.icon;

            const count =
              item.value === 'saved'
                ? data.savedUpdates?.length
                : item.value === 'alerts'
                  ? data.importantAlerts?.length
                  : data.recentUpdates?.length;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={`flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors duration-150 ${
                  tab === item.value
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-white text-ink-soft hover:border-brand hover:text-brand'
                }`}
              >
                <Icon size={13} />
                {item.label}

                {count > 0 && (
                  <span
                    className={`rounded px-1 text-[0.625rem] ${
                      tab === item.value ? 'bg-white/20' : 'bg-surface text-ink-muted'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isSignedIn && (
          <div className="edu-empty">
            <Bookmark size={22} className="text-ink-muted" />

            <h2 className="text-[0.9375rem] font-semibold text-ink">
              Sign in to see your updates
            </h2>

            <p className="text-[0.8125rem] text-ink-muted">
              Saved updates and read alerts are tied to your student account.
            </p>

            <Button size="sm" className="mt-2" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        )}

        {isSignedIn && items.length === 0 && (
          <div className="edu-empty">
            {emptyIcon}

            <h2 className="text-[0.9375rem] font-semibold text-ink">{emptyTitle}</h2>

            <p className="text-[0.8125rem] text-ink-muted">{emptyMessage}</p>

            {tab === 'saved' && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => navigate('/education-updates')}
              >
                Browse updates
              </Button>
            )}
          </div>
        )}

        {isSignedIn && tab === 'alerts' && items.length > 0 && (
          <div className="space-y-2.5">
            {items.map((alert) => (
              <AlertRow key={alert._id} alert={alert} />
            ))}
          </div>
        )}

        {isSignedIn && tab !== 'alerts' && items.length > 0 && (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <UpdateCard
                key={item._id}
                item={{ ...item, isSaved: tab === 'saved' }}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}

        {tab === 'recent' && items.length > 0 && (
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.75rem] text-ink-muted">
            <Clock size={12} />
            Showing the 10 most recent updates published on {formatDate(new Date())}
          </p>
        )}
      </main>
    </div>
  );
}
