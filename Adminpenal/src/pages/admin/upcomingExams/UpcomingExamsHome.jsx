import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { CalendarDays, Clock3, FileText, GraduationCap, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const formatDate = (value) => {
    if (!value) return 'Not announced';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not announced';
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const getRegistrationStatus = (registrationStartDate, registrationEndDate) => {
    if (!registrationStartDate || !registrationEndDate) return null;
    const now = new Date();
    const start = new Date(registrationStartDate);
    const end = new Date(registrationEndDate);
    if (now < start) return 'Registration Starts Soon';
    if (now > end) return 'Registration Closed';
    return 'Registration Open';
};

export default function UpcomingExamsHome() {
    const navigate = useNavigate();
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [ongoingExams, setOngoingExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExams = async () => {
        try {
            const [upcomingRes, ongoingRes] = await Promise.all([
                axios.get('/api/exam-date/upcoming'),
                axios.get('/api/exam-date/ongoing'),
            ]);
            setUpcomingExams(upcomingRes.data.data || []);
            setOngoingExams(ongoingRes.data.data || []);
        } catch {} finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const totalUpcoming = upcomingExams.length;
    const totalOngoing = ongoingExams.length;
    const totalExams = totalUpcoming + totalOngoing;

    const getStatusBadge = (status) => {
        if (status === 'Upcoming') {
            return <Badge className="bg-brand-softest text-brand hover:bg-brand-softest">Upcoming</Badge>;
        }
        if (status === 'Ongoing') {
            return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Ongoing</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">
                    Upcoming <span className="text-brand">Exams</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Stay updated with the latest exam schedules
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Exams
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalExams}</p>
                                <p className="text-xs text-muted-foreground">Active exams</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Upcoming
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-softest flex items-center justify-center">
                                <CalendarDays className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalUpcoming}</p>
                                <p className="text-xs text-muted-foreground">Scheduled exams</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ongoing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <Clock3 className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalOngoing}</p>
                                <p className="text-xs text-muted-foreground">In progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Exams Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Upcoming Exams</h3>
                    <Button
                        variant="link"
                        className="text-sm text-brand hover:text-brand-dark"
                        onClick={() => navigate('/admin/exam-date/list')}
                    >
                        View All <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                    </div>
                ) : upcomingExams.length === 0 ? (
                    <div className="rounded-xl border border-dashed bg-white p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-brand-softest rounded-full flex items-center justify-center mb-4">
                            <CalendarDays className="w-8 h-8 text-brand" />
                        </div>
                        <h3 className="font-semibold text-ink">No upcoming exams</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Try adjusting your filters or search.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingExams.map((examDate) => {
                            const exam = examDate.exam;
                            const examSession = examDate.examSession;
                            const registrationStatus = getRegistrationStatus(
                                examDate.registrationStartDate,
                                examDate.registrationEndDate
                            );

                            return (
                                <Card
                                    key={examDate._id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`/admin/exam-date/list`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge('Upcoming')}
                                                {registrationStatus && (
                                                    <span className="rounded-full bg-brand-softest px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                                                        {registrationStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h4 className="font-semibold text-ink mb-1">
                                            {exam?.name || 'Exam'}
                                        </h4>
                                        {exam?.shortName && (
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {exam.shortName}
                                            </p>
                                        )}

                                        <div className="space-y-1.5 text-sm text-ink-muted">
                                            {exam?.conductingBody && (
                                                <p>
                                                    <span className="font-medium">Conducting Body:</span>{' '}
                                                    {exam.conductingBody}
                                                </p>
                                            )}
                                            {exam?.stream && (
                                                <p>
                                                    <span className="font-medium">Stream:</span>{' '}
                                                    {exam.stream}
                                                </p>
                                            )}
                                            {exam?.level && (
                                                <p>
                                                    <span className="font-medium">Level:</span>{' '}
                                                    {exam.level}
                                                </p>
                                            )}
                                            {examSession && (
                                                <p className="text-xs text-ink-muted">
                                                    Session: {examSession.sessionName}
                                                    {examSession.academicYear
                                                        ? ` (${examSession.academicYear})`
                                                        : ''}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                                            <CalendarDays className="w-4 h-4 text-brand shrink-0" />
                                            <span>
                                                {formatDate(examDate.examStartDate)} -{' '}
                                                {formatDate(examDate.examEndDate)}
                                            </span>
                                        </div>

                                        {registrationStatus && (
                                            <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                                                <Clock3 className="w-4 h-4 text-brand shrink-0" />
                                                <span>
                                                    Apply:{' '}
                                                    {formatDate(examDate.registrationStartDate)} -{' '}
                                                    {formatDate(examDate.registrationEndDate)}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Ongoing Exams Section */}
            {ongoingExams.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Ongoing Exams</h3>
                        <Button
                            variant="link"
                            className="text-sm text-amber-700 hover:text-amber-800"
                            onClick={() => navigate('/admin/exam-date/list')}
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {ongoingExams.map((examDate) => {
                            const exam = examDate.exam;
                            const examSession = examDate.examSession;
                            const registrationStatus = getRegistrationStatus(
                                examDate.registrationStartDate,
                                examDate.registrationEndDate
                            );

                            return (
                                <Card
                                    key={examDate._id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`/admin/exam-date/list`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge('Ongoing')}
                                                {registrationStatus && (
                                                    <span className="rounded-full bg-brand-softest px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                                                        {registrationStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h4 className="font-semibold text-ink mb-1">
                                            {exam?.name || 'Exam'}
                                        </h4>
                                        {exam?.shortName && (
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {exam.shortName}
                                            </p>
                                        )}

                                        <div className="space-y-1.5 text-sm text-ink-muted">
                                            {exam?.conductingBody && (
                                                <p>
                                                    <span className="font-medium">Conducting Body:</span>{' '}
                                                    {exam.conductingBody}
                                                </p>
                                            )}
                                            {exam?.stream && (
                                                <p>
                                                    <span className="font-medium">Stream:</span>{' '}
                                                    {exam.stream}
                                                </p>
                                            )}
                                            {exam?.level && (
                                                <p>
                                                    <span className="font-medium">Level:</span>{' '}
                                                    {exam.level}
                                                </p>
                                            )}
                                            {examSession && (
                                                <p className="text-xs text-ink-muted">
                                                    Session: {examSession.sessionName}
                                                    {examSession.academicYear
                                                        ? ` (${examSession.academicYear})`
                                                        : ''}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                                            <CalendarDays className="w-4 h-4 text-amber-600 shrink-0" />
                                            <span>
                                                {formatDate(examDate.examStartDate)} -{' '}
                                                {formatDate(examDate.examEndDate)}
                                            </span>
                                        </div>

                                        {registrationStatus && (
                                            <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                                                <Clock3 className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>
                                                    Apply:{' '}
                                                    {formatDate(examDate.registrationStartDate)} -{' '}
                                                    {formatDate(examDate.registrationEndDate)}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
