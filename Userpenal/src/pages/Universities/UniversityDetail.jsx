import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
        const response = await axios.get(
          `http://localhost:5001/api/university/${id}`
        );

        setUniversity(response.data.data);
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
        const response = await axios.get(
          `http://localhost:5001/api/university-applications/check/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


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
      await axios.post(
        'http://localhost:5001/api/university-applications',
        {
          universityId: id,
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );


      setOpen(false);
    } catch (error) {
      if (error.response?.status === 409) {

        setOpen(false);
      } else if (error.response?.status === 401) {
        clearInvalidSession();
      } else {

      }
    }
  };

  if (!university) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        University not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">

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

        {/* University Header */}
        <Card className="mb-4 rounded-xl bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Logo */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white">

              {university.logo ? (
                <img
                  src={university.logo}
                  alt={university.name}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Logo
                </div>
              )}

            </div>

            {/* University Info */}
            <div className="min-w-0 flex-1">

              <div className="flex flex-col justify-between gap-3 md:flex-row">

                <div>

                  <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                    {university.name}
                  </h1>

                  {university.shortName && (
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      ({university.shortName})
                    </p>
                  )}

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

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
                  <div className="h-fit w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    NIRF #{university.nirfRanking}
                  </div>
                )}

              </div>

              {(university.accreditation ||
                (Array.isArray(university.recognition) &&
                  university.recognition.length > 0)) && (

                  <div className="mt-3 flex flex-wrap gap-1.5">

                    {university.accreditation && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {university.accreditation}
                      </span>
                    )}

                    {Array.isArray(university.recognition) &&
                      university.recognition.map((item, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
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

          {/* Left Side */}
          <div className="space-y-4 lg:col-span-2">

            {/* Quick Highlights */}
            <Card className="p-4">

              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Quick Highlights
              </h2>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Departments
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.numberOfDepartments ||
                      (Array.isArray(university.departments)
                        ? university.departments.length
                        : 0)}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Faculties
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.numberOfFaculties ||
                      (Array.isArray(university.faculties)
                        ? university.faculties.length
                        : 0)}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Students
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.numberOfStudents || '—'}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Programs
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.numberOfPrograms ||
                      (Array.isArray(university.programTypes)
                        ? university.programTypes.length
                        : 0)}
                  </p>
                </div>

              </div>

            </Card>

            {/* About */}
            <Card className="p-4">

              <h2 className="mb-3 text-lg font-bold text-slate-800">
                About {university.name}
              </h2>

              <p className="text-sm leading-6 text-slate-600">
                {university.description || 'Description not available.'}
              </p>

            </Card>

            {/* Facilities */}
            {Array.isArray(university.facilities) &&
              university.facilities.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Facilities
                  </h2>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                    {university.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-slate-50 p-2.5 text-xs font-medium text-slate-700"
                      >
                        {facility}
                      </div>
                    ))}

                  </div>

                </Card>
              )}

            {/* Faculties */}
            {Array.isArray(university.faculties) &&
              university.faculties.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Faculties
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {university.faculties.map((faculty, index) => (
                      <span
                        key={index}
                        className="rounded-md border bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                      >
                        {faculty}
                      </span>
                    ))}

                  </div>

                </Card>
              )}

            {/* Departments */}
            {Array.isArray(university.departments) &&
              university.departments.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Departments
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {university.departments.map((department, index) => (
                      <span
                        key={index}
                        className="rounded-md border bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                      >
                        {department}
                      </span>
                    ))}

                  </div>

                </Card>
              )}

            {/* Program Types */}
            {Array.isArray(university.programTypes) &&
              university.programTypes.length > 0 && (

                <Card className="p-4">

                  <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Program Types
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {university.programTypes.map((program, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {program}
                      </span>
                    ))}

                  </div>

                </Card>
              )}

            {/* Contact */}
            <Card className="p-4">

              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.email || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.phone || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Admission Email
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.admissionEmail || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Admission Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {university.admissionPhone || 'Not available'}
                  </p>
                </div>

                {university.officialWebsite && (
                  <div className="md:col-span-2">

                    <p className="text-xs text-slate-500">
                      Website
                    </p>

                    <a
                      href={university.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-semibold text-[#0F766E] hover:underline"
                    >
                      {university.officialWebsite}
                    </a>

                  </div>
                )}

              </div>

            </Card>

          </div>

          {/* Right Side */}
          <div>

            <div className="space-y-4 lg:sticky lg:top-5">

              {/* Apply */}
              <Card className="p-4">

                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Interested in this university?
                </h3>

                <Button
                  className="w-full rounded-full bg-[#1E3A5F] text-sm text-white hover:bg-[#16293F]"

                  onClick={openApplyDialog}
                >
              apply
                </Button>

                <Button
                  variant="outline"
                  className="mt-2 w-full rounded-full border-[#1E3A5F] text-sm text-[#1E3A5F]"
                >
                  Add to Compare
                </Button>

              </Card>

              {/* Quick Stats */}
              <Card className="p-4">

                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Quick Stats
                </h3>

                <div className="space-y-2.5 text-xs">

                  {university.establishedYear && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-slate-500">
                        Established
                      </span>

                      <span className="font-semibold">
                        {university.establishedYear}
                      </span>

                    </div>
                  )}

                  <div className="flex justify-between border-b pb-2">

                    <span className="text-slate-500">
                      Type
                    </span>

                    <span className="font-semibold">
                      {university.universityType}
                    </span>

                  </div>

                  <div className="flex justify-between border-b pb-2">

                    <span className="text-slate-500">
                      Category
                    </span>

                    <span className="font-semibold">
                      {university.category}
                    </span>

                  </div>

                  {university.campusArea && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-slate-500">
                        Campus Area
                      </span>

                      <span className="font-semibold">
                        {university.campusArea}
                      </span>

                    </div>
                  )}

                  {university.nirfRanking && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-slate-500">
                        NIRF
                      </span>

                      <span className="font-semibold">
                        #{university.nirfRanking}
                      </span>

                    </div>
                  )}

                  {university.naacGrade && (
                    <div className="flex justify-between border-b pb-2">

                      <span className="text-slate-500">
                        NAAC Grade
                      </span>

                      <span className="font-semibold">
                        {university.naacGrade}
                      </span>

                    </div>
                  )}

                  {university.numberOfStudents && (
                    <div className="flex justify-between">

                      <span className="text-slate-500">
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
