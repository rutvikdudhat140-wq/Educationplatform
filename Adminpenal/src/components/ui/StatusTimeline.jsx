import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  Lightbulb, 
  PhoneCall, 
  XCircle, 
  FileText,
  MessageSquare
} from 'lucide-react';

const getEventConfig = (status) => {
  const s = status?.toLowerCase() || '';
  if (s.includes('request')) return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' };
  if (s.includes('assign')) return { icon: UserCheck, color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-200' };
  if (s.includes('progress')) return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' };
  if (s.includes('schedule')) return { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' };
  if (s.includes('recommend')) return { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-200' };
  if (s.includes('follow-up') || s.includes('follow')) return { icon: PhoneCall, color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' };
  if (s.includes('complete')) return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-brand-soft', border: 'border-brand-border' };
  if (s.includes('close') || s.includes('cancel')) return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' };
  return { icon: MessageSquare, color: 'text-ink-muted', bg: 'bg-brand-softest', border: 'border-line' };
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

/**
 * StatusTimeline - Professional Dynamic Activity Feed
 * Maps exactly to the events recorded in statusHistory
 */
const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-ink-muted">No activity recorded yet.</p>
      </div>
    );
  }

  // Sort chronologically (oldest first, newest at the bottom)
  const sortedHistory = [...statusHistory].sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));

  return (
    <div className="space-y-0 py-2">
      {sortedHistory.map((history, idx) => {
        const isLast = idx === sortedHistory.length - 1;
        const config = getEventConfig(history.status);
        const Icon = config.icon;

        return (
          <div key={idx} className="flex gap-4 group">
            {/* Left: icon + line */}
            <div className="flex flex-col items-center">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                border-2 ${config.border} ${config.bg} z-10 transition-transform group-hover:scale-110
              `}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              {!isLast && (
                <div className="w-[2px] flex-1 bg-brand-soft my-1 min-h-[30px]" />
              )}
            </div>

            {/* Right: content */}
            <div className={`flex-1 ${isLast ? 'pb-2' : 'pb-6'} pt-1.5`}>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">
                    {history.status}
                  </span>
                  {isLast && (
                    <span className="text-[10px] font-bold bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Latest
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-ink-muted">
                  {formatDate(history.changedAt)}
                </span>
              </div>

              {history.note && (
                <div className="mt-2.5 bg-surface border border-line rounded-lg p-2.5 shadow-sm">
                  <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">
                    {history.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
