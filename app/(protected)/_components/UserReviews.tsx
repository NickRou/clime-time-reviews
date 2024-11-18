"use client";

import { getReviews, getUniqueTags } from "@/app/(protected)/_actions/reviews";
import { UserReview } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilterIcon, StarIcon } from "lucide-react";
import ReviewCard from "./ReviewCard";

const UserReviews = () => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    rating: "any",
    tags: [] as string[],
  });
  const [tempFilters, setTempFilters] = useState({
    rating: "any",
    tags: [] as string[],
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const fetchReviews = useCallback(
    async (filterParams = activeFilters) => {
      setLoading(true);
      const result = await getReviews(filterParams);
      setReviews(result.reviews);
      setError(result.error);
      setLoading(false);
    },
    [activeFilters]
  );

  useEffect(() => {
    fetchReviews().catch(console.error);
  }, [fetchReviews]);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getUniqueTags();
      setAvailableTags(tags);
    };
    fetchTags();
  }, []);

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    setActiveFilters(tempFilters);
    fetchReviews(tempFilters);
  };

  const handleDialogOpen = (open: boolean) => {
    setIsFilterOpen(open);
    if (open) {
      setTempFilters(activeFilters);
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-center mb-12 text-black ">
          --- Reviews From Your Friends ---
        </h1>
        <SignedOut>
          <p className="text-center mb-12 text-black">
            Log in to see reviews from your friends.
          </p>
        </SignedOut>
        <SignedIn>
          <div className="flex justify-start mb-6">
            <Dialog open={isFilterOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xs p-4">
                <DialogHeader className="pb-2">
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Rating</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="any"
                          name="rating"
                          value="any"
                          checked={tempFilters.rating === "any"}
                          onChange={(e) =>
                            setTempFilters({
                              ...tempFilters,
                              rating: e.target.value,
                            })
                          }
                          className="h-4 w-4"
                        />
                        <label htmlFor="any">Any Rating</label>
                      </div>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            id={`rating${rating}`}
                            name="rating"
                            value={rating}
                            checked={tempFilters.rating === rating.toString()}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                rating: e.target.value,
                              })
                            }
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`rating${rating}`}
                            className="flex items-center space-x-1"
                          >
                            <span>{rating}+</span>
                            <div className="flex">
                              {[...Array(rating)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="max-h-40 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (tempFilters.tags.includes(tag)) {
                                setTempFilters({
                                  ...tempFilters,
                                  tags: tempFilters.tags.filter(
                                    (t) => t !== tag
                                  ),
                                });
                              } else {
                                setTempFilters({
                                  ...tempFilters,
                                  tags: [...tempFilters.tags, tag],
                                });
                              }
                            }}
                            className={`px-3 py-1 rounded-md text-sm transition-colors
                                ${
                                  tempFilters.tags.includes(tag)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-6 overflow-y-auto max-h-full">
            {reviews.length === 0 ? (
              <p className="text-center mb-12 text-black">
                No reviews from your friends :/
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))
            )}
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default UserReviews;
