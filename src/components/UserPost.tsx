'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import StarRating from '@/components/StarRating'
import Link from 'next/link'
import { PostWithUser, Like } from '@/lib/types'
import { useEffect, useState } from 'react'
import { getPostLikes, likePost, unlikePost } from '@/lib/actions'

interface UserPostProps {
  post: PostWithUser
  currentUserId: string
  onDelete?: (postId: string) => Promise<void>
}

export default function UserPost({
  post,
  currentUserId,
  onDelete,
}: UserPostProps) {
  const { post_id, loc_name, loc_address, loc_review, loc_content, user } = post
  const { username, first_name, last_name, image_url } = user

  const [likes, setLikes] = useState<Like[]>([])
  const [currentUserLiked, setCurrentUserLiked] = useState(false)

  useEffect(() => {
    const updateLikes = async () => {
      const res = await getPostLikes(post_id)
      setLikes(res)
      setCurrentUserLiked(res.some((like) => like.user_id === currentUserId))
    }
    updateLikes()
  }, [currentUserId, post_id])

  const onLikeToggle = async (postId: string) => {
    if (currentUserLiked) {
      await unlikePost(postId)
      setLikes(likes.filter((like) => like.post_id !== postId))
      setCurrentUserLiked(false)
    } else {
      const res = await likePost(postId)
      setLikes([...likes, res])
      setCurrentUserLiked(true)
    }
  }

  return (
    <Card className="w-full max-w-3xl border-0 shadow-none">
      <CardContent className="pt-6">
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
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">{loc_name}</p>
              <p className="text-sm text-muted-foreground">{loc_address}</p>
              <StarRating rating={loc_review} />
            </div>
            <p className="mt-2 text-sm">{loc_content}</p>
          </div>
        </div>
        {currentUserId !== user.user_id && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onLikeToggle(post_id)}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${
                  currentUserLiked ? 'fill-red-500 stroke-red-500' : ''
                }`}
              />
              <span className="text-xs">{likes.length}</span>
            </Button>
          </div>
        )}
        {currentUserId === user.user_id && onDelete && (
          <div className="mt-4 flex justify-end">
            <div className="flex items-center space-x-2">
              <Heart className={`w-4 h-4 mr-1`} />
              <span className="text-xs">{likes.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => onDelete(post_id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
