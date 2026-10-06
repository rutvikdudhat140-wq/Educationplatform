import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CalendarDays,
  MapPin,
  ChevronRight,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatDate = (value) => {
  if (!value) return 'Date TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date TBA';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const computeExamStatus = (exam) => {
  const dates = exam.dates?.[0];
  if (!dates) return { label: 'Upcoming', color: 'bg-blue-50 text-blue-700 border-blue-200' };

  const now = new Date();
  const regEnd = dates.registrationEndDate ? new Date(dates.registrationEndDate) : null;
  const examStart = dates.examStartDate ? new Date(dates.examStartDate) : null;
  const examEnd = dates.examEndDate ? new Date(dates.examEndDate) : examStart;

  if (examEnd && examEnd < now) {
    return { label: 'Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
  if (regEnd) {
    const diffDays = Math.ceil((regEnd - now) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 5) {
      return { label: 'Closing Soon', color: 'bg-orange-50 text-accent border-orange-200' };
    }
    if (diffDays > 5) {
      return { label: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  }
  return { label: 'Upcoming', color: 'bg-blue-50 text-blue-700 border-blue-200' };
};

export default function ExamCard({ exam }) {
  const examDate = exam.dates?.[0];
  const eligibility = exam.eligibility?.[0];
  const pattern = exam.patterns?.[0] || exam.pattern;
  const statusInfo = computeExamStatus(exam);

  return (
    <div className="group rounded-md border border-line bg-white p-4 shadow-none hover:border-brand/40 transition-all flex flex-col justify-between h-full">
      <div>
        {/* Top bar: Short Code/Icon, Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand font-bold text-xs border border-blue-100 uppercase">
              {exam.shortName ? exam.shortName.slice(0, 3) : (exam.name?.slice(0, 3) || 'EXM')}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink group-hover:text-brand transition-colors truncate">
                {exam.name}
              </h3>
              {exam.conductingBody && (
                <p className="text-[11px] text-ink-muted truncate">
                  By {exam.conductingBody}
                </p>
              )}
            </div>
          </div>

          <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] text-ink-muted">
          {exam.stream && (
            <span className="rounded bg-surface px-2 py-0.5 border border-line">
              {exam.stream}
            </span>
          )}
          {exam.level && (
            <span className="rounded bg-surface px-2 py-0.5 border border-line">
              {exam.level}
            </span>
          )}
          {exam.examType && (
            <span className="rounded bg-surface px-2 py-0.5 border border-line">
              {exam.examType}
            </span>
          )}
        </div>

        {/* Essential Info List */}
        <div className="space-y-1.5 text-xs text-ink-muted py-2 border-t border-line/60">
          {/* Exam Dates */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-ink-muted">
              <CalendarDays size={13} className="text-brand shrink-0" /> Exam Date:
            </span>
            <span className="font-semibold text-ink">
              {formatDate(examDate?.examStartDate)}
            </span>
          </div>

          {/* Registration Deadline */}
          {examDate?.registrationEndDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Clock size={13} className="text-brand shrink-0" /> Reg. Deadline:
              </span>
              <span className="font-medium text-ink">
                {formatDate(examDate.registrationEndDate)}
              </span>
            </div>
          )}

          {/* Exam Specs (Duration / Questions / Marks) if present */}
          {(pattern?.duration || pattern?.totalQuestions || pattern?.totalMarks) && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-ink-muted">Pattern:</span>
              <span className="font-medium text-ink">
                {pattern?.duration ? `${pattern.duration} • ` : ''}
                {pattern?.totalQuestions ? `${pattern.totalQuestions} Qs • ` : ''}
                {pattern?.totalMarks ? `${pattern.totalMarks} Marks` : ''}
              </span>
            </div>
          )}

          {/* Eligibility */}
          {eligibility?.minimumQualification && (
            <div className="pt-1">
              <span className="text-ink-muted block text-[11px]">Eligibility:</span>
              <p className="text-ink font-medium text-[11px] line-clamp-1">
                {eligibility.minimumQualification}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-3 border-t border-line">
        <Link to={`/exams/${exam._id}`} className="block w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-md border-line text-xs font-semibold h-8 text-brand hover:bg-blue-50/50 hover:border-brand/40 shadow-none flex items-center justify-center gap-1"
          >
            View Exam Details <ChevronRight size={13} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
