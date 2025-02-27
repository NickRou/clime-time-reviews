import { getNonFollowedUsers } from '@/actions/users'
import UserExplorer from '@/app/(protected)/explore/_components/UserExplorer'

export default async function ExplorePage() {
  const usersNotFollowing = await getNonFollowedUsers()

  return <UserExplorer users={usersNotFollowing} />
}
