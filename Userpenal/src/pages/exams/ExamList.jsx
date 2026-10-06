import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ExamCard from "./ExamCard";
import UpcomingExamsSection from "./UpcomingExamsSection";

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
        <section className="min-h-screen bg-[#fafafa]">

            {/* Header */}
            <div className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                    <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Back</span>
                        <span>Home</span>
                        <span className="font-medium text-foreground">
                            Entrance Exams
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold">{pageTitle}</h1>

                    <p className="mt-1 text-sm text-muted-foreground">Stay updated with exam dates, eligibility, syllabus and preparation tips
                    </p>
                    <div className="mt-4 flex max-w-2xl gap-2">
                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search exams..."
                                className="h-10 rounded-lg pl-9" />
                        </div>

                        <button className="h-10 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground">Search                </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                <div className="grid gap-6 lg:grid-cols-[255px_1fr]">

                    <aside className="h-fit rounded-xl border bg-white lg:sticky lg:top-24">

                        <div className="flex items-center gap-2 border-b px-4 py-4">
                            <SlidersHorizontal className="size-4" />

                            <h2 className="text-sm font-semibold">Filters</h2>
                        </div>
                        <div className="border-b px-4 py-5">

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold">Status</h3>
                            </div>

                            <div className="space-y-1 text-sm">
                                {VIEWS.map((view) => (
                                    <button
                                        key={view.id}
                                        type="button"
                                        onClick={() => setActiveView(view.id)}
                                        className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition ${activeView === view.id
                                            ? "bg-teal-50 text-teal-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        {view.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="px-4 py-5">

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold">Stream</h3>
                                {!allStreams && (
                                    <button
                                        type="button"
                                        onClick={clearStreams}
                                        className="text-xs font-medium text-teal-700 hover:underline"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="max-h-72 space-y-3 overflow-y-auto pr-2 text-sm text-muted-foreground">
                                <label
                                    className="flex cursor-pointer items-center gap-2 font-medium"
                                >
                                    <input
                                        type="checkbox"
                                        checked={allStreams}
                                        onChange={handleAllStreamsChange}
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-teal-700 focus:ring-teal-700"
                                    />
                                    All Streams
                                </label>

                                <div className="border-t border-slate-200 my-2 -mx-2"></div>

                                {STREAMS.map((stream) => (
                                    <label
                                        key={stream}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStreams.includes(stream)}
                                            onChange={() => handleStreamToggle(stream)}
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-teal-700 focus:ring-teal-700"
                                            disabled={allStreams}
                                        />
                                        {stream}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>
                    <main>
                        {activeView === "all" ? (
                            <>
                                <div className="mb-5 flex items-center gap-3 rounded-xl border bg-white px-4 py-4">
                                    <SlidersHorizontal className="size-4 text-muted-foreground" />

                                    <span className="text-sm font-medium"> Filters</span>

                                    <span className="text-sm text-muted-foreground">{filteredExams.length} exams found</span>
                                </div>
                                {filteredExams.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                                        {filteredExams.map((exam) => (
                                            <ExamCard
                                                key={exam._id}
                                                exam={exam}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed bg-white p-12 text-center">
                                        <h2 className="font-semibold">No exams available.</h2>

                                        <p className="mt-1 text-sm text-muted-foreground">Try searching for another exam or adjust your filters.</p>
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
