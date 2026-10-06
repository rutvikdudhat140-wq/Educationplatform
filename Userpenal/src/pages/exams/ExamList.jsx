import { ArrowLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ExamCard from "./ExamCard";
import UpcomingExamsSection from "./UpcomingExamsSection";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VIEWS = [
    {
        id: "all",
        label: "All Exams",
        title: "All Entrance Exams",
    },
    {
        id: "upcoming",
        label: "Upcoming Exams",
        title: "Upcoming Entrance Exams",
    },
    {
        id: "ongoing",
        label: "Ongoing Exams",
        title: "Ongoing Entrance Exams",
    },
    {
        id: "completed",
        label: "Completed Exams",
        title: "Completed Entrance Exams",
    },
];

const STREAMS = [
    "Engineering",
    "Management",
    "Medical",
    "Sciences",
    "Commerce & Banking",
    "Arts & Humanities",
    "Law",
    "Design",
    "Hotel Management",
    "Information Technology",
    "Mass Communication",
    "Agriculture",
    "Pharmacy",
    "Dental",
    "Performing Arts",
    "Education",
];

export default function ExamList() {
    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState("");
    const [activeView, setActiveView] = useState("all");
    const [allStreams, setAllStreams] = useState(true);
    const [selectedStreams, setSelectedStreams] = useState([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:5001/api/exam").then((res) => {
            setExams(res.data.exams || []);
        });
    }, []);

    const toggleStream = (stream) => {
        setSelectedStreams((prev) =>
            prev.includes(stream)
                ? prev.filter((s) => s !== stream)
                : [...prev, stream]
        );
    };

    const handleAllStreamsChange = (e) => {
        if (!e.target.checked) {
            setAllStreams(false);
        }
    };

    const handleStreamToggle = (stream) => {
        if (allStreams) setAllStreams(false);
        toggleStream(stream);
    };

    const clearStreams = () => {
        setAllStreams(true);
        setSelectedStreams([]);
    };

    const filteredExams = exams.filter((exam) => {
        const matchesSearch =
            exam.name?.toLowerCase().includes(search.toLowerCase()) ||
            exam.shortName?.toLowerCase().includes(search.toLowerCase()) ||
            exam.conductingBody?.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (allStreams) return true;

        return selectedStreams.includes(exam.stream);
    });

    const activeViewConfig = VIEWS.find((v) => v.id === activeView);
    const pageTitle = activeViewConfig?.title || "Entrance Exams";

    return (
        <section className="min-h-screen bg-[#F7F8FC]">

            {/* Header */}
            <div className="edu-page-head">
                <div className="edu-container">

                    <div className="edu-breadcrumb">
                        <Link
                            to="/"
                            className="edu-breadcrumb-link"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </Link>

                        <ChevronRight className="size-3.5 text-line-strong" />

                        <span className="font-semibold text-ink">
                            Entrance Exams
                        </span>
                    </div>

                    <h1 className="edu-h1 mt-2.5">{pageTitle}</h1>

                    <p className="mt-1.5 max-w-2xl text-[0.8125rem] text-ink-muted">
                        Stay updated with exam dates, eligibility, syllabus and
                        preparation tips
                    </p>

                    <div className="mt-3.5 flex max-w-2xl gap-2">
                        <div className="relative flex-1">

                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                            />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search exams..."
                                className="pl-9"
                            />
                        </div>

                        <Button
                            type="button"
                            className="shrink-0"
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            <div className="edu-container py-3 md:py-6">

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[15rem_1fr] lg:gap-6">

                    {/* Mobile Filter Toggle Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                            className="flex w-full items-center justify-between rounded-md bg-white border border-line px-4 py-2 text-xs font-semibold text-ink shadow-none"
                        >
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-brand" />
                                Filters & Streams
                            </div>
                            <ChevronRight className={`size-4 transition-transform ${isMobileFilterOpen ? "rotate-90" : ""}`} />
                        </button>
                    </div>

                    <aside className={`lg:sticky lg:top-24 lg:self-start ${isMobileFilterOpen ? "block" : "hidden"} lg:block`}>
                        <div className="rounded-md border border-line bg-white shadow-none overflow-hidden">

                            <div className="border-b border-line px-4 py-3 hidden lg:block">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal size={14} className="text-brand" />
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                                        Filters
                                    </h2>
                                </div>
                            </div>

                            <div className="border-b border-line px-4 py-3">

                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                                        Status
                                    </h3>
                                </div>

                                <div className="space-y-1">
                                    {VIEWS.map((view) => (
                                        <button
                                            key={view.id}
                                            type="button"
                                            onClick={() => setActiveView(view.id)}
                                            className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${activeView === view.id
                                                ? "bg-blue-50 text-brand font-semibold"
                                                : "text-ink-muted hover:bg-surface hover:text-ink"
                                                }`}
                                        >
                                            {view.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-3">

                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                                        Stream
                                    </h3>

                                    {!allStreams && (
                                        <button
                                            type="button"
                                            onClick={clearStreams}
                                            className="text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-56 lg:max-h-72 space-y-0.5 overflow-y-auto pr-1">
                                    <label className="flex items-center gap-2 py-1 text-xs text-ink cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={allStreams}
                                            onChange={handleAllStreamsChange}
                                            className="size-3.5 shrink-0 cursor-pointer accent-brand"
                                        />

                                        <span className="font-semibold text-ink">
                                            All Streams
                                        </span>
                                    </label>

                                    <div className="my-1.5 h-px bg-line" />

                                    {STREAMS.map((stream) => (
                                        <label
                                            key={stream}
                                            className={`flex items-center gap-2 py-1 text-xs cursor-pointer ${allStreams ? "opacity-55" : ""}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStreams.includes(stream)}
                                                onChange={() => handleStreamToggle(stream)}
                                                className="size-3.5 shrink-0 cursor-pointer accent-brand"
                                                disabled={allStreams}
                                            />

                                            <span className="text-ink-muted hover:text-ink truncate">
                                                {stream}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
                            <p className="text-[0.8125rem] text-ink-muted">
                                Showing{' '}
                                <span className="font-semibold text-ink">
                                    {filteredExams.length}
                                </span>{' '}
                                {filteredExams.length === 1 ? 'exam' : 'exams'}
                            </p>

                            {!allStreams && selectedStreams.length > 0 && (
                                <span className="edu-chip text-[11px] px-2 py-0.5">
                                    {selectedStreams.length}{' '}
                                    {selectedStreams.length === 1 ? 'stream' : 'streams'}{' '}
                                    selected
                                </span>
                            )}
                        </div>

                        {activeView === "all" ? (
                            <>
                                {filteredExams.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-3.5 xl:grid-cols-3">

                                        {filteredExams.map((exam) => (
                                            <ExamCard
                                                key={exam._id}
                                                exam={exam}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="edu-empty">
                                        <h2 className="text-[0.9375rem] font-semibold text-ink">
                                            No exams available.
                                        </h2>

                                        <p className="text-[0.8125rem] text-ink-muted">
                                            Try searching for another exam or
                                            adjust your filters.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <UpcomingExamsSection
                                view={activeView}
                                search={search}
                                selectedStreams={allStreams ? [] : selectedStreams}
                            />
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
}
