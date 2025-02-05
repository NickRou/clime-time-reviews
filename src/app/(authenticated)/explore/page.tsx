'use client'

import { getAllUsers } from '@/lib/actions'
import UserCard from '@/components/UserCard'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await getAllUsers()
      if (fetchedUsers) {
        setUsers(fetchedUsers)
      }
    }
    loadUsers()
  }, [])

  const toggleFollow = (userId: string) => {
    console.log(userId)
  }

  if (!users) return null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="who-to-follow" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="who-to-follow">Who to Follow</TabsTrigger>
        </TabsList>
        <TabsContent value="who-to-follow">
          <Card className="border-0 shadow-none">
            {users.map((user, index) => (
              <div key={user.id}>
                <UserCard
                  name={`${user.firstName} ${user.lastName}`}
                  username={user.username || ''}
                  avatar={user.imageUrl}
                  isFollowing={false}
                  onFollowToggle={() => toggleFollow(user.id)}
                />
                {index < users.length - 1 && <Separator />}
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
