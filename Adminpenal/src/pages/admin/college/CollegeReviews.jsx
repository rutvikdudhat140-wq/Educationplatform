
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CollegeReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await axios.get("http://localhost:5001/api/reviews");

    if (res.data.success) {
      setReviews(res.data.data);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5001/api/reviews/${id}/status`,
      { status }
    );

    fetchReviews();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5001/api/reviews/${id}`
    );

    fetchReviews();
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          College Reviews
        </h1>
        <p className="text-[11px] text-gray-500">
          Manage student reviews and ratings
        </p>
      </div>

      <Card className="overflow-hidden rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="border-b ">
              <tr>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600">College</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Reviewer</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Course</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Rating</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Status</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="max-w-[140px] truncate px-2 py-1.5 font-medium text-gray-800">{review.collegeId?.name}</td>

                  <td className="max-w-[100px] truncate px-2 py-1.5 text-gray-600">{review.reviewerName}</td>

                  <td className="whitespace-nowrap px-2 py-1.5 text-gray-600">
                    {review.course}
                    {review.graduationYear &&
                      ` (${review.graduationYear})`}
                  </td>

                  <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-yellow-500">{review.ratings?.overall || 0} ★</td>

                  <td className="px-2 py-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : review.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  <td className="px-2 py-1.5">
                    <div className="flex gap-1">
                      {review.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateStatus(review._id, "approved")
                          }
                          className="h-6 px-1.5 text-[10px] text-green-600">
                          Approve
                        </Button>
                      )}

                      {review.status !== "rejected" && (
                        <Button size="sm"variant="outline"onClick={() =>
                            updateStatus(review._id, "rejected")
                          }
                          className="h-6 px-1.5 text-[10px] text-red-600">
                          Reject
                        </Button>
                      )}

                      <Button size="sm"variant="destructive"onClick={() => handleDelete(review._id)}className="h-6 px-1.5 text-[10px]">Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CollegeReviews;
