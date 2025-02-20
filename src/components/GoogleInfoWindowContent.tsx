import { Card, CardContent } from '@/components/ui/card'
import StarRating from '@/components/DisplayStarRating'
import { PostWithUser } from '@/lib/types'

interface GoogleInfoWindowContentProps {
  post: PostWithUser
}

export default function GoogleInfoWindowContent({
  post,
}: GoogleInfoWindowContentProps) {
  const {
    loc_name,
    loc_address,
    loc_review,
    loc_content,
    loc_cost,
    user,
    createTs,
  } = post
  const { first_name, last_name, username } = user

  return (
    <Card className="w-full max-w-sm border-0 shadow-none bg-white text-black">
      <CardContent className="">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900">
              {first_name} {last_name}
            </p>
            <p className="text-sm text-gray-600">@{username}</p>
            <span className="text-sm text-gray-600">
              •{' '}
              {new Date(createTs).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
              })}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">{loc_name}</p>
            <p className="text-sm text-gray-600">{loc_address}</p>
            <div className="flex items-center gap-1">
              <StarRating rating={loc_review} />
              {loc_cost > 0 && (
                <span className="text-sm text-gray-600">
                  • {'$'.repeat(loc_cost)}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap text-gray-800">
            {loc_content}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
