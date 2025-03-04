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
    <div className="w-[calc(100%)-2rem] h-[calc(100%)] md:p-0.5">
      <GoogleMap posts={posts} userId={userId} />
    </div>
  )
}
