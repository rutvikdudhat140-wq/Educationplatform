import { CalendarDays, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const formatDate = (value) => {
    if (!value) return "Not announced";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not announced";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
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
    Upcoming: "bg-teal-50 text-teal-700",
    Ongoing: "bg-amber-50 text-amber-700",
    Completed: "bg-slate-100 text-slate-600",
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
        <div className={`flex h-full flex-col rounded-lg border bg-white ${compact ? 'p-3' : 'p-4'} transition hover:border-primary/40 hover:shadow-md`}>

            <div className={`mb-2 flex flex-wrap items-center gap-2 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                <span className={`rounded-full px-2 py-0.5 font-semibold ${badgeClass}`}>
                    {status}
                </span>

                {registrationStatus && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                        {registrationStatus}
                    </span>
                )}
            </div>

            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-slate-900`}>
                        {exam?.name || "Exam"}
                    </h2>

                    {exam?.shortName && !compact && (
                        <p className="text-sm text-muted-foreground">
                            {exam.shortName}
                        </p>
                    )}
                </div>

                {exam?.examType && (
                    <span className={`font-medium text-slate-500 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                        {exam.examType}
                    </span>
                )}
            </div>

            {!compact && (
                <>
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                        {exam?.conductingBody && (
                            <p>
                                <span className="font-medium">Conducting Body:</span>{" "}
                                {exam.conductingBody}
                            </p>
                        )}

                        {exam?.stream && (
                            <p>
                                <span className="font-medium">Stream:</span>{" "}
                                {exam.stream}
                            </p>
                        )}

                        {exam?.level && (
                            <p>
                                <span className="font-medium">Level:</span>{" "}
                                {exam.level}
                            </p>
                        )}
                    </div>

                    {examSession && (
                        <p className="mt-2 text-xs text-slate-500">
                            Session: {examSession.sessionName}{" "}
                            {examSession.academicYear
                                ? `(${examSession.academicYear})`
                                : ""}
                        </p>
                    )}
                </>
            )}

            <div className={`mt-3 flex items-center gap-2 text-slate-600 ${compact ? 'text-xs' : 'text-sm'}`}>
                <CalendarDays className={`${compact ? 'size-3.5' : 'size-4'} text-[#0F766E]`} />

                <span>
                    {formatDate(examDate?.examStartDate)} -{" "}
                    {formatDate(examDate?.examEndDate)}
                </span>
            </div>

            {registrationStatus && (
                <div className={`mt-1 flex items-center gap-2 text-slate-500 ${compact ? 'text-[11px]' : 'text-xs'}`}>
                    <Clock3 className={`${compact ? 'size-3.5' : 'size-4'} text-[#0F766E]`} />

                    <span>
                        Apply: {formatDate(examDate?.registrationStartDate)} -{" "}
                        {formatDate(examDate?.registrationEndDate)}
                    </span>
                </div>
            )}

            <div className={`mt-auto ${compact ? 'pt-3' : 'pt-4'}`}>
                <Button
                    size={compact ? "sm" : "default"}
                    className="w-full text-xs"
                    onClick={() => navigate(`/exams/${exam?._id}`)}>
                    View Details
                </Button>
            </div>

        </div>
    );
}
