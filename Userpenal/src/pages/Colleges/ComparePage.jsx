import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  Plus,
  X,
  Building2,
  MapPin,
  Star,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ComparePage = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();

  useEffect(() => {
    const getColleges = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/college`);
        const allColleges = res.data?.colleges || [];
        setColleges(allColleges);

        const searchParams = new URLSearchParams(location.search);
        const idsParam = searchParams.get('ids');
        if (idsParam) {
          const ids = idsParam.split(',');
          const preSelected = allColleges.filter((c) => ids.includes(c._id)).slice(0, 2);
          setSelected(preSelected);
        }
      } catch (err) {
        console.error('Failed to load colleges for comparison', err);
      }
    };

    getColleges();
  }, [location.search]);

  const addCollege = (college) => {
    if (selected.length >= 2) return;
    if (selected.some((c) => c._id === college._id)) return;
    setSelected([...selected, college]);
    setShowModal(false);
  };

  const removeCollege = (index) => {
    setSelected(selected.filter((_, i) => i !== index));
  };

  const college1 = selected[0];
  const college2 = selected[1];

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const alreadySelected = selected.some((s) => s._id === c._id);
    return matchesSearch && !alreadySelected;
  });

  return (
    <div className="min-h-screen bg-surface p-4 md:p-6 text-ink">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-xs md:text-sm text-ink-muted">
          <button
            onClick={() => navigate('/colleges')}
            className="flex items-center gap-1 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} /> Back to Colleges
          </button>
          <span>/</span>
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <span className="text-ink font-medium">Compare Colleges</span>
        </div>

        {/* Page Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-brand text-xs font-semibold mb-2">
              <Building2 size={13} /> College Comparison Tool
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Compare Colleges Side-by-Side
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Analyze fees, ratings, placements, campus facilities and eligibility.
            </p>
          </div>

          {selected.length > 0 && selected.length < 2 && (
            <Button
              onClick={() => setShowModal(true)}
              className="bg-brand hover:bg-brand-dark text-white rounded-md h-10 px-4 text-sm font-semibold flex items-center gap-2 shadow-none"
            >
              <Plus size={16} /> Add Second College
            </Button>
          )}
        </div>

        {/* Empty state: No colleges selected */}
        {selected.length === 0 && (
          <Card className="mx-auto max-w-md p-8 md:p-12 text-center rounded-md border border-line bg-white shadow-none">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-blue-50 text-brand">
              <Building2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-ink mb-1">Select Colleges to Compare</h2>
            <p className="text-sm text-ink-muted mb-6">
              Pick two institutions to evaluate courses, campus size, ratings and accreditations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={() => setShowModal(true)}
                className="bg-brand hover:bg-brand-dark text-white rounded-md h-10 px-5 text-sm font-semibold shadow-none"
              >
                <Plus size={16} className="mr-1.5" /> Select First College
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/colleges')}
                className="rounded-md h-10 px-5 text-sm font-medium border-line hover:bg-surface shadow-none"
              >
                Browse All Colleges
              </Button>
            </div>
          </Card>
        )}

        {/* Comparison Table */}
        {selected.length > 0 && (
          <div className="overflow-hidden rounded-md border border-line bg-white shadow-none">
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                {/* College Cards Header Grid */}
                <div className="grid grid-cols-3 border-b border-line bg-neutral-surface">
                  <div className="p-4 md:p-6 flex flex-col justify-end">
                    <span className="text-xs uppercase font-bold tracking-wider text-ink-muted">
                      Institutions
                    </span>
                    <p className="text-sm text-ink-muted mt-1">
                      Direct feature matrix
                    </p>
                  </div>

                  {/* College 1 Column Header */}
                  <div className="border-l border-line p-5 text-center relative bg-white">
                    <button
                      onClick={() => removeCollege(0)}
                      title="Remove"
                      className="absolute top-3 right-3 p-1 rounded text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="space-y-3">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-line bg-surface text-xl font-bold text-brand">
                        {college1?.logo ? (
                          <img
                            src={college1.logo}
                            alt={college1.name}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <span>{college1?.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-ink line-clamp-1">
                          {college1?.name}
                        </h2>
                        <p className="text-xs text-ink-muted flex items-center justify-center gap-1 mt-1">
                          <MapPin size={12} /> {college1?.location?.city || 'Location N/A'}, {college1?.location?.state || ''}
                        </p>
                      </div>
                      <Link to={`/colleges/${college1?._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-md text-xs font-semibold h-8 mt-1 border-line hover:bg-blue-50 hover:text-brand hover:border-brand/40 shadow-none"
                        >
                          View Full Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* College 2 Column Header */}
                  <div className="border-l border-line p-5 text-center relative bg-white">
                    {college2 ? (
                      <>
                        <button
                          onClick={() => removeCollege(1)}
                          title="Remove"
                          className="absolute top-3 right-3 p-1 rounded text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                        >
                          <X size={16} />
                        </button>
                        <div className="space-y-3">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-line bg-surface text-xl font-bold text-brand">
                            {college2?.logo ? (
                              <img
                                src={college2.logo}
                                alt={college2.name}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <span>{college2?.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h2 className="text-base md:text-lg font-bold text-ink line-clamp-1">
                              {college2?.name}
                            </h2>
                            <p className="text-xs text-ink-muted flex items-center justify-center gap-1 mt-1">
                              <MapPin size={12} /> {college2?.location?.city || 'Location N/A'}, {college2?.location?.state || ''}
                            </p>
                          </div>
                          <Link to={`/colleges/${college2?._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-md text-xs font-semibold h-8 mt-1 border-line hover:bg-blue-50 hover:text-brand hover:border-brand/40 shadow-none"
                            >
                              View Full Details
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-line text-ink-muted">
                          <Plus size={22} />
                        </div>
                        <p className="mb-3 text-xs text-ink-muted font-medium">Add a second college to compare</p>
                        <Button
                          onClick={() => setShowModal(true)}
                          className="bg-brand hover:bg-brand-dark text-white rounded-md text-xs font-semibold h-8 px-3 shadow-none"
                        >
                          Select College
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section: Basic Information */}
                <div className="bg-neutral-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink-muted border-b border-line">
                  General Overview
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Ownership / Type</div>
                  <div className="border-l border-line p-3.5 text-center text-ink font-medium">
                    {college1?.collegeType || 'Private'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center text-ink font-medium">
                    {college2?.collegeType || (college2 ? 'Private' : '-')}
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Established Year</div>
                  <div className="border-l border-line p-3.5 text-center text-ink-muted">
                    {college1?.establishedYear || 'N/A'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center text-ink-muted">
                    {college2?.establishedYear || (college2 ? 'N/A' : '-')}
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Rating / Reviews</div>
                  <div className="border-l border-line p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-brand font-semibold text-xs">
                      <Star size={12} className="fill-brand" /> {college1?.rating || '4.0'} / 5.0
                    </span>
                  </div>
                  <div className="border-l border-line p-3.5 text-center">
                    {college2 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-brand font-semibold text-xs">
                        <Star size={12} className="fill-brand" /> {college2?.rating || '4.0'} / 5.0
                      </span>
                    ) : '-'}
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Category / Stream</div>
                  <div className="border-l border-line p-3.5 text-center text-ink font-medium">
                    {college1?.category || 'General'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center text-ink font-medium">
                    {college2?.category || (college2 ? 'General' : '-')}
                  </div>
                </div>

                {/* Section: Highlights & Campus */}
                <div className="bg-neutral-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink-muted border-b border-line">
                  Campus & Academics
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Campus Size</div>
                  <div className="border-l border-line p-3.5 text-center text-ink">
                    {college1?.highlights?.campusSize || 'N/A'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center text-ink">
                    {college2?.highlights?.campusSize || (college2 ? 'N/A' : '-')}
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Faculty Strength</div>
                  <div className="border-l border-line p-3.5 text-center text-ink">
                    {college1?.highlights?.facultyStrength || 'N/A'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center text-ink">
                    {college2?.highlights?.facultyStrength || (college2 ? 'N/A' : '-')}
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Total Courses Offered</div>
                  <div className="border-l border-line p-3.5 text-center font-semibold text-brand">
                    {college1?.highlights?.totalCourses || 'Multiple'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center font-semibold text-brand">
                    {college2?.highlights?.totalCourses || (college2 ? 'Multiple' : '-')}
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-line text-sm hover:bg-surface/50 transition-colors">
                  <div className="p-3.5 font-medium text-ink bg-neutral-surface/40">Key Facilities</div>
                  <div className="border-l border-line p-3.5 text-center text-xs text-ink-muted leading-relaxed">
                    {Array.isArray(college1?.facilities) ? college1.facilities.join(', ') : college1?.facilities || 'Library, Labs, Sports, Hostels'}
                  </div>
                  <div className="border-l border-line p-3.5 text-center text-xs text-ink-muted leading-relaxed">
                    {college2 ? (Array.isArray(college2?.facilities) ? college2.facilities.join(', ') : college2?.facilities || 'Library, Labs, Sports, Hostels') : '-'}
                  </div>
                </div>

                {/* Section: Action buttons row */}
                <div className="grid grid-cols-3 p-4 bg-surface text-center">
                  <div className="p-2 text-xs font-semibold text-ink-muted flex items-center">
                    Ready to Apply?
                  </div>
                  <div className="border-l border-line p-2">
                    <Link to={`/apply?collegeId=${college1?._id}`}>
                      <Button className="w-full bg-brand hover:bg-brand-dark text-white rounded-md text-xs font-semibold h-9 shadow-none">
                        Apply to {college1?.name?.slice(0, 15)}...
                      </Button>
                    </Link>
                  </div>
                  <div className="border-l border-line p-2">
                    {college2 ? (
                      <Link to={`/apply?collegeId=${college2?._id}`}>
                        <Button className="w-full bg-brand hover:bg-brand-dark text-white rounded-md text-xs font-semibold h-9 shadow-none">
                          Apply to {college2?.name?.slice(0, 15)}...
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => setShowModal(true)}
                        variant="outline"
                        className="w-full rounded-md text-xs font-semibold h-9 border-dashed border-line shadow-none"
                      >
                        + Add College
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add College Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-md border border-line bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-surface">
              <div>
                <h3 className="font-bold text-base text-ink">Select College to Compare</h3>
                <p className="text-xs text-ink-muted mt-0.5">Choose an institution to add to comparison</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md p-1.5 text-ink-muted hover:text-ink hover:bg-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-line">
              <input
                type="text"
                placeholder="Search by college name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-line px-3.5 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="max-h-[380px] overflow-y-auto p-4 space-y-2">
              {filteredColleges.length === 0 ? (
                <div className="p-8 text-center text-sm text-ink-muted">
                  No matching colleges available to compare.
                </div>
              ) : (
                filteredColleges.map((college) => (
                  <button
                    key={college._id}
                    onClick={() => addCollege(college)}
                    className="flex w-full items-center justify-between gap-3 rounded-md border border-line p-3 text-left hover:border-brand/40 hover:bg-blue-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface font-bold text-brand text-sm">
                        {college.logo ? (
                          <img
                            src={college.logo}
                            alt={college.name}
                            className="h-full w-full object-contain p-0.5"
                          />
                        ) : (
                          <span>{college.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{college.name}</p>
                        <p className="text-xs text-ink-muted truncate">
                          {college.location?.city || 'Location N/A'}, {college.location?.state || ''}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-brand">
                      Select
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
