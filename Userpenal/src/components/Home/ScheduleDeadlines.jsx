import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CalendarX2, Clock3 } from 'lucide-react';
import { fetchEducationUpdates } from '@/lib/educationApi';

const toDateKey = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const DAYS_TO_SHOW = 7;

const buildDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return {
            date: d,
            dateKey: toDateKey(d),
            dayShort: d.toLocaleDateString('en-IN', { weekday: 'short' }),
            dayNum: d.getDate(),
            month: d.toLocaleDateString('en-IN', { month: 'short' }),
            isToday: i === 0,
            isTomorrow: i === 1,
        };
    });
};

const EVENT_FIELDS = [
    { field: 'deadline', label: 'Last Date', badge: 'bg-red-50 text-red-700 border-red-200' },
    { field: 'examDate', label: 'Exam Day', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { field: 'resultDate', label: 'Result', badge: 'bg-green-50 text-green-700 border-green-200' },
];

const subtitleFor = (item) =>
    item.examId?.shortName ||
    item.examId?.name ||
    item.collegeId?.name ||
    item.scholarshipId?.name ||
    item.courseId?.name ||
    item.category ||
    'Education Update';

const formatFullDay = (day) =>
    day.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

const relativeLabel = (day) => (day.isToday ? 'Today' : day.isTomorrow ? 'Tomorrow' : null);


export default function ScheduleDeadlines({ variant = 'mobile' }) {
    const navigate = useNavigate();
    const isDesktop = variant === 'desktop';
    const days = useMemo(buildDays, []);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [eventsByDay, setEventsByDay] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        fetchEducationUpdates({ sort: 'deadline', limit: 50 })
            .then(({ items }) => {
                if (!active) return;
                const grouped = {};
                items.forEach((item) => {
                    EVENT_FIELDS.forEach(({ field, label, badge }) => {
                        const key = item[field] ? toDateKey(item[field]) : null;
                        if (!key) return;
                        (grouped[key] = grouped[key] || []).push({
                            id: `${item._id}-${field}`,
                            updateId: item._id,
                            title: item.title,
                            subtitle: subtitleFor(item),
                            label,
                            badge,
                        });
                    });
                });
                setEventsByDay(grouped);
                setLoading(false);
            })
            .catch(() => {
                if (active) {
                    setEventsByDay({});
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    const selectedDay = days[selectedIndex];
    const selectedEvents = eventsByDay[selectedDay.dateKey] || [];
    const nextBusyIndex = days.findIndex((d, i) => i > selectedIndex && eventsByDay[d.dateKey]?.length);
    const countText = (n) => `${n} ${n === 1 ? 'deadline' : 'deadlines'}`;

    if (isDesktop) {
        const [first, ...rest] = selectedEvents;
        return (
            <div className="flex items-center w-full gap-4 sm:gap-6">

                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="flex size-7 items-center justify-center rounded-md bg-[#FFF7ED] text-[#EA580C]">
                            <Calendar size={14} />
                        </span>
                        <span className="text-[12px] font-bold text-[#172554] uppercase tracking-wide">
                            Deadlines
                        </span>
                    </div>

                    <div className="h-8 w-px bg-[#E2E8F0] hidden sm:block" />

                    <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
                        {days.map((day, idx) => {
                            const isSelected = selectedIndex === idx;
                            const count = eventsByDay[day.dateKey]?.length || 0;
                            return (
                                <button
                                    key={day.dateKey}
                                    type="button"
                                    onClick={() => setSelectedIndex(idx)}
                                    title={`${formatFullDay(day)} · ${countText(count)}`}
                                    className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all shrink-0 ${isSelected
                                        ? 'bg-[#172554] text-white shadow-md ring-2 ring-[#172554]/20'
                                        : 'bg-white border border-[#E2E8F0] text-slate-600 hover:border-[#CBD5E1] hover:bg-slate-50'
                                        }`}
                                >
                                    <span className={`text-[9px] font-bold uppercase tracking-wide ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                                        {day.isToday ? 'Today' : day.dayShort}
                                    </span>
                                    <span className={`text-[14px] font-extrabold leading-none mt-0.5 ${isSelected ? 'text-white' : 'text-[#172554]'}`}>
                                        {day.dayNum}
                                    </span>
                                    {count > 0 && (
                                        <span className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-[#F8FAFC] ${isSelected ? 'bg-[#F97316] text-white' : 'bg-[#FFF7ED] text-[#EA580C] border-white'
                                            }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>


                <div className="flex-1 min-w-0 bg-white rounded-lg border border-[#E2E8F0] px-3 py-2 flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] h-10">
                    {first ? (
                        <button
                            type="button"
                            onClick={() => navigate(`/education-updates/${first.updateId}`)}
                            className="group flex w-full items-center gap-2.5 text-left"
                        >
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 border ${first.badge}`}>
                                {first.label}
                            </span>
                            <span className="min-w-0 flex items-center gap-1.5">
                                <span className="truncate text-[12.5px] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors">
                                    {first.title}
                                </span>
                                <span className="shrink-0 text-[11px] text-slate-400 hidden lg:inline-block">
                                    — {first.subtitle}
                                </span>
                            </span>
                            {rest.length > 0 && (
                                <span className="ml-auto shrink-0 text-[10.5px] font-bold text-[#2563EB] bg-[#EFF6FF] rounded px-1.5 py-0.5">
                                    +{rest.length} more
                                </span>
                            )}
                        </button>
                    ) : (
                        <div className="flex w-full items-center justify-between text-[12.5px] text-slate-500">
                            <div className="flex items-center gap-2">
                                <CalendarX2 size={14} className="text-slate-400 shrink-0" />
                                <span>
                                    No deadlines on <strong className="text-[#172554]">{relativeLabel(selectedDay) || formatFullDay(selectedDay)}</strong>
                                </span>
                            </div>
                            {nextBusyIndex !== -1 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex(nextBusyIndex)}
                                    className="shrink-0 font-bold text-[#2563EB] hover:underline"
                                >
                                    Next: {days[nextBusyIndex].dayShort} {days[nextBusyIndex].dayNum} &rarr;
                                </button>
                            )}
                        </div>
                    )}
                </div>


                <button
                    type="button"
                    onClick={() => navigate('/education-updates?sort=deadline')}
                    className="shrink-0 flex items-center justify-center size-9 rounded-full bg-white border border-[#E2E8F0] text-[#172554] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-colors shadow-2xs"
                    title="View all deadlines"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        );
    }

    return (
        <div
            className={
                isDesktop
                    ? 'rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-5 space-y-4'
                    : 'bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-3 space-y-2.5 shadow-2xs'
            }
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <Calendar size={isDesktop ? 18 : 14} className="text-[#172554]" />
                    <span
                        className={`font-extrabold uppercase tracking-wider text-[#172554] ${isDesktop ? 'text-[0.875rem]' : 'text-[11.5px]'
                            }`}
                    >
                        Schedule &amp; Deadlines
                    </span>
                    <span className={`text-slate-500 font-medium ${isDesktop ? 'text-[0.75rem]' : 'text-[9.5px]'}`}>
                        · Next 7 days
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/education-updates?sort=deadline')}
                    className={`font-bold text-[#172554] hover:underline flex items-center gap-0.5 bg-white rounded border border-[#E2E8F0] shrink-0 ${isDesktop ? 'text-[0.8125rem] px-3 py-1' : 'text-[10.5px] px-2 py-0.5'
                        }`}
                >
                    <span>See All</span>
                    <ChevronRight size={12} />
                </button>
            </div>

            <div className={isDesktop ? 'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 items-start' : 'space-y-2.5'}>

                <div className={`flex justify-between items-stretch ${isDesktop ? 'gap-2' : 'gap-1'}`}>
                    {days.map((day, idx) => {
                        const isSelected = selectedIndex === idx;
                        const count = eventsByDay[day.dateKey]?.length || 0;
                        return (
                            <button
                                key={day.dateKey}
                                type="button"
                                onClick={() => setSelectedIndex(idx)}
                                aria-label={`${formatFullDay(day)}, ${countText(count)}`}
                                className={`flex-1 rounded-[6px] flex flex-col items-center justify-center transition-all cursor-pointer ${isDesktop ? 'py-2.5' : 'py-1.5'
                                    } ${isSelected
                                        ? 'bg-[#172554] text-white shadow-xs ring-2 ring-[#172554]/20'
                                        : 'bg-white border border-[#E2E8F0] text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span
                                    className={`uppercase leading-tight ${isDesktop ? 'text-[0.6875rem]' : 'text-[9px]'} ${isSelected ? 'text-white/90' : 'text-slate-400'
                                        }`}
                                >
                                    {day.isToday ? 'Today' : day.dayShort}
                                </span>
                                <span className={`leading-tight font-extrabold mt-0.5 ${isDesktop ? 'text-[1.0625rem]' : 'text-[12px]'}`}>
                                    {day.dayNum}
                                </span>

                                <span className="h-3.5 mt-0.5 flex items-center">
                                    {count > 0 && (
                                        <span
                                            className={`min-w-3.5 h-3.5 px-1 rounded-full text-[8.5px] font-bold leading-none flex items-center justify-center ${isSelected ? 'bg-[#F97316] text-white' : 'bg-[#FFF7ED] text-[#EA580C]'
                                                }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>


                <div className={`bg-white rounded-md border border-[#E2E8F0] space-y-2 ${isDesktop ? 'p-3.5' : 'p-2.5'}`}>
                    <div
                        className={`flex items-center justify-between gap-2 font-bold text-[#172554] ${isDesktop ? 'text-[0.875rem]' : 'text-[11px]'
                            }`}
                    >
                        <span className="flex items-center gap-1 min-w-0">
                            <Clock3 size={isDesktop ? 14 : 12} className="text-[#F97316] shrink-0" />
                            <span className="truncate">{formatFullDay(selectedDay)}</span>
                            {relativeLabel(selectedDay) && (
                                <span className="text-[9.5px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                    {relativeLabel(selectedDay)}
                                </span>
                            )}
                        </span>
                        {!loading && (
                            <span
                                className={`shrink-0 font-semibold px-1.5 py-0.5 rounded ${isDesktop ? 'text-[0.6875rem]' : 'text-[9.5px]'
                                    } ${selectedEvents.length ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-slate-100 text-slate-500'}`}
                            >
                                {countText(selectedEvents.length)}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="space-y-1.5">
                            {[0, 1].map((i) => (
                                <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
                            ))}
                        </div>
                    ) : selectedEvents.length > 0 ? (
                        <div className={`space-y-1.5 ${isDesktop ? 'max-h-56 overflow-y-auto pr-1' : ''}`}>
                            {selectedEvents.map((ev) => (
                                <button
                                    type="button"
                                    key={ev.id}
                                    onClick={() => navigate(`/education-updates/${ev.updateId}`)}
                                    className="w-full text-left flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-slate-100"
                                >
                                    <div className="min-w-0 pr-2">
                                        <p className={`font-bold text-[#172554] truncate ${isDesktop ? 'text-[0.8125rem]' : 'text-[11px]'}`}>
                                            {ev.title}
                                        </p>
                                        <p className={`text-slate-500 truncate ${isDesktop ? 'text-[0.6875rem]' : 'text-[9.5px]'}`}>
                                            {ev.subtitle}
                                        </p>
                                    </div>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${ev.badge}`}>
                                        {ev.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center py-2 gap-1">
                            <CalendarX2 size={isDesktop ? 20 : 16} className="text-slate-300" />
                            <p className={`text-slate-500 ${isDesktop ? 'text-[0.8125rem]' : 'text-[10.5px]'}`}>
                                No deadlines on this day.
                            </p>
                            {nextBusyIndex !== -1 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex(nextBusyIndex)}
                                    className={`font-semibold text-[#2563EB] hover:underline ${isDesktop ? 'text-[0.75rem]' : 'text-[10px]'}`}
                                >
                                    Next: {formatFullDay(days[nextBusyIndex])} →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
