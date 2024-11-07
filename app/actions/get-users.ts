"use server";

interface ClerkUser {
  id: string;
  username: string;
}

export async function getClerkUsers(): Promise<ClerkUser[]> {
  const response = await fetch("https://api.clerk.com/v1/users", {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data.map((user: ClerkUser) => ({
    id: user.id,
    username: user.username,
  }));
}
