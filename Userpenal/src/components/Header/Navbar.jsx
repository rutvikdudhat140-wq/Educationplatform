import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, LogIn, UserPlus, LogOut, LayoutGrid } from "lucide-react";

const EXAM_OPTIONS = {
    Engineering: [
        "JEE Main",
        "JEE Advanced",
        "BITSAT",
        "GATE",
        "WBJEE",
        "MHT CET",
        "COMEDK",
    ],
    Management: [
        "CAT",
        "XAT",
        "CMAT",
        "MAT",
        "SNAP",
        "NMAT",
    ],
    "Commerce & Banking": [
        "CUET",
        "CA Foundation",
        "CMA",
        "CS",
    ],
    Medical: [
        "NEET UG",
        "NEET PG",
        "AIIMS Nursing",
    ],
    Sciences: [
        "CUET",
        "IIT JAM",
        "NEST",
        "CSIR NET",
    ],
    "Hotel Management": [
        "NCHMCT JEE",
        "IIHM eCHAT",
    ],
    "Information Technology": [
        "NIMCET",
        "CUET",
    ],
    "Arts & Humanities": [
        "CUET",
        "NTA UGC NET",
    ],
    "Mass Communication": [
        "CUET",
        "IIMC Entrance Exam",
    ],
    Agriculture: [
        "ICAR AIEEA",
        "CUET Agriculture",
    ],
    Design: [
        "NID DAT",
        "UCEED",
        "NIFT Entrance Exam",
    ],
    Law: [
        "CLAT",
        "AILET",
        "LSAT India",
    ],
    Pharmacy: [
        "GPAT",
        "MHT CET Pharmacy",
    ],
    Dental: [
        "NEET MDS",
    ],
    "Performing Arts": [
        "CUET",
        "University Entrance Exams",
    ],
    Education: [
        "CUET",
        "UGC NET",
    ],
};

const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            name: "Colleges",
            path: "/colleges/all-colleges",
            dropdown: [
                {
                    name: "All Colleges",
                    path: "/colleges/all-colleges",
                },
                {
                    name: "Top Engineering Colleges",
                    path: "/colleges/category/Engineering",
                },
                {
                    name: "Top MBA Colleges",
                    path: "/colleges/category/MBA",
                },
                {
                    name: "Top Medical Colleges",
                    path: "/colleges/category/Medical",
                },
                {
                    name: "Top Law Colleges",
                    path: "/colleges/category/Law",
                },
            ],
        },
        {
            name: "Universities",
            path: "/universities/all-universities",
            dropdown: [
                {
                    name: "All Universities",
                    path: "/universities/all-universities",
                },
                {
                    name: "Top Central Universities",
                    path: "/universities/category/Central University",
                },
                {
                    name: "Top State Universities",
                    path: "/universities/category/State University",
                },
                {
                    name: "Top Private Universities",
                    path: "/universities/category/Private University",
                },
                {
                    name: "Top Deemed Universities",
                    path: "/universities/category/Deemed University",
                },
            ],
        },
        {
            name: "Courses",
            path: "/courses",
            dropdown: [
                {
                    name: "All Courses",
                    path: "/courses",
                },
                {
                    name: "Career Explorer",
                    path: "/careers",
                },
            ],
        },
        {
            name: "Counselling",
            path: "/counselling",
            dropdown: [
                {
                    name: "Start Counselling",
                    path: "/counselling",
                },
                {
                    name: "My Counselling",
                    path: "/my-counselling",
                },
            ],
        },
        {
            name: "Exams",
            path: "/exams",
        },
        {
            name: "Study Abroad",
            path: "/study-abroad",
            dropdown: [
                {
                    name: "Study Abroad Overview",
                    path: "/study-abroad",
                },
                {
                    name: "Countries",
                    path: "/study-abroad/countries",
                },
                {
                    name: "Universities",
                    path: "/study-abroad/universities",
                },
                {
                    name: "Courses",
                    path: "/study-abroad/courses",
                },
                {
                    name: "Exams",
                    path: "/study-abroad/exams",
                },
                {
                    name: "Fees & Cost",
                    path: "/study-abroad/fees",
                },
                {
                    name: "Admission Process",
                    path: "/study-abroad/admission-process",
                },
                {
                    name: "Student Visa Info",
                    path: "/study-abroad/visa",
                },
                {
                    name: "Intakes & Deadlines",
                    path: "/study-abroad/intakes",
                },
                {
                    name: "Guides",
                    path: "/study-abroad/guides",
                },
            ],
        },
    ];

    const simpleNavItems = [
        {
            name: "Rankings",
            path: "/rankings",
        },
        {
            name: "Compare",
            path: "/compare",
        },
    ];

    const moreItems = [
        {
            name: "My Applications",
            path: "/my-applications",
        },
        {
            name: "Career Explorer",
            path: "/careers",
        },
        {
            name: "Scholarships",
            path: "/scholarships",
        },
        {
            name: "Study Abroad",
            path: "/study-abroad",
        },
        {
            name: "News & Updates",
            path: "/news",
        },
        {
            name: "Educational Loans",
            path: "/educational-loans",
        },
    ];

    const isLoggedIn = Boolean(localStorage.getItem("userToken"));

    const isItemActive = (item) => {
        if (!item.path) {
            return false;
        }

        return (
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)
        );
    };

    const toggleDropdown = (name) => {
        setOpenDropdown(
            openDropdown === name ? null : name
        );
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("userToken");

        if (token) {
            await axios.post(
                "http://localhost:5001/api/user/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        localStorage.removeItem("userToken");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    const dropdownLinkClass =
        "flex items-center gap-2 rounded-[6px] px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors duration-150 hover:bg-brand-softest hover:text-brand-darker";

    const renderMobileNavItems = () => {
        const items = [];

        navItems.forEach((item) => {
            items.push(
                <div key={item.name} className="border-b border-line last:border-b-0">
                    <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 text-[0.875rem] transition-colors ${
                            isItemActive(item)
                                ? "bg-brand-softest font-semibold text-brand-darker"
                                : "font-medium text-ink hover:bg-surface"
                        }`}
                    >
                        <span>{item.name}</span>
                        {item.dropdown && (
                            <ChevronDown
                                size={15}
                                className="shrink-0 text-ink-muted"
                            />
                        )}
                    </Link>

                    {item.dropdown && (
                        <div className="border-t border-line bg-surface px-2 py-1.5">
                            {item.dropdown.map((sub) => (
                                sub.isHeader ? (
                                    <div
                                        key={sub.name}
                                        className="px-3 pb-1 pt-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-ink-muted"
                                    >
                                        {sub.name}
                                    </div>
                                ) : (
                                    <Link
                                        key={sub.name}
                                        to={sub.path}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-[6px] px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:bg-brand-softest hover:text-brand-darker"
                                    >
                                        {sub.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    )}

                    {item.name === "Exams" && (
                        <div className="border-t border-line bg-surface px-2 py-1.5">
                            <Link
                                to="/exams"
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-[6px] px-3 py-2 text-[0.8125rem] font-medium text-ink-soft transition-colors hover:bg-brand-softest hover:text-brand-darker"
                            >
                                All Exams
                            </Link>
                            {Object.entries(EXAM_OPTIONS).map(([stream, exams]) => (
                                <div key={stream} className="mt-1.5">
                                    <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-ink-muted">
                                        {stream}
                                    </p>
                                    {exams.map((exam) => (
                                        <Link
                                            key={exam}
                                            to={`/exams/${encodeURIComponent(exam)}`}
                                            onClick={() => setMobileOpen(false)}
                                            className="block rounded-[6px] py-1.5 pl-6 pr-3 text-[0.8125rem] text-ink-muted transition-colors hover:bg-brand-softest hover:text-brand-darker"
                                        >
                                            {exam}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        });

        simpleNavItems.forEach((item) => {
            items.push(
                <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-line px-4 py-3.5 text-[0.875rem] font-medium text-ink transition-colors last:border-b-0 hover:bg-surface"
                >
                    {item.name}
                </Link>
            );
        });

        items.push(
            <div className="px-4 pb-1 pt-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                More
            </div>
        );

        moreItems.forEach((item) => {
            items.push(
                <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-[0.8125rem] font-medium text-ink-soft transition-colors hover:bg-brand-softest hover:text-brand-darker"
                >
                    {item.name}
                </Link>
            );
        });

        return items;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-line bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/85">
            <nav className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between gap-3">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex shrink-0 items-center gap-2.5"
                        onClick={closeDropdown}
                    >
                        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-[0.9375rem] font-bold text-primary-foreground">
                            E
                        </span>

                        <span className="flex flex-col leading-none">
                            <span className="text-[1.0625rem] font-bold tracking-[-0.02em] text-ink">
                                EduPlatform
                            </span>
                            <span className="mt-0.5 hidden text-[0.6875rem] font-medium text-ink-muted sm:block">
                                Colleges &amp; Admissions
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex lg:items-center lg:gap-0.5">
                        {navItems.map((item) => {
                            const active = isItemActive(item);

                            return (
                                <div key={item.name} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown(item.name)}
                                        aria-expanded={openDropdown === item.name}
                                        className={`relative flex h-14 items-center gap-1 rounded-none px-3 text-[0.8125rem] font-medium transition-colors duration-150 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors ${
                                            active || openDropdown === item.name
                                                ? "text-brand-darker after:bg-primary"
                                                : "text-ink-soft after:bg-transparent hover:text-brand hover:after:bg-brand-border"
                                        }`}
                                    >
                                        {item.name}
                                        <ChevronDown
                                            size={13}
                                            className={`transition-transform duration-200 ${
                                                openDropdown === item.name
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Exams mega dropdown */}
                                    {openDropdown === "Exams" &&
                                        item.name === "Exams" && (
                                            <div className="absolute left-1/2 top-full z-50 mt-0 w-[min(56rem,calc(100vw-3rem))] -translate-x-1/2 animate-panel-in rounded-b-xl border border-t-0 border-line bg-white shadow-[0_16px_40px_-8px_rgb(23_35_60/0.20)]">
                                                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                                                    <Link
                                                        to="/exams"
                                                        onClick={closeDropdown}
                                                        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brand transition-colors hover:text-brand-dark"
                                                    >
                                                        Browse All Entrance Exams
                                                    </Link>
                                                </div>

                                                <div className="grid max-h-[70vh] grid-cols-2 gap-x-6 gap-y-1 overflow-y-auto px-4 py-4 md:grid-cols-3">
                                                    {Object.entries(
                                                        EXAM_OPTIONS
                                                    ).map(
                                                        ([stream, exams]) => (
                                                            <div
                                                                key={stream}
                                                                className="py-1.5"
                                                            >
                                                                <h3 className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-ink-muted">
                                                                    {stream}
                                                                </h3>

                                                                {exams.map(
                                                                    (exam) => (
                                                                        <Link
                                                                            key={exam}
                                                                            to={`/exams/${encodeURIComponent(
                                                                                exam
                                                                            )}`}
                                                                            onClick={
                                                                                closeDropdown
                                                                            }
                                                                            className={dropdownLinkClass}
                                                                        >
                                                                            {exam}
                                                                        </Link>
                                                                    )
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Standard dropdowns */}
                                    {openDropdown === item.name &&
                                        item.name !== "Exams" && (
                                            <div className="absolute left-0 top-full z-50 mt-0 w-auto min-w-[15rem] animate-panel-in rounded-b-xl border border-t-0 border-line bg-white p-1.5 shadow-[0_16px_40px_-8px_rgb(23_35_60/0.20)]">
                                                <Link
                                                    to={item.path}
                                                    onClick={closeDropdown}
                                                    className="mb-1 flex items-center gap-2 rounded-[6px] bg-brand-softest px-3 py-2 text-[0.8125rem] font-semibold text-brand-darker transition-colors hover:bg-brand-soft"
                                                >
                                                    {item.name}
                                                </Link>

                                                {item.dropdown?.map(
                                                    (dropdownItem) => (
                                                        <Link
                                                            key={
                                                                dropdownItem.name
                                                            }
                                                            to={
                                                                dropdownItem.path
                                                            }
                                                            onClick={
                                                                closeDropdown
                                                            }
                                                            className={dropdownLinkClass}
                                                        >
                                                            <span className="size-1.5 shrink-0 rounded-full bg-line-strong transition-colors group-hover:bg-brand" />
                                                            {
                                                                dropdownItem.name
                                                            }
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            );
                        })}

                        {/* Simple links */}
                        {simpleNavItems.map((item) => {
                            const active = isItemActive(item);

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`relative flex h-14 items-center rounded-none px-3 text-[0.8125rem] font-medium transition-colors duration-150 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors ${
                                        active
                                            ? "text-brand-darker after:bg-primary"
                                            : "text-ink-soft after:bg-transparent hover:text-brand hover:after:bg-brand-border"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* More */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown("More")}
                                aria-expanded={openDropdown === "More"}
                                className={`relative flex h-14 items-center gap-1 rounded-none px-3 text-[0.8125rem] font-medium transition-colors duration-150 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors ${
                                    openDropdown === "More"
                                        ? "text-brand-darker after:bg-primary"
                                        : "text-ink-soft after:bg-transparent hover:text-brand hover:after:bg-brand-border"
                                }`}
                            >
                                More
                                <ChevronDown
                                    size={13}
                                    className={`transition-transform duration-200 ${
                                        openDropdown === "More"
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {openDropdown === "More" && (
                                <div className="absolute right-0 top-full z-50 mt-0 w-56 animate-panel-in rounded-b-xl border border-t-0 border-line bg-white p-1.5 shadow-[0_16px_40px_-8px_rgb(23_35_60/0.20)]">
                                    {moreItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={closeDropdown}
                                            className="flex items-center gap-2 rounded-[6px] px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors duration-150 hover:bg-brand-softest hover:text-brand-darker"
                                        >
                                            <span className="size-1.5 shrink-0 rounded-full bg-line-strong" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Login / Logout */}
                    <div className="hidden shrink-0 items-center gap-2 lg:flex">
                        {isLoggedIn ? (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleLogout}
                            >
                                <LogOut />
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[0.78125rem] font-medium text-ink-soft transition-colors duration-150 hover:bg-surface hover:text-ink"
                                >
                                    <LogIn className="size-3.5" />
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[0.78125rem] font-medium text-primary-foreground shadow-[0_1px_2px_0_rgb(23_35_60/0.10)] transition-[background-color,transform] duration-150 hover:bg-[color-mix(in_oklch,var(--primary),black_12%)]"
                                >
                                    <UserPlus className="size-3.5" />
                                    Sign Up Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile actions */}
                    <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
                        {isLoggedIn ? (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleLogout}
                            >
                                <LogOut />
                                Logout
                            </Button>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-white px-3 text-[0.78125rem] font-medium text-ink transition-[border-color,background-color,color] duration-150 hover:border-brand hover:bg-brand-softest hover:text-brand-darker"
                            >
                                <LogIn className="size-3.5" />
                                Login
                            </Link>
                        )}

                        <Sheet
                            open={mobileOpen}
                            onOpenChange={setMobileOpen}
                        >
                            <SheetTrigger>
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                >
                                    <Menu />
                                    <span className="sr-only">
                                        Menu
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="w-[84vw] max-w-[20rem] gap-0 p-0"
                            >
                                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                                    <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-ink">
                                        <LayoutGrid
                                            size={15}
                                            className="text-brand"
                                        />
                                        Menu
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                    >
                                        <X />
                                        <span className="sr-only">
                                            Close
                                        </span>
                                    </Button>
                                </div>

                                <div className="flex flex-col overflow-y-auto">
                                    {renderMobileNavItems()}
                                </div>

                                <div className="mt-auto border-t border-line bg-surface px-4 py-3.5">
                                    {isLoggedIn ? (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center"
                                            onClick={() => {
                                                handleLogout();
                                                setMobileOpen(false);
                                            }}
                                        >
                                            <LogOut />
                                            Logout
                                        </Button>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                to="/login"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className="inline-flex h-9 items-center justify-center rounded-md border border-line-strong bg-white text-[0.8125rem] font-medium text-ink transition-colors hover:border-brand hover:text-brand-darker"
                                            >
                                                Login
                                            </Link>

                                            <Link
                                                to="/signup"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary text-[0.8125rem] font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--primary),black_12%)]"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
