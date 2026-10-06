import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Award, Filter, ChevronRight, BarChart3, Building } from 'lucide-react';

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [filters, setFilters] = useState({ rankingBody: '', year: '', category: '', state: '', city: '', search: '' });
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    setLoading(true);
    const params = {};
    if (filters.rankingBody) params.rankingBody = filters.rankingBody;
    if (filters.year) params.year = filters.year;
    if (filters.category) params.category = filters.category;
    if (filters.state) params.state = filters.state;
    if (filters.city) params.city = filters.city;
    if (filters.search) params.search = filters.search;
    
    try {
      const res = await axios.get('http://localhost:5001/api/rankings', { params });
      setRankings(res.data.rankings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRankings(); }, [filters]);

  const displayRank = (r) => {
    if (r.rankType === 'Range') return `${r.rankFrom || ''}-${r.rankTo || ''}`;
    return r.rank !== undefined && r.rank !== null ? `#${r.rank}` : '—';
  };

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const clearFilters = () => setFilters({ rankingBody: '', year: '', category: '', state: '', city: '', search: '' });

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans">
      {/* Hero Banner */}
      <div className="bg-[#0B1E36] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-3 mb-4 text-[#8C9BB0] text-[13px] font-medium">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">College Rankings</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Top College Rankings in India</h1>
          <p className="text-[#8C9BB0] text-[15px] max-w-2xl leading-relaxed">
            Discover the best colleges and universities evaluated by leading ranking bodies like NIRF, QS, India Today, and Outlook based on academic excellence, placement records, and infrastructure.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Filters */}
          <div className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
              <div className="bg-[#F8FAFC] px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <Filter size={18} className="text-[#0F766E]" />
                  Filter Rankings
                </div>
                <button onClick={clearFilters} className="text-[12px] font-medium text-red-500 hover:text-red-700">Clear All</button>
              </div>
              
              <div className="p-5 flex flex-col gap-5">
                {/* Search */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Search College</label>
                  <div className="relative">
                    <input
                      name="search"
                      placeholder="e.g. IIT Madras..."
                      value={filters.search}
                      onChange={handleChange}
                      className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-[13px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                {/* Ranking Body */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Ranking Body</label>
                  <select name="rankingBody" value={filters.rankingBody} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-[13px] text-slate-700 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none">
                    <option value="">All Bodies</option>
                    <option value="NIRF">NIRF</option>
                    <option value="QS">QS World</option>
                    <option value="India Today">India Today</option>
                    <option value="Outlook">Outlook</option>
                    <option value="The Week">The Week</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Year</label>
                  <select name="year" value={filters.year} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-[13px] text-slate-700 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none">
                    <option value="">All Years</option>
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Category</label>
                  <input
                    name="category"
                    placeholder="e.g. Engineering, Medical"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-[13px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none transition-all"
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">State</label>
                    <input
                      name="state"
                      placeholder="State"
                      value={filters.state}
                      onChange={handleChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-[13px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">City</label>
                    <input
                      name="city"
                      placeholder="City"
                      value={filters.city}
                      onChange={handleChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-[13px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Content: Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-800">
                {rankings.length} Ranking{rankings.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {rankings.map((r, index) => (
                <div key={r._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6 group">
                  
                  {/* Rank Badge */}
                  <div className="flex-shrink-0 flex items-center justify-center w-[100px] h-[100px] rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100 text-center">
                    <div>
                      <div className="text-[12px] font-bold text-teal-600 uppercase tracking-wider mb-1">Rank</div>
                      <div className="text-3xl font-extrabold text-[#0B1E36]">
                        {displayRank(r).replace('#', '')}
                      </div>
                    </div>
                  </div>

                  {/* College Details */}
                  <div className="flex-1">
                    <Link
                      to={`/colleges/${r.collegeId?._id}`}
                      className="text-[18px] font-bold text-[#0B1E36] hover:text-[#0F766E] transition-colors leading-tight block mb-2"
                    >
                      {r.collegeId?.name || '—'}
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500 mb-4">
                      {(r.collegeId?.location?.city || r.collegeId?.location?.state) && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          {[r.collegeId.location.city, r.collegeId.location.state].filter(Boolean).join(', ')}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Award size={14} className="text-yellow-500" />
                        {r.rankingBody} {r.year}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-blue-500" />
                        {r.category || 'Overall'} Category
                      </div>
                    </div>

                    {/* Quick Stats Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600">
                        Ranking Name: <span className="text-slate-800">{r.rankingName}</span>
                      </span>
                      {r.score !== undefined && r.score !== null && (
                        <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
                          Score: <span className="font-bold">{r.score}</span> {r.scoreOutOf ? `/ ${r.scoreOutOf}` : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2 mt-4 md:mt-0 w-full md:w-[160px]">
                    <Link
                      to={`/colleges/${r.collegeId?._id}`}
                      className="w-full flex items-center justify-center gap-2 bg-[#0B1E36] hover:bg-[#1E3A5F] text-white text-[13px] font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                      View Details
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                  
                </div>
              ))}

              {!loading && rankings.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center">
                  <Building size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No Rankings Found</h3>
                  <p className="text-[14px] text-slate-500 max-w-md mb-6">
                    We couldn't find any college rankings matching your current filters. Try adjusting your search criteria.
                  </p>
                  <button onClick={clearFilters} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-6 rounded-lg text-[14px] transition-colors">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RankingPage;
