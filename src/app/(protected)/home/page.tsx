import { UserPostFeed } from './_components/UserPostFeed'
import { Suspense } from 'react'
import { LoadingRing } from './_components/LoadingRing'
import Post from './_components/Post'
import { getCurrentUserAsUserType } from '@/actions/clerk'

export default async function HomePage() {
  const user = await getCurrentUserAsUserType()

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="grid">
        <div className="p-4">
          <Post currentUser={user} />
        </div>
        <Suspense fallback={<LoadingRing />}>
          <UserPostFeed currentUserId={user.user_id} />
        </Suspense>
      </div>
    </div>
  )
}
