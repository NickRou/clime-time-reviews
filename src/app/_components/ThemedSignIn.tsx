'use client'

import { useClerkTheme } from '@/hooks/use-clerk-theme'
import { SignIn } from '@clerk/nextjs'

export default function ThemedSignIn() {
  const clerkTheme = useClerkTheme()

  return <SignIn appearance={{ baseTheme: clerkTheme }} />
}
