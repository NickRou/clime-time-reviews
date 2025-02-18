import { getFollowingPosts } from '@/lib/actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import MapBoxMap from '@/components/MapBoxMap'

export default async function MapPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }
  const posts = await getFollowingPosts()

  return (
    <div className="w-full h-screen">
      <MapBoxMap posts={posts} />
    </div>
  )
}
