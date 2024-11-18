"use client";

import { getCurrentUserReviews } from "@/app/(protected)/_actions/reviews";
import { UserReview } from "@/lib/types";
import { useEffect, useState } from "react";
import ManageReviewCard from "../_components/ManageReviewCard";

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const result = await getCurrentUserReviews();
      setReviews(result.reviews);
      setError(result.error);
      setLoading(false);
    }
    fetchReviews().catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-black">
          Loading Reviews...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-red-500">
        <h1 className="text-4xl font-bold text-center mb-12 text-black">
          {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Container with max width and center alignment */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-center mb-12 text-black ">
          --- Your Reviews ---
        </h1>
        {/* Reviews Grid */}
        <div className="space-y-6 overflow-y-auto max-h-full">
          {reviews.length === 0 ? (
            <p className="text-center mb-12 text-black">
              You have no reviews :/
            </p>
          ) : (
            reviews.map((review) => (
              <ManageReviewCard key={review.review_id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviewsPage;
