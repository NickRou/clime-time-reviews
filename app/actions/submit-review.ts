"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function submitReview(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return {
      message: "You must be logged in to submit a review.",
      success: false,
    };
  }

  const user = await currentUser();

  const userIdString = user?.id;
  const username = user?.username;
  const rating = parseInt(formData.get("rating") as string);
  const date = formData.get("date") as string;
  const address = formData.get("address") as string;
  const restaurantName = formData.get("restaurantName") as string;
  const review = formData.get("review") as string;
  const timestamp = new Date().toISOString();

  try {
    await sql`
      INSERT INTO reviews (user_id, rating, date, address, restaurant_name, review, timestamp, user_name)
      VALUES (${userIdString}, ${rating}, ${date}, ${address}, ${restaurantName}, ${review}, ${timestamp}, ${username})
    `;
    revalidatePath("/writeareview");
    return { message: "Review submitted successfully!", success: true };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return {
      message: "Failed to submit review. Please try again.",
      success: false,
    };
  }
}
