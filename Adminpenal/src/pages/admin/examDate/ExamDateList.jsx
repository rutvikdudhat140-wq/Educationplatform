import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Search, List, LayoutGrid, Calendar } from 'lucide-react';
import {
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

export default function ExamDateList() {
  const [examDates, setExamDates] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchExamDates = async () => {

      const res = await axios.get('/api/exam-date');
      setExamDates(res.data.examDates || []);

  };

  useEffect(() => {
    fetchExamDates();
  }, []);

  const handleDelete = async (id) => {

await axios.delete(`/api/exam-date/${id}`);
      setExamDates((prev) => prev.filter((d) => d._id !== id));

  };

  const formatDate = (dateStr) => {

    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filtered = examDates.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.exam?.name?.toLowerCase().includes(q) ||
      d.examSession?.sessionName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-ink flex items-center gap-2">
          <Calendar className="text-pink-500" /> Exam Dates
        </h2>
      </div>

      <AdminCard>
        <FilterBar>
          <div className="relative w-full md:w-64">

            <input
              type="text"
              placeholder="Search by exam or session..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-surface border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

            <div className="ml-2">
              <AddButton onClick={() => navigate('/admin/exam-date/add')} label="Add Exam Date" />
            </div>
          </div>
        </FilterBar>

        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>EXAM & SESSION</TableHead>
              <TableHead>REGISTRATION</TableHead>
              <TableHead>EXAM DATES</TableHead>
              <TableHead>ADMIT CARD & RESULT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyRow colSpan={7} message="No exam dates found." />
            ) : (
              filtered.map((examDate) => (
                <TableRow key={examDate._id}>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-ink">{examDate.exam?.name }</span>
                      <span className="text-[11px] text-ink-muted">{examDate.examSession?.sessionName }</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    <div className="flex flex-col text-[12px]">
                      <span><strong className="text-ink-muted font-medium">Start:</strong> {formatDate(examDate.registrationStartDate)}</span>
                      <span><strong className="text-ink-muted font-medium">End:</strong> {formatDate(examDate.registrationEndDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    <div className="flex flex-col text-[12px]">
                      <span><strong className="text-ink-muted font-medium">Start:</strong> {formatDate(examDate.examStartDate)}</span>
                      <span><strong className="text-ink-muted font-medium">End:</strong> {formatDate(examDate.examEndDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    <div className="flex flex-col text-[12px]">
                      <span><strong className="text-ink-muted font-medium">Admit Card:</strong> {formatDate(examDate.admitCardDate)}</span>
                      <span><strong className="text-ink-muted font-medium">Result:</strong> {formatDate(examDate.resultDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={examDate.status || 'Active'} />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <EditBtn onClick={() => navigate(`/admin/exam-date/edit/${examDate._id}`)} />
                      <DeleteBtn onClick={() => handleDelete(examDate._id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-line flex items-center justify-between text-[13px] text-ink-muted">
          <div>Showing 1 to {filtered.length} of {filtered.length} exam dates</div>
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
