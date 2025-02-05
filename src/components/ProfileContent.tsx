'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Users } from 'lucide-react'
import PostCard from '@/components/PostCard'
import UserCard from '@/components/UserCard'
import Link from 'next/link'
import { getPostsByUserId, getFollowing, getFollowers } from '@/lib/actions'
import { Post, User } from '@/lib/types'

interface ProfileContentProps {
  userId: string
  username: string
  firstName: string
  lastName: string
  imageUrl: string
}

export default function ProfileContent({
  userId,
  username,
  firstName,
  lastName,
  imageUrl,
}: ProfileContentProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])

  useEffect(() => {
    Promise.all([
      getPostsByUserId(userId),
      getFollowing(userId),
      getFollowers(userId),
    ])
      .then(([posts, followingUsers, followerUsers]) => {
        setUserPosts(posts)
        setFollowing(followingUsers)
        setFollowers(followerUsers)
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }, [userId])

  const toggleFollow = (userId: number) => {
    // Implementation of toggleFollow function
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
          <div className="grid gap-6 max-w-3xl mx-auto">
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
                />
                {index < userPosts.length - 1 && <Separator />}
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
                    isFollowing={true}
                    onFollowToggle={() => toggleFollow(1)}
                  />
                  {index < following.length - 1 && <Separator />}
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
                    isFollowing={following.some((f) => f.id === user.id)}
                    onFollowToggle={() =>
                      following.some((f) => f.id === user.id)
                        ? toggleFollow(1)
                        : toggleFollow(1)
                    }
                  />
                  {index < followers.length - 1 && <Separator />}
                </div>
              ))
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
