import { Button } from "@/components/ui/button";
import { UserReview } from "@/lib/types";
import { StarIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteReview } from "../_actions/reviews";

const ReviewCard = ({
  review,
  editVersion,
  onDelete,
}: {
  review: UserReview;
  editVersion?: boolean;
  onDelete: (deletedReviewId: string) => void;
}) => {
  const handleDelete = async () => {
    const result = await deleteReview(review.review_id);
    if (result?.success) {
      onDelete(review.review_id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 relative overflow-hidden rounded-full">
          <Image
            src={review.user_image_url || "/default-avatar.png"}
            alt={`${review.username}'s avatar`}
            fill
            className="object-cover"
          />
        </div>
        <span className="font-medium text-gray-900">@{review.user_name}</span>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {review.restaurant_name}
          </h3>
          <p className="text-sm text-gray-500">{review.address}</p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>

      <p className="mt-4 text-gray-600">
        <strong> Review: </strong> {review.review}
      </p>
      {/* What to Order */}
      {review.what_to_order && (
        <p className="mt-4 text-gray-600">
          <strong> What To Order: </strong>
          {review.what_to_order}
        </p>
      )}
      {/* Tags Section */}
      {review.tags && review.tags.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mt-2">
            <strong className="text-gray-600">Tags:</strong>
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Edit and Delete Buttons */}
      {editVersion && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(review.review_id)}
            aria-label="Edit review"
          >
            <Edit className="h-4 w-4" />
          </Button> */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            aria-label="Delete review"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
