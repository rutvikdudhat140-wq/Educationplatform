import { Link } from 'react-router-dom';

const footerLinks = {
    Explore: [
        { label: 'Colleges', to: '/colleges/all-colleges' },
        { label: 'Universities', to: '/universities/all-universities' },
        { label: 'Courses', to: '/courses' },
        { label: 'Career Explorer', to: '/careers' },
    ],
    Support: [
        { label: 'Login', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
        { label: 'Compare', to: '/compare' },
        { label: 'Scholarships', to: '/scholarships' },
    ],
    Resources: [
        { label: 'Rankings', to: '/rankings' },
        { label: 'Study Abroad', to: '/study-abroad' },
        { label: 'Educational Loans', to: '/educational-loans' },
        { label: 'News & Updates', to: '/news' },
    ],
};



const Footer = () => {
    return (
        <footer className="mt-16 border-t bg-slate-950 text-slate-200">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

                    <div className='lg:col-span-2'>
                        <Link to="/" className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-lg font-bold text-white shadow-sm'>
                                E
                            </div>
                            <div>
                                <div className='text-xl font-semibold text-white'>EduPlateform</div>
                                <div className='text-sm text-slate-400'>your fature starts here</div>
                            </div>
                        </Link>
                        <p className='mt-5 max-w-md text-sm leading-6 text-slate-300'>
                            Discover colleges compare coureses,track careers,and plan your academic path with trasted guidance and smart decision-making tools
                        </p>
                        <div className='mt-6 flex items-center gap-4 text-sm text-slate-300'>
                            <a href='mailto.hello@eduplatform.com' className='transition hover:text-white'> hello@eduplateform.com</a>
                            <a href='tel:+910000000000' className='transition hover:text-white'>+1234567890</a>
                        </div>
                    </div>
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                                {title}
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.to} className="transition hover:text-white">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>


                <div className='mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 md:felx-row md:item-center md:justify-between'>
                    <p> 2026 EduPlatform.All rights reserved</p>
                    <div className='flex items-center gap-5'>
                        <a href='/privacy' className='transition hover:text-white'>Privacy</a>
                        <a href='/terms' className='transition hover:text-white'>Terms</a>
                        <a href='/contect' className='transition hover:text-white'>Contect</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
