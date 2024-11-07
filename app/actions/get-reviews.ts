"use server";

import { sql, QueryResultRow } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { getFriends } from "@/app/actions/manage-friends";

export async function getReviews(): Promise<{
  reviews: QueryResultRow[];
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId) return { reviews: [], error: null };

  const friends = await getFriends();
  const followingIds = friends.following.map((user) => user.id);

  if (followingIds.length === 0) {
    return { reviews: [], error: null };
  }

  try {
    const followingIdsArray = `{${followingIds.join(",")}}`;
    const { rows } = await sql<QueryResultRow>`
      SELECT * FROM reviews
      WHERE user_id = ANY(${followingIdsArray}::text[])      
      ORDER BY date DESC
    `;
    return { reviews: rows, error: null };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { reviews: [], error: "Failed to load reviews. Please try again." };
  }
}
