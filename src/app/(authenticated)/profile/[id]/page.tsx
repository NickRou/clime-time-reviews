import ProfileContent from '@/components/ProfileContent'
import { ProfileSkeleton } from '@/components/ProfileSkeleton'
import {
  getAllUsers,
  getPostsByUserId,
  getFollowing,
  getFollowers,
} from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// Move all data fetching to a new component
async function ProfileData({ id }: { id: string }) {
  const allUsers = await getAllUsers()
  const user = allUsers?.find((user) => user.username === id)

  if (
    !user ||
    !user.username ||
    !user.firstName ||
    !user.lastName ||
    !user.imageUrl ||
    !allUsers
  ) {
    return notFound()
  }

  // Fetch all data in parallel
  const [posts, following, followers] = await Promise.all([
    getPostsByUserId(user.id),
    getFollowing(user.id),
    getFollowers(user.id),
  ])

  return (
    <ProfileContent
      userId={user.id}
      username={user.username}
      firstName={user.firstName}
      lastName={user.lastName}
      imageUrl={user.imageUrl}
      initialPosts={posts}
      initialFollowing={following}
      initialFollowers={followers}
    />
  )
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData id={id} />
    </Suspense>
  )
}
