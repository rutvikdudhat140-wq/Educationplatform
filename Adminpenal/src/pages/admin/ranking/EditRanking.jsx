import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const EditRanking = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [colleges, setColleges] = useState([]);

  const [form, setForm] = useState({
    collegeId: "",
    rankingBody: "",
    rankingName: "",
    year: "",
    category: "",
    rankType: "Numeric",
    rank: "",
    rankFrom: "",
    rankTo: "",
    score: "",
    scoreOutOf: "",
    description: "",
    status: "Active",
    indicators: [],
    trend: [],
  });

  useEffect(() => {
    axios
      .get("/api/college")
      .then((res) => {
        setColleges(res.data.colleges || []);
      });

    axios
      .get(`/api/rankings/admin/single/${id}`)
      .then((res) => {
        const ranking = res.data.ranking;

        setForm({
          collegeId: ranking.collegeId?._id || ranking.collegeId || "",
          rankingBody: ranking.rankingBody || "",
          rankingName: ranking.rankingName || "",
          year: ranking.year || "",
          category: ranking.category || "",
          rankType: ranking.rankType || "Numeric",
          rank: ranking.rank ?? "",
          rankFrom: ranking.rankFrom ?? "",
          rankTo: ranking.rankTo ?? "",
          score: ranking.score ?? "",
          scoreOutOf: ranking.scoreOutOf ?? "",
          description: ranking.description || "",
          status: ranking.status || "Active",
          indicators: ranking.indicators || [],
          trend: ranking.trend || [],
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addIndicator = () => {
    setForm({
      ...form,
      indicators: [
        ...form.indicators,
        {
          name: "",
          score: "",
          scoreOutOf: "",
        },
      ],
    });
  };

  const removeIndicator = (index) => {
    setForm({
      ...form,
      indicators: form.indicators.filter((_, i) => i !== index),
    });
  };

  const updateIndicator = (index, field, value) => {
    const indicators = [...form.indicators];

    indicators[index][field] = value;

    setForm({
      ...form,
      indicators,
    });
  };

  const addTrend = () => {
    setForm({
      ...form,
      trend: [
        ...form.trend,
        {
          year: "",
          indiaRank: "",
          globalRank: "",
        },
      ],
    });
  };

  const removeTrend = (index) => {
    setForm({
      ...form,
      trend: form.trend.filter((_, i) => i !== index),
    });
  };

  const updateTrend = (index, field, value) => {
    const trend = [...form.trend];

    trend[index][field] = value;

    setForm({
      ...form,
      trend,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      `/api/rankings/admin/update/${id}`,
      form);

    navigate("/admin/ranking/list");
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Edit Ranking
        </h2>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/ranking/list")}
        >
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <Card className="p-5 space-y-4">

          <h3 className="font-semibold text-ink">
            Basic Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label>College *</Label>

              <select
                name="collegeId"
                value={form.collegeId}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              >
                <option value="">Select College</option>

                {colleges.map((college) => (
                  <option
                    key={college._id}
                    value={college._id}
                  >
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Ranking Body *</Label>

              <input
                name="rankingBody"
                value={form.rankingBody}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="e.g. NIRF"
              />
            </div>

            <div>
              <Label>Ranking Name *</Label>

              <input
                name="rankingName"
                value={form.rankingName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="e.g. Overall Ranking"
              />
            </div>

            <div>
              <Label>Year *</Label>

              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="2027"
              />
            </div>

            <div>
              <Label>Category</Label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="Overall"
              />
            </div>

            <div>
              <Label>Status</Label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label>Rank Type</Label>

              <select
                name="rankType"
                value={form.rankType}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              >
                <option value="Numeric">Numeric</option>
                <option value="Range">Range</option>
              </select>
            </div>

            {form.rankType === "Numeric" ? (
              <div>
                <Label>Rank</Label>

                <input
                  name="rank"
                  type="number"
                  value={form.rank}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  placeholder="526"
                />
              </div>
            ) : (
              <>
                <div>
                  <Label>Rank From</Label>

                  <input
                    name="rankFrom"
                    type="number"
                    value={form.rankFrom}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    placeholder="691"
                  />
                </div>

                <div>
                  <Label>Rank To</Label>

                  <input
                    name="rankTo"
                    type="number"
                    value={form.rankTo}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    placeholder="700"
                  />
                </div>
              </>
            )}

            <div>
              <Label>Score</Label>

              <input
                name="score"
                type="number"
                step="0.01"
                value={form.score}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="31.1"
              />
            </div>

            <div>
              <Label>Score Out Of</Label>

              <input
                name="scoreOutOf"
                type="number"
                value={form.scoreOutOf}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                placeholder="100"
              />
            </div>

          </div>

          <div>
            <Label>Description</Label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              placeholder="Write about this ranking..."
            />
          </div>

        </Card>

        {/* Indicator Scores */}
        <Card className="p-5 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink">
              Indicator Scores
            </h3>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIndicator}
            >
              Add Indicator
            </Button>
          </div>

          {form.indicators.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_160px_120px_auto] gap-3 items-end"
            >
              <div>
                <Label>Indicator Name</Label>

                <input
                  value={item.name || ""}
                  onChange={(e) =>
                    updateIndicator(index, "name", e.target.value)
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  placeholder="Academic Reputation"
                />
              </div>

              <div>
                <Label>Score</Label>

                <input
                  type="number"
                  value={item.score ?? ""}
                  onChange={(e) =>
                    updateIndicator(index, "score", e.target.value)
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <Label>Out Of</Label>

                <input
                  type="number"
                  value={item.scoreOutOf ?? ""}
                  onChange={(e) =>
                    updateIndicator(index, "scoreOutOf", e.target.value)
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  placeholder="100"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="text-red-600"
                onClick={() => removeIndicator(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          {form.indicators.length === 0 && (
            <p className="text-sm text-ink-muted">
              No indicator scores added.
            </p>
          )}

        </Card>

        {/* Ranking Trend */}
        <Card className="p-5 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink">
              Ranking Trend by Year
            </h3>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTrend}
            >
              Add Trend
            </Button>
          </div>

          {form.trend.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr_auto] gap-3 items-end"
            >
              <div>
                <Label>Year</Label>

                <input
                  type="number"
                  value={item.year ?? ""}
                  onChange={(e) =>
                    updateTrend(index, "year", e.target.value)
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <Label>India Rank</Label>

                <input
                  value={item.indiaRank || ""}
                  onChange={(e) =>
                    updateTrend(index, "indiaRank", e.target.value)
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  placeholder="13"
                />
              </div>

              <div>
                <Label>Global Rank</Label>

                <input
                  value={item.globalRank || ""}
                  onChange={(e) =>
                    updateTrend(index, "globalRank", e.target.value)
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  placeholder="526"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="text-red-600"
                onClick={() => removeTrend(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          {form.trend.length === 0 && (
            <p className="text-sm text-ink-muted">
              No ranking trend added.
            </p>
          )}

        </Card>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button type="submit">
            Update Ranking
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/ranking/list")}
          >
            Cancel
          </Button>
        </div>

      </form>
    </div>
  );
};

export default EditRanking;
