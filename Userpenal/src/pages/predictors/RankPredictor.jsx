import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Award,
    Calculator,
    ArrowRight,
    BookOpen,
    Target,
    CheckCircle2,
    TrendingUp,
    GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RankPredictor() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        examId: "",
        examSessionId: "",
        predictionMethod: "percentile",
        category: "ALL",
        input: "",
    });

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/exam`).then((response) => {
            setExams(response.data.exams || []);
        });
    }, []);

    useEffect(() => {
        if (!form.examId) {
            setSessions([]);
            return;
        }

        axios
            .get(
                `${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/predictor-exam-sessions?examId=${form.examId}`
            )
            .then((response) => {
                setSessions(response.data.examSessions || []);
            });
    }, [form.examId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
            ...(name === "examId" && {
                examSessionId: "",
            }),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/rank-predictor`,
            {
                examId: form.examId,
                examSessionId: form.examSessionId,
                predictionMethod: form.predictionMethod,
                category: form.category,
                input: Number(form.input),
            }
        );

        setResult(response.data.prediction);
    };

    return (
        <div className="min-h-screen bg-white">


            <section className="border-b bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                 <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
                        <div>
                            <Badge
                                variant="outline"
                                className="mb-4 border-[#2563EB]/20 bg-[#2563EB]/5 text-brand">
                                <Target className="w-3.5 h-3.5 mr-1.5" />
                                Smart Admission Tool
                            </Badge>

                            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-ink leading-tight">
                                Predict Your
                                <span className="text-[#2563EB]">
                                    {" "}Exam Rank
                                </span>
                            </h1>

                            <p className="mt-4 text-sm md:text-base text-ink-muted leading-6 max-w-xl">
                                Get an estimated All India Rank based on your
                                expected percentile or marks and take the next
                                step towards finding the right college.
                            </p>

                            <div className="flex flex-wrap gap-2.5 mt-5">

                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("rank-form")
                                    }
                                    className="bg-[#172554] hover:bg-[#0F172A] text-white"
                                >
                                    Predict My Rank
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        document
                                            .getElementById("how-it-works")
                                    }
                                >
                                    How It Works
                                </Button>

                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">

                                <div className="flex items-center gap-2 text-sm text-ink-muted">
                                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                                    Percentile Based
                                </div>

                                <div className="flex items-center gap-2 text-sm text-ink-muted">
                                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                                    Marks Based
                                </div>

                                <div className="flex items-center gap-2 text-sm text-ink-muted">
                                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                                    College Discovery
                                </div>

                            </div>

                        </div>

                        <div className="lg:pl-8">

                            <Card className="border-line shadow-none md:shadow-sm overflow-hidden">

                                <div className="h-1 bg-[#2563EB]" />

                                <CardContent className="p-4 md:p-6">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-md bg-[#2563EB]/10">
                                            <Award className="h-5 w-5 text-[#2563EB]" />
                                        </div>

                                        <div>
                                            <p className="text-sm text-ink-muted">Your estimated result
                                            </p>

                                            <p className="text-lg font-bold text-ink">
                                                Rank Prediction
                                            </p>
                                        </div>

                                    </div>


                                    <div className="mt-5 rounded-md border bg-surface p-4">

                                        <p className="text-xs uppercase tracking-wide text-ink-muted">
                                            Expected Rank Range
                                        </p>

                                        <p className="text-2xl font-bold text-ink mt-2">
                                            12,450 - 13,820
                                        </p>

                                        <div className="flex items-center gap-2 mt-3 text-xs text-ink-muted">
                                            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                                            Based on your exam performance
                                        </div>

                                    </div>


                                    <div className="grid grid-cols-2 gap-3 mt-3">

                                        <div className="rounded-md border p-2.5">
                                            <p className="text-xs text-ink-muted">
                                                Prediction
                                            </p>
                                            <p className="font-semibold text-ink mt-1">
                                                Rank Range
                                            </p>
                                        </div>

                                        <div className="rounded-md border p-2.5">
                                            <p className="text-xs text-ink-muted">
                                                Next Step
                                            </p>
                                            <p className="font-semibold text-ink mt-1">
                                                Find Colleges
                                            </p>
                                        </div>

                                    </div>

                                </CardContent>

                            </Card>

                        </div>

                    </div>

                </div>
            </section>


            {/* PREDICTOR FORM */}
            <section
                id="rank-form"
                className="bg-surface border-b"
            >
                <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

                    <div className="text-center mb-6">

                        <Badge
                            variant="outline"
                            className="border-line bg-white text-ink-muted mb-3"
                        >
                            Rank Calculator
                        </Badge>

                        <h2 className="text-2xl md:text-3xl font-bold text-ink">
                            Calculate Your Predicted Rank
                        </h2>

                        <p className="text-sm text-ink-muted mt-2">
                            Enter your exam details to get your estimated rank.
                        </p>

                    </div>


                    <Card className="border-line shadow-none md:shadow-sm">

                        <CardHeader>
                            <CardTitle className="text-lg">
                                Enter Your Details
                            </CardTitle>

                            <CardDescription>
                                Select your exam, session and performance details.
                            </CardDescription>
                        </CardHeader>


                        <CardContent>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 md:space-y-5"
                            >

                                {/* Exam */}
                                <div className="grid md:grid-cols-2 gap-3 md:gap-4">

                                    <div>
                                        <label className="text-[13px] md:text-sm font-medium text-ink">
                                            Select Exam
                                        </label>

                                        <select
                                            name="examId"
                                            value={form.examId}
                                            onChange={handleChange}
                                            className="mt-1.5 h-10 md:h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                        >
                                            <option value="">
                                                Select an exam
                                            </option>

                                            {exams.map((exam) => (
                                                <option
                                                    key={exam._id}
                                                    value={exam._id}
                                                >
                                                    {exam.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div>
                                        <label className="text-[13px] md:text-sm font-medium text-ink">
                                            Exam Session
                                        </label>

                                        <select
                                            name="examSessionId"
                                            value={form.examSessionId}
                                            onChange={handleChange}
                                            disabled={!form.examId}
                                            className="mt-1.5 h-10 md:h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none disabled:bg-brand-softest disabled:text-ink-muted focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                        >
                                            <option value="">
                                                Select session
                                            </option>

                                            {sessions.map((session) => (
                                                <option
                                                    key={session._id}
                                                    value={session._id}
                                                >
                                                    {session.academicYear} -{" "}
                                                    {session.sessionName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>


                                {/* Method + Category */}
                                <div className="grid md:grid-cols-2 gap-3 md:gap-4">

                                    <div>
                                        <label className="text-[13px] md:text-sm font-medium text-ink">
                                            Prediction Based On
                                        </label>

                                        <select
                                            name="predictionMethod"
                                            value={form.predictionMethod}
                                            onChange={handleChange}
                                            className="mt-1.5 h-10 md:h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                        >
                                            <option value="percentile">
                                                Percentile
                                            </option>

                                            <option value="marks">
                                                Expected Marks
                                            </option>
                                        </select>
                                    </div>


                                    <div>
                                        <label className="text-[13px] md:text-sm font-medium text-ink">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className="mt-1.5 h-10 md:h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                        >
                                            <option value="ALL">
                                                All Categories
                                            </option>

                                            <option value="OPEN">
                                                OPEN / General
                                            </option>

                                            <option value="OBC">
                                                OBC
                                            </option>

                                            <option value="SC">
                                                SC
                                            </option>

                                            <option value="ST">
                                                ST
                                            </option>

                                            <option value="EWS">
                                                EWS
                                            </option>
                                        </select>
                                    </div>

                                </div>


                                {/* Input */}
                                <div>

                                    <label className="text-[13px] md:text-sm font-medium text-ink">
                                        Your{" "}
                                        {form.predictionMethod === "percentile"
                                            ? "Percentile"
                                            : "Expected Marks"}
                                    </label>

                                    <div className="relative mt-1.5">

                                        <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />

                                        <input
                                            type="number"
                                            step="any"
                                            name="input"
                                            value={form.input}
                                            onChange={handleChange}
                                            placeholder={
                                                form.predictionMethod ===
                                                "percentile"
                                                    ? "Example: 98.5"
                                                    : "Example: 150"
                                            }
                                            className="h-10 md:h-11 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                        />

                                    </div>

                                </div>


                                <Button
                                    type="submit"
                                    className="w-full h-10 md:h-11 bg-[#172554] hover:bg-[#0F172A] text-white"
                                >
                                    <Award className="w-4 h-4 mr-2" />
                                    Predict My Rank
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>

                            </form>

                        </CardContent>

                    </Card>

                </div>
            </section>


            {/* RESULT */}
            {result && (
                <section className="bg-white">

                    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">

                        <Card className="border-[#2563EB]/20 shadow-none md:shadow-sm overflow-hidden">

                            <div className="bg-[#2563EB]/5 border-b border-[#2563EB]/10">

                                <CardContent className="py-6 text-center">

                                    <p className="text-xs uppercase tracking-wider text-ink-muted">
                                        Estimated All India Rank
                                    </p>

                                    <p className="text-sm font-medium text-[#2563EB] mt-2">
                                        Your Rank Range
                                    </p>

                                    <p className="text-2xl md:text-4xl font-bold text-ink mt-1">
                                        {result.expectedRankFrom?.toLocaleString()}
                                        {" - "}
                                        {result.expectedRankTo?.toLocaleString()}
                                    </p>

                                </CardContent>

                            </div>


                            <CardContent className="p-4 md:p-6">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>
                                        <h3 className="font-semibold text-ink">
                                            Ready to find your college?
                                        </h3>

                                        <p className="text-sm text-ink-muted mt-1">
                                            Explore colleges based on your predicted
                                            rank and category.
                                        </p>
                                    </div>


                                    <Button
                                        onClick={() =>
                                            navigate(
                                                `/college-predictor?examId=${form.examId}&rank=${result.expectedRankFrom}&category=${form.category}`
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Find My Colleges
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                </section>
            )}


            {/* HOW IT WORKS */}
            <section
                id="how-it-works"
                className="border-t bg-surface"
            >
                <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

                    <div className="text-center mb-6">

                        <p className="text-sm font-medium text-[#2563EB]">
                            Simple Process
                        </p>

                        <h2 className="text-2xl md:text-3xl font-bold text-ink mt-1">
                            How Rank Predictor Works
                        </h2>

                    </div>


                    <div className="grid md:grid-cols-3 gap-3 md:gap-4">

                        <Card className="border-line shadow-none md:shadow-sm">
                            <CardContent className="p-4">

                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-md bg-[#2563EB]/10 flex items-center justify-center">
                                    <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-[#2563EB]" />
                                </div>

                                <h3 className="font-semibold mt-3 text-ink">
                                    01. Select Exam
                                </h3>

                                <p className="text-sm text-ink-muted mt-1.5 leading-5">
                                    Choose your exam and the relevant exam session.
                                </p>

                            </CardContent>
                        </Card>


                        <Card className="border-line shadow-none md:shadow-sm">
                            <CardContent className="p-4">

                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-md bg-blue-50 flex items-center justify-center">
                                    <Calculator className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                </div>

                                <h3 className="font-semibold mt-3 text-ink">
                                    02. Enter Score
                                </h3>

                                <p className="text-sm text-ink-muted mt-1.5 leading-5">
                                    Enter your expected percentile or marks and category.
                                </p>

                            </CardContent>
                        </Card>


                        <Card className="border-line shadow-none md:shadow-sm">
                            <CardContent className="p-4">

                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-md bg-violet-50 flex items-center justify-center">
                                    <Award className="h-4 w-4 md:h-5 md:w-5 text-violet-600" />
                                </div>

                                <h3 className="font-semibold mt-3 text-ink">
                                    03. Get Your Rank
                                </h3>

                                <p className="text-sm text-ink-muted mt-1.5 leading-5">
                                    View your estimated rank range and explore colleges.
                                </p>

                            </CardContent>
                        </Card>

                    </div>

                </div>
            </section>

        </div>
    );
}
