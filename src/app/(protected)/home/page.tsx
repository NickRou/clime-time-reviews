import { UserPostFeed } from './_components/UserPostFeed'
import { Suspense } from 'react'
import { LoadingRing } from './_components/LoadingRing'
import Post from './_components/Post'
import { getCurrentUserAsUserType } from '@/actions/clerk'
import { getAllTags } from '@/actions/tags'

export default async function HomePage() {
  const user = await getCurrentUserAsUserType()
  const tags = await getAllTags()

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="grid">
        <div className="p-4">
          <Post currentUser={user} allTags={tags} />
        </div>
        <Suspense fallback={<LoadingRing />}>
          <UserPostFeed currentUserId={user.user_id} />
        </Suspense>
      </div>
    </div>
  )
}
