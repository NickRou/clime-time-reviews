import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import GoogleMap from '@/app/(protected)/map/_components/GoogleMap'
import { getFollowingPosts, getPostsByUserId } from '@/actions/posts'

export default async function MapPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }
  const posts = await getFollowingPosts()
  const userPosts = await getPostsByUserId(userId)

  return (
    <div className="w-[calc(100%)-2rem] h-[calc(100%)] md:p-0.5">
      <GoogleMap posts={posts} userPosts={userPosts} userId={userId} />
    </div>
  )
}
