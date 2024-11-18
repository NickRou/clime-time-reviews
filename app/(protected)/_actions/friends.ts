"use server";

import { ClerkUser } from "@/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

/**
 * Fetches friends based on a follow relationship.
 *
 * @param {"following" | "followers"} type - The type of relationship to retrieve:
 *  - `"following"` to get the users the user is following,
 *  - `"followers"` to get the users who are following the user.
 * @returns {Promise<ClerkUser[]>} - A Promise resolving to an array of friends based on the specified relationship type.
 */
export async function getFriendFollowRelationships(
  type: "following" | "followers"
): Promise<ClerkUser[]> {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const query =
      type === "following"
        ? sql<ClerkUser>`
        SELECT following_username AS username, following_id AS id 
        FROM friends 
        WHERE follower_id = ${userId}`
        : sql<ClerkUser>`
        SELECT follower_username AS username, follower_id AS id 
        FROM friends 
        WHERE following_id = ${userId}`;

    const { rows } = await query;
    return rows;
  } catch (error) {
    console.error("Failed to fetch follow relationships:", error);
    throw new Error("Unable to retrieve follow relationships");
  }
}

export async function deleteFriend(friendId: string, isFollowing: boolean) {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  if (isFollowing) {
    await sql`DELETE FROM friends WHERE follower_id = ${userId} AND following_id = ${friendId}`;
  } else {
    await sql`DELETE FROM friends WHERE follower_id = ${friendId} AND following_id = ${userId}`;
  }
}

export async function addFriend(friend: ClerkUser) {
  const user = await currentUser();
  if (!user) {
    return;
  }

  await sql`INSERT INTO friends (follower_id, following_id, follower_username, following_username) VALUES (${user.id}, ${friend.id}, ${user.username}, ${friend.username})`;
}
