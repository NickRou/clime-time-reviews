import ProfileContent from '@/components/ProfileContent'
import { ProfileSkeleton } from '@/components/ProfileSkeleton'
import getUserByUsername from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const user = await getUserByUsername(id)

  if (
    !user ||
    !user.username ||
    !user.firstName ||
    !user.lastName ||
    !user.imageUrl
  ) {
    return notFound()
  }

  const { username, firstName, lastName, imageUrl } = user

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent
        username={username}
        firstName={firstName}
        lastName={lastName}
        imageUrl={imageUrl}
      />
    </Suspense>
  )
}
