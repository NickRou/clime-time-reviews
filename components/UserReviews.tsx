"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, StarIcon } from "lucide-react";
import { getReviews } from "@/app/actions/get-reviews";
import { QueryResultRow } from "@vercel/postgres";

export default function UserReviews() {
  const [reviews, setReviews] = useState<QueryResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const result = await getReviews();
      setReviews(result.reviews);
      setError(result.error);
      setLoading(false);
    }
    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Reviews</h1>
      <div className="max-w-2xl mx-0">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">
            You have not written any reviews yet.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="overflow-hidden border-l-4 border-l-yellow-400"
              >
                <CardHeader key={review.id} className="bg-muted pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle
                        key={review.id}
                        className="text-lg font-semibold"
                      >
                        {review.restaurant_name}
                      </CardTitle>
                      <span>{review.address}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={`star-${review.id}-${i}`}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent key={review.id} className="pt-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <div>
                      <span className="font-semibold">
                        User: {review.user_name}
                      </span>{" "}
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span className="mr-4">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
