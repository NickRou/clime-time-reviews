import { redirect } from 'next/navigation'
import CreatePost from '@/app/(protected)/home/_components/CreatePost'
import { auth } from '@clerk/nextjs/server'
import { UserPostFeed } from './_components/UserPostFeed'
import { Suspense } from 'react'
import { LoadingRing } from './_components/LoadingRing'

export default async function HomePage() {
  // auth current user
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="grid">
        <div className="p-4">
          <CreatePost />
        </div>
        <Suspense fallback={<LoadingRing />}>
          <UserPostFeed currentUserId={userId} />
        </Suspense>
      </div>
    </div>
  )
}
