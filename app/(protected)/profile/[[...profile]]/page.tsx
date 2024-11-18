"use client";

import { UserProfile, useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl  font-bold text-center mb-12 text-black">
        --- Profile ---
      </h1>
      <UserProfile />
    </div>
  );
}
