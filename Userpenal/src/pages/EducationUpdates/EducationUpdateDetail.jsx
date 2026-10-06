import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  Percent,
} from 'lucide-react';
import { createApiUrl } from '@/lib/api';

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

const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const RELATED_ICONS = {
  Exam: GraduationCap,
  College: Building2,
  Course: BookOpen,
  Scholarship: Percent,
};

const RelatedCard = ({ kind, value }) => {
  const Icon = RELATED_ICONS[kind] || GraduationCap;

  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="flex items-center gap-1.5 text-ink-muted">
        <Icon size={14} />
        <span className="text-[0.6875rem] font-semibold uppercase tracking-wide">
          {kind}
        </span>
      </div>

      <p className="mt-1.5 truncate text-[0.8125rem] font-semibold text-ink">
        {value || 'Not related'}
      </p>
    </div>
  );
};

const KeyValue = ({ label, value }) => {
  if (!value) return null;

  return (
    <div>
      <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-0.5 text-[0.8125rem] font-semibold text-ink">{value}</p>
    </div>
  );
};

export default function EducationUpdateDetail() {
  const { id } = useParams();

  const [update, setUpdate] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(createApiUrl(`/education-updates/${id}`), { headers });
        const data = await res.json();
        setUpdate(data.data);
      } catch {
        setUpdate(null);
      }
    };

    load();
  }, [id]);

  const handleToggleSave = async () => {
    if (!update) return;

    try {
      const token = localStorage.getItem('userToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await fetch(createApiUrl(`/education-updates/${update._id}/save`), { method: 'POST', headers });
      setUpdate((current) => ({ ...current, isSaved: !current.isSaved }));
    } catch {
      // ignore
    }
  };

  if (!update) {
    return (
      <div className="edu-container py-10">
        <div className="edu-empty">
          <AlertTriangle size={22} className="text-red-500" />
          <p className="text-[0.8125rem] text-ink-muted">
            The update may have been unpublished or removed.
          </p>

          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            render={<Link to="/education-updates" />}
          >
            Back to Updates
          </Button>
        </div>
      </div>
    );
  }

  const related = relatedOf(update);
  const left = daysLeft(update.deadline);
  const paragraphs = String(update.content || '')
    .split(/\n{2,}/)
    .map((block) => stripHtml(block))
    .filter(Boolean);

  const modules = [
    { kind: 'Exam', value: update.examId?.name || update.examId?.shortName },
    { kind: 'College', value: update.collegeId?.name },
    { kind: 'Course', value: update.courseId?.fullName || update.courseId?.name },
    { kind: 'Scholarship', value: update.scholarshipId?.name },
  ];

  return (
    <div className="edu-container py-5 md:py-6">
      <nav className="edu-crumbs">
        <Link to="/education-updates" className="flex items-center gap-1">
          <ArrowLeft size={13} />
          Back to Updates
        </Link>
      </nav>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_290px]">
        <article className="edu-card overflow-hidden p-0">
          <div className={`relative flex h-44 items-end bg-gradient-to-br p-5 sm:h-56 ${toneOf(update)}`}>
            {update.thumbnail && (
              <img
                src={update.thumbnail}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            )}

            <div className="relative">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-white/75">
                {relatedKind(update)}
              </span>

              <p className="mt-1 text-2xl font-bold text-white">{related}</p>
            </div>

            {update.isImportant && (
              <span className="absolute right-4 top-4 rounded bg-red-500 px-2 py-0.5 text-[0.625rem] font-bold text-white">
                IMPORTANT
              </span>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <span className="edu-chip">{update.category}</span>

              {left !== null && left >= 0 && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.625rem] font-bold ${
                    left <= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <Clock size={11} />
                  {left === 0 ? 'Closes today' : `${left} day${left === 1 ? '' : 's'} left`}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-xl font-bold leading-snug text-ink sm:text-2xl">
              {update.title}
            </h1>

            {update.shortDescription && (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {update.shortDescription}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-y border-line py-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                Published {formatDate(update.publishedAt) || timeAgo(update.publishedAt)}
              </span>

              <span>Updated {timeAgo(update.updatedAt) || 'just now'}</span>
            </div>

            {paragraphs.length > 0 && (
              <>
                <h2 className="mt-6 text-base font-bold text-ink">Full Details</h2>

                <div className="mt-2 space-y-3 text-sm leading-7 text-ink-soft">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}

            {update.deadline && (
              <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-2 text-amber-800">
                  <AlertTriangle size={17} className="shrink-0" />

                  <div>
                    <h3 className="text-sm font-bold">Important Information</h3>

                    <p className="mt-1 text-xs leading-relaxed">
                      Last date: {formatDate(update.deadline)}.
                      {left !== null && left >= 0
                        ? ` That is ${left} day${left === 1 ? '' : 's'} from today.`
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="mt-6 text-base font-bold text-ink">Related Modules</h2>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {modules.map((module) => (
                <RelatedCard key={module.kind} kind={module.kind} value={module.value} />
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-3">
          <Button
            className="w-full"
            variant={update.isSaved ? 'outline' : 'default'}
            onClick={handleToggleSave}
          >
            <Bookmark size={15} fill={update.isSaved ? 'currentColor' : 'none'} />
            {update.isSaved ? 'Saved' : 'Save Update'}
          </Button>

          {update.officialLink && (
            <Button
              className="w-full"
              variant="outline"
              render={
                <a href={update.officialLink} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink size={15} />
              Official Website
            </Button>
          )}

          <div className="edu-card overflow-hidden">
            <div className="edu-panel-head">
              <h2 className="edu-panel-title">Quick Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 text-xs">
              <KeyValue label="Category" value={update.category} />
              <KeyValue label="Related" value={related} />
              <KeyValue label="Published" value={formatDate(update.publishedAt)} />
              <KeyValue label="Deadline" value={formatDate(update.deadline)} />
              <KeyValue label="Exam Date" value={formatDate(update.examDate)} />
              <KeyValue label="Result Date" value={formatDate(update.resultDate)} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
