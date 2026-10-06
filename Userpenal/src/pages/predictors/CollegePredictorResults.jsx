import { useEffect, useState } from "react";
import { createApiUrl } from '@/lib/api';
import { Link, useSearchParams } from "react-router-dom";
import {
    Building2,
    MapPin,
    X,
    CheckCircle2,
    Download,
    ChevronRight,
    ChevronUp,
    ArrowLeft,
    Star,
    Layers,
    SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CollegePredictorResults() {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [recommendedColleges, setRecommendedColleges] = useState([]);

    useEffect(() => {
        if (showModal) {
            fetch(createApiUrl('/college'))
                .then((r) => r.json())
                .then((response) => {
                    setRecommendedColleges(response.data?.colleges?.slice(0, 4) || []);
                });
        }
    }, [showModal]);

    useEffect(() => {
        const payload = {
            examId: searchParams.get("examId"),
            examSessionId: searchParams.get("examSessionId"),
            rank: Number(searchParams.get("rank")),
            category: searchParams.get("category"),
            gender: searchParams.get("gender"),
            quota: searchParams.get("quota"),
        };

        if (searchParams.get("courseIds")) payload.courseIds = searchParams.get("courseIds");
        if (searchParams.get("city")) payload.city = searchParams.get("city");
        if (searchParams.get("state")) payload.state = searchParams.get("state");

        fetch(createApiUrl('/college-predictor'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((r) => r.json())
            .then((response) => {
                setResults(response.data?.results || []);
            });
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-surface pb-20 text-ink">
            {/* Header / Hero */}
            <div className="border-b border-line bg-white">
                <div className="mx-auto max-w-5xl px-4 py-6">
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-ink-muted">
                        <Link to="/college-predictor" className="flex items-center gap-1 hover:text-ink">
                            <ArrowLeft size={13} /> Edit Parameters
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-ink">Prediction Results</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-ink">College Prediction Results</h1>
                            <p className="text-xs text-ink-muted mt-0.5">Institutions matching your rank and category profile</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="rounded bg-blue-50 text-brand px-2.5 py-1 text-xs font-semibold border border-blue-100">
                                Rank: {Number(searchParams.get("rank") || 0).toLocaleString()}
                            </span>
                            <span className="rounded bg-surface px-2.5 py-1 text-xs font-semibold border border-line text-ink">
                                {searchParams.get("category") || 'OPEN'}
                            </span>
                            <span className="rounded bg-surface px-2.5 py-1 text-xs font-semibold border border-line text-ink">
                                {searchParams.get("quota") || 'All'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {results.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
                            <h2 className="text-base font-bold text-ink">
                                Predicted Admissions ({results.length})
                            </h2>
                            <span className="text-xs text-ink-muted">Sorted by Cutoff Closeness</span>
                        </div>

                        <div className="space-y-4">
                            {results.map((item) => (
                                <div key={item.collegeId} className="rounded-md border border-line bg-white p-5 shadow-none hover:border-brand/40 transition-colors">
                                    {/* College Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-line pb-3 mb-3">
                                        <div>
                                            <h3 className="text-base font-bold text-ink">
                                                {item.collegeName || "Engineering Institution"}
                                            </h3>
                                            <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                                                <MapPin size={12} /> {item.location || 'Campus Location'}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/colleges/${item.collegeId}`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline shrink-0"
                                        >
                                            View College <ChevronRight size={13} />
                                        </Link>
                                    </div>

                                    {/* Course & Cutoff Info */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-ink mb-2">
                                            {item.courseName || "B.Tech / B.E. Program"}
                                        </h4>

                                        {/* Round Info Chips */}
                                        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                                            <span className="rounded bg-surface px-2 py-0.5 border border-line font-medium text-ink">
                                                Round {item.round || 1}
                                            </span>
                                            <span className="rounded bg-surface px-2 py-0.5 border border-line font-medium text-ink">
                                                Historical Closing: <strong className="text-brand">{item.historicalClosingRank?.toLocaleString() || "18,993"}</strong>
                                            </span>
                                            <span className="rounded bg-blue-50 text-brand px-2 py-0.5 text-[10px] font-bold border border-blue-100">
                                                {item.quota === 'HOME_STATE' ? 'Home State Quota' : (item.quota === 'ALL' ? 'All India Quota' : 'Other State Quota')}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 pt-3 border-t border-line">
                                            <Link to={`/apply?collegeId=${item.collegeId}`} className="flex-1">
                                                <Button className="w-full rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-semibold h-9 shadow-none">
                                                    Apply Now
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowModal(true)}
                                                className="flex-1 rounded-md border-line text-xs font-semibold h-9 shadow-none"
                                            >
                                                Download Cutoff Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-md border border-line bg-white px-5 py-10 text-center">
                        <p className="text-sm font-semibold text-ink">No matching colleges found</p>
                        <p className="mt-1 text-xs text-ink-muted">Try adjusting your prediction parameters.</p>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-md bg-white border border-line shadow-lg overflow-hidden">
                        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-surface">
                            <h3 className="text-sm font-bold text-ink">Brochure & Cutoff Guide</h3>
                            <button onClick={() => setShowModal(false)} className="text-ink-muted hover:text-ink">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 text-xs">
                            <div className="flex items-start gap-3 rounded bg-blue-50 p-3 border border-blue-100">
                                <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-ink">Cutoff information sent</p>
                                    <p className="text-ink-muted mt-0.5">The detailed round-by-round opening and closing rank report has been forwarded.</p>
                                </div>
                            </div>

                            {recommendedColleges.length > 0 && (
                                <div>
                                    <p className="font-bold text-ink mb-2 uppercase tracking-wider text-[10px] text-ink-muted">Similar Recommended Campuses</p>
                                    <div className="space-y-2">
                                        {recommendedColleges.slice(0, 3).map((college, idx) => (
                                            <div key={college._id || idx} className="flex items-center justify-between p-2 rounded border border-line bg-surface">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-ink truncate">{college.name}</p>
                                                    <p className="text-[10px] text-ink-muted truncate">{college.location?.city || 'Location'}</p>
                                                </div>
                                                <Link to={`/colleges/${college._id}`}>
                                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-brand hover:text-brand-dark">
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-md border-line text-xs font-semibold h-8"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
