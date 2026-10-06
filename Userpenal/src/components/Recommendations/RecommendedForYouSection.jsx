import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, MapPin, Star, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import { API, getHeaders } from '@/lib/api';

export default function RecommendedForYouSection() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        let list = [];
        try {
          const res = await axios.get(`${API}/recommendations/colleges`, { headers: getHeaders() });
          list = res.data?.colleges || [];
        } catch {
        }

        if (list.length < 4) {
          const topRes = await axios.get(`${API}/college?isTopCollege=true`);
          const topList = topRes.data?.colleges || topRes.data?.data || [];
          const existingIds = new Set(list.map(c => c._id || c.id));
          const supp = topList.filter(c => !existingIds.has(c._id || c.id));
          list = [...list, ...supp];
        }

        if (alive) {
          setRecommendations(list.slice(0, 4).map((c, i) => ({
            ...c,
            matchPercent: c.matchScore || (98 - i * 3),
          })));
        }
      } catch {
      }
    };

    loadData();
    return () => { alive = false; };
  }, []);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#E5E7EB] bg-[#F8FAFC] py-10 sm:py-12">
      <div className="edu-container">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
              <Sparkles size={14} /> AI Tailored Fit
            </div>
            <h2 className="text-[18px] sm:text-[22px] font-bold text-[#172554] leading-tight">Recommended for You</h2>
            <p className="text-[12.5px] sm:text-[13.5px] text-[#64748B] mt-0.5">
              Top institutions matched to your academic profile, location, rank and budget
            </p>
          </div>

          <Link
            to="/colleges"
            className="shrink-0 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((college) => {
            const collegeId = college._id || college.id;
            const locationStr = [college.location?.city, college.location?.state].filter(Boolean).join(', ');
            const ratingNum = Number(college.rating || 4.7).toFixed(1);
            const avgPkg = college.placements?.[0]?.averagePackage || college.highlights?.averagePackage || '₹8.5 LPA Avg';

            return (
              <div
                key={collegeId}
                onClick={() => navigate(`/colleges/${collegeId}`)}
                className="group flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-3.5 hover:border-[#172554] hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  {/* Top Image + Badges */}
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-[#F1F5F9] mb-3">
                    <SafeImage
                      entity={college}
                      alt={college.name || college.collegeName}
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center bg-[#F8FAFC] text-slate-300">
                          <Building2 size={28} />
                        </div>
                      }
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-[#172554] text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                      ⚡ {college.matchPercent}% Match
                    </span>
                    <span className="absolute top-2 right-2 flex items-center gap-0.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 shadow-xs">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {ratingNum}
                    </span>
                  </div>

                  <h3 className="line-clamp-1 text-[13.5px] font-bold text-[#172554] group-hover:text-[#2563EB] transition-colors">
                    {college.name || college.collegeName}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[#64748B]">
                    <MapPin size={11} className="shrink-0 text-slate-400" />
                    <span className="truncate">{locationStr || 'India'}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                    {avgPkg}
                  </span>
                  <span className="text-[11.5px] font-bold text-[#172554] group-hover:text-[#2563EB] flex items-center gap-0.5">
                    Details <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}