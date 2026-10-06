import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';
import {
    User, Lock, FileText, Bell,
    LogOut, ChevronRight,
    Award, Shield, HelpCircle, Heart,
    Compass,
} from 'lucide-react';


const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ applications: 0, scholarships: 0, saved: 0 });

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) { navigate('/login'); return; }

        const headers = { Authorization: `Bearer ${token}` };

        fetch(createApiUrl('/user/profile'), { headers })
            .then((r) => r.json())
            .then((data) => setUser(data.data || data.user || null));


        fetch(createApiUrl('/admissions/my'), { headers })
            .then((r) => r.json())
            .then((res) => setStats((s) => ({ ...s, applications: (res.data?.admissions || []).length })));

        fetch(createApiUrl('/scholarships/my/applications'), { headers })
            .then((r) => r.json())
            .then((res) => setStats((s) => ({ ...s, scholarships: (res.data?.data || res.data?.applications || []).length })));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    const name = user?.name || user?.fullName || 'Student Candidate';
    const email = user?.email || 'student@education.com';
    const phone = user?.mobile || user?.phone || '';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const menuSections = [
        {
            title: 'Account & Settings',
            items: [
                { icon: User, label: 'Personal & Academic Profile', path: '/profile', color: '#2563EB' },
                { icon: Lock, label: 'Change Password', path: '/forgot-password', color: '#F97316' },
                { icon: Bell, label: 'Notifications & Alerts', path: '/notifications', color: '#2563EB' },
            ]
        },
        {
            title: 'My Academic Activity',
            items: [
                { icon: FileText, label: 'My Applications', path: '/my-applications', color: '#2563EB', badge: stats.applications > 0 ? stats.applications : null },
                { icon: Award, label: 'My Scholarships', path: '/my-scholarships', color: '#F97316', badge: stats.scholarships > 0 ? stats.scholarships : null },
                { icon: Compass, label: 'Counselling Sessions', path: '/my-counselling', color: '#2563EB' },
                { icon: Heart, label: 'Saved Colleges & Courses', path: '/colleges', color: '#F97316' },
            ]
        },
        {
            title: 'Assistance & Transparency',
            items: [
                { icon: HelpCircle, label: 'Support & FAQs', path: '/counselling', color: '#64748B' },
                { icon: Shield, label: 'Terms & Privacy Policy', path: '/', color: '#64748B' },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-surface pb-24 text-ink">
            {/* Header Banner - Deep Navy Corporate */}
            <div className="bg-[#172554] px-4 pt-8 pb-14 text-white">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-md bg-white/10 flex items-center justify-center text-white text-lg font-bold border border-white/20">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">
                                {name}
                            </h1>
                            <p className="text-xs text-white/80 mt-0.5 truncate">{email}</p>
                            {phone && <p className="text-[11px] text-white/60 mt-0.5">{phone}</p>}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 transition-colors shrink-0"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-7 mb-6 relative z-10">
                <div className="max-w-3xl mx-auto bg-white rounded-md border border-line grid grid-cols-3 divide-x divide-line shadow-none">
                    {[
                        { label: 'Applications', value: stats.applications, icon: FileText, color: 'text-brand', bg: 'bg-blue-50' },
                        { label: 'Scholarships', value: stats.scholarships, icon: Award, color: 'text-accent', bg: 'bg-orange-50' },
                        { label: 'Active Sessions', value: stats.applications > 0 ? 1 : 0, icon: Compass, color: 'text-brand', bg: 'bg-blue-50' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="flex items-center gap-2.5 p-3 sm:p-4">
                                <div className={`w-8 h-8 rounded-md ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                                    <Icon size={16} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-base sm:text-lg font-bold text-ink leading-tight">{stat.value}</span>
                                    <span className="block text-[10px] sm:text-xs text-ink-muted truncate">{stat.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="px-4 space-y-4 max-w-3xl mx-auto">
                {menuSections.map((section, si) => (
                    <div key={si}>
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-2 px-1">
                            {section.title}
                        </h2>
                        <div className="bg-white rounded-md border border-line shadow-none overflow-hidden divide-y divide-line">
                            {section.items.map((item, ii) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={ii}
                                        to={item.path}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: item.color + '15' }}
                                        >
                                            <Icon size={16} style={{ color: item.color }} />
                                        </div>
                                        <span className="flex-1 text-xs sm:text-sm font-semibold text-ink">
                                            {item.label}
                                        </span>
                                        {item.badge && (
                                            <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronRight size={15} className="text-ink-muted shrink-0" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="pt-2">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-white border border-red-200 rounded-md flex items-center justify-center gap-2 p-3 text-xs font-semibold text-red-600 hover:bg-red-50/50 transition-colors shadow-none">
                        <LogOut size={14} /> Log Out of Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
