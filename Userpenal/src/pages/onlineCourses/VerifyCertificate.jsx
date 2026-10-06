import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';

import {
  Ban,
  CheckCircle2,
  ChevronRight,
  Home,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? '—'
    : parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
};

const VerifyCertificate = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const certificateId = searchParams.get('id') || '';
  const [input, setInput] = useState(certificateId);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    if (!certificateId) return;

    setCertificate(null);

    fetch(createApiUrl(`/certificates/verify/${certificateId}`))
      .then((res) => res.json())
      .then((data) => setCertificate(data.data || null))
      .catch(() => setCertificate(null));
  }, [certificateId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchParams({ id: input.trim() });
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="edu-page-head">
        <div className="edu-container py-4 md:py-5">
          <div className="edu-breadcrumb">
            <Link to="/" className="edu-breadcrumb-link">
              <Home size={14} />
              Home
            </Link>

            <ChevronRight className="size-3.5 text-line-strong" />

            <span className="font-semibold text-ink">
              Verify Certificate
            </span>
          </div>

          <h1 className="edu-h1 mt-2.5">Verify Certificate</h1>

          <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
            Enter a certificate ID to confirm it was issued by EduPlatform.
          </p>
        </div>
      </div>

      <main className="edu-container py-5 md:py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[22rem_1fr] lg:gap-6">
          <form onSubmit={handleSubmit} className="edu-card h-fit p-4">
            <label htmlFor="certificate-id" className="edu-field-label">
              Certificate ID
            </label>

            <div className="relative mt-1.5">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-line-strong"
              />

              <Input
                id="certificate-id"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="CERT-2026-000123"
                className="pl-9"
              />
            </div>

            <Button
              type="submit"
              className="mt-3 w-full"
              disabled={!input.trim()}
            >
              <Search size={14} />
              Verify Certificate
            </Button>
          </form>

          <div>
            {certificate && (
              <div className="edu-card overflow-hidden">
                <div
                  className={
                    certificate.status === 'Valid'
                      ? 'flex items-center gap-3 border-b border-brand-border bg-brand-softest px-4 py-3.5'
                      : 'flex items-center gap-3 border-b border-destructive/30 bg-destructive/5 px-4 py-3.5'
                  }
                >
                  {certificate.status === 'Valid' ? (
                    <CheckCircle2 size={22} className="shrink-0 text-brand" />
                  ) : (
                    <Ban size={22} className="shrink-0 text-destructive" />
                  )}

                  <div>
                    <h2 className="text-[0.9375rem] font-semibold text-ink">
                      {certificate.status === 'Valid'
                        ? 'This certificate is valid'
                        : 'This certificate is revoked'}
                    </h2>

                    <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                      {certificate.status === 'Valid'
                        ? 'Issued by EduPlatform and confirmed genuine.'
                        : 'This certificate no longer confers completion.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: 'Student',
                        value: certificate.studentName,
                      },
                      {
                        label: 'Certificate ID',
                        value: certificate.certificateId,
                      },
                      { label: 'Course', value: certificate.courseName },
                      { label: 'Category', value: certificate.courseCategory },
                      {
                        label: 'Completion Date',
                        value: formatDate(certificate.completionDate),
                      },
                      {
                        label: 'Issue Date',
                        value: formatDate(certificate.issuedAt),
                      },
                      {
                        label: 'Duration',
                        value: certificate.courseDuration,
                      },
                      { label: 'Instructor', value: certificate.instructorName },
                    ].map((field) => (
                      <div key={field.label} className="edu-stat">
                        <p className="edu-label">{field.label}</p>

                        <p className="edu-stat-value">
                          {field.value || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyCertificate;
