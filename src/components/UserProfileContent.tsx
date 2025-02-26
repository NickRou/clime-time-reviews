'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Users } from 'lucide-react'
import UserCard from '@/components/UserCard'
import { unfollowUser, followUser } from '@/actions/follows'
import { Post, User } from '@/lib/types'
import UserPost from './UserPost'

interface UserProfileContentProps {
  currentUser: User
  profileUser: User
  profilePosts: Post[]
  profileFollowing: User[]
  profileFollowers: User[]
  currUserFollowing: User[]
  currUserFollowers: User[]
}

export default function UserProfileContent({
  currentUser,
  profileUser,
  profilePosts,
  profileFollowing,
  profileFollowers,
  currUserFollowing,
  currUserFollowers,
}: UserProfileContentProps) {
  const { username, first_name, last_name, image_url } = profileUser
  const [posts] = useState<Post[]>(profilePosts)
  const [following] = useState<User[]>(profileFollowing)
  const [followers, setFollowers] = useState<User[]>(profileFollowers)
  const [currFollowing, setCurrFollowing] = useState<User[]>(currUserFollowing)
  const [currFollowers] = useState<User[]>(currUserFollowers)

  // check if the current user is following the profile user
  const [currUserIsFollowing, setCurrUserIsFollowing] = useState(
    currFollowing.some((user) => user.user_id === profileUser.user_id)
  )

  const onProfileFollow = async () => {
    if (currUserIsFollowing) {
      await unfollowUser(profileUser.user_id)
      setCurrUserIsFollowing(false)
      setFollowers(
        followers.filter((user) => user.user_id !== currentUser.user_id)
      )
    } else {
      await followUser(profileUser.user_id)
      setCurrUserIsFollowing(true)
      setFollowers([...followers, currentUser])
    }
  }

  const onFollowToggle = async (userId: string) => {
    if (currUserIsFollowing) {
      await unfollowUser(userId)
      setCurrUserIsFollowing(false)
      setCurrFollowing(currFollowing.filter((user) => user.user_id !== userId))
    } else {
      await followUser(userId)
      setCurrUserIsFollowing(true)
      setCurrFollowing([...currFollowing, profileUser])
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
            <Button
              onClick={() => onProfileFollow()}
              variant={currUserIsFollowing ? 'secondary' : 'default'}
            >
              {currUserIsFollowing ? 'Unfollow' : 'Follow'}
            </Button>
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
                <UserPost post={post} currentUserId={currentUser.user_id} />
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
              following.map((user, index) => {
                const isFollowing = currFollowing.some(
                  (followingUser) => followingUser.user_id === user.user_id
                )
                const userIsCurrentUser = currentUser.user_id === user.user_id
                return (
                  <div key={user.user_id}>
                    <UserCard
                      user={user}
                      isFollowing={isFollowing}
                      showFollowButton={!userIsCurrentUser}
                      onFollow={() => onFollowToggle(user.user_id)}
                    />
                    {index < following.length && <Separator />}
                  </div>
                )
              })
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
                const isFollowing = currFollowers.some(
                  (followingUser) => followingUser.user_id === user.user_id
                )
                const userIsCurrentUser = currentUser.user_id === user.user_id
                return (
                  <div key={user.user_id}>
                    <UserCard
                      user={user}
                      isFollowing={isFollowing}
                      showFollowButton={!userIsCurrentUser}
                      onFollow={() => onFollowToggle(user.user_id)}
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
