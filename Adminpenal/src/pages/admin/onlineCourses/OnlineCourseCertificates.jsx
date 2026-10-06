import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from "axios";

import { PageHeader, StatusBadge } from '@/components/layout/AdminUI';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Eye,
  ExternalLink,
  RotateCcw,
  Search,
  TriangleAlert,
  UserRound,
} from 'lucide-react';

const LEARNER_APP_URL = 'http://localhost:5173';

const formatDate = (date) => {
  if (!date) {
    return '—';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const OnlineCourseCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState('');

  const getCertificates = useCallback(async () => {
    const response = await axios.get('/api/admin/certificates');

    setCertificates(response.data.data || []);
  }, []);

  useEffect(() => {
    getCertificates();
  }, [getCertificates]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return certificates;
    }

    return certificates.filter((certificate) =>
      [
        certificate.certificateId,
        certificate.studentName,
        certificate.courseName,
        certificate.userId?.email,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [certificates, search]);

  const setStatus = useCallback(async (certificate, status) => {
    setUpdatingId(certificate._id);

    const response = await axios.patch(
      `/api/admin/certificates/${certificate._id}/status`,
      { status }
    );

    const updated = response.data.data;

    setCertificates((previous) =>
      previous.map((item) => (item._id === updated._id ? updated : item))
    );

    setSelected((previous) =>
      previous && previous._id === updated._id ? updated : previous
    );

    setUpdatingId('');
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Online Course Certificates" />

      <div className="rounded-xl border border-line bg-white">
        <div className="border-b border-line p-4">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-line-strong"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ID, student, email or course"
              className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-[0.8125rem] text-ink outline-none transition-colors duration-150 placeholder:text-ink-muted focus:border-brand-border"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-ink-muted"
                >
                  {certificates.length === 0
                    ? 'No certificates found.'
                    : 'No certificates match this search.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((certificate) => {
                const isValid = certificate.status === 'Valid';
                const busy = updatingId === certificate._id;

                return (
                  <TableRow key={certificate._id}>
                    <TableCell className="font-medium text-ink">
                      {certificate.certificateId}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-ink">
                        {certificate.userId?.name || certificate.studentName}
                      </div>
                      <div className="text-xs text-ink-muted">
                        {certificate.userId?.email || '—'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>{certificate.courseName}</div>
                      {certificate.courseCategory && (
                        <div className="text-xs text-ink-muted">
                          {certificate.courseCategory}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>{formatDate(certificate.issuedAt)}</TableCell>

                    <TableCell>
                      <StatusBadge status={certificate.status} />
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelected(certificate)}
                          aria-label="View certificate"
                          className="inline-flex size-7 items-center justify-center rounded-md border border-line bg-white text-ink-muted transition-colors duration-150 hover:border-brand-border hover:bg-brand-softest hover:text-brand"
                        >
                          <Eye size={14} />
                        </button>

                        {isValid ? (
                          <button
                            type="button"
                            onClick={() =>
                              setStatus(certificate, 'Revoked')
                            }
                            disabled={busy}
                            aria-label="Revoke certificate"
                            title="Revoke certificate"
                            className="inline-flex size-7 items-center justify-center rounded-md border border-line bg-white text-ink-muted transition-colors duration-150 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          >
                            <Ban size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setStatus(certificate, 'Valid')}
                            disabled={busy}
                            aria-label="Restore certificate"
                            title="Restore certificate"
                            className="inline-flex size-7 items-center justify-center rounded-md border border-line bg-white text-ink-muted transition-colors duration-150 hover:border-brand-border hover:bg-brand-softest hover:text-brand disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>

            <DialogDescription>
              Issued automatically when the student completed the course.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <>
              <div
                className={
                  selected.status === 'Valid'
                    ? 'flex items-center gap-3 rounded-lg border border-brand-border bg-brand-softest px-3.5 py-3'
                    : 'flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3'
                }
              >
                {selected.status === 'Valid' ? (
                  <CheckCircle2 size={20} className="shrink-0 text-brand" />
                ) : (
                  <TriangleAlert
                    size={20}
                    className="shrink-0 text-destructive"
                  />
                )}

                <div>
                  <p className="text-[0.875rem] font-semibold text-ink">
                    {selected.status === 'Valid'
                      ? 'This certificate is valid'
                      : 'This certificate is revoked'}
                  </p>

                  <p className="text-[0.8125rem] text-ink-muted">
                    {selected.status === 'Valid'
                      ? 'Anyone with the ID can confirm it as genuine.'
                      : 'The student no longer holds a valid completion credential.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: 'Certificate ID', value: selected.certificateId },
                  {
                    label: 'Student',
                    value: selected.userId?.name || selected.studentName,
                  },
                  { label: 'Email', value: selected.userId?.email },
                  { label: 'Course', value: selected.courseName },
                  { label: 'Category', value: selected.courseCategory },
                  { label: 'Instructor', value: selected.instructorName },
                  {
                    label: 'Course Duration',
                    value: selected.courseDuration,
                  },
                  {
                    label: 'Completion Date',
                    value: formatDate(selected.completionDate),
                  },
                  {
                    label: 'Issue Date',
                    value: formatDate(selected.issuedAt),
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="rounded-lg border border-line p-3"
                  >
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                      {field.label}
                    </p>

                    <p className="mt-1 text-[0.8125rem] font-medium text-ink">
                      {field.value || '—'}
                    </p>
                  </div>
                ))}
              </div>

              <DialogFooter className="flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `${LEARNER_APP_URL}/verify-certificate?id=${encodeURIComponent(
                        selected.certificateId
                      )}`,
                      '_blank',
                      'noopener'
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[0.8125rem] font-semibold text-ink transition-colors duration-150 hover:border-brand-border hover:text-brand"
                >
                  <ExternalLink size={14} />
                  Open public verification
                </button>

                {selected.status === 'Valid' ? (
                  <button
                    type="button"
                    onClick={() => setStatus(selected, 'Revoked')}
                    disabled={updatingId === selected._id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition-colors duration-150 hover:opacity-90 disabled:opacity-50"
                  >
                    <Ban size={14} />
                    Revoke Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStatus(selected, 'Valid')}
                    disabled={updatingId === selected._id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition-colors duration-150 hover:bg-brand-dark disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Restore Certificate
                  </button>
                )}
              </DialogFooter>

              {selected.status === 'Valid' && (
                <p className="flex items-start gap-1.5 text-[0.75rem] text-ink-muted">
                  <UserRound size={12} className="mt-0.5 shrink-0" />
                  Revoking keeps the record for audit purposes. The certificate
                  is hidden from the student and public verification reports it
                  as invalid.
                </p>
              )}

              {selected.status !== 'Valid' && (
                <p className="flex items-start gap-1.5 text-[0.8125rem] font-semibold text-brand">
                  <BadgeCheck size={13} className="mt-0.5 shrink-0" />
                  Restoring makes this certificate valid again for the student.
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlineCourseCertificates;
