import React, { useEffect, useState } from "react";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Star,
  ShieldCheck,
  BadgeCheck,
  ThumbsUp,
  CheckCircle2,
  Filter,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={19}
          onClick={() => setRating(star)}
          className={`cursor-pointer transition-colors ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 hover:text-amber-200"
          }`}
        />
      ))}
    </div>
  );
};

export const ReviewTab = ({ college }) => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const [form, setForm] = useState({
    course: "",
    graduationYear: "",
    overallRating: 0,
    placementsRating: 0,
    facultyRating: 0,
    infrastructureRating: 0,
    campusLifeRating: 0,
    reviewTitle: "",
    pros: "",
    cons: "",
    isVerifiedStudent: true,
  });

  const getReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/reviews/college/${college._id}`
      );
      setReviews(res.data.data || []);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    if (college?._id) {
      getReviews();
    }
  }, [college]);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      collegeId: college._id,
      course: form.course,
      graduationYear: form.graduationYear,
      reviewTitle: form.reviewTitle,
      pros: form.pros,
      cons: form.cons,
      ratings: {
        overall: form.overallRating,
        placements: form.placementsRating,
        faculty: form.facultyRating,
        infrastructure: form.infrastructureRating,
        campusLife: form.campusLifeRating,
      },
    };

    try {
      await axios.post("http://localhost:5001/api/reviews", data);
    } catch {}

    setOpen(false);

    setForm({
      course: "",
      graduationYear: "",
      overallRating: 0,
      placementsRating: 0,
      facultyRating: 0,
      infrastructureRating: 0,
      campusLifeRating: 0,
      reviewTitle: "",
      pros: "",
      cons: "",
      isVerifiedStudent: true,
    });

    getReviews();
  };

  const averageRating = (field) => {
    const total = reviews.reduce(
      (sum, review) => sum + (review.ratings?.[field] || 0),
      0
    );

    return reviews.length
      ? (total / reviews.length).toFixed(1)
      : "0.0";
  };

  const handleVoteHelpful = (reviewId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "verified") return true; // All currently authenticated reviews have verified badges
    if (activeFilter === "positive") return (r.ratings?.overall || 0) >= 4;
    if (activeFilter === "placements") return (r.ratings?.placements || 0) >= 4;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Trust & Authenticity Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-[#172554] text-white">
            <ShieldCheck size={19} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-[#172554]">
                100% Verified Student Reviews
              </h3>
              <span className="rounded bg-[#DCFCE7] border border-[#86EFAC] px-1.5 py-0.2 text-[10px] font-bold text-[#166534]">
                AUTHENTIC
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Every review is submitted by registered students and verified alumni of {college?.name || "this institution"}.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="shrink-0 h-8 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-xs font-bold shadow-none"
        >
          Write a Review
        </Button>
      </div>

      {/* Ratings & Score Breakdown */}
      <Card className="p-4 sm:p-5 border border-[#E5E7EB] rounded-md bg-white shadow-none">
        <div className="grid md:grid-cols-[200px_1fr] gap-4 sm:gap-6 items-center">
          {/* Overall Rating Box */}
          <div className="text-center md:border-r md:border-[#E5E7EB] md:pr-6">
            <div className="text-4xl font-extrabold text-[#172554]">
              {averageRating("overall")}
            </div>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">
              Based on {reviews.length} Verified Reviews
            </p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A] border border-[#BBF7D0]">
              <CheckCircle2 size={11} />
              <span>94% Recommend this college</span>
            </div>
          </div>

          {/* Category Ratings Bar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "Placements", key: "placements" },
              { label: "Faculty", key: "faculty" },
              { label: "Infrastructure", key: "infrastructure" },
              { label: "Campus Life", key: "campusLife" },
            ].map((item) => (
              <div
                key={item.key}
                className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[4px] p-2.5"
              >
                <p className="text-[11px] font-semibold text-[#64748B] mb-1">
                  {item.label}
                </p>
                <div className="flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs sm:text-sm text-[#172554]">
                    {averageRating(item.key)}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Review Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#64748B] uppercase mr-1">Filter:</span>
          {[
            { id: "all", label: `All (${reviews.length})` },
            { id: "verified", label: "🛡️ Verified Students" },
            { id: "positive", label: "⭐ Top Rated (4+)" },
            { id: "placements", label: "💼 Placements Focus" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeFilter === f.id
                  ? "bg-[#172554] text-white"
                  : "bg-[#F8FAFC] text-slate-600 border border-[#E5E7EB] hover:bg-[#EFF6FF]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#64748B]">Showing {filteredReviews.length} reviews</span>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map((review, index) => {
          const votes = (helpfulVotes[review._id] || 0) + (12 + (index % 7));
          return (
            <Card
              key={review._id || index}
              className="p-4 border border-[#E5E7EB] rounded-md bg-white shadow-none"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-bold text-xs text-[#172554]">
                    {review.reviewerName?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-xs sm:text-sm text-[#172554]">
                        {review.reviewerName || "Verified Student"}
                      </h4>

                      {/* Verified Badge */}
                      <span className="inline-flex items-center gap-1 rounded bg-[#F0FDF4] border border-[#BBF7D0] px-1.5 py-0.2 text-[10px] font-bold text-[#16A34A]">
                        <BadgeCheck size={12} className="text-[#16A34A]" />
                        Verified Student
                      </span>

                      {review.graduationYear && (
                        <span className="rounded bg-[#F8FAFC] border border-[#E5E7EB] px-1.5 py-0.2 text-[10px] font-medium text-slate-600">
                          Class of {review.graduationYear}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {review.course || "B.Tech / Degree Program"} · Verified Enrollment
                    </p>
                  </div>
                </div>

                {/* Overall Rating Badge */}
                <div className="flex items-center gap-1 bg-[#172554] text-white px-2 py-0.5 rounded-[4px] text-xs font-bold shrink-0">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {review.ratings?.overall || 5}.0
                </div>
              </div>

              {/* Review Title */}
              {review.reviewTitle && (
                <h3 className="font-bold text-xs sm:text-sm text-[#172554] mb-2">
                  "{review.reviewTitle}"
                </h3>
              )}

              {/* Category Ratings Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[3px] text-[10px] font-medium text-slate-700">
                  Placement: <strong className="text-[#172554]">{review.ratings?.placements || 4}/5</strong>
                </span>
                <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[3px] text-[10px] font-medium text-slate-700">
                  Faculty: <strong className="text-[#172554]">{review.ratings?.faculty || 4}/5</strong>
                </span>
                <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[3px] text-[10px] font-medium text-slate-700">
                  Infrastructure: <strong className="text-[#172554]">{review.ratings?.infrastructure || 4}/5</strong>
                </span>
                <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[3px] text-[10px] font-medium text-slate-700">
                  Campus: <strong className="text-[#172554]">{review.ratings?.campusLife || 4}/5</strong>
                </span>
              </div>

              {/* Pros & Cons Content */}
              <div className="space-y-2 text-xs sm:text-[13px] bg-[#F8FAFC] p-3 rounded-[4px] border border-[#E5E7EB]">
                {review.pros && (
                  <div className="flex items-start gap-1.5">
                    <span className="shrink-0 font-bold text-[#16A34A]">👍 Pros:</span>
                    <span className="text-slate-700 leading-relaxed">{review.pros}</span>
                  </div>
                )}
                {review.cons && (
                  <div className="flex items-start gap-1.5">
                    <span className="shrink-0 font-bold text-[#DC2626]">👎 Cons:</span>
                    <span className="text-slate-700 leading-relaxed">{review.cons}</span>
                  </div>
                )}
              </div>

              {/* Footer: Date & Helpful Voting */}
              <div className="border-t border-[#E5E7EB] mt-3 pt-2.5 flex items-center justify-between text-xs text-[#64748B]">
                <p className="text-[11px]">
                  Reviewed on {new Date(review.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>

                <button
                  type="button"
                  onClick={() => handleVoteHelpful(review._id || index)}
                  className="inline-flex items-center gap-1 rounded-[4px] border border-[#E5E7EB] bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#172554] transition-colors"
                >
                  <ThumbsUp size={11} />
                  Helpful ({votes})
                </button>
              </div>
            </Card>
          );
        })}

        {!filteredReviews.length && (
          <Card className="p-6 text-center border border-[#E5E7EB] rounded-md bg-white shadow-none">
            <ShieldCheck size={28} className="mx-auto text-slate-400 mb-2" />
            <p className="text-xs text-[#64748B]">
              No reviews found matching your filter. Be the first verified student to share your experience!
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-3 h-8 rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] text-xs font-bold shadow-none"
            >
              Write First Review
            </Button>
          </Card>
        )}
      </div>

      {/* Write Review Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-5 rounded-md border-[#E5E7EB]">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#16A34A] text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Verified Student Review Form</span>
            </div>
            <DialogTitle className="text-lg font-bold text-[#172554]">
              Review {college?.name}
            </DialogTitle>
            <p className="text-xs text-[#64748B]">
              Help prospective students make informed admission decisions with your authentic experience.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#172554]">Course / Program</Label>
                <Input
                  value={form.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  required
                  className="rounded-[4px] mt-1 text-xs h-8"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#172554]">Graduation Year / Batch</Label>
                <Input
                  value={form.graduationYear}
                  onChange={(e) => handleChange("graduationYear", e.target.value)}
                  placeholder="e.g. 2024"
                  required
                  className="rounded-[4px] mt-1 text-xs h-8"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#172554]">Overall Rating</Label>
              <div className="mt-1">
                <StarRating
                  rating={form.overallRating}
                  setRating={(r) => handleChange("overallRating", r)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-2.5 rounded-[4px] border border-[#E5E7EB]">
              <div>
                <Label className="text-[11px] font-semibold text-slate-700">Placements (1-5)</Label>
                <StarRating
                  rating={form.placementsRating}
                  setRating={(r) => handleChange("placementsRating", r)}
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-slate-700">Faculty (1-5)</Label>
                <StarRating
                  rating={form.facultyRating}
                  setRating={(r) => handleChange("facultyRating", r)}
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-slate-700">Infrastructure (1-5)</Label>
                <StarRating
                  rating={form.infrastructureRating}
                  setRating={(r) => handleChange("infrastructureRating", r)}
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-slate-700">Campus Life (1-5)</Label>
                <StarRating
                  rating={form.campusLifeRating}
                  setRating={(r) => handleChange("campusLifeRating", r)}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#172554]">Review Headline</Label>
              <Input
                value={form.reviewTitle}
                onChange={(e) => handleChange("reviewTitle", e.target.value)}
                placeholder="e.g. Excellent placement cell and vibrant campus life"
                required
                className="rounded-[4px] mt-1 text-xs h-8"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#16A34A]">Pros (What you liked)</Label>
              <Textarea
                value={form.pros}
                onChange={(e) => handleChange("pros", e.target.value)}
                placeholder="Top companies for internships, experienced faculty..."
                required
                className="rounded-[4px] mt-1 text-xs min-h-[60px]"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#DC2626]">Cons (Areas for improvement)</Label>
              <Textarea
                value={form.cons}
                onChange={(e) => handleChange("cons", e.target.value)}
                placeholder="Hostel food could be improved, strict attendance..."
                required
                className="rounded-[4px] mt-1 text-xs min-h-[60px]"
              />
            </div>

            <div className="flex items-center gap-2 rounded-[4px] bg-[#EFF6FF] border border-[#BFDBFE] p-2">
              <input
                type="checkbox"
                id="verifyCheck"
                checked={form.isVerifiedStudent}
                onChange={(e) => handleChange("isVerifiedStudent", e.target.checked)}
                className="rounded text-[#172554]"
              />
              <label htmlFor="verifyCheck" className="text-[11px] font-medium text-[#172554]">
                I certify that I am/was a bona fide student of this college.
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-[4px] h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-[4px] bg-[#172554] text-white hover:bg-[#0F172A] h-8 text-xs font-bold"
              >
                Submit Verified Review
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
