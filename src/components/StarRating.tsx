import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (starIndex === 1 && isHalf && value > 0) {
      onChange(0)
      return
    }
    const newValue = isHalf ? starIndex * 2 - 1 : starIndex * 2
    onChange(newValue)
  }

  return (
    <div className="flex gap-2">
      {stars.map((star) => (
        <div key={star} className="relative">
          {/* Half star clickable area */}
          <div
            className="absolute w-1/2 h-full cursor-pointer z-10"
            onClick={() => handleClick(star, true)}
          />
          {/* Full star clickable area */}
          <div
            className="absolute w-1/2 h-full cursor-pointer z-10 left-1/2"
            onClick={() => handleClick(star, false)}
          />
          <div className="text-yellow-400 flex">
            {value >= star * 2 ? (
              <Star fill="currentColor" size={40} />
            ) : value >= star * 2 - 1 ? (
              <StarHalf fill="currentColor" size={40} />
            ) : (
              <Star size={40} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
