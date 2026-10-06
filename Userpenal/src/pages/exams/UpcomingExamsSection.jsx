import { useEffect, useState } from "react";
import axios from "axios";
import UpcomingExamCard from "./UpcomingExamCard";

const API_BASE = "http://localhost:5001";

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

const SHOW_LIMIT = 6;

export default function UpcomingExamsSection({ view = "upcoming", search = "", compact = false, selectedStreams = [] }) {
    const config = VIEW_CONFIG[view] || VIEW_CONFIG.upcoming;

    const [exams, setExams] = useState([]);


    useEffect(() => {


        axios
            .get(`${API_BASE}${config.endpoint}`)
            .then((res) => {
                setExams(res.data?.data || []);
            })
            .catch(() => {

            })

    }, [view, config.endpoint]);

    const visibleExams = exams.filter((item) => {
        const exam = item?.exam;
        const term = search.toLowerCase();

        const matchesSearch =
            exam?.name?.toLowerCase().includes(term) ||
            exam?.shortName?.toLowerCase().includes(term) ||
            exam?.conductingBody?.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        if (selectedStreams.length === 0) return true;

        return selectedStreams.includes(exam?.stream);
    });





    if (visibleExams.length === 0) {
        return (
            <div className="space-y-4">
                <div className="mb-5 flex items-center gap-3 rounded-xl border bg-white px-4 py-4">
                    <span className="text-sm font-medium">Filters</span>
                    <span className="text-sm text-muted-foreground">0 exams found</span>
                </div>
                <div className="rounded-xl border border-dashed bg-white p-12 text-center">
                    <h2 className="font-semibold">No exams available.</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mb-5 flex items-center gap-3 rounded-xl border bg-white px-4 py-4">
                <span className="text-sm font-medium">Filters</span>
                <span className="text-sm text-muted-foreground">{visibleExams.length} exams found</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
