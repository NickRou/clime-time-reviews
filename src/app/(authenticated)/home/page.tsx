'use client'

import {
  getAllPosts,
  getAllUsers,
  getPostLikes,
  likePost,
  unlikePost,
} from '@/lib/actions'
import PostCard from '@/components/PostCard'
import { Separator } from '@/components/ui/separator'
import { Fragment, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Post, Like } from '@/lib/types'
import CreatePost from '@/components/CreatePost'
import { useUser } from '@clerk/nextjs'

export default function HomePage() {
  const { user } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [likes, setLikes] = useState<Like[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [fetchedUsers, fetchedPosts] = await Promise.all([
        getAllUsers(),
        getAllPosts(),
      ])
      if (fetchedUsers) setUsers(fetchedUsers)
      if (fetchedPosts) {
        setPosts(fetchedPosts)
        // Fetch likes for all posts
        const allLikes = await Promise.all(
          fetchedPosts.map((post) => getPostLikes(post.post_id))
        )
        setLikes(allLikes.flat())
      }
    }
    loadData()
  }, [])

  const handleLikeToggle = async (postId: string) => {
    if (!user || !user.id) {
      console.error('User not found')
      return null
    }

    const currentUserId = user?.id
    const isLiked = likes.some(
      (like) => like.post_id === postId && like.user_id === currentUserId
    )

    try {
      if (isLiked) {
        await unlikePost(postId)
        setLikes(
          likes.filter(
            (like) =>
              !(like.post_id === postId && like.user_id === currentUserId)
          )
        )
      } else {
        await likePost(postId)
        setLikes([...likes, { post_id: postId, user_id: currentUserId }])
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  if (!users || !posts || !user) return null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="for-you">For You</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <div className="grid max-w-3xl mx-auto">
            <CreatePost />
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
                    postId={post.post_id}
                    likes={
                      likes.filter((like) => like.post_id === post.post_id)
                        .length
                    }
                    isLiked={likes.some(
                      (like) =>
                        like.post_id === post.post_id &&
                        like.user_id === user.id
                    )}
                    onLikeToggle={handleLikeToggle}
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
