import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import {
    Building2,
    MapPin,
    X,
    CheckCircle2,
    Download,
    ChevronRight,
    ChevronUp
} from "lucide-react";

export default function CollegePredictorResults() {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [recommendedColleges, setRecommendedColleges] = useState([]);

    useEffect(() => {
        if (showModal) {
            axios.get("http://localhost:5001/api/college").then((response) => {
                setRecommendedColleges(response.data.colleges?.slice(0, 4) || []);
            }).catch(() => { });
        }
    }, [showModal]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
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

                const response = await axios.post("http://localhost:5001/api/college-predictor", payload);
                setResults(response.data.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-[#1e1b4b] text-white py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">College Predictor Results</h1>
                    <p className="text-indigo-200">Based on your rank and preferences</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 mt-8">
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading results...</div>
                ) : (
                    <>
                        {results.length > 0 && (
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">Recommended Colleges</h2>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                Rank: {Number(searchParams.get("rank") || 0).toLocaleString()}
                                            </span>
                                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {searchParams.get("category")}
                                            </span>
                                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {searchParams.get("gender")}
                                            </span>
                                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {searchParams.get("quota")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center shadow-sm">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        {results.length} Colleges Found
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {results.map((item) => (
                                        <div key={item.collegeId} className="bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            {/* Header Section */}
                                            <div className="p-4 border-b border-gray-200 flex justify-between items-start bg-white">

                                                <Link
                                                    to={`/colleges/${item.collegeId}`}
                                                    className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-0.5 mt-1 shrink-0"
                                                >
                                                    View Details <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>

                                            {/* Body Section */}
                                            <div className="p-4">
                                                {/* Course Info */}
                                                <h4 className="font-bold text-lg text-black mb-1.5">
                                                    {item.courseName || "B.E. in Information Technology"}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-4">
                                                    <span className="font-medium">4.2</span>
                                                    <span className="text-orange-400 text-[15px] tracking-widest">★★★★<span className="text-gray-300">★</span></span>
                                                    <span className="text-teal-600">(70)</span>
                                                    <span className="text-gray-400 mx-1">|</span>
                                                    <span>₹ {item.fees || "4,990"}</span>
                                                </div>

                                                {/* Round Info */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span className="border border-black px-2 py-0.5 rounded-sm text-black font-medium text-xs">JEE Main</span>
                                                        <span>Round <span className="font-bold text-black">{item.round || 1}</span></span>
                                                        <span className="text-gray-400">|</span>
                                                        <span>Rank <span className="font-bold text-black">{item.studentRank?.toLocaleString() || "1055"}</span></span>
                                                        <span className="bg-red-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm ml-1">
                                                            {item.quota === 'HOME_STATE' ? 'HS' : (item.quota === 'ALL' ? 'AI' : 'OS')}
                                                        </span>
                                                    </div>
                                                    <button className="bg-slate-100 text-black text-sm font-medium px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-slate-200 transition-colors">
                                                        All Rounds <ChevronUp className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Table */}
                                                <div className="border border-gray-300 rounded-sm overflow-hidden mb-5">
                                                    <table className="w-full text-sm text-center">
                                                        <thead className="border-b border-gray-300 bg-white">
                                                            <tr>
                                                                <th className="py-2.5 px-4 font-bold text-black border-r border-gray-300 w-1/2">Round</th>
                                                                <th className="py-2.5 px-4 font-bold text-black w-1/2">Closing Rank '24</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="bg-blue-50/40">
                                                                <td className="py-2.5 px-4 border-r border-gray-300 text-gray-800 font-medium">{item.round || 1}</td>
                                                                <td className="py-2.5 px-4 text-gray-800 font-medium">{item.historicalClosingRank?.toLocaleString() || "18,993"}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-4">
                                                    <button className="flex-1 py-2 px-4 border border-teal-600 text-teal-600 font-bold rounded-md hover:bg-teal-50 transition-colors text-[15px]">
                                                        Shortlist
                                                    </button>
                                                    <button
                                                        onClick={() => setShowModal(true)}
                                                        className="flex-1 py-2 px-4 bg-[#0F766E] text-white font-bold rounded-md hover:bg-orange-600 transition-colors shadow-sm text-[15px]"
                                                    >
                                                        Download Brochure
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.length === 0 && (
                            <div className="bg-white rounded-2xl border p-10 text-center mt-8 shadow-sm">
                                <p className="text-slate-500 text-lg font-medium">No colleges found for this rank.</p>
                                <p className="text-slate-400 text-sm mt-2">Try another rank, category, or quota.</p>
                                <Link to="/college-predictor" className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                                    Go Back
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </main>


            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <h3 className="text-base font-semibold text-slate-900">
                                Brochure Emailed
                            </h3>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5">

                            {/* Success */}
                            <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">
                                        Brochure has been mailed to youremail@gmail.com
                                    </h4>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        B.Tech. in Computer Science and Engineering has been added
                                        to your shortlist.
                                    </p>
                                </div>
                            </div>

                            {/* Recommended Colleges */}
                            {recommendedColleges.length > 0 && (
                                <div className="mt-5">
                                    <h4 className="mb-3 text-sm font-semibold text-slate-900">
                                        You may also be interested in
                                    </h4>

                                    <div className="space-y-2">
                                        {recommendedColleges.slice(0, 3).map((college, idx) => {

                                            const location =
                                                typeof college.location === "object"
                                                    ? [
                                                        college.location?.city,
                                                        college.location?.state,
                                                        college.location?.country,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")
                                                    : college.location;

                                            return (
                                                <div
                                                    key={college._id || idx}
                                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                                                >
                                                    <div className="min-w-0">
                                                        <h5 className="truncate text-sm font-semibold text-slate-800">
                                                            {college.name || "Engineering College"}
                                                        </h5>

                                                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {location || college.city || "Location"}
                                                            </span>

                                                            <span>
                                                                ★ {college.rating || "4.2"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="ml-3 flex shrink-0 items-center gap-1.5 rounded-md bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        Brochure
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Close */}
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}




        </div>
    );
}
