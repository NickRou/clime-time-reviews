'use client'

import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { BaseThemeTaggedType } from '@clerk/types'

export function useClerkTheme(): BaseThemeTaggedType | undefined {
  const { theme } = useTheme()
  const clerkTheme = theme === 'dark' ? dark : undefined
  return clerkTheme
}
