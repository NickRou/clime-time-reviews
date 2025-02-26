import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreatePost from '@/components/CreatePost'
import { auth } from '@clerk/nextjs/server'
import { UserPostFeed } from './_components/UserPostFeed'
import { Suspense } from 'react'
import { SkeletonUserPostFeed } from './_components/SkeletonUserPostFeed'

export default async function HomePage() {
  // auth current user
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-3xl mx-auto">
          <TabsTrigger value="for-you">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <div className="grid max-w-3xl mx-auto">
            <CreatePost />
            <Suspense fallback={<SkeletonUserPostFeed />}>
              <UserPostFeed currentUserId={userId} />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
