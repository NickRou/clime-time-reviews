"use client";
import { SignIn, SignUp } from "@clerk/nextjs";

interface WelcomePageProps {
  mode: "sign-in" | "sign-up";
}

export default function WelcomePage({ mode = "sign-in" }: WelcomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-white text-black overflow-hidden">
      <main className="text-center px-4 w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-[clamp(1rem,5vw,2.5rem)] font-bold mb-8 whitespace-nowrap">
          --- Welcome to Clime Time Reviews ---
        </h1>

        <div className="w-full max-w-md flex justify-center">
          {mode === "sign-in" ? <SignIn /> : <SignUp />}
        </div>
      </main>
      <footer className="absolute bottom-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Clime Time Reviews
      </footer>
    </div>
  );
}
