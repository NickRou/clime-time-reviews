'use client'

import { followUser } from '@/actions/follows'
import UserCard from '@/app/(protected)/_components/UserCard'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { User } from '@/lib/types'

interface UserExplorerProps {
  users: User[]
}

export default function UserExplorer({ users }: UserExplorerProps) {
  const [usersToFollow, setUsersToFollow] = useState<User[]>(users)

  const onFollow = async (user: User) => {
    await followUser(user.user_id)
    setUsersToFollow(usersToFollow.filter((u) => u.user_id !== user.user_id))
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-4">
      <h1 className="pl-3 text-xl font-bold">Who to follow</h1>
      <div className="flex flex-col gap-2">
        <Card className="border-0 shadow-none">
          {usersToFollow.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You are following everyone!
            </div>
          ) : (
            usersToFollow.map((user, index) => (
              <div key={user.user_id}>
                <UserCard
                  user={user}
                  isFollowing={false}
                  showFollowButton={true}
                  onFollow={() => onFollow(user)}
                />
                {index < usersToFollow.length && <Separator />}
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  )
}
