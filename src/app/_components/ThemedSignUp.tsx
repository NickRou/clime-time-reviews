'use client'

import { useClerkTheme } from '@/hooks/use-clerk-theme'
import { SignUp } from '@clerk/nextjs'

export default function ThemedSignUp() {
  const clerkTheme = useClerkTheme()

  return <SignUp appearance={{ baseTheme: clerkTheme }} />
}
