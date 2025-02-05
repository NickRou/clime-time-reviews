import ProfileContent from '@/components/ProfileContent'
import { ProfileSkeleton } from '@/components/ProfileSkeleton'
import { getAllUsers, getUserByUsername } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { username, firstName, lastName, imageUrl } = user

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent
        userId={user.id}
        username={username}
        firstName={firstName}
        lastName={lastName}
        imageUrl={imageUrl}
      />
    </Suspense>
  )
}
