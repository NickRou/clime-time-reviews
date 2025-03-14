'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import StarRating from '@/app/(protected)/_components/DisplayStarRating'
import Link from 'next/link'
import { Post, Like } from '@/lib/types'
import { useEffect, useState } from 'react'
import { getPostLikes, likePost, unlikePost } from '@/actions/likes'
import ImageCarousel from './HorizontalScrollImages'
import { Badge } from '@/components/ui/badge'
import UserVerifiedCheck from './UserVerifiedCheck'

interface UserPostProps {
  post: Post
  currentUserId: string
  onDelete?: (postId: string) => Promise<void>
}

export default function UserPost({
  post,
  currentUserId,
  onDelete,
}: UserPostProps) {
  const {
    post_id,
    loc_name,
    loc_address,
    loc_review,
    loc_content,
    loc_cost,
    user,
    images,
    likes,
    post_tags,
    createTs,
  } = post
  const { username, first_name, last_name, image_url, is_verified } = user

  const [postLikes, setPostLikes] = useState<Like[]>(likes || [])
  const [currentUserLiked, setCurrentUserLiked] = useState(
    likes?.some((like) => like.user_id === currentUserId)
  )

  useEffect(() => {
    const updateLikes = async () => {
      const res = await getPostLikes(post_id)
      setPostLikes(res)
      setCurrentUserLiked(res.some((like) => like.user_id === currentUserId))
    }
    updateLikes()
  }, [currentUserId, post_id])

  const onLikeToggle = async (postId: string) => {
    if (currentUserLiked) {
      await unlikePost(postId)
      setPostLikes(postLikes.filter((like) => like.post_id !== postId))
      setCurrentUserLiked(false)
    } else {
      const res = await likePost(postId)
      setPostLikes([...postLikes, res])
      setCurrentUserLiked(true)
    }
  }

  return (
    <Card className="w-full max-w-3xl border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Link href={`/profile/${username}`}>
            <Avatar>
              <AvatarImage
                src={image_url}
                alt={`${first_name} ${last_name}`}
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                {first_name.charAt(0)}
                {last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link
                href={`/profile/${username}`}
                className="hover:underline flex flex-row items-end gap-1"
              >
                <p className="text-sm md:text-base font-medium">
                  {first_name} {last_name}
                </p>
                {is_verified && (
                  <UserVerifiedCheck className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Link>
              <Link href={`/profile/${username}`} className="hover:underline">
                <p className="text-sm text-muted-foreground">@{username}</p>
              </Link>
              <span className="text-sm md:text-base text-muted-foreground">
                •{' '}
                {new Date(createTs).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: '2-digit',
                })}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm md:text-base font-medium">{loc_name}</p>
              <p className="text-sm md:text-base text-muted-foreground">
                {loc_address}
              </p>
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
            <div className="flex flex-wrap gap-2 pt-4">
              {post_tags?.map((postTag) => (
                <Badge
                  key={postTag.tag.tag_id}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 text-xs"
                >
                  {postTag.tag.tag_text}
                </Badge>
              ))}
            </div>
            {images !== undefined && images.length > 0 && (
              <div className="pt-4">
                <ImageCarousel
                  fileUrls={images.map((image) => image.image_url)}
                />
              </div>
            )}
          </div>
        </div>
        {currentUserId !== user.user_id && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-primary rounded-full"
              onClick={() => onLikeToggle(post_id)}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${
                  currentUserLiked ? 'fill-red-500 stroke-red-500' : ''
                }`}
              />
              <span className="text-xs">{postLikes.length}</span>
            </Button>
          </div>
        )}
        {currentUserId === user.user_id && (
          <div className="mt-4 flex justify-end">
            <div className="flex items-center space-x-2">
              <Heart className={`w-4 h-4 mr-1`} />
              <span className="text-xs">{postLikes.length}</span>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onDelete(post_id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
