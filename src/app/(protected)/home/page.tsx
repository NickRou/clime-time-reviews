import { redirect } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { Fragment } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreatePost from '@/components/CreatePost'
import { auth } from '@clerk/nextjs/server'
import { getFollowingPosts } from '@/actions/posts'
import UserPost from '@/components/UserPost'

export default async function HomePage() {
  // auth current user
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }

  // gets posts form all users the current user follows
  const posts = await getFollowingPosts()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="for-you">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <div className="grid max-w-3xl mx-auto">
            <CreatePost />
            {posts.map((post, index) => {
              return (
                <Fragment key={post.post_id}>
                  <UserPost post={post} currentUserId={userId} />
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
