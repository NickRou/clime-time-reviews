import { Card, CardContent } from '@/components/ui/card'
import StarRating from '@/components/DisplayStarRating'
import { PostWithUser } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface GoogleInfoWindowContentProps {
  post: PostWithUser
}

export default function GoogleInfoWindowContent({
  post,
}: GoogleInfoWindowContentProps) {
  const { loc_review, loc_content, loc_cost, user, createTs } = post
  const { first_name, last_name, username, image_url } = user

  return (
    <Card className="bg-white text-gray-800 border border-gray-200">
      <CardContent className="pt-2">
        <div className="flex pt-4 items-center justify-between">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={image_url} />
              <AvatarFallback>
                {first_name}
                {last_name}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {first_name} {last_name}
              </p>
              <p className="text-xs text-gray-500">@{username}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(createTs).toLocaleDateString()}
          </p>
        </div>
        <div className="pt-2 flex items-center justify-between mb-2">
          <div className="flex items-center">
            <StarRating rating={loc_review} />
            <span className="pl-2 text-xs font-medium text-gray-600">
              {'$'.repeat(loc_cost)}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {loc_content}
        </p>
      </CardContent>
    </Card>
  )
}
