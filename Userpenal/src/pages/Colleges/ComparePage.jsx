import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowLeft,
  Plus,
  X,
  Building2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ComparePage = () => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getColleges = async () => {
      const res = await axios.get('http://localhost:5001/api/college');
      setColleges(res.data?.colleges);
    };

    getColleges();
  }, []);

  const addCollege = (college) => {

    if (selected.length >= 2) return;


    setSelected([...selected, college]);
    setShowModal(false);
  };

  const college1 = selected[0];
  const college2 = selected[1];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => navigate('/colleges')} className="flex items-center gap-1 hover:text-slate-700">
            <ArrowLeft size={15} />Back
          </button>

          <span>/</span>
          <Link to="/">Home</Link>
          <span>/</span>

          <span className="text-slate-800">Compare Colleges</span>
        </div>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F5F1] text-[#0F766E]">
            <Building2 size={24} />
          </div>

          <h2 className="text-3xl font-bold text-slate-900">Compare Colleges</h2>
          <p className="mt-1 text-sm text-slate-500"> Compare colleges side-by-side</p>
        </div>

        {selected.length === 0 && (
          <Card className="mx-auto max-w-lg p-10 text-center">
            <Building2
              size={40}
              className="mx-auto mb-3 text-slate-400"
            />
            <p className="text-sm text-slate-500"> Select two colleges to compare</p>

            <div className="mt-5 flex justify-center gap-3">
              <Button onClick={() => setShowModal(true)} className="bg-[#0F766E] hover:bg-[#0C5C55]"><Plus size={16} className="mr-1" />Add College
              </Button>

              <Button variant="outline" onClick={() => navigate('/colleges')}>Home Colleges</Button>
            </div>
          </Card>
        )}

        {selected.length > 0 && (
          <>
            <div className="mb-4 flex justify-end">
              {selected.length < 2 && (
                <Button onClick={() => setShowModal(true)}
                  className="bg-[#0F766E] hover:bg-[#0C5C55]">
                  <Plus size={15} className="mr-1" /> Add College</Button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="min-w-[900px]">

                <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">

                  <div className="p-4 font-semibold text-slate-600">
                  </div>

                  <div className="border-l border-slate-200 p-5 text-center">
                    <div className="space-y-3">

                      <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#E6F5F1] text-xl font-bold text-[#0F766E]">

                        {college1?.logo ? (
                          <img
                            src={college1.logo}
                            alt={college1.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>
                            {college1?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{college1?.name}</h3>
                    </div>
                  </div>


                  <div className="border-l border-slate-200 p-5 text-center">

                    {college2 ? (
                      <div className="space-y-3">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#E6F5F1] text-xl font-bold text-[#0F766E]">

                          {college2?.logo ? (
                            <img
                              src={college2.logo}
                              alt={college2.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>
                              {college2?.name?.charAt(0)}
                            </span>
                          )}

                        </div>

                        <h3 className="text-lg font-bold text-slate-900">{college2?.name}</h3>
                      </div>
                    ) : (
                      <div className="flex min-h-[140px] flex-col items-center justify-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Plus size={24} />
                        </div>
                        <p className="mb-3 text-sm text-slate-500">Add another college</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-100 p-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Basic Details</div>

                <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium">College Name</div>

                  <div className="border-l p-3 text-center">{college1?.name}</div>

                  <div className="border-l p-3 text-center">{college2?.name}</div>
                </div>

                 <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium">Category</div>
                  <div className="border-l p-3 text-center">{college1?.category}</div>
                  <div className="border-l p-3 text-center">{college2?.category}</div>
                </div>

                <div className='grid grid-cols-3 border -b text-sm'>
                  <div className='bg-slate-50 p-3 font-medium'>Ownership</div>
                  <div className='border-l p-3 tet-center'>{college1?.collegeType}</div>
                  <div className='border-l p-3 text-center'>{college2?.collegeType}</div>
                </div>

                <div className='grid grid-cols-3 border text-sm'>
                  <div className='bg-slate-50 font-medium'>Established year</div>
                  <div className='border-l p-3 text-center'>{college1?.establishedYear}</div>
                  <div className='border-l p-3 text-center'>{college2?.establishedYear}</div>
                </div>

                <div className='grid grid-cols-3 border text-sm'>
                  <div className='bg-slate-50 p-3 font-medium'>Description</div>
                  <div className='border-l p-3 text-center'>{college1?.description}</div>
                  <div className='border-l p-3' text-center>{college2?.description}</div>
                </div>

                <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium text-slate-600">Rating</div>

                  <div className="border-l border-slate-200 p-3 text-center">{college1?.rating}</div>

                  <div className="border-l border-slate-200 p-3 text-center">{college2?.rating}</div>
                </div>
                <div className="bg-slate-100 p-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Quick Highlights
                </div>

                <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium">Faculty Strength</div>

                  <div className="border-l p-3 text-center">{college1?.highlights?.facultyStrength}
                  </div>

                  <div className="border-l p-3 text-center">{college2?.highlights?.facultyStrength}</div>
                </div>

                <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium">Campus Size</div>

                  <div className="border-l p-3 text-center">{college1?.highlights?.campusSize}</div>

                  <div className="border-l p-3 text-center">{college2?.highlights?.campusSize}</div>
                </div>

                <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium">Total Courses</div>

                  <div className="border-l p-3 text-center">{college1?.highlights?.totalCourses}</div>

                  <div className="border-l p-3 text-center">{college2?.highlights?.totalCourses}</div>
                </div>

                <div className="grid grid-cols-3 border-b text-sm">
                  <div className="bg-slate-50 p-3 font-medium">Facilities</div>

                  <div className="border-l p-3 text-center">{college1?.facilities}</div>

                  <div className="border-l p-3 text-center">{college2?.facilities}</div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">

            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-slate-800">
                Add College
              </h2>

              <button onClick={() => setShowModal(false)} className="rounded-full p-1 hover:bg-slate-100"><X size={18} /></button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-3">

              {colleges.map((college) => (

                <button
                  key={college._id}
                  onClick={() => addCollege(college)}
                  className="mb-2 flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#E6F5F1] font-bold text-[#0F766E]">

                    {college.logo ? (
                      <img
                        src={college.logo}
                        alt={college.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {(college.name)}
                      </span>
                    )}

                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">{college.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
