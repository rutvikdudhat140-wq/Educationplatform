import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

/* ───────────────────────── Utility Functions ────────────────────────── */
const displayRank = (r) => {
  if (r.rankType === 'Range') return `${r.rankFrom || ''}-${r.rankTo || ''}`;
  return r.rank !== undefined && r.rank !== null ? String(r.rank) : '—';
};

const ordinal = (n) => {
  if (!n || n === '—') return '—';
  const s = String(n);
  if (s.includes('-')) return s;
  const num = parseInt(n);
  if (isNaN(num)) return s;
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

/* ───────────────────────── Section Heading ────────────────────────── */
const SectionHeading = ({ children }) => (
  <h2 className="mb-4 text-[18px] md:text-[20px] font-bold text-[#0B1E36] tracking-tight">{children}</h2>
);

/* ────────────────────── Author Info Box ──────────────────────────────── */
const AuthorInfo = ({ updatedAt }) => {
  const dateStr = new Date(updatedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric'
  });
  
  return (
    <div className="flex items-center gap-3 py-4 border-b border-dashed border-slate-200 mb-8">
      <div className="relative">
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
          <UserCircle2 size={24} />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
          <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-100" />
        </div>
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-700">
          Written By <span className="text-blue-600 cursor-pointer hover:underline">Admin - Content Writer</span>
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5">Updated on - {dateStr}</p>
      </div>
    </div>
  );
};

/* ────────────────────── About Section ──────────────────────────────── */
const AboutSection = ({ collegeName, description }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 400;
  const isLong = description && description.length > limit;

  return (
    <div className="mb-10">
      <SectionHeading>About {collegeName} Ranking</SectionHeading>
      <div className="text-[14px] leading-[1.8] text-[#475569] text-justify space-y-4">
        {isLong && !expanded ? (
          <p>{description.slice(0, limit)}...</p>
        ) : (
          <p>{description}</p>
        )}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {expanded ? 'Read Less' : 'Read More'} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </div>
  );
};

/* ───────────── Exact CollegeDekho-style Table ───────────────── */
const RankingTable = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-lg border border-[#E2E8F0] mb-2">
    <table className="w-full text-[14px]">
      <thead>
        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          {headers.map((h, i) => (
            <th key={i} className="px-5 py-3.5 text-left font-bold text-[#1E293B] whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50/50 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className={`px-5 py-4 text-[#475569] ${j === row.length - 1 ? 'font-medium text-[#0F766E]' : ''}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ──────────────── SVG Trend Chart Component ──────────────────────── */
const TrendChart = ({ trendData }) => {
  if (!trendData || trendData.length < 2) return null;
  const sorted = [...trendData].sort((a, b) => a.year - b.year);
  
  const width = 800;
  const height = 280;
  const paddingX = 40;
  const paddingY = 40;
  
  const ranks = sorted.map(d => parseInt(d.indiaRank || d.globalRank) || 0).filter(r => r > 0);
  if (!ranks.length) return null;
  
  const minRank = Math.max(1, Math.min(...ranks) - 2);
  const maxRank = Math.max(...ranks) + 2;
  const rankRange = Math.max(1, maxRank - minRank);
  
  const points = sorted.map((d, i) => {
     const x = paddingX + (i * ((width - paddingX * 2) / (sorted.length - 1)));
     const rank = parseInt(d.indiaRank || d.globalRank) || maxRank;
     // lower rank is better -> higher up on Y axis
     const y = paddingY + ((rank - minRank) / rankRange) * (height - paddingY * 2);
     return { x, y, year: d.year, rank };
  });

  const pathD = `M ${points[0].x} ${points[0].y} ` + points.map(p => `L ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length-1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
     <div className="w-full overflow-x-auto my-6 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
       <div className="min-w-[500px]">
         <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
           <defs>
             <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
               <stop offset="100%" stopColor="#34D399" stopOpacity="0.0" />
             </linearGradient>
           </defs>
           
           {/* Grid lines */}
           {[0, 0.25, 0.5, 0.75, 1].map(pct => {
             const y = paddingY + (height - paddingY * 2) * pct;
             return <line key={pct} x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#F1F5F9" strokeWidth="1" />;
           })}
           
           <path d={areaD} fill="url(#chartGradient)" />
           <path d={pathD} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
           
           {points.map((p, i) => (
             <g key={i}>
               <circle cx={p.x} cy={p.y} r="6" fill="#ffffff" stroke="#10B981" strokeWidth="2.5" />
               {/* Rank label */}
               <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize="13" fill="#1E293B" fontWeight="700">{p.rank}</text>
               {/* Year label */}
               <text x={p.x} y={height - paddingY + 25} textAnchor="middle" fontSize="13" fill="#64748B" fontWeight="600">{p.year}</text>
             </g>
           ))}
         </svg>
       </div>
     </div>
  );
};


/* ─────────── Ranking Body-wise Section (QS, India Today etc.) ──────── */
const RankingBodySection = ({ collegeName, body, rankingsByBody }) => {
  const latest = rankingsByBody[0];
  return (
    <div className="mb-10">
      <SectionHeading>{collegeName} {latest.rankingName} {latest.year}</SectionHeading>
      {latest?.description && (
        <p className="mb-5 text-[14px] leading-[1.8] text-[#475569]">{latest.description}</p>
      )}
      <RankingTable
        headers={['Ranking Body', 'Category', 'Rank']}
        rows={rankingsByBody.map(r => [
          r.rankingName,
          r.category || 'Overall',
          ordinal(displayRank(r))
        ])}
      />
    </div>
  );
};

/* ──────────────── Indicator Scores Section ──────────────────────── */
const IndicatorSection = ({ collegeName, ranking }) => {
  if (!ranking?.indicators?.length && !ranking?.score) return null;
  const scoreLabel = ranking.scoreOutOf ? `(out of ${ranking.scoreOutOf})` : '';

  return (
    <div className="mb-10">
      <SectionHeading>
        {collegeName} {ranking.rankingName} Indicator Scores {ranking.year}
      </SectionHeading>
      {ranking.description && (
        <p className="mb-5 text-[14px] leading-[1.8] text-[#475569]">{ranking.description}</p>
      )}
      <RankingTable
        headers={[
          `${ranking.rankingBody} ${ranking.year} Indicator`,
          `${collegeName} Score ${scoreLabel}`
        ]}
        rows={[
          ...(ranking.score !== undefined && ranking.score !== null
            ? [['Overall Score', String(ranking.score)]]
            : []),
          ...(ranking.indicators || []).map(ind => [ind.name, String(ind.score)])
        ]}
      />
    </div>
  );
};

/* ──────────────── Ranking Trend Section ──────────────────────────── */
const TrendSection = ({ collegeName, ranking }) => {
  if (!ranking?.trend?.length) return null;
  const sorted = [...ranking.trend].sort((a, b) => (b.year || 0) - (a.year || 0));
  const firstYear = sorted[sorted.length - 1]?.year;
  const lastYear = sorted[0]?.year;

  return (
    <div className="mb-10">
      <SectionHeading>
        {collegeName} {ranking.rankingBody} Ranking Trend ({firstYear}–{lastYear})
      </SectionHeading>
      <p className="mb-4 text-[14px] leading-[1.8] text-[#475569]">
        The chart and table below show the historical ranking trend for {collegeName} under {ranking.rankingBody}.
      </p>
      
      {/* Visual Chart */}
      {sorted.length >= 2 && <TrendChart trendData={sorted} />}

      <RankingTable
        headers={['Year', `${collegeName} India Rank`, `${collegeName} Global Rank`]}
        rows={sorted.map(t => [
          String(t.year),
          t.indiaRank || '—',
          t.globalRank || '—'
        ])}
      />
    </div>
  );
};

/* ──────────────── NIRF Category Rankings ────────────────────────── */
const NirfCategorySection = ({ collegeName, nirfRankings }) => {
  if (!nirfRankings.length) return null;
  const latestYear = nirfRankings[0]?.year;
  const latestYearRankings = nirfRankings.filter(r => r.year === latestYear);

  return (
    <div className="mb-10">
      <SectionHeading>{collegeName} NIRF Rankings {latestYear}</SectionHeading>
      <RankingTable
        headers={['Category', 'Rank']}
        rows={latestYearRankings.map(r => [r.category || 'Overall', ordinal(displayRank(r))])}
      />
    </div>
  );
};

/* ──────────────── NIRF Trend Table ──────────────────────────────── */
const NirfTrendSection = ({ collegeName, nirfRankings }) => {
  if (!nirfRankings.length) return null;

  const allYears = new Set();
  const categories = [...new Set(nirfRankings.map(r => r.category || 'Overall'))];
  const rankMap = {};

  nirfRankings.forEach(r => {
    const cat = r.category || 'Overall';
    if (!rankMap[cat]) rankMap[cat] = {};
    if (r.trend?.length) {
      r.trend.forEach(t => { 
        rankMap[cat][t.year] = ordinal(t.indiaRank || t.globalRank || displayRank(r)); 
        allYears.add(t.year); 
      });
    }
    rankMap[cat][r.year] = ordinal(displayRank(r));
    allYears.add(r.year);
  });

  const years = [...allYears].sort((a, b) => b - a);
  if (!years.length || !categories.length) return null;

  return (
    <div className="mb-10">
      <SectionHeading>{collegeName} NIRF Ranking Trend</SectionHeading>
      <RankingTable
        headers={['Category', ...years.map(String)]}
        rows={categories.map(cat => [cat, ...years.map(y => rankMap[cat]?.[y] || '—')])}
      />
    </div>
  );
};

/* ──────────────── NIRF Parameters / Scores ──────────────────────── */
const NirfParametersSection = ({ collegeName, ranking }) => {
  if (!ranking?.parameters?.length) return null;
  return (
    <div className="mb-10">
      <SectionHeading>{collegeName} NIRF Ranking Parameters</SectionHeading>
      <RankingTable
        headers={['Parameter', 'Score']}
        rows={[
          ...(ranking.score !== undefined && ranking.score !== null
            ? [['Overall Score', String(ranking.score)]]
            : []),
          ...ranking.parameters.map(p => [p.name, String(p.score)])
        ]}
      />
    </div>
  );
};

/* ═══════════════════════ Main Component ═══════════════════════════ */
const CollegeRankingTab = ({ college }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!college?._id) return;
    setLoading(true);
    axios.get(`http://localhost:5001/api/rankings/college/${college._id}`)
      .then(res => setRankings(res.data.rankings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [college?._id]);

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Loading rankings...</div>;
  }

  if (!rankings.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center my-4">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Ranking Data</h3>
        <p className="text-[14px] text-slate-500">Ranking information for {college?.name} has not been published yet.</p>
      </div>
    );
  }

  // Group by rankingBody
  const bodyMap = {};
  rankings.forEach(r => {
    const key = r.rankingBody;
    if (!bodyMap[key]) bodyMap[key] = [];
    bodyMap[key].push(r);
  });

  const nirfRankings = bodyMap['NIRF'] || [];
  const otherBodies = Object.keys(bodyMap).filter(b => b !== 'NIRF');
  
  // Get first occurrence items for detailed sections
  const rankingsWithIndicators = rankings.filter(r => r.indicators?.length);
  const rankingsWithTrend = rankings.filter(r => r.trend?.length);
  const nirfWithParams = nirfRankings.find(r => r.parameters?.length);
  const aboutRanking = rankings.find(r => r.description);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 md:p-8">
      
      {/* Author & Date Box */}
      <AuthorInfo updatedAt={rankings[0]?.updatedAt} />

      <div className="max-w-[850px]">
        {/* About */}
        {aboutRanking && (
          <AboutSection collegeName={college?.name} description={aboutRanking.description} />
        )}

        {/* Ranking Body-wise sections */}
        {otherBodies.map(body => (
          <RankingBodySection
            key={body}
            collegeName={college?.name}
            body={body}
            rankingsByBody={bodyMap[body]}
          />
        ))}

        {/* Indicator Scores */}
        {rankingsWithIndicators.map(r => (
          <IndicatorSection key={r._id} collegeName={college?.name} ranking={r} />
        ))}

        {/* Ranking Trend with Chart */}
        {rankingsWithTrend.map(r => (
          <TrendSection key={r._id} collegeName={college?.name} ranking={r} />
        ))}

        {/* NIRF Category Rankings */}
        {nirfRankings.length > 0 && (
          <NirfCategorySection collegeName={college?.name} nirfRankings={nirfRankings} />
        )}

        {/* NIRF Trend */}
        {nirfRankings.length > 0 && (
          <NirfTrendSection collegeName={college?.name} nirfRankings={nirfRankings} />
        )}

        {/* NIRF Parameters */}
        {nirfWithParams && (
          <NirfParametersSection collegeName={college?.name} ranking={nirfWithParams} />
        )}
      </div>

    </div>
  );
};

export default CollegeRankingTab;
