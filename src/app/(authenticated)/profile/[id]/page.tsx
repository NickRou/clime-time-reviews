import PersonalProfileContent from '@/components/PersonalProfileContent'
import { ProfileSkeleton } from '@/components/ProfileSkeleton'
import {
  getPostsByUserId,
  getFollowing,
  getFollowers,
  getUserByUsername,
  getCurrentUser,
} from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import UserProfileContent from '@/components/UserProfileContent'

async function ProfileData({ id }: { id: string }) {
  const currUser = await getCurrentUser()

  // get the user data from the username in the url
  const user = await getUserByUsername(id)
  if (!user) {
    // if this user doesn't exist, return the user not found page
    notFound()
  }

  // get the users posts, following, and followers
  const postsData = getPostsByUserId(user.user_id)
  const followingData = getFollowing(user.user_id)
  const followersData = getFollowers(user.user_id)

  const [posts, following, followers] = await Promise.all([
    postsData,
    followingData,
    followersData,
  ])

  // if this is the current user's profile, display the personal profile content
  if (currUser.user_id === user.user_id) {
    return (
      <PersonalProfileContent
        profileUser={user}
        profilePosts={posts}
        profileFollowing={following}
        profileFollowers={followers}
      />
    )
  } else {
    // if this is not the current user's profile, we need to fetch more information for social features
    // and then show the user's profile page
    const currUserFollowingData = getFollowing(currUser.user_id)
    const currUserFollowersData = getFollowers(currUser.user_id)
    const [currUserFollowing, currUserFollowers] = await Promise.all([
      currUserFollowingData,
      currUserFollowersData,
    ])

    return (
      <UserProfileContent
        currentUser={currUser}
        profileUser={user}
        profilePosts={posts}
        profileFollowing={following}
        profileFollowers={followers}
        currUserFollowing={currUserFollowing}
        currUserFollowers={currUserFollowers}
      />
    )
  }
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
