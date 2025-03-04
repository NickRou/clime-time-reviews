import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import GoogleMap from '@/app/(protected)/map/_components/GoogleMap'
import { getFollowingPosts } from '@/actions/posts'

export default async function MapPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }
  const posts = await getFollowingPosts()

  return (
    <div className="w-[calc(100%)-2rem] h-[calc(100%)] md:pt-2 md:pr-2 md:pb-2 md:rounded-lg">
      <GoogleMap posts={posts} userId={userId} />
    </div>
  )
}
