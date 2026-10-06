import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronRight,
  TrendingUp,
  IndianRupee,
  GraduationCap,
  Compass,
  ArrowRight,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STREAMS = [
  "Engineering", "Technology", "Management", "Science", "Commerce",
  "Arts", "Education", "Agriculture", "Design", "Pharmacy",
  "Medical", "Law", "Hotel Management", "Computer Applications",
];

const STREAM_ICONS = {
  "Engineering": "⚙️", "Technology": "💻", "Management": "📊", "Science": "🔬",
  "Commerce": "💰", "Arts": "🎨", "Education": "📚", "Agriculture": "🌱",
  "Design": "✏️", "Pharmacy": "💊", "Medical": "🏥", "Law": "⚖️",
  "Hotel Management": "🏨", "Computer Applications": "🖥️",
};

export default function CareerExplorer() {
  const navigate = useNavigate();
  const [selectedStream, setSelectedStream] = useState("Engineering");
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/career`, {
          params: { stream: selectedStream },
        });
        setCareers(response.data?.careers || []);
      } catch (err) {
        console.error("Error fetching careers", err);
        setCareers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [selectedStream]);

  return (
    <div className="min-h-screen bg-surface pb-16 text-ink">
      {/* Page Header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-brand text-xs font-semibold mb-2.5">
              <Compass size={13} /> Career Roadmap Explorer
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
              Discover Careers & Educational Pathways
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-ink-muted leading-relaxed">
              Explore job roles, expected salaries, required degrees, and a step-by-step roadmap from school to senior positions.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stream Selector Tabs */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
            Choose Your Stream
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {STREAMS.map((stream) => {
              const isSelected = selectedStream === stream;
              return (
                <button
                  key={stream}
                  onClick={() => setSelectedStream(stream)}
                  className={`flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all ${
                    isSelected
                      ? "bg-brand text-white border-brand shadow-none"
                      : "bg-white text-ink border-line hover:border-brand/40 hover:bg-blue-50/20"
                  }`}
                >
                  <span className="text-xl mb-1">{STREAM_ICONS[stream] || "📖"}</span>
                  <span className="text-xs font-semibold line-clamp-1">{stream}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between border-b border-line pb-3 mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-ink">
                {selectedStream} Careers
              </h2>
              <span className="rounded bg-blue-50 text-brand text-xs font-semibold px-2 py-0.5">
                {careers.length} Roles
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-md border border-line bg-white p-4 animate-pulse space-y-3">
                  <div className="h-5 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : careers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {careers.map((career) => (
                <div
                  key={career._id}
                  onClick={() => navigate(`/careers/${career._id}`)}
                  className="group rounded-md border border-line bg-white p-4 shadow-none hover:border-brand/50 hover:bg-blue-50/10 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-ink group-hover:text-brand transition-colors line-clamp-1">
                        {career.name}
                      </h3>
                      {career.growthLevel && (
                        <span className="shrink-0 rounded bg-orange-50 text-accent text-[10px] font-semibold px-2 py-0.5 border border-orange-100">
                          {career.growthLevel}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4">
                      {career.shortDescription || career.description || `Explore entry requirements, roadmap, and salary insights for ${career.name}.`}
                    </p>
                  </div>

                  {/* Career Stats */}
                  <div className="pt-3 border-t border-line">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-ink-muted block">Salary Package</span>
                        <span className="font-bold text-brand flex items-center">
                          <IndianRupee size={12} className="mr-0.5" />
                          {career.salaryMin || 3} - {career.salaryMax || 12} {career.salaryUnit || "LPA"}
                        </span>
                      </div>

                      {career.educationLevel && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-ink-muted block">Min Degree</span>
                          <span className="font-semibold text-ink">{career.educationLevel}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-brand group-hover:translate-x-0.5 transition-transform pt-1">
                      <span>View Roadmap Journey</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-line bg-white p-10 text-center shadow-none">
              <Briefcase size={36} className="mx-auto text-ink-muted mb-2" />
              <h3 className="text-base font-bold text-ink">No career profiles currently listed for {selectedStream}</h3>
              <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-sm mx-auto">
                Check back shortly or choose another stream from above to explore high-demand pathways.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
