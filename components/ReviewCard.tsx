import { UserReview } from "@/lib/types";

const ReviewCard = ({ review }: { review: UserReview }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          {/* Restaurant Name */}
          <h2 className="font-bold text-xl text-gray-900">
            {review.restaurant_name}
          </h2>
          {/* Address */}
          <p className="text-gray-500 text-sm mt-1">{review.address}</p>

          <div className="mt-4">
            <div className="flex items-center mt-1">
              {[...Array(review.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Date and Reviewer */}
        <div className="text-sm text-gray-500 flex flex-col items-end">
          <span>{new Date(review.date).toLocaleDateString()}</span>
          <span>{review.user_name}</span>
        </div>
      </div>

      {/* Review Content */}
      <p className="mt-4 text-gray-600">{review.review}</p>
    </div>
  );
};

export default ReviewCard;