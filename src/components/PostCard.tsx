import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import StarRating from '@/components/StarRating'

interface PostCardProps {
  name: string
  username: string
  restaurantName: string
  address: string
  rating: number
  body: string
  avatar: string
  likes: number
  postId: string
  isLiked: boolean
  onLikeToggle: (postId: string) => void
  showDeleteButton?: boolean
  onDelete?: () => void
}

export default function PostCard({
  name,
  username,
  restaurantName,
  address,
  rating,
  body,
  avatar,
  likes,
  postId,
  isLiked,
  onLikeToggle,
  showDeleteButton,
  onDelete,
}: PostCardProps) {
  return (
    <Card className="w-full max-w-3xl border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">{restaurantName}</p>
              <p className="text-sm text-muted-foreground">{address}</p>
              <StarRating rating={rating} />
            </div>
            <p className="mt-2 text-sm">{body}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          {showDeleteButton ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="text-xs">Delete</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onLikeToggle(postId)}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${
                  isLiked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              <span className="text-xs">{likes}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
