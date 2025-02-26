'use server'

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function CurrentUserProfilePage() {
  // This process doesn't seem quite right but works for now
  // I want static links in the sidebar so it doesn't have to re-render
  // Catches the /profile/manage link and redirects to the profile/[id]/manage page
  const user = await currentUser()
  if (!user) {
    return null
  }

  redirect(`/profile/${user.username}/manage`)
}
