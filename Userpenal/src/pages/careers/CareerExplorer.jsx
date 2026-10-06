import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STREAMS = [
  "Engineering",
  "Technology",
  "Management",
  "Science",
  "Commerce",
  "Arts",
  "Education",
  "Agriculture",
  "Design",
  "Pharmacy",
  "Medical",
  "Law",
  "Hotel Management",
  "Computer Applications",
];

export default function CareerExplorer() {
  const navigate = useNavigate();

  const [selectedStream, setSelectedStream] = useState("Engineering");
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/career",
          {
            params: {
              stream: selectedStream,
            },
          }
        );

        setCareers(response.data?.careers || []);
      } catch (error) {
        setCareers([]);
      }
    };

    fetchCareers();
  }, [selectedStream]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-amber-50 px-4 py-10 text-center text-black">
        <Badge className="mb-3 bg-slate-700">
          Career Guide
        </Badge>
    
        <h1 className="text-3xl font-bold">
          Career Path Explorer
        </h1>

        <p className="mt-2 text-sm text-slate-700">
          Discover careers, salaries and education paths
        </p>
      </section>

      {/* Streams */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {STREAMS.map((stream) => (
            <button
              key={stream}
              type="button"
              onClick={() => setSelectedStream(stream)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedStream === stream
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-emerald-300"
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 font-semibold text-emerald-700">
                {stream.charAt(0)}
              </div>

              <h3 className="font-semibold">
                {stream}
              </h3>

              <p className="mt-2 text-sm text-emerald-600">
                Explore Careers
              </p>
            </button>
          ))}
        </div>

        {/* Selected Stream */}
        <Card className="mt-8">
          <CardContent className="p-5">
            <h2 className="text-2xl font-semibold">
              {selectedStream} Careers Path
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore careers available in this stream
            </p>
          </CardContent>
        </Card>

        {/* Careers */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {careers.length > 0 ? (
            careers.map((career) => (
              <Card
                key={career._id}
                className="h-full border border-slate-200 shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {career.name}
                    </h3>

                    {career.workType && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                        {career.workType}
                      </span>
                    )}
                  </div>

                  {career.description && (
                    <p className="mb-4 text-sm leading-6 text-slate-600">
                      {career.description}
                    </p>
                  )}

                  <div className="space-y-3 text-sm text-slate-600">
                    {/* Salary */}
                    {(career.salaryMin || career.salaryMax) && (
                      <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500">
                          Salary
                        </span>

                        <span className="font-medium text-slate-800">
                          {career.salaryMin || ""}

                          {career.salaryMin && career.salaryMax && " - "}

                          {career.salaryMax || ""}{" "}
                          {career.salaryUnit || ""}
                        </span>
                      </div>
                    )}

                    {/* Education */}
                    {career.education && (
                      <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500">
                          Education
                        </span>

                        <span className="font-medium text-slate-800">
                          {career.education}
                        </span>
                      </div>
                    )}

                    {/* Growth */}
                    {career.growthLevel && (
                      <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500">
                          Growth
                        </span>

                        <span className="font-medium text-slate-800">
                          {career.growthLevel}
                        </span>
                      </div>
                    )}

                    {/* Skills */}
                    {career.skills?.length > 0 && (
                      <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                        <span className="text-slate-500">
                          Skills
                        </span>

                        <span className="text-right font-medium text-slate-800">
                          {career.skills.join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Related Courses */}
                    {career.relatedCourses?.length > 0 && (
                      <div className="border-b border-slate-100 pb-2">
                        <span className="text-slate-500">
                          Related Courses
                        </span>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {career.relatedCourses.map((course, index) => (
                            <span
                              key={course?._id || index}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {course?.name || course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No careers found for {selectedStream}.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() =>
              navigate(`/courses?stream=${selectedStream}`)
            }
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Browse {selectedStream} Colleges
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/courses")}
          >
            Related Exams
          </Button>
        </div>
      </section>
    </div>
  );
}
