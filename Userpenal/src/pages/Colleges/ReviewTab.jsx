
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

import { Star } from "lucide-react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={19}
          onClick={() => setRating(star)}
          className={`cursor-pointer ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export const ReviewTab = ({ college }) => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);

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
  });

  const getReviews = async () => {
    const res = await axios.get(
      `http://localhost:5001/api/reviews/college/${college._id}`
    );

    setReviews(res.data.data);
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

    await axios.post("http://localhost:5001/api/reviews", data);

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

  return (
    <div className="space-y-5">

      {/* Header */}
      <Card className="p-5 border rounded-xl">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Students Ratings & Reviews
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Read reviews and ratings from students
            </p>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="bg-[#1E3A5F] hover:bg-[#16293F] text-white"
          >
            Write a Review
          </Button>

        </div>

        {/* Rating Summary */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Overall Rating */}
          <div className="bg-slate-50 rounded-xl p-5 flex items-center gap-5">

            <div className="text-center">

              <div className="text-4xl font-bold text-slate-800">
                {averageRating("overall")}
              </div>

              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Out of 5
              </p>

            </div>

            <div className="border-l pl-5">

              <p className="text-sm font-semibold text-slate-700">
                {reviews.length} Student Reviews
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Overall college experience
              </p>

            </div>

          </div>

          {/* Category Ratings */}
          <div className="grid grid-cols-2 gap-3">

            {[
              {
                label: "Placements",
                key: "placements",
              },
              {
                label: "Faculty",
                key: "faculty",
              },
              {
                label: "Infrastructure",
                key: "infrastructure",
              },
              {
                label: "Campus Life",
                key: "campusLife",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="bg-white border rounded-lg p-3"
              >

                <p className="text-xs text-gray-500 mb-1">
                  {item.label}
                </p>

                <div className="flex items-center gap-1">

                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-bold text-slate-800">
                    {averageRating(item.key)}
                  </span>

                  <span className="text-xs text-gray-400">
                    / 5
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>

      </Card>

      {/* Reviews */}
      <div className="space-y-4">

        {reviews.map((review) => (
          <Card
            key={review._id}
            className="p-5 border rounded-xl"
          >

            {/* Reviewer Header */}
            <div className="flex items-start justify-between gap-3 mb-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700">
                  {review.reviewerName?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div>

                  <h4 className="font-semibold text-slate-800">
                    {review.reviewerName || "Anonymous"}

                    <span className="text-green-600 text-xs ml-1">
                      ✓
                    </span>
                  </h4>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {review.course || "Course"}{" "}
                    {review.graduationYear
                      ? `• Batch of ${review.graduationYear}`
                      : ""}
                  </p>

                </div>

              </div>

              {/* Overall Rating */}
              <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-md text-sm font-semibold">
                <Star
                  size={13}
                  className="fill-white"
                />

                {review.ratings?.overall || 0}
              </div>

            </div>

            {/* Category Ratings */}
            <div className="flex flex-wrap gap-2 mb-4">

              <span className="px-2.5 py-1 bg-slate-50 border rounded-md text-xs text-slate-600">
                Placement: {review.ratings?.placements || 0}/5
              </span>

              <span className="px-2.5 py-1 bg-slate-50 border rounded-md text-xs text-slate-600">
                Faculty: {review.ratings?.faculty || 0}/5
              </span>

              <span className="px-2.5 py-1 bg-slate-50 border rounded-md text-xs text-slate-600">
                Infrastructure:{" "}
                {review.ratings?.infrastructure || 0}/5
              </span>

              <span className="px-2.5 py-1 bg-slate-50 border rounded-md text-xs text-slate-600">
                Campus Life: {review.ratings?.campusLife || 0}/5
              </span>

            </div>

            {/* Review Title */}
            <h3 className="font-bold text-slate-800 text-base mb-2">
              {review.reviewTitle}
            </h3>

            {/* Review Content */}
            <div className="space-y-2 text-sm">

              <div>
                <span className="font-semibold text-green-700">
                  Pros:
                </span>

                <span className="text-slate-600 ml-1">
                  {review.pros}
                </span>
              </div>

              <div>
                <span className="font-semibold text-red-600">
                  Cons:
                </span>

                <span className="text-slate-600 ml-1">
                  {review.cons}
                </span>
              </div>

            </div>

            {/* Date */}
            <div className="border-t mt-4 pt-3">

              <p className="text-xs text-gray-400">
                Reviewed on{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>

            </div>

          </Card>
        ))}

        {!reviews.length && (
          <Card className="p-8 text-center border rounded-xl">
            <p className="text-gray-500 text-sm">
              No reviews yet. Be the first to review!
            </p>

            <Button
              onClick={() => setOpen(true)}
              className="mt-3 bg-[#1E3A5F] hover:bg-[#16293F] text-white"
            >
              Write a Review
            </Button>
          </Card>
        )}

      </div>

      {/* Write Review Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-5 sm:p-6">

          <DialogHeader className="space-y-1">

            <DialogTitle className="text-xl font-bold">
              Write a Review
            </DialogTitle>

            <p className="text-sm text-gray-500">
              {college?.name}
            </p>

          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-2"
          >

            {/* Course & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="space-y-1.5">
                <Label>Course</Label>

                <Input
                  required
                  placeholder="e.g. B.Tech CSE"
                  value={form.course}
                  onChange={(e) =>
                    handleChange(
                      "course",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Graduation Year</Label>

                <Input
                  required
                  placeholder="2026"
                  value={form.graduationYear}
                  onChange={(e) =>
                    handleChange(
                      "graduationYear",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            {/* Ratings */}
            <div className="bg-slate-50 border rounded-lg p-3.5 space-y-2.5">

              <h4 className="font-semibold text-sm text-slate-800">
                Rate Your Experience
              </h4>

              {[
                {
                  label: "Overall Rating",
                  key: "overallRating",
                },
                {
                  label: "Placements",
                  key: "placementsRating",
                },
                {
                  label: "Faculty",
                  key: "facultyRating",
                },
                {
                  label: "Infrastructure",
                  key: "infrastructureRating",
                },
                {
                  label: "Campus Life",
                  key: "campusLifeRating",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3"
                >

                  <span className="text-sm text-slate-600">
                    {item.label}
                  </span>

                  <StarRating
                    rating={form[item.key]}
                    setRating={(value) =>
                      handleChange(
                        item.key,
                        value
                      )
                    }
                  />

                </div>
              ))}

            </div>

            {/* Review Title */}
            <div className="space-y-1.5">
              <Label>Review Title</Label>

              <Input
                required
                placeholder="Summarise your experience"
                value={form.reviewTitle}
                onChange={(e) =>
                  handleChange(
                    "reviewTitle",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="space-y-1.5">
                <Label>Pros</Label>

                <Textarea
                  required
                  rows={3}
                  placeholder="What did you like most?"
                  value={form.pros}
                  onChange={(e) =>
                    handleChange(
                      "pros",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Cons</Label>

                <Textarea
                  required
                  rows={3}
                  placeholder="What could be improved?"
                  value={form.cons}
                  onChange={(e) =>
                    handleChange(
                      "cons",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 bg-[#1E3A5F] hover:bg-[#16293F] text-white"
            >
              Submit Review
            </Button>

          </form>

        </DialogContent>

      </Dialog>

    </div>
  );
};
