import { Link } from 'react-router-dom';
import { Mail, Phone, Compass, BookOpen, GraduationCap, Shield } from 'lucide-react';

const footerLinks = {
    Explore: [
        { label: 'Colleges Directory', to: '/colleges/all-colleges' },
        { label: 'Universities', to: '/colleges/all-colleges?institutionType=university' },
        { label: 'Degrees & Courses', to: '/courses' },
        { label: 'Career Explorer', to: '/careers' },
        { label: 'Rankings 2026', to: '/rankings' },
    ],
    Tools: [
        { label: 'Rank Predictor', to: '/rank-predictor' },
        { label: 'College Predictor', to: '/college-predictor' },
        { label: 'Compare Colleges', to: '/compare' },
        { label: 'Education Loans', to: '/education-loan/step-by-step-guide' },
        { label: 'Free Counselling', to: '/counselling' },
    ],
    Admissions: [
        { label: 'Scholarships Portal', to: '/scholarships' },
        { label: 'Entrance Exams', to: '/exams' },
        { label: 'My Applications', to: '/my-applications' },
        { label: 'Education Alerts', to: '/education-alerts' },
    ],
    Account: [
        { label: 'Student Login', to: '/login' },
        { label: 'Create Account', to: '/signup' },
        { label: 'Student Profile', to: '/profile' },
        { label: 'Recommendations', to: '/recommendations' },
    ],
};

const Footer = () => {
    return (
        <footer className="hidden md:block mt-16 border-t border-[#E5E7EB] bg-[#F8FAFC]">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5">
                            <span className="flex size-8 items-center justify-center rounded-[5px] bg-[#2563EB] text-base font-bold text-white shadow-none">
                                E
                            </span>
                            <span className="flex flex-col leading-none">
                                <span className="text-[1.125rem] font-bold tracking-tight text-[#172554]">
                                    EduPlatform
                                </span>
                                <span className="mt-1 text-[0.6875rem] font-medium text-[#64748B]">
                                    India's Trusted Education Portal
                                </span>
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-[0.8125rem] leading-6 text-slate-600">
                            Discover verified colleges, compare courses, track application deadlines,
                            and plan your academic path with data-driven guidance and trusted tools.
                        </p>

                        <div className="mt-5 flex flex-col gap-2.5 text-[0.8125rem]">
                            <a
                                href="mailto:support@eduplatform.com"
                                className="inline-flex w-fit items-center gap-2 text-slate-600 transition-colors hover:text-[#2563EB]"
                            >
                                <Mail className="size-3.5 text-slate-400" />
                                support@eduplatform.com
                            </a>
                            <a
                                href="tel:+918000000000"
                                className="inline-flex w-fit items-center gap-2 text-slate-600 transition-colors hover:text-[#2563EB]"
                            >
                                <Phone className="size-3.5 text-slate-400" />
                                +91 80000 00000
                            </a>
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-[#172554]">
                                {title}
                            </h3>
                            <ul className="mt-3.5 space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-[0.8125rem] text-slate-600 transition-colors hover:text-[#2563EB]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-start gap-3 border-t border-[#E5E7EB] pt-6 text-[0.75rem] text-[#64748B] md:flex-row md:items-center md:justify-between">
                    <p>&copy; {new Date().getFullYear()} EduPlatform. All rights reserved. Professional Admissions &amp; Discovery System.</p>
                    <div className="flex items-center gap-5">
                        <Link to="/colleges" className="transition-colors hover:text-[#2563EB]">
                            Colleges
                        </Link>
                        <Link to="/courses" className="transition-colors hover:text-[#2563EB]">
                            Courses
                        </Link>
                        <Link to="/exams" className="transition-colors hover:text-[#2563EB]">
                            Exams
                        </Link>
                        <Link to="/scholarships" className="transition-colors hover:text-[#2563EB]">
                            Scholarships
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
