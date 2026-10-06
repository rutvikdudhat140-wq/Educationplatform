
import { useNavigate } from "react-router-dom";
import {
    Award,
    Building2,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";

export default function Predictors() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* HERO */}
            <section className="border-b bg-gradient-to-b from-slate-50 to-white">
                <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[#087F70]" />
                            Smart Admission Tools
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                            Predict Your
                            <span className="ml-2 text-[#087F70]">
                                Admission
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                            Estimate your rank and discover colleges that match
                            your admission profile.
                        </p>

                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                            <button
                                onClick={() => navigate("/rank-predictor")}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#087F70] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066559]"
                            >
                                Predict My Rank
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => navigate("/college-predictor")}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Predict My College
                                <ArrowRight className="h-4 w-4" />
                            </button>

                        </div>
                    </div>

                    {/* SMALL STATS */}
                    <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">

                        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                                <TrendingUp className="h-4 w-4 text-[#087F70]" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Rank Prediction
                                </p>
                                <p className="text-xs text-slate-500">
                                    Estimate your rank
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                <Building2 className="h-4 w-4 text-blue-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    College Prediction
                                </p>
                                <p className="text-xs text-slate-500">
                                    Find suitable colleges
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                                <Award className="h-4 w-4 text-emerald-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Better Decisions
                                </p>
                                <p className="text-xs text-slate-500">
                                    Plan your admission
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* PREDICTOR CARDS */}
            <section className="px-4 py-14 md:py-16">
                <div className="mx-auto max-w-5xl">

                    <div className="mb-9 text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#087F70]">
                            Prediction Tools
                        </p>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            Choose a Predictor
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Start with the tool you need for your admission journey.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* RANK CARD */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                                    <Award className="h-6 w-6 text-[#087F70]" />
                                </div>

                                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-[#087F70]">
                                    Rank
                                </span>

                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                                Rank Predictor
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Enter your marks or percentile to estimate your
                                expected rank for the selected exam.
                            </p>

                            <div className="mt-5 space-y-2.5">

                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-[#087F70]" />
                                    Select exam & session
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-[#087F70]" />
                                    Enter marks or percentile
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-[#087F70]" />
                                    Get estimated rank
                                </div>

                            </div>

                            <button
                                onClick={() => navigate("/rank-predictor")}
                                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#087F70] text-sm font-semibold text-white transition hover:bg-[#066559]"
                            >
                                Predict My Rank
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>

                        </div>

                        {/* COLLEGE CARD */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>

                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
                                    Colleges
                                </span>

                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                                College Predictor
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Enter your rank and preferences to discover
                                colleges that match your admission profile.
                            </p>

                            <div className="mt-5 space-y-2.5">

                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    Enter your rank
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    Select category & course
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    Explore matching colleges
                                </div>

                            </div>

                            <button
                                onClick={() => navigate("/college-predictor")}
                                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Predict My College
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>

                        </div>

                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-t bg-slate-50 px-4 py-14">
                <div className="mx-auto max-w-5xl">

                    <div className="mb-9 text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#087F70]">
                            How It Works
                        </p>

                        <h2 className="mt-2 text-2xl font-bold">
                            Simple. Fast. Useful.
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                        <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
                            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-[#087F70]">
                                01
                            </div>

                            <h3 className="mt-3 text-sm font-semibold">
                                Enter Details
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Provide your exam, marks, rank and preferences.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
                            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                                02
                            </div>

                            <h3 className="mt-3 text-sm font-semibold">
                                Get Prediction
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Get results based on available admission data.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
                            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
                                03
                            </div>

                            <h3 className="mt-3 text-sm font-semibold">
                                Explore Options
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Explore colleges that fit your predicted result.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* SMALL CTA */}
            <section className="px-4 py-12">
                <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-7 text-center shadow-sm">

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                        <Sparkles className="h-5 w-5 text-[#087F70]" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold">
                        Ready to explore your admission options?
                    </h2>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                        Start with your rank or exam details and discover your
                        possible college opportunities.
                    </p>

                    <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">

                        <button
                            onClick={() => navigate("/rank-predictor")}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#087F70] px-5 text-sm font-semibold text-white hover:bg-[#066559]"
                        >
                            Start Rank Predictor
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => navigate("/college-predictor")}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-semibold hover:bg-slate-50"
                        >
                            Start College Predictor
                            <ArrowRight className="h-4 w-4" />
                        </button>

                    </div>

                </div>
            </section>

        </div>
    );
}

