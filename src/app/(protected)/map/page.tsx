import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import GoogleMap from '@/components/GoogleMap'
import { getFollowingPosts } from '@/actions/posts'

export default async function MapPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }
  const posts = await getFollowingPosts()

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <GoogleMap posts={posts} />
    </div>
  )
}
