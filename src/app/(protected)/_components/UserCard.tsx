import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User } from '@/lib/types'
import Link from 'next/link'
import UserVerifiedCheck from './UserVerifiedCheck'

interface UserCardProps {
  user: User
  isFollowing: boolean
  showFollowButton: boolean
  onFollow: () => void
  showRemoveButton?: boolean
  onRemove?: () => void
}

export default function UserCard({
  user,
  isFollowing,
  showFollowButton,
  onFollow,
  showRemoveButton = false,
  onRemove,
}: UserCardProps) {
  const { username, first_name, last_name, image_url, is_verified } = user
  const name = `${first_name} ${last_name}`
  return (
    <div className="flex items-center justify-between p-4">
      <Link href={`/profile/${username}`} className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={image_url} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <div className="flex flex-row gap-1 items-end">
            <p className="text-sm font-medium hover:underline">{name}</p>
            {is_verified && <UserVerifiedCheck className="w-4 h-4" />}
          </div>
          <p className="text-sm text-muted-foreground hover:underline">
            @{username}
          </p>
        </div>
      </Link>
      <div className="flex gap-2">
        {showFollowButton && (
          <Button
            variant={isFollowing ? 'outline' : 'default'}
            size="sm"
            onClick={onFollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
        {showRemoveButton && (
          <Button variant="outline" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
