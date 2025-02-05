'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Users } from 'lucide-react'
import PostCard from '@/components/PostCard'
import UserCard from '@/components/UserCard'
import Link from 'next/link'
import { unfollowUser, removeFollower, deletePost } from '@/lib/actions'
import { Post, User } from '@/lib/types'

interface ProfileContentProps {
  userId: string
  username: string
  firstName: string
  lastName: string
  imageUrl: string
  initialPosts: Post[]
  initialFollowing: User[]
  initialFollowers: User[]
}

export default function ProfileContent({
  userId,
  username,
  firstName,
  lastName,
  imageUrl,
  initialPosts,
  initialFollowing,
  initialFollowers,
}: ProfileContentProps) {
  const [userPosts, setUserPosts] = useState<Post[]>(initialPosts)
  const [following, setFollowing] = useState<User[]>(initialFollowing)
  const [followers, setFollowers] = useState<User[]>(initialFollowers)

  const toggleFollow = async (followeeId: string) => {
    try {
      await unfollowUser(followeeId)
      // Remove the unfollowed user from the following list
      setFollowing(following.filter((user) => user.id !== followeeId))
    } catch (error) {
      console.error('Failed to unfollow user:', error)
    }
  }

  const removeFollowerHandler = async (followerId: string) => {
    try {
      await removeFollower(followerId)
      // Remove the follower from the local state
      setFollowers(followers.filter((user) => user.id !== followerId))
    } catch (error) {
      console.error('Failed to remove follower:', error)
    }
  }

  const deletePostHandler = async (postId: string) => {
    try {
      await deletePost(postId)
      // Remove the deleted post from the local state
      setUserPosts(userPosts.filter((post) => post.post_id !== postId))
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end px-4">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage
              className="object-cover w-full h-full"
              src={imageUrl}
              alt="@username"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h1 className="text-2xl font-bold">
              {firstName} {lastName}
            </h1>
            <p className="text-muted-foreground">@{username}</p>
            <div className="flex mt-2 space-x-4">
              <div className="flex items-center">
                <UserPlus className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  <strong>{following.length}</strong> Following
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  <strong>{followers.length}</strong> Followers
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <Link href={`/profile/${username}/manage`}>
              <Button>Edit profile</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="grid max-w-3xl mx-auto">
            {userPosts.map((post, index) => (
              <div key={post.post_id}>
                <PostCard
                  name={`${firstName} ${lastName}`}
                  username={username}
                  restaurantName={post.loc_name}
                  address={post.loc_address}
                  rating={post.loc_review}
                  body={post.loc_content}
                  avatar={imageUrl}
                  likes={0}
                  postId={post.post_id}
                  isLiked={false}
                  onLikeToggle={() => {}}
                  showDeleteButton={true}
                  onDelete={() => deletePostHandler(post.post_id)}
                />
                {index < userPosts.length && <Separator />}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="following">
          <Card className="border-0 shadow-none max-w-3xl mx-auto">
            {following.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Not following anyone yet
              </div>
            ) : (
              following.map((user, index) => (
                <div key={user.id}>
                  <UserCard
                    name={`${user.firstName} ${user.lastName}`}
                    username={user.username || ''}
                    avatar={user.imageUrl}
                    showFollowingButton={true}
                    isFollowing={true}
                    onFollowToggle={() => toggleFollow(user.id)}
                  />
                  {index < following.length && <Separator />}
                </div>
              ))
            )}
          </Card>
        </TabsContent>
        <TabsContent value="followers">
          <Card className="border-0 shadow-none max-w-3xl mx-auto">
            {followers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No followers yet
              </div>
            ) : (
              followers.map((user, index) => (
                <div key={user.id}>
                  <UserCard
                    name={`${user.firstName} ${user.lastName}`}
                    username={user.username || ''}
                    avatar={user.imageUrl}
                    showFollowingButton={false}
                    showRemoveButton={true}
                    onRemove={() => removeFollowerHandler(user.id)}
                  />
                  {index < followers.length && <Separator />}
                </div>
              ))
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
