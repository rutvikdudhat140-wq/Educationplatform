import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Search, List, LayoutGrid } from 'lucide-react';
import {
  PageHeader,
  AdminCard,
  FilterBar,
  AddButton,
  EditBtn,
  DeleteBtn,
  StatusBadge,
  EmptyRow,
} from '@/components/layout/AdminUI';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ExamEligibilityList() {
  const [eligibilities, setEligibilities] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchEligibilities = async () => {

      const res = await axios.get('/api/exam-eligibility');
      setEligibilities(res.data.examEligibilities || []);

  };

  useEffect(() => {
    fetchEligibilities();
  }, []);

  const handleDelete = async (id) => {

await axios.delete(`/api/exam-eligibility/${id}`);
      setEligibilities((prev) => prev.filter((e) => e._id !== id));

  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';

      await axios.put(
        `/api/exam-eligibility/${item._id}`,
        { status: newStatus }
      );
      setEligibilities((prev) =>
        prev.map((e) => (e._id === item._id ? { ...e, status: newStatus } : e))
      );

  };

  const filtered = eligibilities.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.exam?.name?.toLowerCase().includes(q) ||
      e.qualification?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-ink flex items-center gap-2">
          Exam Eligibility
        </h2>
      </div>

      <AdminCard>
        <FilterBar>
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by exam name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-surface border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

            <div className="ml-2">
              <AddButton onClick={() => navigate('/admin/exam-eligibility/add')} label="Add Eligibility" />
            </div>
          </div>
        </FilterBar>

        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>EXAM</TableHead>
              <TableHead>MIN AGE</TableHead>
              <TableHead>MAX AGE</TableHead>
              <TableHead>QUALIFICATION</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyRow colSpan={7} message="No eligibility records found." />
            ) : (
              filtered.map((item, idx) => (
                <TableRow key={item._id}>

                  <TableCell className="font-bold text-ink">
                    {item.exam?.name}
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {item.ageLimit || "—"}
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    —
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {item.minimumQualification || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(item)}
                      title="Click to toggle status"
                    >
                      <StatusBadge status={item.status || 'Active'} />
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <EditBtn onClick={() => navigate(`/admin/exam-eligibility/edit/${item._id}`)} />
                      <DeleteBtn onClick={() => handleDelete(item._id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-line flex items-center justify-between text-[13px] text-ink-muted">
          <div>Showing 1 to {filtered.length} of {filtered.length} records</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-line rounded-md hover:bg-surface text-ink-muted">&lt;</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium shadow-sm">1</button>
            <button className="px-3 py-1.5 border border-line rounded-md hover:bg-surface text-ink-muted">&gt;</button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
