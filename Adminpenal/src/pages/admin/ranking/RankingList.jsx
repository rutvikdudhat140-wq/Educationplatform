import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RankingList = () => {
  const navigate = useNavigate();

  const [rankings, setRankings] = useState([]);

  const fetchRankings = async () => {
    const res = await axios.get("/api/rankings/admin/list");

    setRankings(res.data.rankings || []);
  };

  const deleteRanking = async (id) => {

    await axios.delete(`/api/rankings/admin/delete/${id}`);

    fetchRankings();
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-line overflow-hidden">

<div className="p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Rankings
          </h2>
          <p className="text-xs text-ink-muted">
            Manage college rankings
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/ranking/add")}
          className="bg-brand hover:bg-brand-dark text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
        >
          Add Ranking
        </button>
      </div>

<Table>
        <TableHeader>
          <TableRow>
            <TableHead>COLLEGE</TableHead>
            <TableHead>RANKING BODY</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>YEAR</TableHead>
            <TableHead>RANK</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rankings.map((ranking) => (
            <TableRow key={ranking._id}>

              <TableCell>
                <span className="font-medium text-ink">
                  {ranking.collegeId?.name}
                </span>
              </TableCell>

              <TableCell>
                {ranking.rankingBody}
              </TableCell>

              <TableCell>
                {ranking.category}
              </TableCell>

              <TableCell>
                {ranking.year}
              </TableCell>

              <TableCell className="font-semibold">
                {ranking.rank}
              </TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-[11px] font-medium ${ranking.status === "Active"
                      ? "bg-green-100 text-brand"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {ranking.status || "Inactive"}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/ranking/edit/${ranking._id}`)
                    }
                    className="py-1 px-5 border"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteRanking(ranking._id)}
                    className="border py-1 px-5"
                  >
                    Delete
                  </button>

                </div>
              </TableCell>

            </TableRow>
          ))}

        </TableBody>
      </Table>

    </div>
  );
};

export default RankingList;
