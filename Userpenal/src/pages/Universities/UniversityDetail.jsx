import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';
import { SafeImage } from '@/components/ui/safe-image';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ApplyApplicationModal, {
  createEmptyApplicationForm,
} from '@/components/application/ApplyApplicationModal';

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [university, setUniversity] = useState(null);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createEmptyApplicationForm());

  const token = localStorage.getItem('userToken');

  const clearInvalidSession = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setOpen(false);

    navigate('/login');
  };

  useEffect(() => {
    const getUniversity = async () => {
      try {
        const res = await fetch(createApiUrl(`/university/${id}`));
        const data = await res.json();
        setUniversity(data.data);
      } catch (error) {
      }
    };

    getUniversity();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!token) {
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(createApiUrl(`/university-applications/check/${id}`), { headers });
      } catch (error) {
        if (error.response?.status === 401) {
          clearInvalidSession();
        }
      }
    };

    checkApplied();
  }, [id, token]);

  const openApplyDialog = () => {
    const currentToken = localStorage.getItem('userToken');

    if (!currentToken) {
      navigate('/login');
      return;
    }

    setForm(createEmptyApplicationForm());
    setOpen(true);
  };

  const handleApply = async (event) => {
    event.preventDefault();

    const currentToken = localStorage.getItem('userToken');

    if (!currentToken) {
      clearInvalidSession();
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${currentToken}` };
      const res = await fetch(createApiUrl('/university-applications'), {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId: id, ...form }),
      });

      if (res.status === 409) {
        setOpen(false);
        return;
      }
      if (res.status === 401) {
        clearInvalidSession();
        return;
      }

      setOpen(false);
    } catch (error) {
      if (error.response?.status === 409) {
        setOpen(false);
      } else if (error.response?.status === 401) {
        clearInvalidSession();
      }
    }
  };

  if (!university) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="edu-container py-10">
          <div className="edu-card p-8 text-center">
            <p className="text-[0.875rem] text-ink-muted">
              Loading university details…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-12">

      {/* Hero */}
      <div className="relative h-44 w-full overflow-hidden md:h-52">
        <img
          src={
            university.coverImage ||
            'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop'
          }
          alt={university.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-4">

      <Card className="mb-4 rounded-md border border-[#E5E7EB] bg-white p-5 shadow-xs">

          <div className="flex flex-col gap-4 md:flex-row">

            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[#E5E7EB] bg-white">

              {university.logo ? (
                <img
                  src={university.logo}
                  alt={university.name}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-ink-muted">
                  Logo
                </div>
              )}

            </div>

            <div className="min-w-0 flex-1">

              <div className="flex flex-col justify-between gap-3 md:flex-row">

                <div>

                  <h1 className="text-xl font-bold text-[#172554] md:text-2xl">
                    {university.name}
                  </h1>

                  {university.shortName && (
                    <p className="mt-1 text-sm font-medium text-[#64748B]">
                      ({university.shortName})
                    </p>
                  )}

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748B]">

                    <span>
                      {university.city && university.state
                        ? `${university.city}, ${university.state}`
                        : university.city || university.state || 'Location not available'}
                    </span>

                    {university.establishedYear && (
                      <span>
                        Est. {university.establishedYear}
                      </span>
                    )}

                    <span>
                      {university.universityType}
                    </span>

                  </div>

                </div>

                {university.nirfRanking && (
                  <div className="h-fit w-fit rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1E40AF]">
                    NIRF #{university.nirfRanking}
                  </div>
                )}

              </div>

              {(university.accreditation ||
                (Array.isArray(university.recognition) &&
                  university.recognition.length > 0)) && (

                  <div className="mt-3 flex flex-wrap gap-1.5">

                    {university.accreditation && (
                      <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {university.accreditation}
                      </span>
                    )}

                    {Array.isArray(university.recognition) &&
                      university.recognition.map((item, index) => (
                        <span
                          key={index}
                          className="rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                        >
                          {item}
                        </span>
                      ))}

                  </div>
                )}

            </div>

          </div>

        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          <div className="space-y-4 lg:col-span-2">

            <Card className="p-4 rounded-md border border-[#E5E7EB]">

              <h2 className="mb-4 text-base font-bold text-[#172554]">
                Quick Highlights
              </h2>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                  <p className="text-xs text-[#64748B]">
                    Departments
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#172554]">
                    {university.numberOfDepartments ||
                      (Array.isArray(university.departments)
                        ? university.departments.length
                        : 0)}
                  </p>
                </div>

                <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                  <p className="text-xs text-[#64748B]">
                    Faculties
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#172554]">
                    {university.numberOfFaculties ||
                      (Array.isArray(university.faculties)
                        ? university.faculties.length
                        : 0)}
                  </p>
                </div>

                <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                  <p className="text-xs text-[#64748B]">
                    Students
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#172554]">
                    {university.numberOfStudents || '5,000+'}
                  </p>
                </div>

                <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                  <p className="text-xs text-[#64748B]">
                    Programs
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {university.numberOfPrograms ||
                      (Array.isArray(university.programTypes)
                        ? university.programTypes.length
                        : 0)}
                  </p>
                </div>

              </div>

            </Card>

            <Card className="p-4">

              <h2 className="mb-3 text-lg font-bold text-ink">
                About {university.name}
              </h2>

              <p className="text-sm leading-6 text-ink-muted">
                {university.description || 'Description not available.'}
              </p>

            </Card>

            {Array.isArray(university.facilities) &&
              university.facilities.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-ink">
                    Facilities
                  </h2>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                    {university.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-surface p-2.5 text-xs font-medium text-ink"
                      >
                        {facility}
                      </div>
                    ))}

                  </div>

                </Card>
              )}

            {Array.isArray(university.faculties) &&
              university.faculties.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-ink">
                    Faculties
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {university.faculties.map((faculty, index) => (
                      <span
                        key={index}
                        className="rounded-md border bg-surface px-2.5 py-1 text-xs text-ink"
                      >
                        {faculty}
                      </span>
                    ))}

                  </div>

                </Card>
              )}

            {Array.isArray(university.departments) &&
              university.departments.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-ink">
                    Departments
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {university.departments.map((department, index) => (
                      <span
                        key={index}
                        className="rounded-md border bg-surface px-2.5 py-1 text-xs text-ink"
                      >
                        {department}
                      </span>
                    ))}

                  </div>

                </Card>
              )}

            {Array.isArray(university.programTypes) &&
              university.programTypes.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-ink">
                    Program Types
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {university.programTypes.map((program, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-brand-softest px-2.5 py-1 text-xs font-semibold text-brand"
                      >
                        {program}
                      </span>
                    ))}

                  </div>

                </Card>
              )}

            <Card className="p-4">

              <h2 className="mb-4 text-lg font-bold text-ink">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <p className="text-xs text-ink-muted">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {university.email }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ink-muted">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {university.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ink-muted">
                    Admission Email
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {university.admissionEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-ink-muted">
                    Admission Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {university.admissionPhone}
                  </p>
                </div>

                {university.officialWebsite && (
                  <div className="md:col-span-2">

                    <p className="text-xs text-ink-muted">
                      Website
                    </p>

                    <a
                      href={university.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-semibold text-brand hover:underline"
                    >
                      {university.officialWebsite}
                    </a>

                  </div>
                )}

              </div>

            </Card>

          </div>


          <div>

            <div className="space-y-4 lg:sticky lg:top-5">

              <Card className="p-4 rounded-md border border-[#E5E7EB]">

                <h3 className="mb-3 text-sm font-bold text-[#172554]">
                  Interested in this university?
                </h3>

                <Button
                  className="w-full rounded-[4px] bg-[#172554] text-xs font-semibold text-white hover:bg-[#0F172A] shadow-none h-9.5"
                  onClick={openApplyDialog}
                >
                  Apply Now
                </Button>

                <Button
                  variant="outline"
                  className="mt-2 w-full rounded-[4px] border-[#CBD5E1] text-xs font-semibold text-[#172554] hover:bg-[#F8FAFC] h-9.5"
                >
                  Add to Compare
                </Button>

              </Card>
              <Card className="p-4 rounded-md border border-[#E5E7EB]">

                <h3 className="mb-3 text-sm font-bold text-[#172554]">
                  Quick Stats
                </h3>

                <div className="space-y-2.5 text-xs">

                  {university.establishedYear && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-ink-muted">
                        Established
                      </span>

                      <span className="font-semibold">
                        {university.establishedYear}
                      </span>

                    </div>
                  )}

                  <div className="flex justify-between border-b pb-2">

                    <span className="text-ink-muted">
                      Type
                    </span>

                    <span className="font-semibold">
                      {university.universityType}
                    </span>

                  </div>

                  <div className="flex justify-between border-b pb-2">

                    <span className="text-ink-muted">
                      Category
                    </span>

                    <span className="font-semibold">
                      {university.category}
                    </span>

                  </div>

                  {university.campusArea && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-ink-muted">
                        Campus Area
                      </span>

                      <span className="font-semibold">
                        {university.campusArea}
                      </span>

                    </div>
                  )}

                  {university.nirfRanking && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-ink-muted">
                        NIRF
                      </span>

                      <span className="font-semibold">
                        {university.nirfRanking}
                      </span>

                    </div>
                  )}

                  {university.naacGrade && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-ink-muted">
                        NAAC Grade
                      </span>

                      <span className="font-semibold">
                        {university.naacGrade}
                      </span>

                    </div>
                  )}

                  {university.numberOfStudents && (
                    <div className="flex justify-between">

                      <span className="text-ink-muted">
                        Students
                      </span>

                      <span className="font-semibold">
                        {university.numberOfStudents}
                      </span>

                    </div>
                  )}

                </div>

              </Card>

            </div>

          </div>

        </div>

      </div>

      <ApplyApplicationModal
        open={open}
        title={`Apply to ${university.name}`}
        form={form}
        setForm={setForm}
        onClose={() => setOpen(false)}
        onSubmit={handleApply}
        submitLabel="Apply Now"
      />

    </div>
  );
};

export default UniversityDetail;
