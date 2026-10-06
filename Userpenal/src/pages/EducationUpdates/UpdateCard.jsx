import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, Clock, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';

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

const daysLeft = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return Math.round((date - start) / 86400000);
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

const relatedKind = (item = {}) => {
  if (item.examId) return 'Exam';
  if (item.collegeId) return 'College';
  if (item.courseId) return 'Course';
  if (item.scholarshipId) return 'Scholarship';

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

const Deadline = ({ deadline }) => {
  const left = daysLeft(deadline);
  if (left === null) return null;

  const label =
    left < 0
      ? 'Deadline closed'
      : left === 0
        ? 'Closes today'
        : `${left} day${left === 1 ? '' : 's'} left`;

  const tone =
    left < 0
      ? 'bg-surface text-ink-muted'
      : left <= 3
        ? 'bg-red-50 text-red-600'
        : left <= 7
          ? 'bg-amber-50 text-amber-700'
          : 'bg-brand-softest text-brand';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold ${tone}`}>
      <Clock size={11} />
      {label}
    </span>
  );
};

export const UpdateCard = ({ item, onToggleSave }) => {
  const [pending, setPending] = useState(false);

  const saved = Boolean(item.isSaved);
  const related = relatedOf(item);
  const published = formatDate(item.publishedAt || item.createdAt);

  const handleSave = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (pending || !onToggleSave) return;

    setPending(true);
    try {
      await onToggleSave(item, !saved);
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="edu-card edu-card-hover group flex h-full flex-col overflow-hidden p-0 shadow-none">
      <Link
        to={`/education-updates/${item._id}`}
        className={`relative flex h-28 items-end bg-gradient-to-br p-3 ${toneOf(item)}`}
      >
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <span className="relative text-base font-bold text-white/95">{related}</span>

        {item.isImportant && (
          <span className="absolute right-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-[0.55rem] font-bold tracking-wide text-white">
            IMPORTANT
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="edu-chip">{item.category}</span>
            <span className="edu-tag">{relatedKind(item)}</span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            aria-label={saved ? 'Remove from saved' : 'Save update'}
            title={saved ? 'Remove from saved' : 'Save update'}
            className={`shrink-0 transition-colors duration-150 disabled:opacity-50 ${
              saved ? 'text-brand' : 'text-ink-muted hover:text-brand'
            }`}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <Link to={`/education-updates/${item._id}`}>
          <h3 className="mt-2 line-clamp-2 text-[0.875rem] font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-brand">
            {item.title}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-relaxed text-ink-muted">
          {item.shortDescription || 'No summary provided for this update.'}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Deadline deadline={item.deadline} />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[0.6875rem] text-ink-muted">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {published || timeAgo(item.createdAt) || 'Undated'}
          </span>

          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {related}
          </span>
        </div>
      </div>

      <div className="border-t border-line p-3">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          render={<Link to={`/education-updates/${item._id}`} />}
        >
          Read More
        </Button>
      </div>
    </article>
  );
};
