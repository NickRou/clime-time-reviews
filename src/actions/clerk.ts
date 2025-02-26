'use server'

import { User } from '@/lib/types'
import { auth, currentUser } from '@clerk/nextjs/server'

export async function getCurrentUserIdOrThrow(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Current user is not authenticated')
  return userId
}

export async function getCurrentUserAsUserType(): Promise<User> {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error('Current user not found')
  }
  if (!clerkUser.username || !clerkUser.firstName || !clerkUser.lastName) {
    throw new Error('Current user data is missing')
  }

  return {
    user_id: clerkUser.id,
    username: clerkUser.username,
    first_name: clerkUser.firstName,
    last_name: clerkUser.lastName,
    image_url: clerkUser.imageUrl,
  }
}
