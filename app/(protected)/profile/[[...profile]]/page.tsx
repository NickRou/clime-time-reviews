"use client";

import { UserProfile, useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container max-w-4xl mx-auto md:px-0 sm:px-0 lg:px-4 xl:px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-black">
        --- Profile ---
      </h1>
      <UserProfile />
    </div>
  );
}
