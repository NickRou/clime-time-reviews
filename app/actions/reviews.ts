"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserReview } from "@/lib/types";

export async function getReviews(): Promise<{
  reviews: UserReview[];
  error: string | null;
}> {
  const { userId } = await auth();
  if (!userId) return { reviews: [], error: null };

  try {
    const { rows } = await sql<UserReview>`
      SELECT * FROM reviews
      WHERE user_id IN (
        SELECT following_id FROM friends WHERE follower_id = ${userId}
      )
      ORDER BY date DESC
      `;
    return { reviews: rows, error: null };
  } catch (error) {
    console.error("Failed to fetch reviews: ", error);
    return { reviews: [], error: "Failed to load reviews. Please try again." };
  }
}

/**
 * Submits a review to the database using form data.
 *
 * @async
 * @param {FormData} formData - The form data containing the review details
 *
 * @throws {Error} Throws an error if:
 * - User is not authenticated
 * - Required form fields are missing/invalid
 * - Database operation fails
 *
 * @returns {Promise<{ message: string; success: boolean }>} Returns message and success status
 */
export async function submitReview(
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  // check if user is authenticated
  const user = await currentUser();

  if (!user) {
    return {
      message: "User must be logged in to submit a review.",
      success: false,
    };
  }

  // pull review data from the form
  const userIdString = user.id;
  const username = user.username;
  const rating = parseInt(formData.get("rating") as string);
  const date = formData.get("date") as string;
  const address = formData.get("address") as string;
  const restaurantName = formData.get("restaurantName") as string;
  const review = formData.get("review") as string;
  const timestamp = new Date().toISOString();

  try {
    // insert review into "reviews" table
    await sql`
      INSERT INTO reviews (user_id, rating, date, address, restaurant_name, review, timestamp, user_name)
      VALUES (${userIdString}, ${rating}, ${date}, ${address}, ${restaurantName}, ${review}, ${timestamp}, ${username})
    `;
    revalidatePath("/writeareview");
    return { message: "Review submitted successfully!", success: true };
  } catch (error) {
    // catch errors during database operation
    console.error("Failed to submit review: ", error);
    return {
      message: "Failed to submit review. Please try again.",
      success: false,
    };
  }
}