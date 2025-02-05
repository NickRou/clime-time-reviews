import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface UserCardProps {
  name: string
  username: string
  avatar: string
  isFollowing: boolean
  onFollowToggle: () => void
  onRemove?: () => void
  showRemoveButton?: boolean
}

export default function UserCard({
  name,
  username,
  avatar,
  isFollowing,
  onFollowToggle,
  onRemove,
  showRemoveButton = false,
}: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {showRemoveButton && (
          <Button variant="outline" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
        <Button
          variant={isFollowing ? 'outline' : 'default'}
          size="sm"
          onClick={onFollowToggle}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      </div>
    </div>
  )
}
