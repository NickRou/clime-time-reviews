import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
}

export default function StarRating({ rating }: StarRatingProps) {
  // Convert rating from 10 to 5 scale
  const convertedRating = rating / 2
  const fullStars = Math.floor(convertedRating)
  const hasHalfStar = convertedRating % 1 !== 0
  const emptyStars = 5 - Math.ceil(convertedRating)
  const ratingString = hasHalfStar
    ? convertedRating.toFixed(1)
    : convertedRating

  return (
    <div className="flex items-center">
      <span className="mr-1 text-sm text-gray-600">{ratingString}/5</span>
      {[...Array(fullStars)].map((_, index) => (
        <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" />
        </div>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} className="w-4 h-4 text-yellow-400" />
      ))}
    </div>
  )
}
