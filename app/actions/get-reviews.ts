"use server";

import { sql, QueryResultRow } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";

export async function getReviews(): Promise<{
  reviews: QueryResultRow[];
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId) return { reviews: [], error: null };

  try {
    const { rows } = await sql<QueryResultRow>`
      SELECT * FROM reviews
      WHERE user_id = ${userId}
      ORDER BY date DESC
    `;
    return { reviews: rows, error: null };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { reviews: [], error: "Failed to load reviews. Please try again." };
  }
}
