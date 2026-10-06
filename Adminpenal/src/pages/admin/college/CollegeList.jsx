import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Building } from "lucide-react";

import {
  AdminCard,
  AddButton,
  StatusBadge,
  EmptyRow,
} from "@/components/layout/AdminUI";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@base-ui/react";

const CollegeList = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const getColleges = async (pageNum) => {
    const response = await axios.get(`/api/college?page=${pageNum}&limit=${limit}`);

    setColleges(response.data.colleges || []);
    setTotalPages(response.data.totalPages || 1);
  };

  const deleteCollege = async (id) => {
    await axios.delete(`/api/college/${id}`);

    getColleges(page);
  };

  useEffect(() => {
    getColleges(page);
  }, [page]);

  return (
    <div className="space-y-6">

<div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-ink flex items-center gap-2">
          <Building className="text-pink-500" />
          College List
        </h2>
      </div>

      <AdminCard>

        {/* Add Button */}
        <div className="p-4 flex justify-end">
          <AddButton
            onClick={() => navigate("/admin/college/add")}
            label="Add College"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>COLLEGE NAME</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>CITY</TableHead>
              <TableHead>TOP COLLEGE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right pr-6">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {colleges.length === 0 ? (
              <EmptyRow
                colSpan={7}
                message="No colleges found."
              />
            ) : (
              colleges.map((college) => (
                <TableRow key={college._id}>

                  <TableCell>
                    <span className="font-bold text-ink">
                      {college.name}
                    </span>
                  </TableCell>

                  <TableCell className="text-ink-muted">
                    {college.category}
                  </TableCell>

                  <TableCell className="text-ink-muted">
                    {college.collegeType}
                  </TableCell>

                  <TableCell className="text-ink-muted">
                    {college.location?.city}
                  </TableCell>

                  <TableCell>
                    {college.isTopCollege ? (
                      <span className="text-amber-500 font-bold text-[11px] bg-amber-50 px-2 rounded-sm border border-amber-200">
                        YES
                      </span>
                    ) : (
                      <span className="text-ink-muted font-medium text-[11px]">
                        NO
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={college.status || "Inactive"}
                    />
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">

<Button onClick={() =>
                        navigate(
                          `/admin/college/edit/${college._id}`
                        )
                      } className="border py-1 px-5">Edit</Button>

<Button onClick={() => deleteCollege(college._id)} className="border py-1 px-5">Delete</Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminCard>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-[12px] border border-line rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
          <button
            key={pNum}
            onClick={() => setPage(pNum)}
            className={`px-3 py-1 text-[12px] border border-line rounded ${
              pNum === page
                ? "bg-brand text-white"
                : "hover:bg-brand-softest"
            }`}
          >
            {pNum}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-[12px] border border-line rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CollegeList;

