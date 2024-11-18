import { UserReview } from "@/lib/types";

interface ReviewsLayoutProps {
  title: string;
  reviews: UserReview[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
  children?: React.ReactNode;
}

const ReviewsLayout = ({
  title,
  reviews,
  loading,
  error,
  emptyMessage = "No reviews found :/",
  children,
}: ReviewsLayoutProps) => {
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
        <h1 className="text-4xl font-bold text-center mb-12 text-black">
          {title}
        </h1>
        <div className="space-y-6 overflow-y-auto max-h-full">
          {reviews.length === 0 ? (
            <p className="text-center mb-12 text-black">{emptyMessage}</p>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsLayout;
