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
        axios.get("http://localhost:5001/api/exam").then((response) => {
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
                `http://localhost:5001/api/predictor-exam-sessions?examId=${form.examId}`
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
            "http://localhost:5001/api/rank-predictor",
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
                <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
                 <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <Badge
                                variant="outline"
                                className="mb-5 border-[#087F70]/20 bg-[#087F70]/5 text-[#087F7]">
                                <Target className="w-3.5 h-3.5 mr-1.5" />
                                Smart Admission Tool
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                                Predict Your
                                <span className="text-[#087F70]">
                                    {" "}Exam Rank
                                </span>
                            </h1>

                            <p className="mt-5 text-base md:text-lg text-slate-600 leading-7 max-w-xl">
                                Get an estimated All India Rank based on your
                                expected percentile or marks and take the next
                                step towards finding the right college.
                            </p>

                            <div className="flex flex-wrap gap-3 mt-7">

                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("rank-form")
                                    }
                                    className="bg-[#087F70] hover:bg-[#06695d]"
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
                            <div className="flex flex-wrap gap-5 mt-8">

                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-[#087F70]" />
                                    Percentile Based
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-[#087F70]" />
                                    Marks Based
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-[#087F70]" />
                                    College Discovery
                                </div>

                            </div>

                        </div>

                        <div className="lg:pl-8">

                            <Card className="border-slate-200 shadow-sm overflow-hidden">

                                <div className="h-1 bg-[#087F70]" />

                                <CardContent className="p-7">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#087F70]/10">
                                            <Award className="h-6 w-6 text-[#087F70]" />
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500">Your estimated result
                                            </p>

                                            <p className="text-xl font-bold text-slate-900">
                                                Rank Prediction
                                            </p>
                                        </div>

                                    </div>


                                    <div className="mt-7 rounded-xl border bg-slate-50 p-5">

                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Expected Rank Range
                                        </p>

                                        <p className="text-3xl font-bold text-slate-900 mt-2">
                                            12,450 - 13,820
                                        </p>

                                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                            <TrendingUp className="w-4 h-4 text-[#087F70]" />
                                            Based on your exam performance
                                        </div>

                                    </div>


                                    <div className="grid grid-cols-2 gap-3 mt-4">

                                        <div className="rounded-lg border p-3">
                                            <p className="text-xs text-slate-500">
                                                Prediction
                                            </p>
                                            <p className="font-semibold text-slate-900 mt-1">
                                                Rank Range
                                            </p>
                                        </div>

                                        <div className="rounded-lg border p-3">
                                            <p className="text-xs text-slate-500">
                                                Next Step
                                            </p>
                                            <p className="font-semibold text-slate-900 mt-1">
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
                className="bg-slate-50 border-b"
            >
                <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">

                    <div className="text-center mb-8">

                        <Badge
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-600 mb-3"
                        >
                            Rank Calculator
                        </Badge>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Calculate Your Predicted Rank
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                            Enter your exam details to get your estimated rank.
                        </p>

                    </div>


                    <Card className="border-slate-200 shadow-sm">

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
                                className="space-y-5"
                            >

                                {/* Exam */}
                                <div className="grid md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Select Exam
                                        </label>

                                        <select
                                            name="examId"
                                            value={form.examId}
                                            onChange={handleChange}
                                            className="mt-1.5 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#087F70] focus:ring-1 focus:ring-[#087F70]"
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
                                        <label className="text-sm font-medium text-slate-700">
                                            Exam Session
                                        </label>

                                        <select
                                            name="examSessionId"
                                            value={form.examSessionId}
                                            onChange={handleChange}
                                            disabled={!form.examId}
                                            className="mt-1.5 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#087F70] focus:ring-1 focus:ring-[#087F70]"
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
                                <div className="grid md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Prediction Based On
                                        </label>

                                        <select
                                            name="predictionMethod"
                                            value={form.predictionMethod}
                                            onChange={handleChange}
                                            className="mt-1.5 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#087F70] focus:ring-1 focus:ring-[#087F70]"
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
                                        <label className="text-sm font-medium text-slate-700">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className="mt-1.5 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#087F70] focus:ring-1 focus:ring-[#087F70]"
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

                                    <label className="text-sm font-medium text-slate-700">
                                        Your{" "}
                                        {form.predictionMethod === "percentile"
                                            ? "Percentile"
                                            : "Expected Marks"}
                                    </label>

                                    <div className="relative mt-1.5">

                                        <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

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
                                            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#087F70] focus:ring-1 focus:ring-[#087F70]"
                                        />

                                    </div>

                                </div>


                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#087F70] hover:bg-[#06695d]"
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

                    <div className="max-w-5xl mx-auto px-4 py-10">

                        <Card className="border-[#087F70]/20 shadow-sm overflow-hidden">

                            <div className="bg-[#087F70]/5 border-b border-[#087F70]/10">

                                <CardContent className="py-8 text-center">

                                    <p className="text-xs uppercase tracking-wider text-slate-500">
                                        Estimated All India Rank
                                    </p>

                                    <p className="text-sm font-medium text-[#087F70] mt-2">
                                        Your Rank Range
                                    </p>

                                    <p className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                                        {result.expectedRankFrom?.toLocaleString()}
                                        {" - "}
                                        {result.expectedRankTo?.toLocaleString()}
                                    </p>

                                </CardContent>

                            </div>


                            <CardContent className="p-6">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Ready to find your college?
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
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
                className="border-t bg-slate-50"
            >
                <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">

                    <div className="text-center mb-8">

                        <p className="text-sm font-medium text-[#087F70]">
                            Simple Process
                        </p>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                            How Rank Predictor Works
                        </h2>

                    </div>


                    <div className="grid md:grid-cols-3 gap-4">

                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-5">

                                <div className="h-10 w-10 rounded-lg bg-[#087F70]/10 flex items-center justify-center">
                                    <GraduationCap className="h-5 w-5 text-[#087F70]" />
                                </div>

                                <h3 className="font-semibold mt-4 text-slate-900">
                                    01. Select Exam
                                </h3>

                                <p className="text-sm text-slate-500 mt-1.5 leading-5">
                                    Choose your exam and the relevant exam session.
                                </p>

                            </CardContent>
                        </Card>


                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-5">

                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Calculator className="h-5 w-5 text-blue-600" />
                                </div>

                                <h3 className="font-semibold mt-4 text-slate-900">
                                    02. Enter Score
                                </h3>

                                <p className="text-sm text-slate-500 mt-1.5 leading-5">
                                    Enter your expected percentile or marks and category.
                                </p>

                            </CardContent>
                        </Card>


                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-5">

                                <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <Award className="h-5 w-5 text-violet-600" />
                                </div>

                                <h3 className="font-semibold mt-4 text-slate-900">
                                    03. Get Your Rank
                                </h3>

                                <p className="text-sm text-slate-500 mt-1.5 leading-5">
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
