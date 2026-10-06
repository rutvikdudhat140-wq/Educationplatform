import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

const VIEWS = [
  { key: "all", label: "Overview" },
  { key: "top", label: "Top Colleges" },
  { key: "table", label: "Ranking Table" },
];

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [topColleges, setTopColleges] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "all";

  const setView = (next) => {
    setSearchParams(next === "all" ? {} : { view: next }, { replace: true });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/rankings`)
      .then((res) => {
        setRankings(res.data.rankings || []);
      });

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/rankings/top-colleges`)
      .then((res) => {
        setTopColleges(res.data.data || []);
      });
  }, []);

  const showTopColleges = view !== "table";
  const showRankingTable = view !== "top";

  return (
    <div className="min-h-screen bg-surface">

      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">

          <div className="mb-4 flex items-center gap-2 text-[12px] text-ink-muted">
            <Link to="/" className="hover:text-white">Home</Link>

            <ChevronRight size={13} />
            <span className="text-white">College Rankings</span>
          </div>

          <div className="max-w-2xl">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-ink-muted">
              <Trophy size={13} />College Rankings
            </div>

            <h1 className="text-2xl font-bold leading-tight text-white md:text-4xl">Top College Rankings in India</h1>

            <p className="mt-3 text-[13px] leading-6 text-ink-muted md:text-[14px]">Explore college rankings, ranking bodies, categories,
              scores and student review based rankings.
            </p>

          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">

        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-line pb-4">
          {VIEWS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setView(item.key)}
              aria-pressed={view === item.key}
              className={`rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                view === item.key
                  ? "bg-brand text-white"
                  : "border border-line bg-white text-ink-soft hover:bg-surface"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="mb-6 rounded-lg border border-line bg-white p-4 md:p-5">

          <h2 className="mb-2 text-lg font-bold text-ink md:text-xl">About College Rankings</h2>

          <p className="text-[13px] leading-6 text-ink-muted">
            College rankings provide information about the position
            of colleges across different ranking bodies and categories.
            This page brings together available ranking information
            along with student review based college rankings.
          </p>

          <p className="mt-2 text-[13px] leading-6 text-ink-muted">
            Check the ranking body, ranking year, category, rank and
            available score information for each college.
          </p>

        </section>

        {showTopColleges && topColleges.length > 0 && (
          <section className="mb-7">

            <div className="mb-3 flex items-center gap-2">

              <Trophy size={18} className="text-yellow-500" />

              <div>
                <h2 className="text-lg font-bold text-ink md:text-xl">Top College</h2>
                <p className="mt-0.5 text-[11px] text-ink-muted">Based on available student review ratings</p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              {topColleges.map((college) => (
                <div
                  key={college.collegeId}
                  className="overflow-hidden rounded-lg border border-line bg-white"
                >
                  <div className="h-1 bg-brand" />

                  <div className="p-4">

                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface p-1.5">
                          <img
                            src={`http://localhost:5001${college.logo}`}
                            alt={college.collegeName}
                            className="max-h-full max-w-full object-contain"
                          />
                      </div>

                      <div className="text-right">

                        <div className="text-[9px] uppercase text-ink-muted">Rank</div>

                        <div className="text-xl font-bold text-brand">{college.rank}</div>
                      </div>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-[14px] font-bold text-ink">{college.collegeName}</h3>

                    {(college.location?.city ||
                      college.location?.state) && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-ink-muted">

                        <MapPin size={12} />

                        {college.location?.city
                          ? `${college.location.city}, `
                          : ""}

                        {college.location?.state}

                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-line pt-3">

                      <div className="flex items-center gap-1 text-[12px] font-semibold text-ink">
                        <Star
                          size={13}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {college.averageRating} / 5
                      </div>

                      <div className="text-[11px] text-ink-muted">
                        {college.reviewCount}{" "}
                        {college.reviewCount === 1
                          ? "Review"
                          : "Reviews"}
                      </div>

                    </div>

                    <Link
                      to={`/colleges/${college.collegeId}`}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-brand py-2 text-[12px] font-medium text-white hover:bg-ink"
                    >
                      View College
                      <ArrowRight size={13} />
                    </Link>

                  </div>
                </div>
              ))}

            </div>
          </section>
        )}

        {/* Rankings */}
        {showRankingTable && (
          <section className="mb-6 overflow-hidden rounded-lg border border-line bg-white">

          <div className="border-b border-line p-4">

            <h2 className="text-lg font-bold text-ink md:text-xl">
              College Ranking
            </h2>

            <p className="mt-0.5 text-[11px] text-ink-muted">
              Ranking information from available ranking data
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-[12px]">

              <thead>
                <tr className="bg-surface">

                  <th className="border-b border-line px-4 py-3 text-left font-semibold text-ink">
                    College
                  </th>

                  <th className="border-b border-line px-4 py-3 text-left font-semibold text-ink">
                    Ranking Body
                  </th>

                  <th className="border-b border-line px-4 py-3 text-left font-semibold text-ink">
                    Category
                  </th>

                  <th className="border-b border-line px-4 py-3 text-left font-semibold text-ink">
                    Year
                  </th>

                  <th className="border-b border-line px-4 py-3 text-left font-semibold text-ink">
                    Rank
                  </th>

                  <th className="border-b border-line px-4 py-3 text-right font-semibold text-ink">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {rankings.map((ranking) => (
                  <tr
                    key={ranking._id}
                    className="hover:bg-surface"
                  >

                    <td className="border-b border-line px-4 py-3">

                      <Link
                        to={`/colleges/${
                          ranking.collegeId?._id || ranking.collegeId
                        }`}
                        className="font-semibold text-ink hover:text-brand"
                      >
                        {ranking.collegeId?.name || "Unknown College"}
                      </Link>

                    </td>

                    <td className="border-b border-line px-4 py-3 text-ink-muted">
                      {ranking.rankingBody || "—"}
                    </td>

                    <td className="border-b border-line px-4 py-3 text-ink-muted">
                      {ranking.category || "—"}
                    </td>

                    <td className="border-b border-line px-4 py-3 text-ink-muted">
                      {ranking.year || "—"}
                    </td>

                    <td className="border-b border-line px-4 py-3">

                      <span className="font-bold text-brand">
                        {ranking.rankType === "Range"
                          ? `${ranking.rankFrom ?? "—"}-${ranking.rankTo ?? "—"}`
                          : ranking.rank ?? "—"}
                      </span>

                    </td>

                    <td className="border-b border-line px-4 py-3 text-right">

                      <Link
                        to={`/colleges/${
                          ranking.collegeId?._id || ranking.collegeId
                        }`}
                        className="inline-flex items-center gap-1 rounded bg-brand px-2.5 py-1.5 text-[11px] text-white hover:bg-ink"
                      >
                        View
                        <ArrowRight size={12} />
                      </Link>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
          </section>
        )}

        {/* Bottom */}
        <section className="rounded-lg bg-ink p-5 md:p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-bold text-white">
                Explore College Details
              </h2>

              <p className="mt-1 max-w-xl text-[12px] text-ink-muted">
                Check courses, admissions, fees, placements,
                reviews and other information for colleges.
              </p>

            </div>

            <Link
              to="/colleges"
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-white px-4 py-2 text-[12px] font-semibold text-brand hover:bg-brand-softest"
            >
              Explore Colleges
              <ArrowRight size={13} />
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
};

export default RankingPage;
