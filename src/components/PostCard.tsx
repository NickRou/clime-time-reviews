import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
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
}: PostCardProps) {
  return (
    <Card className="w-full max-w-2xl border-0 shadow-none">
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
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <Heart className="w-4 h-4 mr-1" />
            <span className="text-xs">{likes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
