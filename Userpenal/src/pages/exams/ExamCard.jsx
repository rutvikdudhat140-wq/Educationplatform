import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatDate = (value) => {


    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'Not announced';

    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};


const dynamicStatusBadge = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-amber-100 text-amber-700',
    Completed: 'bg-gray-100 text-gray-700',
};

const computeExamStatus = (examStartDate, examEndDate) => {
    if (!examStartDate || !examEndDate) return null;

    const now = new Date();
    const todayStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    if (new Date(examStartDate) >= tomorrowStart) return 'Upcoming';
    if (new Date(examEndDate) < todayStart) return 'Completed';
    return 'Ongoing';
};

export default function ExamCard({ exam }) {
    const examDate = exam.dates?.[0];
    const eligibility = exam.eligibility?.[0];
    const dynamicStatus = computeExamStatus(
        examDate?.examStartDate,
        examDate?.examEndDate
    );

    return (
        <Link
            to={`/exams/${exam._id}`}
            className="group block h-full rounded-lg border bg-white p-4 transition hover:border-primary/40 hover:shadow-md"
        >

            {dynamicStatus && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${dynamicStatusBadge[dynamicStatus]}`}>
                        {dynamicStatus}
                    </span>
                </div>
            )}

            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {exam.shortName?.charAt(0) || exam.name?.charAt(0) || 'E'}
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">{exam.stream}</p>

                        <h2 className="text-base font-semibold text-foreground group-hover:text-primary">{exam.name}</h2>
                    </div>
                </div>

                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${exam.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                        }`}
                >
                    {exam.status}
                </span>
            </div>


            <div className="mt-4 space-y-2 border-t pt-3">
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-24 text-muted-foreground">
                        Conducting
                    </span>
                    <span className="font-medium">
                        {exam.conductingBody || 'Not added'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="w-24 text-muted-foreground">
                        Exam Type
                    </span>
                    <span className="font-medium">
                        {exam.examType || 'Not added'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="w-24 text-muted-foreground">
                        Level
                    </span>
                    <span className="font-medium">
                        {exam.level || 'Not added'}
                    </span>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="size-4 text-primary" />

                    <span>
                        Apply: {formatDate(examDate?.registrationStartDate)} - {formatDate(examDate?.registrationEndDate)}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" />

                    <span>
                        Exam: {formatDate(examDate?.examStartDate)} - {formatDate(examDate?.examEndDate)}
                    </span>
                </div>
            </div>


            <div className="mt-3 rounded-md bg-muted/40 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                    Eligibility
                </p>

                <p className="mt-0.5 line-clamp-1 text-sm font-medium">
                    {eligibility?.minimumQualification || 'Not added'}
                </p>
            </div>

            {/* Bottom */}
            <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">
                    View exam details
                </span>

                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
