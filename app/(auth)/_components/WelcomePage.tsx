"use client";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";

interface WelcomePageProps {
  mode: "sign-in" | "sign-up";
}

export default function WelcomePage({ mode = "sign-in" }: WelcomePageProps) {
  const { signIn, isLoading: isSignInLoading } = useSignIn();
  const { signUp, isLoading: isSignUpLoading } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "sign-in") {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          // Redirect or handle successful sign in
          window.location.href = "/reviews";
        }
      } else {
        const result = await signUp.create({
          emailAddress: email,
          password,
        });

        if (result.status === "complete") {
          // Redirect or handle successful sign up
          window.location.href = "/reviews";
        }
      }
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-white text-black overflow-hidden">
      <main className="text-center px-4 w-full h-full flex flex-col items-center justify-center">
        <div className="mb-8">
          <Image
            src="/typing-monkey.png"
            alt="Typing Monkey"
            width={150}
            height={150}
            priority
          />
        </div>
        <h1 className="text-[clamp(1rem,5vw,2.5rem)] font-bold mb-8 whitespace-nowrap">
          --- Welcome to Clime Time Reviews ---
        </h1>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSignInLoading || isSignUpLoading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSignInLoading || isSignUpLoading
                ? "Loading..."
                : mode === "sign-in"
                  ? "Sign In"
                  : "Sign Up"}
            </button>
          </form>
        </div>
      </main>
      <footer className="absolute bottom-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Clime Time Reviews
      </footer>
    </div>
  );
}
