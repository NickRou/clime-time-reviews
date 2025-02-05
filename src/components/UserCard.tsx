import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UserCardProps {
  name: string
  username: string
  avatar: string
  showFollowingButton?: boolean
  isFollowing?: boolean
  onFollowToggle?: () => void
  onRemove?: () => void
  showRemoveButton?: boolean
}

export default function UserCard({
  name,
  username,
  avatar,
  showFollowingButton = false,
  isFollowing,
  onFollowToggle,
  onRemove,
  showRemoveButton = false,
}: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <Link href={`/profile/${username}`} className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="text-sm font-medium hover:underline">{name}</p>
          <p className="text-sm text-muted-foreground hover:underline">
            @{username}
          </p>
        </div>
      </Link>
      <div className="flex gap-2">
        {showRemoveButton && (
          <Button variant="outline" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
        {showFollowingButton && (
          <Button
            variant={isFollowing ? 'outline' : 'default'}
            size="sm"
            onClick={onFollowToggle}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>
    </div>
  )
}
