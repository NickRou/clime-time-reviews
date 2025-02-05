'use client'

import {
  getAllUsers,
  getFollowingPosts,
  getPostLikes,
  likePost,
  unlikePost,
} from '@/lib/actions'
import PostCard from '@/components/PostCard'
import { Separator } from '@/components/ui/separator'
import { Fragment, useEffect, useState, Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Post, Like } from '@/lib/types'
import CreatePost from '@/components/CreatePost'
import { useUser } from '@clerk/nextjs'
import { Skeleton } from '@/components/ui/skeleton'

function PostCardSkeleton() {
  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="mt-4 h-8 w-20" />
    </div>
  )
}

function HomePageSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="w-full mb-8">
        <Skeleton className="h-10 w-full max-w-3xl mx-auto mb-6" />
        <div className="grid max-w-3xl mx-auto gap-6">
          <Skeleton className="h-32 w-full" />
          {[1, 2, 3].map((i) => (
            <Fragment key={i}>
              <PostCardSkeleton />
              <Separator />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user: currentUser } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [likes, setLikes] = useState<Like[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedUsers, fetchedPosts] = await Promise.all([
          getAllUsers(),
          getFollowingPosts(),
        ])
        if (fetchedUsers) setUsers(fetchedUsers)
        if (fetchedPosts) {
          setPosts(fetchedPosts)
          const allLikes = await Promise.all(
            fetchedPosts.map((post) => getPostLikes(post.post_id))
          )
          setLikes(allLikes.flat())
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleLikeToggle = async (postId: string) => {
    if (!currentUser || !currentUser.id) {
      console.error('User not found')
      return null
    }

    const currentUserId = currentUser?.id
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

  if (!currentUser || isLoading || !users.length || !posts) {
    return <HomePageSkeleton />
  }

  return (
    <Suspense fallback={<HomePageSkeleton />}>
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
                          like.user_id === currentUser?.id
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
    </Suspense>
  )
}
