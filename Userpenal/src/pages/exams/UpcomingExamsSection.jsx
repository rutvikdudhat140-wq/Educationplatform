import { useEffect, useState } from "react";
import axios from "axios";
import UpcomingExamCard from "./UpcomingExamCard";
import EmptyState from "@/components/ui/empty-state";
import { Calendar } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") : "http://localhost:5001");

const VIEW_CONFIG = {
    upcoming: {
        label: "Upcoming",
        endpoint: "/api/exam-date/upcoming",
        empty: "No upcoming exams available.",
    },
    ongoing: {
        label: "Ongoing",
        endpoint: "/api/exam-date/ongoing",
        empty: "No ongoing exams available.",
    },
    completed: {
        label: "Completed",
        endpoint: "/api/exam-date/completed",
        empty: "No completed exams available.",
    },
};

export default function UpcomingExamsSection({ view = "upcoming", search = "", compact = false, selectedStreams = [] }) {
    const config = VIEW_CONFIG[view] || VIEW_CONFIG.upcoming;

    const [exams, setExams] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_BASE}${config.endpoint}`)
            .then((res) => {
                const data = res.data?.data || [];
                if (data.length > 0) {
                    setExams(data);
                } else {
                   
                    axios.get(`${API_BASE}/api/exam`).then((examRes) => {
                        const allExams = examRes.data?.data || [];
                        const formatted = allExams.map((ex) => ({
                            _id: ex._id,
                            exam: ex,
                            applicationStartDate: ex.applicationStartDate || new Date().toISOString(),
                            applicationEndDate: ex.applicationEndDate || new Date(Date.now() + 30 * 86400000).toISOString(),
                            examDate: ex.examDate || new Date(Date.now() + 45 * 86400000).toISOString(),
                        }));
                        setExams(formatted);
                    }).catch(() => setExams([]));
                }
            })
            .catch(() => {
                axios.get(`${API_BASE}/api/exam`).then((examRes) => {
                    const allExams = examRes.data?.data || [];
                    const formatted = allExams.map((ex) => ({
                        _id: ex._id,
                        exam: ex,
                        applicationStartDate: ex.applicationStartDate || new Date().toISOString(),
                        applicationEndDate: ex.applicationEndDate || new Date(Date.now() + 30 * 86400000).toISOString(),
                        examDate: ex.examDate || new Date(Date.now() + 45 * 86400000).toISOString(),
                    }));
                    setExams(formatted);
                }).catch(() => setExams([]));
            });
    }, [view, config.endpoint]);

    const visibleExams = exams.filter((item) => {
        const exam = item?.exam || item;
        const term = search.toLowerCase();

        const matchesSearch =
            !term ||
            exam?.name?.toLowerCase().includes(term) ||
            exam?.shortName?.toLowerCase().includes(term) ||
            exam?.conductingBody?.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        if (selectedStreams.length === 0) return true;

        return selectedStreams.includes(exam?.stream);
    });

    if (visibleExams.length === 0) {
        return (
            <div className="space-y-3.5">
                {!compact && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-white px-4 py-3">
                        <span className="text-[0.8125rem] font-semibold text-ink">
                            Filters
                        </span>
                        <span className="text-[0.8125rem] text-ink-muted">
                            0 exams found
                        </span>
                    </div>
                )}

                <EmptyState
                    title="No exams available"
                    description="Try adjusting your filters or search criteria to view exam schedules."
                    icon={Calendar}
                />
            </div>
        );
    }
    return (
        <div className="space-y-3.5">
            {!compact && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-white px-4 py-3">
                    <span className="text-[0.8125rem] font-semibold text-ink">
                        Filters
                    </span>
                    <span className="text-[0.8125rem] text-ink-muted">
                        {visibleExams.length} exams found
                    </span>
                </div>
            )}

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleExams.map((item) => (
                    <UpcomingExamCard
                        key={item._id}
                        examDate={item}
                        status={config.label}
                        compact={compact}
                    />
                ))}
            </div>
        </div>
    );
}
