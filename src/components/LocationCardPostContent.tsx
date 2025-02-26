import { Card, CardContent } from '@/components/ui/card'
import StarRating from '@/components/DisplayStarRating'
import { Post } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import HorizontalScrollImages from './HorizontalScrollImages'

interface LocationCardPostContentProps {
  post: Post
}

export default function LocationCardPostContent({
  post,
}: LocationCardPostContentProps) {
  const { loc_review, loc_content, loc_cost, user, images, createTs } = post
  const { first_name, last_name, username, image_url } = user

  return (
    <Card className="border-0 border-b rounded-none">
      <CardContent className="pt-2">
        <div className="flex items-start space-x-4">
          <Link href={`/profile/${username}`}>
            <Avatar>
              <AvatarImage src={image_url} alt={`${first_name} ${last_name}`} />
              <AvatarFallback>
                {first_name.charAt(0)}
                {last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link href={`/profile/${username}`} className="hover:underline">
                <p className="text-sm font-medium">
                  {first_name} {last_name}
                </p>
              </Link>
              <Link href={`/profile/${username}`} className="hover:underline">
                <p className="text-sm text-muted-foreground">@{username}</p>
              </Link>
              <span className="text-sm text-muted-foreground">
                •{' '}
                {new Date(createTs).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: '2-digit',
                })}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1">
                <StarRating rating={loc_review} />
                {loc_cost > 0 && (
                  <span className="text-sm text-muted-foreground">
                    • {'$'.repeat(loc_cost)}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap">{loc_content}</p>
            {images !== undefined && images.length > 0 && (
              <div className="pt-4">
                <HorizontalScrollImages
                  fileUrls={images.map((image) => image.image_url)}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
