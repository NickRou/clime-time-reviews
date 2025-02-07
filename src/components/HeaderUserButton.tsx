import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { Skeleton } from './ui/skeleton'

export default function HeaderUserButton() {
  const { theme } = useTheme()
  const clerkTheme = theme === 'dark' ? dark : undefined

  const { user } = useUser()
  if (!user || !user.username) {
    return <Skeleton className="h-8 w-8 rounded-full" />
  }

  const { username } = user
  return (
    <UserButton
      appearance={{ baseTheme: clerkTheme }}
      userProfileMode="navigation"
      userProfileUrl={`/profile/${username}/manage`}
    />
  )
}
