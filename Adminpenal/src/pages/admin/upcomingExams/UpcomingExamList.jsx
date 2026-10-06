import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Search, CalendarDays, Clock3, FileText } from 'lucide-react';
import {
    AdminCard,
    FilterBar,
    PageHeader,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function UpcomingExamList() {
    const navigate = useNavigate();
    const [examDates, setExamDates] = useState([]);
    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchExamDates = async () => {
        try {
            const res = await axios.get('/api/exam-date');
            setExamDates(res.data.examDates || []);
        } catch {} finally {
            setLoading(false);
        }
    };

    const fetchExams = async () => {
        try {
            const res = await axios.get('/api/exam');
            setExams(res.data.exams || []);
        } catch {}
    };

    useEffect(() => {
        fetchExamDates();
        fetchExams();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/exam-date/${id}`);
            setExamDates((prev) => prev.filter((d) => d._id !== id));
        } catch {}
    };

    const toggleStatus = async (examDate) => {
        try {
            await axios.put(
                `/api/exam-date/${examDate._id}`,
                { status: examDate.status === 'Active' ? 'Inactive' : 'Active' });
            fetchExamDates();
        } catch {}
    };

    const getExamName = (examId) => {
        if (!examId) return 'N/A';
        const exam = exams.find((e) => e._id === examId);
        return exam?.name || 'N/A';
    };

    const getExamShortName = (examId) => {
        if (!examId) return 'N/A';
        const exam = exams.find((e) => e._id === examId);
        return exam?.shortName || '';
    };

    const getExamStream = (examId) => {
        if (!examId) return 'N/A';
        const exam = exams.find((e) => e._id === examId);
        return exam?.stream || 'N/A';
    };

    const getExamLevel = (examId) => {
        if (!examId) return 'N/A';
        const exam = exams.find((e) => e._id === examId);
        return exam?.level || 'N/A';
    };

    const getExamType = (examId) => {
        if (!examId) return 'N/A';
        const exam = exams.find((e) => e._id === examId);
        return exam?.examType || 'N/A';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const filtered = examDates.filter((d) => {
        const q = search.toLowerCase();
        const examName = getExamName(d.exam).toLowerCase();
        const shortName = getExamShortName(d.exam).toLowerCase();
        const sessionName = d.examSession?.sessionName?.toLowerCase() || '';

        const matchesSearch =
            examName.includes(q) ||
            shortName.includes(q) ||
            sessionName.includes(q);

        if (!matchesSearch) return false;

        if (statusFilter === 'all') return true;
        if (statusFilter === 'active') return d.status === 'Active';
        if (statusFilter === 'inactive') return d.status === 'Inactive';
        return true;
    });

    const upcomingCount = examDates.filter((d) => {
        const examStart = d.examStartDate ? new Date(d.examStartDate) : null;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return examStart && examStart >= tomorrow && d.status === 'Active';
    }).length;

    const ongoingCount = examDates.filter((d) => {
        const examStart = d.examStartDate ? new Date(d.examStartDate) : null;
        const examEnd = d.examEndDate ? new Date(d.examEndDate) : null;
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return examStart && examEnd && examStart < tomorrow && examEnd >= today && d.status === 'Active';
    }).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">
                        Upcoming <span className="text-brand">Exams</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage upcoming, ongoing, and completed exam schedules
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/exam-date/add')}>
                    Add Exam Date
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <AdminCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-softest flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{upcomingCount}</p>
                            <p className="text-xs text-muted-foreground">Upcoming</p>
                        </div>
                    </div>
                </AdminCard>
                <AdminCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Clock3 className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{ongoingCount}</p>
                            <p className="text-xs text-muted-foreground">Ongoing</p>
                        </div>
                    </div>
                </AdminCard>
                <AdminCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{examDates.length}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                    </div>
                </AdminCard>
            </div>

            <AdminCard>
                <FilterBar>
                    <div className="relative w-full md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                            type="text"
                            placeholder="Search by exam or session..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-[13px] bg-surface border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-[13px] bg-surface border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <div className="ml-2">
                            <AddButton onClick={() => navigate('/admin/exam-date/add')} label="Add Exam Date" />
                        </div>
                    </div>
                </FilterBar>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>EXAM</TableHead>
                            <TableHead>STREAM</TableHead>
                            <TableHead>LEVEL</TableHead>
                            <TableHead>EXAM TYPE</TableHead>
                            <TableHead>SESSION</TableHead>
                            <TableHead>EXAM DATES</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead className="text-right pr-6">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-ink-muted">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <EmptyRow colSpan={8} message="No exam dates found." />
                        ) : (
                            filtered.map((examDate) => (
                                <TableRow key={examDate._id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-ink">
                                                {getExamName(examDate.exam)}
                                            </span>
                                            {getExamShortName(examDate.exam) && (
                                                <span className="text-[11px] text-ink-muted">
                                                    {getExamShortName(examDate.exam)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-ink-muted">
                                        {getExamStream(examDate.exam)}
                                    </TableCell>
                                    <TableCell className="text-ink-muted">
                                        {getExamLevel(examDate.exam)}
                                    </TableCell>
                                    <TableCell className="text-ink-muted">
                                        {getExamType(examDate.exam)}
                                    </TableCell>
                                    <TableCell className="text-ink-muted">
                                        {examDate.examSession?.sessionName || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-ink-muted">
                                        <div className="flex flex-col text-[12px]">
                                            <span>
                                                <strong className="text-ink-muted font-medium">Start:</strong>{' '}
                                                {formatDate(examDate.examStartDate)}
                                            </span>
                                            <span>
                                                <strong className="text-ink-muted font-medium">End:</strong>{' '}
                                                {formatDate(examDate.examEndDate)}
                                            </span>
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
