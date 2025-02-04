'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Users } from 'lucide-react'
import PostCard from '@/components/PostCard'
import UserCard from '@/components/UserCard'

export default function ProfilePage() {
  const [followingUsers, setFollowingUsers] = useState([1, 3, 5])

  const toggleFollow = (userId: number) => {
    setFollowingUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 ">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end px-4">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage
              src="/placeholder.svg?height=128&width=128"
              alt="@username"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">@johndoe</p>
            <div className="flex mt-2 space-x-4">
              <div className="flex items-center">
                <UserPlus className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  <strong>250</strong> Following
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  <strong>1.2K</strong> Followers
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <Button>Edit profile</Button>
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
            <PostCard
              name="John Doe"
              username="johndoe"
              restaurantName="Downtown Café"
              address="123 Main St, Anytown, USA"
              rating={4.5}
              body="Just had an amazing experience at the new café downtown! The atmosphere was cozy, and the coffee was top-notch. Highly recommend their caramel latte. #CoffeeLovers"
              avatar="/placeholder.svg?height=40&width=40&text=JD"
              likes={15}
            />
            <Separator />
            <PostCard
              name="John Doe"
              username="johndoe"
              restaurantName="Bella Italia"
              address="456 Elm St, Another City, USA"
              rating={3.5}
              body="Tried the new Italian restaurant on 5th Avenue. The pasta was good, but the service was a bit slow. Might give it another chance in a few weeks. #FoodieAdventures"
              avatar="/placeholder.svg?height=40&width=40&text=JD"
              likes={8}
            />
            <Separator />
            <PostCard
              name="John Doe"
              username="johndoe"
              restaurantName="Bookworm Café"
              address="789 Oak Rd, Somewhere, USA"
              rating={5}
              body="Just finished reading 'The Midnight Library' by Matt Haig at this cozy book café. What an incredible journey through possibilities and the value of life. The ambiance here perfectly complemented the read. Absolutely loved it! #BookRecommendations #CaféHopping"
              avatar="/placeholder.svg?height=40&width=40&text=JD"
              likes={23}
            />
          </div>
        </TabsContent>
        <TabsContent value="following">
          <Card className="border-0 shadow-none max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((user, index) => (
              <div key={user}>
                <UserCard
                  name={`User ${user}`}
                  username={`user${user}`}
                  avatar={`/placeholder.svg?height=40&width=40&text=U${user}`}
                  isFollowing={followingUsers.includes(user)}
                  onFollowToggle={() => toggleFollow(user)}
                />
                {index < 5 && <Separator />}
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="followers">
          <Card className="border-0 shadow-none max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((user, index) => (
              <div key={user}>
                <UserCard
                  name={`Fan ${user}`}
                  username={`fan${user}`}
                  avatar={`/placeholder.svg?height=40&width=40&text=F${user}`}
                  isFollowing={followingUsers.includes(user)}
                  onFollowToggle={() => toggleFollow(user)}
                />
                {index < 5 && <Separator />}
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
