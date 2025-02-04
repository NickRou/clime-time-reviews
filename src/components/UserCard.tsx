import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface UserCardProps {
  name: string
  username: string
  avatar: string
  isFollowing: boolean
  onFollowToggle: () => void
}

export default function UserCard({
  name,
  username,
  avatar,
  isFollowing,
  onFollowToggle,
}: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>
      <Button
        variant={isFollowing ? 'secondary' : 'default'}
        size="sm"
        onClick={onFollowToggle}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  )
}
