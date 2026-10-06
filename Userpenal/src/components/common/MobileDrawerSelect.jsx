import React, { useState, useEffect } from 'react';
import { X, Check, Search, ChevronDown } from 'lucide-react';

/**
 * MobileDrawerSelect: Native-feeling slide-up bottom drawer for dropdowns/filters on mobile
 * 
 * Props:
 * - title: string (e.g. "Select Stream", "Select State")
 * - options: Array<{ label: string, value: string | number, count?: number, icon?: React.ReactNode }> or Array<string>
 * - value: current selected value (or array if multi)
 * - onChange: (newValue) => void
 * - placeholder?: string
 * - isMulti?: boolean
 * - showSearch?: boolean
 * - triggerClassName?: string
 */
export default function MobileDrawerSelect({
    title = "Select Option",
    options = [],
    value = "",
    onChange,
    placeholder = "Select...",
    isMulti = false,
    showSearch = true,
    triggerClassName = ""
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tempSelected, setTempSelected] = useState(value);

    // Sync with incoming value when opening
    useEffect(() => {
        if (isOpen) {
            setTempSelected(value);
            setSearchQuery("");
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, value]);

    // Normalize options
    const normalizedOptions = options.map((opt) => {
        if (typeof opt === 'string') {
            return { label: opt, value: opt };
        }
        return opt;
    });

    const filteredOptions = normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectOption = (optValue) => {
        if (isMulti) {
            const current = Array.isArray(tempSelected) ? tempSelected : [];
            if (current.includes(optValue)) {
                setTempSelected(current.filter((v) => v !== optValue));
            } else {
                setTempSelected([...current, optValue]);
            }
        } else {
            setTempSelected(optValue);
            if (onChange) onChange(optValue);
            setIsOpen(false);
        }
    };

    const handleApplyMulti = () => {
        if (onChange) onChange(tempSelected);
        setIsOpen(false);
    };

    const handleClear = () => {
        const cleared = isMulti ? [] : "";
        setTempSelected(cleared);
        if (onChange) onChange(cleared);
        setIsOpen(false);
    };

    // Label for trigger button
    const getTriggerLabel = () => {
        if (isMulti) {
            if (Array.isArray(value) && value.length > 0) {
                return `${value.length} selected`;
            }
            return placeholder;
        }
        const selectedObj = normalizedOptions.find((o) => o.value === value);
        return selectedObj ? selectedObj.label : placeholder;
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={
                    triggerClassName ||
                    "flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#E5E7EB] rounded-[5px] text-[12px] font-medium text-slate-700 hover:border-[#172554] active:bg-[#F8FAFC] transition-colors"
                }
            >
                <span className="truncate">{getTriggerLabel()}</span>
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
            </button>

            {/* Slide-up Bottom Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
                    {/* Backdrop click to dismiss */}
                    <div className="flex-1" onClick={() => setIsOpen(false)} />

                    {/* Drawer Content */}
                    <div className="bg-white rounded-t-[16px] max-h-[85vh] flex flex-col shadow-2xl border-t border-[#E5E7EB] animate-in slide-in-from-bottom duration-250">
                        {/* Pull Handle */}
                        <div className="w-full flex justify-center pt-2.5 pb-1 cursor-pointer" onClick={() => setIsOpen(false)}>
                            <div className="w-10 h-1 bg-slate-300 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E7EB]">
                            <div>
                                <h3 className="text-[14.5px] font-bold text-[#172554]">{title}</h3>
                                {isMulti && (
                                    <p className="text-[11px] text-[#64748B]">
                                        {Array.isArray(tempSelected) ? tempSelected.length : 0} selected
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                                aria-label="Close"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Search Bar (if list is long) */}
                        {showSearch && normalizedOptions.length > 5 && (
                            <div className="px-4 py-2.5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={`Search ${title.toLowerCase()}...`}
                                        className="w-full bg-white border border-[#CBD5E1] rounded-[5px] text-[12.5px] py-1.5 pl-8 pr-3 outline-none focus:border-[#172554] text-slate-800 placeholder:text-slate-400"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="flex-1 overflow-y-auto px-2 py-1 divide-y divide-slate-100 max-h-[50vh]">
                            {filteredOptions.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-[12px]">
                                    No matches found
                                </div>
                            ) : (
                                filteredOptions.map((opt) => {
                                    const isSelected = isMulti
                                        ? Array.isArray(tempSelected) && tempSelected.includes(opt.value)
                                        : tempSelected === opt.value;

                                    return (
                                        <button
                                            key={String(opt.value)}
                                            type="button"
                                            onClick={() => handleSelectOption(opt.value)}
                                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[6px] text-left transition-colors ${
                                                isSelected ? "bg-[#EFF6FF] text-[#172554] font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 truncate">
                                                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                                                <span className="text-[13px] truncate">{opt.label}</span>
                                                {opt.count !== undefined && (
                                                    <span className="text-[10.5px] text-[#64748B] font-normal shrink-0">
                                                        ({opt.count})
                                                    </span>
                                                )}
                                            </div>

                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-[#172554] text-white flex items-center justify-center shrink-0">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer (for Multi-select or Reset) */}
                        <div className="p-3 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="flex-1 py-2 text-[12px] font-semibold text-slate-600 bg-white border border-[#CBD5E1] rounded-[5px] hover:bg-slate-50 active:scale-98 transition-all"
                            >
                                Reset
                            </button>
                            {isMulti && (
                                <button
                                    type="button"
                                    onClick={handleApplyMulti}
                                    className="flex-1 py-2 text-[12px] font-bold text-white bg-[#172554] rounded-[5px] hover:bg-[#1E293B] active:scale-98 transition-all"
                                >
                                    Apply
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
