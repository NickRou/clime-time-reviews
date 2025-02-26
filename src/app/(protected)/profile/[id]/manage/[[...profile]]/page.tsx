'use client'

import { UserProfile, useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import { useParams, redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function EditProfilePage() {
  const { theme } = useTheme()
  const { user } = useUser()
  const params = useParams()
  const clerkTheme = theme === 'dark' ? dark : undefined

  useEffect(() => {
    if (user && params.id !== user.username) {
      redirect(`/profile/${params.id}`) // redirect to the profile page if the user is not the same
    }
  }, [user, params.id])

  if (!user) return null

  return (
    <div className="flex items-center justify-center container mx-auto max-w-3xl px-4 py-8">
      <UserProfile appearance={{ baseTheme: clerkTheme }} />
    </div>
  )
}
