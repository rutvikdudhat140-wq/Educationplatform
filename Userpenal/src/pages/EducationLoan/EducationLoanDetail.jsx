import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, MessageCircle, Share2, UserCheck } from 'lucide-react';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';

const TABS = [
  { name: 'Overview', path: '/education-loan/step-by-step-guide' },
  { name: 'Loan Eligibility', path: '/education-loan/eligibility-criteria' },
  { name: 'Loan Providers', path: '/education-loan/best-education-loan-providers' },
  { name: 'Public v/s Private', path: '/education-loan/public-vs-private' },
  { name: 'Government Loans', path: '/education-loan/government-loans' },
  { name: 'Vidya Laxmi Portal', path: '/education-loan/vidya-laxmi-portal' },
  { name: 'Loan Calculator', path: '/education-loan/loan-calculator' },
  { name: 'Education Loan Interest Rates', path: '/education-loan/interest-rates' },
];

const TIPTAP_EXTENSIONS = [
  StarterKit, Image, Table, TableRow, TableHeader, TableCell, TiptapLink, Underline
];

const formatDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function EducationLoanDetail() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [articles, setArticles] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/education-loan/articles/${slug}`, {
        signal: controller.signal,
      })
      .then((res) =>
        setArticles((prev) => ({ ...prev, [slug]: res.data }))
      )
      .catch(() => {});

    return () => controller.abort();
  }, [slug]);

  const article = articles[slug];

  const articleHTML = useMemo(() => {
    if (!article?.content) return '';
    try {
      return generateHTML(article.content, TIPTAP_EXTENSIONS);
    } catch {
      return '';
    }
  }, [article]);

  if (!article) return null;

  return (
    <div className="bg-white min-h-screen font-sans">

      <div className="container mx-auto max-w-7xl px-4 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-ink mb-2 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-[13px] text-gray-500">
              <span>6 mins read</span>
              <span className="flex items-center gap-1"><Eye size={14} /> 16.4K Views</span>
              <span className="flex items-center gap-1 text-brand font-medium cursor-pointer"><MessageCircle size={14} /> 2 Comments</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-800"><Share2 size={14} /> Share</span>
            </div>
          </div>

        </div>
      </div>

      <div className="border-b border-gray-200 mt-4 sticky top-[64px] bg-white z-40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex overflow-x-auto hide-scrollbar whitespace-nowrap">
            {TABS.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`text-[14px] px-4 py-3 font-semibold transition-colors border-b-2 ${
                    isActive
                      ? 'border-brand text-brand'
                      : 'border-transparent text-ink-muted hover:text-brand'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6 flex flex-col lg:flex-row gap-8">


        <div className="w-full lg:w-[70%]">

          <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
             <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center bg-brand-softest">
                <span className="font-bold text-brand-dark text-xs">{article.author?.charAt(0)}</span>
             </div>
             <div className="flex flex-col">
               <span className="font-semibold text-[13px] text-brand flex items-center gap-1">
                 {article.author} <UserCheck size={14} className="text-brand" />
               </span>
                <span className="text-[11px] text-gray-500">Updated on {formatDate(article.updatedAt)}</span>
             </div>
          </div>

          <p className="italic text-ink-soft mb-6 text-[15px] font-medium leading-relaxed">
            {article.summary}
          </p>

          {article.coverImage && (
            <div className="mb-8">
              <img src={article.coverImage} alt={article.title} className="w-full object-cover" />
            </div>
          )}

          <div
            className="edu-prose max-w-none text-[15px] font-serif"
            dangerouslySetInnerHTML={{ __html: articleHTML }}
          />

        </div>

        {/* Right Sidebar - Related Articles */}
        <div className="w-full lg:w-[30%]">
          <div className="border border-brand-border rounded-md p-5 sticky top-[140px]">
            <h3 className="font-bold text-gray-900 text-[16px] mb-4">Related Articles</h3>

            <div className="flex flex-col gap-4">
              {[
                { title: 'How to Calculate EMI for Student Loan Abroad: Formula, Examples', views: '1.9K', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&q=80' },
                { title: 'How to Get Education Loan for Abroad Studies in 2027', views: '4L', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&q=80' },
                { title: 'SBI Loan for Abroad Studies: Eligibility & Interest Rate', views: '1.6L', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=100&q=80' },
                { title: 'Abroad Education Loan Eligibility Criteria for Students', views: '1.5L', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=100&q=80' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 group cursor-pointer">
                  <div className="flex-1">
                    <h4 className="font-bold text-ink-soft text-[14px] leading-tight mb-2 group-hover:text-brand transition-colors">{item.title}</h4>
                    <div className="flex items-center text-[11px] text-gray-500">
                      Raj Vimal • {item.views} Views
                    </div>
                  </div>
                  <div className="w-20 h-14 shrink-0 rounded overflow-hidden">
                    <img src={item.img} alt="related" className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
