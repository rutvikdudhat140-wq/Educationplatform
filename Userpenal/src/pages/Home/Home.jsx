import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search,
  MapPin,
  BookOpen,
  FileText,
  GraduationCap,
  Building2,
  BarChart3,
  Stethoscope,
  Scale,
  Settings2,
  BriefcaseBusiness,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpcomingExamsSection from '../Exams/UpcomingExamsSection';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');


  useEffect(() => {
    const loadHomeData = async () => {


      try {
        const [collegeResponse, courseResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/college?status=Active'),
          axios.get('http://localhost:5001/api/course/popular'),
        ]);

        const collegeData =
          collegeResponse.data?.colleges ||
          collegeResponse.data?.data ||
          [];
        const courseData =
          courseResponse.data?.data ||
          courseResponse.data?.courses ||
          [];

        setColleges(
          Array.isArray(collegeData)
            ? collegeData.filter((college) => college.status !== 'Inactive')
            : []
        );
        setPopularCourses(Array.isArray(courseData) ? courseData : []);
      } catch {

      }
    };

    loadHomeData();
  }, []);

  const locations = [];

  colleges.forEach((college) => {
    const city = college.location?.city;

    if (city && !locations.includes(city)) {
      locations.push(city);
    }
  });

  locations.sort();

  const matchingColleges = colleges
    .filter((college) => {
      const name = college.name?.toLowerCase();
      const city = college.location?.city;

      return (
        name.includes(searchTerm.toLowerCase()) &&
        (!selectedLocation || city === selectedLocation)
      );
    })
    .slice(0, 8);

  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#17233C]">

      <main>

        <section className="relative min-h-[770px] overflow-hidden bg-gradient-to-b from-[#F4FBF9] via-[#F8FCFB] to-white">

          <div className="relative mx-auto max-w-[1180px] px-5 pt-[60px] sm:px-8 lg:px-0">

            <div className="grid items-center gap-5 lg:grid-cols-[0.95fr_1.05fr]">

              <div className="relative z-20 pt-2 lg:pt-5">

                <Badge className="mb-5 rounded-full border-0 bg-[#DDF8EA] px-4 py-2 text-[13px] font-semibold text-[#087F70] shadow-none">
                  <span className="mr-2 text-[16px]">☆</span>
                  Your College Discovery Platform
                </Badge>

                <h1 className="max-w-[620px] text-[43px] font-bold leading-[1.12] tracking-[-1.8px] text-[#142039] sm:text-[50px] lg:text-[52px]">

                  Discover the Right College

                  <span className="block text-[#087F70]">
                    for Your Future.
                  </span>

                </h1>

                <p className="mt-5 max-w-[570px] text-[16px] leading-7 text-[#5F6674] sm:text-[17px]">
                  Explore colleges, compare courses, check entrance exams
                  and discover admission opportunities.
                </p>

              </div>

              <div className="relative h-[310px] sm:h-[360px] lg:h-[390px]">

                <img
                  src="./college-building.png"
                  alt="College"
                  className="absolute bottom-[-12px] left-1/2 z-10 w-[650px] max-w-none -translate-x-1/2 object-contain sm:w-[720px] lg:left-[48%] lg:w-[730px]"
                />

              </div>

            </div>

            {/* SEARCH CARD */}
            <Card className="relative z-40 mx-auto mt-[-12px] max-w-[780px] rounded-[12px] border border-[#DFE9E7] bg-white shadow-[0_8px_24px_rgba(25,71,64,0.08)]">

              <CardContent className="p-4">

                <div className="mb-3 flex items-center gap-2">

                  <Search className="size-[18px] text-[#087F70]" />

                  <h2 className="text-[16px] font-bold text-[#17233C]">
                    Search for Colleges
                  </h2>

                </div>

                {/* COLLEGE SEARCH */}
                <div className="relative">

                  <Search className="absolute left-3 top-1/2 z-10 size-[16px] -translate-y-1/2 text-[#89919D]" />

                  <Input
                    type="text"
                    placeholder="Search by college name..."
                    value={searchTerm}
                    autoComplete="off"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-[38px] rounded-[7px] border-[#CDD5DC] bg-white pl-9 text-[13px] shadow-none focus-visible:ring-[#0F766E]"
                  />

                  {searchTerm && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[10px] border bg-white shadow-xl">

                      {matchingColleges.length > 0 ? (

                        <div className="max-h-72 overflow-y-auto p-1">

                          {matchingColleges.map((college) => (

                            <button
                              key={college._id}
                              type="button"
                              onClick={() =>
                                navigate(`/colleges/${college._id}`)
                              }
                              className="w-full rounded-lg px-4 py-3 text-left hover:bg-[#ECFDF5]"
                            >

                              <p className="text-sm font-semibold text-slate-900">
                                {college.name}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {college.location?.city}
                                {college.location?.state &&
                                  `, ${college.location.state}`}
                              </p>

                            </button>

                          ))}

                        </div>

                      ) : (

                        <p className="px-4 py-4 text-sm text-muted-foreground">
                          No matching colleges found.
                        </p>

                      )}

                    </div>
                  )}

                </div>

                {/* FILTERS */}
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">

                  {/* LOCATION */}
                  <div className="space-y-2">

                    <Label className="text-[12px] font-semibold text-[#17233C]">
                      Location
                    </Label>

                    <div className="relative">

                      <MapPin className="absolute left-3 top-1/2 size-[16px] -translate-y-1/2 text-[#7D8792]" />

                      <select
                        value={selectedLocation}
                        onChange={(e) =>
                          setSelectedLocation(e.target.value)
                        }
                        className="h-[38px] w-full appearance-none rounded-[7px] border border-[#CDD5DC] bg-white pl-9 pr-8 text-[12px] text-[#5D6672] outline-none focus:border-[#0F766E]"
                      >

                        <option value="">
                          Select Location
                        </option>

                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}

                      </select>

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px]">
                        ▾
                      </span>

                    </div>

                  </div>


                  <div className="space-y-2">

                    <Label className="text-[12px] font-semibold text-[#17233C]">
                      Course
                    </Label>

                    <div className="relative">

                      <BookOpen className="absolute left-3 top-1/2 size-[16px] -translate-y-1/2 text-[#7D8792]" />

                      <select className="h-[38px] w-full appearance-none rounded-[7px] border border-[#CDD5DC] bg-white pl-9 pr-8 text-[12px] text-[#5D6672] outline-none focus:border-[#0F766E]">

                        <option>Select Course</option>
                        <option>B.Tech</option>
                        <option>MBA</option>
                        <option>MBBS</option>
                        <option>LLB</option>

                      </select>

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px]">
                        ▾
                      </span>

                    </div>

                  </div>


                  <div className="space-y-2">

                    <Label className="text-[12px] font-semibold text-[#17233C]">
                      Entrance Exam
                    </Label>

                    <div className="relative">

                      <FileText className="absolute left-3 top-1/2 size-[16px] -translate-y-1/2 text-[#7D8792]" />

                      <select className="h-[38px] w-full appearance-none rounded-[7px] border border-[#CDD5DC] bg-white pl-9 pr-8 text-[12px] text-[#5D6672] outline-none focus:border-[#0F766E]">

                        <option>Select Exam</option>
                        <option>JEE Main</option>
                        <option>CAT</option>
                        <option>NEET</option>
                        <option>GATE</option>

                      </select>

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px]">
                        ▾
                      </span>

                    </div>

                  </div>

                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (matchingColleges.length > 0) {
                      navigate(`/colleges/${matchingColleges[0]._id}`);
                    }
                  }}
                  className="mt-3 h-[40px] w-full rounded-[7px] bg-[#078675] text-[13px] font-semibold shadow-none hover:bg-[#086F63]"
                >
                  <Search className="mr-2 size-[16px]" />
                  Search Colleges
                </Button>



              </CardContent>

            </Card>





            <div className="relative z-30 mt-4 flex flex-wrap justify-center gap-3">

              <Button
                type="button"
                onClick={() => navigate('/colleges/all-colleges')}
                className="h-[42px] rounded-[8px] bg-[#087F70] px-6 text-[14px] font-semibold shadow-sm hover:bg-[#086F63]"
              >
                <Building2 className="mr-2 size-[17px]" />
                Explore Colleges
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/predictors")}
                className="h-[42px] rounded-[8px] bg-[#087F70] px-6 text-[14px] font-semibold shadow-sm hover:bg-[#086F63]"
              >
                <Building2 className="mr-2 size-[17px]" />
                Predictor
              </Button>
            </div>


            <div className="relative z-30 mt-2">

              <p className="mb-3 text-center text-[13px] font-medium text-[#636B75]">
                Popular Searches
              </p>

              <div className="flex flex-wrap justify-center gap-2">

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <Settings2 className="mr-2 size-[15px]" />
                  Engineering
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <BriefcaseBusiness className="mr-2 size-[15px]" />
                  MBA
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <Stethoscope className="mr-2 size-[15px]" />
                  Medical
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <Scale className="mr-2 size-[15px]" />
                  Law
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <GraduationCap className="mr-2 size-[15px]" />
                  B.Tech
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <FileText className="mr-2 size-[15px]" />
                  JEE Main
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-[37px] rounded-full border-[#75BDB2] bg-white px-4 text-[12px] font-medium text-[#087F70] hover:bg-[#ECFDF5]"
                >
                  <BarChart3 className="mr-2 size-[15px]" />
                  CAT
                </Button>

              </div>

            </div>
            {colleges.length > 0 && (
              <section className="relative z-30 mt-12 px-5">
                <div className="mb-5 text-center">
                  <h2 className="text-[20px] font-bold tracking-[-0.4px] text-[#17233C] sm:text-[28px]">
                    Top Colleges
                  </h2>
                  <p className="mt-1 text-[12px] text-[#636B75] sm:text-[13px]">
                    Explore all active colleges to find your perfect fit
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {colleges.map((college) => {
                    const location = [
                      college.location?.city,
                      college.location?.state,
                    ]
                      .filter(Boolean)
                      .join(', ');
                    const courseCount =
                      college.courses?.length ||
                      college.highlights?.totalCourses ||
                      'N/A';

                    return (
                      <div
                        key={college._id}
                        onClick={() => navigate(`/colleges/${college._id}`)}
                        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#DDE7E5] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#A7D9CB] hover:shadow-md"
                      >
                        <div className="h-40 overflow-hidden bg-[#EAF5F1]">
                          {college.coverImage ||
                            college.images?.[0] ||
                            college.logo ? (
                            <img
                              src={
                                college.coverImage ||
                                college.images?.[0] ||
                                college.logo
                              }
                              alt={college.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#087F70]">
                              <Building2 className="size-12" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-4">
                          <Badge className="w-fit rounded-full bg-[#DDF8EA] text-[10px] font-semibold text-[#087F70] shadow-none">
                            {college.category || 'College'}
                          </Badge>

                          <h3 className="mt-3 line-clamp-2 min-h-[36px] text-[15px] font-bold leading-5 text-[#17233C]">
                            {college.name}
                          </h3>

                          <p className="mt-2 flex items-center gap-1 text-[11px] text-[#636B75]">
                            <MapPin className="size-3 shrink-0" />
                            <span className="line-clamp-1">
                              {location || 'Location not available'}
                            </span>
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-[#F7FBFA] px-3 py-2">
                              <p className="text-[10px] text-[#7A8391]">
                                Rating
                              </p>
                              <p className="mt-1 text-[13px] font-bold text-[#17233C]">
                                {Number(college.rating || 0).toFixed(1)}
                              </p>
                            </div>
                            <div className="rounded-lg bg-[#F7FBFA] px-3 py-2">
                              <p className="text-[10px] text-[#7A8391]">
                                Courses
                              </p>
                              <p className="mt-1 text-[13px] font-bold text-[#17233C]">
                                {courseCount}
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t border-[#DDE7E5] pt-3 text-[11px] font-semibold text-[#087F70]">
                            <span>View Details</span>
                            <span aria-hidden="true">→</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}


            {popularCourses.length > 0 && (
              <section className="z-30 mt-12  px-5 ">
                <div className="mb-5 text-center">
                  <h2 className="text-[20px] font-bold tracking-[-0.4px] text-[#17233C] sm:text-[28px]">
                    Popular Courses
                  </h2>

                  <p className="mt-1 text-[12px] text-[#636B75] sm:text-[13px]">
                    Most sought-after programs across universities
                  </p>

                  {/* <button
                    type="button"
                    onClick={() => navigate('/courses')}
                    className="mt-2 inline-flex items-center gap-2 text-[12px] font-semibold text-[#087F70] transition hover:text-[#086F63] sm:text-[13px]"
                  >
                    View All Courses
                  </button> */}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {popularCourses.slice(0, 6).map((course) => (
                    <div
                      key={course._id}
                      className="flex h-full cursor-pointer flex-col rounded-[16px] border border-[#DDE7E5] bg-[#F7FBFA] p-4 transition hover:-translate-y-0.5 hover:border-[#A7D9CB] hover:shadow-sm"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B7E2D6] bg-[#DFF5EE] text-[#0A7D69]">
                          <GraduationCap className="size-4" />
                        </div>

                        <span className="text-[10px] font-medium text-[#0A7D69]">
                          {course.stream || 'General'}
                        </span>
                      </div>

                      <div className="mt-3 min-h-[24px] text-[15px] font-bold text-[#17233C] sm:text-[16px]">
                        {course.name}
                      </div>


                      <div className="mt-1 min-h-[36px] text-[11px] leading-5 text-[#636B75] sm:text-[12px]">
                        {course.fullName || "Bachelor's degree"}
                      </div>


                      <div className="mt-3 flex items-center gap-2 text-[10px] text-[#636B75] sm:text-[11px]">
                        <span className="rounded-full bg-white px-2.5 py-1 text-[#2C374A]">
                          {course.duration}
                        </span>

                        <span className="rounded-full bg-white px-2.5 py-1 text-[#2C374A]">
                          {course.level}
                        </span>
                      </div>

                      <div className="mt-3 rounded-xl border border-[#E2ECE9] bg-white px-3 py-2.5">
                        <div className="text-[10px] text-[#7A8391]">
                          Fees
                        </div>

                        <div className="mt-1 text-[14px] font-semibold text-[#17233C]">
                          ₹{Number(course.fees || 0).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-between border-t border-[#DDE7E5] pt-3 text-[11px] font-medium text-[#0A7D69] sm:text-[12px]">
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="z-30 mt-12  px-5 pb-16">
              <div className="mb-5 text-center">
                <h2 className="text-[20px] font-bold tracking-[-0.4px] text-[#17233C] sm:text-[28px]">
                  Upcoming <span className="text-[#0F766E]">Exams</span>
                </h2>
                <p className="mt-1 text-[12px] text-[#636B75] sm:text-[13px]">
                  Stay updated with the latest exam schedules
                </p>
              </div>

              <div className="mx-auto max-w-[1140px]">
                <UpcomingExamsSection view="upcoming" compact={true} />
              </div>
            </section>

          </div>

        </section>

      </main>

    </div>
  );
}
