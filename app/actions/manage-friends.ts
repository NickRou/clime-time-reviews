"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { getClerkUsers } from "@/app/actions/get-users";

interface ClerkUser {
  id: string;
  username: string;
}

export async function getFriends() {
  const { userId } = await auth();
  if (!userId) {
    console.error("No user found.");
  }

  const allClerkUsers = await getClerkUsers();

  const following = await sql`
    SELECT following_id as id
    FROM friends
    WHERE follower_id = ${userId}
  `;
  const followers = await sql`
    SELECT follower_id as id
    FROM friends
    WHERE following_id = ${userId}
  `;
  return {
    following: following.rows
      .map((row) => allClerkUsers.find((user) => user.id === row.id))
      .filter((user): user is ClerkUser => user !== undefined),
    followers: followers.rows
      .map((row) => allClerkUsers.find((user) => user.id === row.id))
      .filter((user): user is ClerkUser => user !== undefined),
  };
}

export async function deleteFriend(
  friendId: string,
  type: "following" | "followers",
) {
  const { userId } = await auth();
  if (!userId) {
    console.error("No user found.");
  }

  if (type === "following") {
    await sql`DELETE FROM friends WHERE follower_id = ${userId} AND following_id = ${friendId}`;
  } else {
    await sql`DELETE FROM friends WHERE follower_id = ${friendId} AND following_id = ${userId}`;
  }
}

export async function searchFriends(query: string) {
  const { userId } = await auth();
  if (!userId) {
    console.error("No user found.");
  }

  const allClerkUsers = await getClerkUsers();

  // Get the list of users the current user is already following
  const following = await sql`
    SELECT following_id
    FROM friends
    WHERE follower_id = ${userId}
  `;
  const followingIds = following.rows.map((row) => row.following_id);

  // Filter the ALL_USER_IDS list to exclude the current user and those already being followed
  const potentialFriends = allClerkUsers.filter(
    (clerkUser) =>
      clerkUser.id !== userId && !followingIds.includes(clerkUser.id),
  );

  // Filter potential friends based on the search query
  const searchResults = potentialFriends.filter((clerkUser) =>
    clerkUser.username.toLowerCase().includes(query.toLowerCase()),
  );

  // Limit the results to 10
  return searchResults.slice(0, 10);
}

export async function addFriend(friendId: string) {
  const { userId } = await auth();
  if (!userId) {
    console.error("No user found.");
  }

  await sql`INSERT INTO friends (follower_id, following_id) VALUES (${userId}, ${friendId})`;
}
