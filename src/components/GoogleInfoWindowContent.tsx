import { Card, CardContent } from '@/components/ui/card'
import StarRating from '@/components/DisplayStarRating'
import { PostWithUser } from '@/lib/types'

interface GoogleInfoWindowContentProps {
  post: PostWithUser
}

export default function GoogleInfoWindowContent({
  post,
}: GoogleInfoWindowContentProps) {
  const { loc_review, loc_content, loc_cost, user, createTs } = post
  const { first_name, last_name, username } = user

  return (
    <Card className="border-0 bg-white text-gray-800">
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <p className="font-medium">
              {first_name} {last_name}
              <span className="ml-1 font-normal text-gray-500">
                @{username}
              </span>
            </p>
            <span className="text-gray-400">
              {new Date(createTs).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={loc_review} />
            {loc_cost > 0 && (
              <span className="text-xs font-medium text-gray-600">
                {'$'.repeat(loc_cost)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 line-clamp-3">{loc_content}</p>
        </div>
      </CardContent>
    </Card>
  )
}
