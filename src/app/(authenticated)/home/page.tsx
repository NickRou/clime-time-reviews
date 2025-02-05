'use client'

import { getAllPosts, getAllUsers } from '@/lib/actions'
import PostCard from '@/components/PostCard'
import { Separator } from '@/components/ui/separator'
import { Fragment, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

  if (!users || !posts) return null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="for-you">For You</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <div className="grid max-w-3xl mx-auto">
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
                  {index < posts.length && <Separator />}
                </Fragment>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
