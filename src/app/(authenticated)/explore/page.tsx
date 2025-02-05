'use client'

import {
  getAllUsers,
  followUser,
  getFollowing,
  unfollowUser,
} from '@/lib/actions'
import UserCard from '@/components/UserCard'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@clerk/nextjs'

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const { user } = useUser()

  useEffect(() => {
    const loadUsers = async () => {
      if (!user?.id) return

      // Get all users and current following
      const [allUsers, following] = await Promise.all([
        getAllUsers(),
        getFollowing(user.id),
      ])

      if (!allUsers) return

      // Filter out the current user and users already being followed
      const followingSet = new Set(following.map((f) => f.id))
      const filteredUsers = allUsers.filter(
        (u) => u.id !== user.id && !followingSet.has(u.id)
      )

      setUsers(filteredUsers)
      setFollowingIds(followingSet)
    }

    loadUsers()
  }, [user?.id])

  const toggleFollow = async (userId: string) => {
    if (!user?.id) return

    try {
      await followUser(userId)
      setFollowingIds((prev) => {
        const next = new Set(prev)
        next.add(userId)
        return next
      })
      // Remove the user from the list after following
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="who-to-follow" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="who-to-follow">Who to Follow</TabsTrigger>
        </TabsList>
        <TabsContent value="who-to-follow">
          <Card className="border-0 shadow-none">
            {users.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                You are following everyone!
              </div>
            ) : (
              users.map((user, index) => (
                <div key={user.id}>
                  <UserCard
                    name={`${user.firstName} ${user.lastName}`}
                    username={user.username || ''}
                    avatar={user.imageUrl}
                    showFollowingButton={true}
                    isFollowing={followingIds.has(user.id)}
                    onFollowToggle={() => toggleFollow(user.id)}
                  />
                  {index < users.length - 1 && <Separator />}
                </div>
              ))
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
