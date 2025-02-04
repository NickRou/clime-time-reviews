import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
}

export default function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          )
        } else if (index === fullStars && hasHalfStar) {
          return (
            <StarHalf
              key={index}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          )
        } else {
          return <Star key={index} className="w-4 h-4 text-gray-300" />
        }
      })}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}
