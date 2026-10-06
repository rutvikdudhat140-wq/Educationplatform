import { CalendarDays, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const formatDate = (value) => {
    if (!value) return "Not announced";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not announced";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getRegistrationStatus = (registrationStartDate, registrationEndDate) => {
    if (!registrationStartDate || !registrationEndDate) return null;

    const now = new Date();
    const start = new Date(registrationStartDate);
    const end = new Date(registrationEndDate);

    if (now < start) return "Registration Starts Soon";
    if (now > end) return "Registration Closed";
    return "Registration Open";
};

const statusBadge = {
    Upcoming: "border-brand-border bg-brand-softest text-brand-dark",
    Ongoing: "border-[#F5D9A8] bg-[#FEF6E7] text-[#8A5A08]",
    Completed: "border-line-strong bg-surface text-ink-soft",
};

export default function UpcomingExamCard({ examDate, status = "Upcoming", compact = false }) {
    const navigate = useNavigate();
    const exam = examDate?.exam;
    const examSession = examDate?.examSession;

    const registrationStatus = getRegistrationStatus(
        examDate?.registrationStartDate,
        examDate?.registrationEndDate
    );

    const badgeClass = statusBadge[status] || statusBadge.Upcoming;

    return (
        <div className={`edu-card edu-card-hover flex h-full flex-col ${compact ? 'p-3' : 'p-4'}`}>

            <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className={`inline-flex h-[1.375rem] items-center rounded-md border px-2 text-[0.6875rem] font-semibold ${badgeClass}`}>
                    {status}
                </span>

                {registrationStatus && (
                    <span className="edu-tag">
                        {registrationStatus}
                    </span>
                )}
            </div>

            <div className="flex items-start justify-between gap-2">
                <h2 className={`line-clamp-2 font-semibold leading-5 text-ink ${compact ? 'text-[0.875rem]' : 'text-[0.9375rem]'}`}>
                    {exam?.name || "Exam"}
                </h2>

                {exam?.examType && (
                    <span className="mt-0.5 shrink-0 text-[0.6875rem] font-medium text-ink-muted">
                        {exam.examType}
                    </span>
                )}
            </div>

            {exam?.shortName && !compact && (
                <p className="mt-1 text-[0.8125rem] text-ink-soft">
                    {exam.shortName}
                </p>
            )}

            {!compact && (
                <>
                    <div className="mt-2.5 space-y-1 text-[0.8125rem] text-ink-soft">
                        {exam?.conductingBody && (
                            <p>
                                <span className="font-medium text-ink">Conducting Body:</span>{" "}
                                {exam.conductingBody}
                            </p>
                        )}

                        {exam?.stream && (
                            <p>
                                <span className="font-medium text-ink">Stream:</span>{" "}
                                {exam.stream}
                            </p>
                        )}

                        {exam?.level && (
                            <p>
                                <span className="font-medium text-ink">Level:</span>{" "}
                                {exam.level}
                            </p>
                        )}
                    </div>

                    {examSession && (
                        <p className="mt-2 text-[0.75rem] text-ink-muted">
                            Session: {examSession.sessionName}{" "}
                            {examSession.academicYear
                                ? `(${examSession.academicYear})`
                                : ""}
                        </p>
                    )}
                </>
            )}

            <div className={`mt-3 space-y-1.5 border-t border-line pt-3 text-ink-soft ${compact ? 'text-[0.75rem]' : 'text-[0.8125rem]'}`}>
                <p className="flex items-start gap-1.5">
                    <CalendarDays className={`mt-0.5 size-3.5 shrink-0 text-brand ${compact ? 'size-3.5' : ''}`} />

                    <span>
                        {formatDate(examDate?.examStartDate)} -{" "}
                        {formatDate(examDate?.examEndDate)}
                    </span>
                </p>

                {registrationStatus && (
                    <p className="flex items-start gap-1.5 text-ink-muted">
                        <Clock3 className="mt-0.5 size-3.5 shrink-0 text-brand" />

                        <span>
                            Apply: {formatDate(examDate?.registrationStartDate)} -{" "}
                            {formatDate(examDate?.registrationEndDate)}
                        </span>
                    </p>
                )}
            </div>

            <div className={`mt-auto flex items-center justify-between border-t border-line ${compact ? 'pt-2.5' : 'pt-3'}`}>
                <span className="text-[0.75rem] font-semibold text-brand">
                    View Details
                </span>

                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[0.75rem]"
                    onClick={() => navigate(`/exams/${exam?._id}`)}>
                    Open
                </Button>
            </div>

        </div>
    );
}
