import ProfileContent from '@/components/ProfileContent'
import { ProfileSkeleton } from '@/components/ProfileSkeleton'
import {
  getAllUsers,
  getPostsByUserId,
  getFollowing,
  getFollowers,
  getCurrentUser,
  getPostLikes,
} from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Post, User } from '@/lib/types'

// Move all data fetching to a new component
async function ProfileData({ id }: { id: string }) {
  const currentUser = await getCurrentUser()
  const allUsers = await getAllUsers()
  const user = allUsers?.find((user) => user.username === id)

  if (
    !currentUser ||
    !user ||
    !user.username ||
    !user.firstName ||
    !user.lastName ||
    !user.imageUrl ||
    !allUsers
  ) {
    return notFound()
  }

  // Extract only the necessary properties from currentUser
  const serializedCurrentUser: User = {
    id: currentUser.id,
    username: currentUser.username as string,
    firstName: currentUser.firstName as string,
    lastName: currentUser.lastName as string,
    imageUrl: currentUser.imageUrl as string,
  }

  let posts: Post[] | null = null
  const [fetchedPosts, following, followers, postLikes, currentUserFollowing] =
    await Promise.all([
      getPostsByUserId(user.id),
      getFollowing(user.id),
      getFollowers(user.id),
      Promise.all(
        (await getPostsByUserId(user.id))?.map((post) =>
          getPostLikes(post.post_id)
        ) ?? []
      ),
      getFollowing(currentUser.id),
    ])
  posts = fetchedPosts

  // Check if current user is following the profile user
  const isFollowing =
    currentUserFollowing?.some((f) => f.id === user.id) ?? false

  return (
    <ProfileContent
      currentUser={serializedCurrentUser}
      userId={user.id}
      username={user.username}
      firstName={user.firstName}
      lastName={user.lastName}
      imageUrl={user.imageUrl}
      initialPosts={posts}
      initialFollowing={following}
      initialFollowers={followers}
      initialLikes={postLikes.flat()}
      isFollowing={isFollowing}
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
