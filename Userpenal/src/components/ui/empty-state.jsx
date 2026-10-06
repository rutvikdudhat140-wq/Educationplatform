import React from 'react';
import { Search, RefreshCw, Layers, Calendar, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({
  title = "No results found",
  description = "We couldn't find any items matching your criteria. Try resetting filters or searching for something else.",
  actionText = "Reset Filters",
  onAction,
  actionLink,
  icon: Icon = Search,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center sm:p-12 my-4">
      {/* Decorative Vector Graphic Background Icon */}
      <div className="relative mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#E2E8F0]">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#EFF6FF] to-transparent opacity-60" />
        <Icon size={30} className="relative z-10 text-[#2563EB]" />
      </div>

      {/* Content */}
      <h3 className="text-[16px] font-bold text-[#172554] sm:text-[18px]">{title}</h3>
      <p className="mt-1.5 max-w-md text-[13px] text-[#64748B] leading-relaxed">{description}</p>

      {/* Action Button */}
      {(onAction || actionLink) && (
        <div className="mt-5">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex h-9.5 items-center gap-2 rounded-xl bg-[#172554] px-5 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#0F172A] active:scale-95"
            >
              <RefreshCw size={13} /> {actionText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex h-9.5 items-center gap-2 rounded-xl bg-[#172554] px-5 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#0F172A] active:scale-95"
            >
              <RefreshCw size={13} /> {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
