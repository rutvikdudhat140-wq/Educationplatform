import { useEffect, useState } from "react";
import axios from "axios";

const CollegeRankingTab = ({ college }) => {
  const [rankings, setRankings] = useState([]);


  useEffect(() => {
    if (!college?._id) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/rankings/college/${college._id}`)
      .then((res) => {
        setRankings(res.data.rankings || []);
      });
  }, [college?._id]);


  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase text-ink-muted">
          Ranking
        </p>

        <h2 className="mt-1 text-xl font-bold text-ink">
          {college?.name}
        </h2>

        {rankings[0]?.description && (
          <p className="mt-2 text-sm text-ink-muted">
            {rankings[0].description}
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-surface">
              <th className="px-4 py-3 text-left font-semibold">
                Ranking Body
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Ranking Name
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Category
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Year
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Rank
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Score
              </th>
            </tr>
          </thead>

          <tbody>
            {rankings.map((ranking) => (
              <tr
                key={ranking._id}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3 text-ink-muted">
                  {ranking.rankingBody}
                </td>

                <td className="px-4 py-3 text-ink-muted">
                  {ranking.rankingName}
                </td>

                <td className="px-4 py-3 text-ink-muted">
                  {ranking.category}
                </td>

                <td className="px-4 py-3 text-ink-muted">
                  {ranking.year}
                </td>

                <td className="px-4 py-3 font-semibold text-ink">
                  {ranking.rank ||
                    ranking.rankFrom ||
                    ranking.rankTo
                    ? ranking.rankType === "Range"
                      ? `${ranking.rankFrom || ""}-${ranking.rankTo || ""}`
                      : ranking.rank
                    : "—"}
                </td>

                <td className="px-4 py-3 text-ink-muted">
                  {ranking.score
                    ? `${ranking.score}${ranking.scoreOutOf
                      ? ` / ${ranking.scoreOutOf}`
                      : ""
                    }`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rankings.some(
        (ranking) => ranking.indicators?.length > 0
      ) && (
          <div className="mt-6">
            <h3 className="mb-3 text-base font-semibold text-ink">
              Indicator Scores
            </h3>

            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-surface">
                    <th className="px-4 py-3 text-left font-semibold">
                      Indicator
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Score
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rankings.flatMap((ranking) =>
                    (ranking.indicators || []).map((indicator, index) => (
                      <tr
                        key={`${ranking._id}-${index}`}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 text-ink-muted">
                          {indicator.name}
                        </td>

                        <td className="px-4 py-3 text-ink-muted">
                          {indicator.score}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default CollegeRankingTab;
