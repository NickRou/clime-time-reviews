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
import {
  unfollowUser,
  followUser,
  removeFollower,
  deletePost,
  likePost,
  unlikePost,
} from '@/lib/actions'
import { Post, User, Like } from '@/lib/types'

interface ProfileContentProps {
  currentUser: User
  userId: string
  username: string
  firstName: string
  lastName: string
  imageUrl: string
  initialPosts: Post[]
  initialFollowing: User[]
  initialFollowers: User[]
  initialLikes: Like[]
  isFollowing?: boolean
}

export default function ProfileContent({
  currentUser,
  userId,
  username,
  firstName,
  lastName,
  imageUrl,
  initialPosts,
  initialFollowing,
  initialFollowers,
  initialLikes,
  isFollowing,
}: ProfileContentProps) {
  const [userPosts, setUserPosts] = useState<Post[]>(initialPosts)
  const [following, setFollowing] = useState<User[]>(initialFollowing)
  const [followers, setFollowers] = useState<User[]>(initialFollowers)
  const [isFollowingUser, setIsFollowingUser] = useState(isFollowing)
  const [likes, setLikes] = useState<Like[]>(initialLikes)
  const profileIsCurrentUser = currentUser.id === userId

  const toggleFollow = async (followeeId: string) => {
    try {
      if (isFollowingUser) {
        await unfollowUser(followeeId)
        setIsFollowingUser(false)
        setFollowers(followers.filter((user) => user.id !== currentUser.id))
      } else {
        await followUser(followeeId)
        setIsFollowingUser(true)
        setFollowers([...followers, currentUser])
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  const toggleFollowingUser = async (followeeId: string) => {
    try {
      const isCurrentlyFollowing = following.some(
        (user) => user.id === followeeId
      )

      if (isCurrentlyFollowing) {
        await unfollowUser(followeeId)
        setFollowing(following.filter((user) => user.id !== followeeId))
      } else {
        const userToFollow = followers.find((user) => user.id === followeeId)
        if (userToFollow) {
          await followUser(followeeId)
          setFollowing([...following, userToFollow])
        }
      }
    } catch (error) {
      console.error('Failed to toggle following:', error)
    }
  }

  const removeFollowerHandler = async (followerId: string) => {
    try {
      await removeFollower(followerId)
      setFollowers(followers.filter((user) => user.id !== followerId))
    } catch (error) {
      console.error('Failed to remove follower:', error)
    }
  }

  const deletePostHandler = async (postId: string) => {
    try {
      await deletePost(postId)
      setUserPosts(userPosts.filter((post) => post.post_id !== postId))
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleLikeToggle = async (postId: string) => {
    if (!currentUser.id) {
      console.error('User not found')
      return null
    }

    const isLiked = likes.some(
      (like) => like.post_id === postId && like.user_id === currentUser.id
    )

    try {
      if (isLiked) {
        await unlikePost(postId)
        setLikes(
          likes.filter(
            (like) =>
              !(like.post_id === postId && like.user_id === currentUser.id)
          )
        )
      } else {
        await likePost(postId)
        setLikes([...likes, { post_id: postId, user_id: currentUser.id }])
      }
    } catch (error) {
      console.error('Error toggling like:', error)
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
            {profileIsCurrentUser ? (
              <Link href={`/profile/${username}/manage`}>
                <Button>Edit profile</Button>
              </Link>
            ) : (
              <Button
                onClick={() => toggleFollow(userId)}
                variant={isFollowingUser ? 'secondary' : 'default'}
              >
                {isFollowingUser ? 'Unfollow' : 'Follow'}
              </Button>
            )}
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
                  postId={post.post_id}
                  restaurantName={post.loc_name}
                  address={post.loc_address}
                  rating={post.loc_review}
                  body={post.loc_content}
                  avatar={imageUrl}
                  likes={
                    likes.filter((like) => like.post_id === post.post_id).length
                  }
                  isLiked={likes.some(
                    (like) =>
                      like.post_id === post.post_id &&
                      like.user_id === currentUser.id
                  )}
                  onLikeToggle={() => handleLikeToggle(post.post_id)}
                  showDeleteButton={profileIsCurrentUser}
                  onDelete={() =>
                    profileIsCurrentUser && deletePostHandler(post.post_id)
                  }
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
                    name={`${user.firstName || ''} ${user.lastName || ''}`}
                    username={user.username || ''}
                    avatar={user.imageUrl}
                    showFollowingButton={profileIsCurrentUser}
                    isFollowing={true}
                    onFollowToggle={() => toggleFollowingUser(user.id)}
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
                    name={`${user.firstName || ''} ${user.lastName || ''}`}
                    username={user.username || ''}
                    avatar={user.imageUrl}
                    showFollowingButton={false}
                    showRemoveButton={profileIsCurrentUser}
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
