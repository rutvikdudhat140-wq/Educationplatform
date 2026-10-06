import AdminSidebar from './AdminSidebar';
import { Bell, Search, Settings, Building2, GraduationCap, BookOpen, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchAction = (path) => {
    navigate(`${path}?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans text-ink overflow-hidden">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        
        {/* Glass Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-6 border-b border-line bg-white/80 backdrop-blur-md px-6 z-40 sticky top-0">
          <div className="hidden md:flex items-center gap-4 flex-1">
            <div className="relative group max-w-md w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search students, colleges, or courses..." 
                className="w-full bg-surface/50 border border-line rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />
              
              {/* Smart Search Dropdown */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-line overflow-hidden z-50 animate-fade-up">
                  <div className="p-2">
                    <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted/70">
                      Search In
                    </p>
                    <button 
                      onClick={() => handleSearchAction('/admin/college/list')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface rounded-lg transition-colors"
                    >
                      <Building2 size={16} className="text-emerald-500" />
                      Colleges matching <span className="font-bold text-brand">"{searchQuery}"</span>
                    </button>
                    <button 
                      onClick={() => handleSearchAction('/admin/univercity/list')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface rounded-lg transition-colors"
                    >
                      <GraduationCap size={16} className="text-blue-500" />
                      Universities matching <span className="font-bold text-brand">"{searchQuery}"</span>
                    </button>
                    <button 
                      onClick={() => handleSearchAction('/admin/course/list')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface rounded-lg transition-colors"
                    >
                      <BookOpen size={16} className="text-violet-500" />
                      Courses matching <span className="font-bold text-brand">"{searchQuery}"</span>
                    </button>
                    <button 
                      onClick={() => handleSearchAction('/admin/counselling')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface rounded-lg transition-colors"
                    >
                      <Users size={16} className="text-amber-500" />
                      Applications matching <span className="font-bold text-brand">"{searchQuery}"</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-5">
            <button className="relative p-2 text-ink-muted hover:text-ink transition-colors rounded-full hover:bg-surface">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive shadow-sm"></span>
            </button>
            
            <button className="p-2 text-ink-muted hover:text-ink transition-colors rounded-full hover:bg-surface hidden sm:block">
              <Settings className="h-5 w-5" />
            </button>

            <div className="h-6 w-[1px] bg-line hidden sm:block"></div>

            <div className="flex cursor-pointer items-center gap-3 pl-1">
              <div className="hidden md:block text-right">
                <p className="text-[0.8125rem] font-bold leading-tight text-ink">
                  Admin Head
                </p>
                <p className="text-[0.6875rem] font-medium text-brand">
                  Super Administrator
                </p>
              </div>
              
              <div className="relative">
                <span className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-brand-soft bg-brand-softest text-[0.875rem] font-bold text-brand shadow-sm">
                  A
                </span>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none -z-10"></div>
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
