import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompare } from '@/context/CompareContext';
import { Building2, X, ArrowRight, Layers, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export const CompareDock = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show compare dock on the actual compare page or auth pages
  if (
    compareList.length === 0 ||
    location.pathname === '/compare' ||
    ['/login', '/signup', '/forgot-password'].includes(location.pathname)
  ) {
    return null;
  }

  const handleCompareClick = () => {
    const ids = compareList.map((c) => c._id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-14 md:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="overflow-hidden rounded-lg border border-[#172554] bg-[#172554] text-white shadow-2xl backdrop-blur-md">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0F172A] border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-bold text-white">
              {compareList.length}
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              Compare Colleges ({compareList.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors"
              title="Clear all selected"
            >
              <Trash2 size={12} />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="size-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isMinimized && (
          <div className="p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Colleges Chips List */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
              {compareList.map((college) => (
                <div
                  key={college._id}
                  className="flex items-center gap-1.5 rounded-[5px] bg-white/10 border border-white/15 px-2 py-1 shrink-0 text-white"
                >
                  <div className="size-5 rounded overflow-hidden bg-white shrink-0 flex items-center justify-center text-[#172554]">
                    {college.logo ? (
                      <img src={college.logo} alt="" className="size-full object-contain p-0.5" />
                    ) : (
                      <Building2 size={12} />
                    )}
                  </div>
                  <span className="text-[11px] font-medium max-w-[90px] sm:max-w-[120px] truncate">
                    {college.name}
                  </span>
                  <button
                    onClick={() => removeFromCompare(college._id)}
                    className="size-4 flex items-center justify-center rounded-full hover:bg-white/20 text-slate-300 hover:text-white ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}

              {compareList.length < 4 && (
                <div className="hidden sm:flex items-center justify-center rounded-[5px] border border-dashed border-white/30 px-2 py-1 text-[10.5px] text-slate-300">
                  + Add up to {4 - compareList.length} more
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCompareClick}
              disabled={compareList.length < 2}
              className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-[4px] px-4 py-2 text-xs font-bold transition-all shadow-md ${
                compareList.length >= 2
                  ? 'bg-white text-[#172554] hover:bg-slate-100 cursor-pointer active:scale-95'
                  : 'bg-white/20 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Compare ({compareList.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CompareDock;
