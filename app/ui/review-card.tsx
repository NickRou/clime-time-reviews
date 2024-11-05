// components/ReviewCard.tsx
import { StarIcon } from "lucide-react"; // Assuming you're using Lucide for icons

type ReviewCardProps = {
  name: string;
  rating: number;
  date: string;
  review: string;
  address: string;
  restaurantName: string;
};

export default function ReviewCard({
  name,
  rating,
  date,
  review,
  address,
  restaurantName,
}: ReviewCardProps) {
  return (
    <div className="max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="mb-3">
        <h1 className="text-xl font-bold">{restaurantName}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-gray-500 text-sm">{date}</p>
          <p className="text-gray-400 text-sm">{address}</p>
        </div>
      </div>

      <div className="flex items-center mt-2 space-x-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={24} // Increase the star size
            className={`text-yellow-500 ${i < rating ? "fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>

      <p className="mt-4 text-gray-700">{review}</p>
    </div>
  );
}
