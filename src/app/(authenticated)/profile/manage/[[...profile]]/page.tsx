'use client'

import { UserProfile } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'

export default function EditProfilePage() {
  const { theme } = useTheme()
  const clerkTheme = theme === 'dark' ? dark : undefined

  return (
    <div className="flex items-center justify-center">
      <UserProfile appearance={{ baseTheme: clerkTheme }} />
    </div>
  )
}
