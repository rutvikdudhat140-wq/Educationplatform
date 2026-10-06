import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Search, List, LayoutGrid, Clock } from 'lucide-react';
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

export default function ExamSessionList() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchSessions = async () => {

      const res = await axios.get('/api/exam-session');
      setSessions(res.data.examSessions || []);

  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {

      await axios.delete(`/api/exam-session/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));

  };

  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.exam?.name?.toLowerCase().includes(q) ||
      s.sessionName?.toLowerCase().includes(q) ||
      String(s.year).includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-ink flex items-center gap-2">
         Exam Sessions
        </h2>
      </div>

      <AdminCard>
        <FilterBar>

<div className="flex  items-center gap-3 w-full ">

            <div className="ml-2">
              <AddButton onClick={() => navigate('/admin/exam-session/add')} label="Add Exam Session" />
            </div>
          </div>
        </FilterBar>

        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>EXAM</TableHead>
              <TableHead>SESSION NAME</TableHead>
              <TableHead>YEAR</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyRow colSpan={6} message="No exam sessions found." />
            ) : (
              filtered.map((session) => (
                <TableRow key={session._id}>

                  <TableCell className="font-bold text-ink">
                    {session.exam?.name }
                  </TableCell>
                  <TableCell className="text-ink-muted font-medium">
                    {session.sessionName }
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {session.year}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={session.status || 'Active'} />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <EditBtn onClick={() => navigate(`/admin/exam-session/edit/${session._id}`)} />
                      <DeleteBtn onClick={() => handleDelete(session._id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-line flex items-center justify-between text-[13px] text-ink-muted">
          <div>Showing 1 to {filtered.length} of {filtered.length} exam sessions</div>
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
