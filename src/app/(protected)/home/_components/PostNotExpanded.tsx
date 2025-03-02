'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/lib/types'
import Link from 'next/link'

interface PostNotExpandedProps {
  user: User
  handleExpand: () => void
}

export default function PostNotExpanded({
  user,
  handleExpand,
}: PostNotExpandedProps) {
  return (
    <div className="flex gap-4 pl-2">
      <Link href={`/profile/${user.username}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.image_url}
            alt={user.username ?? ''}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>
            {user.first_name?.charAt(0)}
            {user.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div
        onClick={handleExpand}
        className="w-full cursor-pointer p-3 rounded-lg bg-gray-200 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
      >
        Write a review!
      </div>
    </div>
  )
}
