'use client'

import { getAllPosts, getAllUsers } from '@/lib/actions'
import PostCard from '@/components/PostCard'
import { Separator } from '@/components/ui/separator'
import { Fragment, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import UserCard from '@/components/UserCard'
import { User } from '@/lib/types'
import { Post } from '@/lib/types'

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [fetchedUsers, fetchedPosts] = await Promise.all([
        getAllUsers(),
        getAllPosts(),
      ])
      if (fetchedUsers) setUsers(fetchedUsers)
      if (fetchedPosts) setPosts(fetchedPosts)
    }
    loadData()
  }, [])

  const toggleFollow = (userId: string) => {
    console.log(userId)
  }

  if (!users || !posts) return null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-3xl mx-auto">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="grid gap-6 max-w-3xl mx-auto">
            {posts.map((post, index) => {
              const user = users.find((user) => user.id === post.user_id)
              if (!user) return null

              return (
                <Fragment key={post.post_id}>
                  <PostCard
                    name={`${user.firstName} ${user.lastName}`}
                    username={user.username || ''}
                    restaurantName={post.loc_name}
                    address={post.loc_address}
                    rating={post.loc_review}
                    body={post.loc_content}
                    avatar={user.imageUrl}
                    likes={0}
                  />
                  {index < posts.length - 1 && <Separator />}
                </Fragment>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="following">
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
