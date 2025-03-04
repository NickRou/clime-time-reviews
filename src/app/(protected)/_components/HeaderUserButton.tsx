import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { Skeleton } from '../../../components/ui/skeleton'

export default function HeaderUserButton() {
  const { theme } = useTheme()
  const clerkTheme = theme === 'dark' ? dark : undefined

  const { isLoaded, user } = useUser()
  if (!user || !isLoaded) {
    return <Skeleton className="h-8 w-8 rounded-full" />
  }

  return (
    <UserButton
      appearance={{ baseTheme: clerkTheme }}
      userProfileProps={{ appearance: { baseTheme: clerkTheme } }}
      userProfileMode="modal"
    />
  )
}
