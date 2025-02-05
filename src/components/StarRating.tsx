import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
}

export default function StarRating({ rating }: StarRatingProps) {
  // Convert rating from 10 to 5 scale
  const convertedRating = rating / 2
  const fullStars = Math.floor(convertedRating)
  const hasHalfStar = convertedRating % 1 !== 0

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
      <span className="ml-1 text-sm text-gray-600">{rating / 2}/5</span>
    </div>
  )
}
