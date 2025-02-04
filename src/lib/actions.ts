import { auth, clerkClient } from '@clerk/nextjs/server'

export default async function getUserByUsername(username: string) {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const client = await clerkClient()
  const users = await client.users.getUserList({
    username: [username],
  })

  return users.data[0] || null
}
