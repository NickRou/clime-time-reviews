'use client'

import { followUser } from '@/actions/follows'
import UserCard from '@/app/(protected)/_components/UserCard'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { User } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="who-to-follow" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="who-to-follow">Who to Follow</TabsTrigger>
        </TabsList>
        <TabsContent value="who-to-follow">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
