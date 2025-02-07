'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Users } from 'lucide-react'
import UserCard from '@/components/UserCard'
import Link from 'next/link'
import {
  unfollowUser,
  followUser,
  removeFollower,
  deletePost,
} from '@/lib/actions'
import { PostWithUser, User } from '@/lib/types'
import UserPost from './UserPost'

interface PersonalProfileContentProps {
  profileUser: User
  profilePosts: PostWithUser[]
  profileFollowing: User[]
  profileFollowers: User[]
}

export default function PersonalProfileContent({
  profileUser,
  profilePosts,
  profileFollowing,
  profileFollowers,
}: PersonalProfileContentProps) {
  const { user_id, username, first_name, last_name, image_url } = profileUser
  const [posts, setPosts] = useState<PostWithUser[]>(profilePosts)
  const [following, setFollowing] = useState<User[]>(profileFollowing)
  const [followers, setFollowers] = useState<User[]>(profileFollowers)

  const onDelete = async (postId: string) => {
    await deletePost(postId)
    setPosts(posts.filter((post) => post.post_id !== postId))
  }

  const onUnfollow = async (user: User) => {
    await unfollowUser(user.user_id)
    setFollowing(
      following.filter(
        (followingUser) => followingUser.user_id !== user.user_id
      )
    )
  }

  const onFollow = async (user: User) => {
    await followUser(user.user_id)
    setFollowing([...following, user])
  }

  const onRemove = async (userId: string) => {
    await removeFollower(userId)
    setFollowers(followers.filter((user) => user.user_id !== userId))
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end px-4">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage
              className="object-cover w-full h-full"
              src={image_url}
              alt="@username"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h1 className="text-2xl font-bold">
              {first_name} {last_name}
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
            {posts.map((post, index) => (
              <div key={post.post_id}>
                <UserPost
                  post={post}
                  currentUserId={user_id}
                  onDelete={onDelete}
                />
                {index < profilePosts.length && <Separator />}
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
                <div key={user.user_id}>
                  <UserCard
                    user={user}
                    isFollowing={true}
                    showFollowButton={true}
                    onFollow={() => onUnfollow(user)}
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
              followers.map((user, index) => {
                const isFollowing = following.some(
                  (followingUser) => followingUser.user_id === user.user_id
                )
                return (
                  <div key={user.user_id}>
                    <UserCard
                      user={user}
                      isFollowing={isFollowing}
                      showFollowButton={true}
                      onFollow={() =>
                        isFollowing ? onUnfollow(user) : onFollow(user)
                      }
                      showRemoveButton={true}
                      onRemove={() => onRemove(user.user_id)}
                    />
                    {index < followers.length && <Separator />}
                  </div>
                )
              })
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
