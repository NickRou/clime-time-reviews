'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/nextjs'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import Footer from '@/components/Footer'
import { redirect } from 'next/navigation'

export default function LandingPage() {
  const { userId, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (userId) {
    redirect('/home')
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <BackgroundCanvas />
      <div className="relative z-10 flex h-full flex-col items-center px-4 text-center text-neutral-50">
        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.h1
            className="mb-6 text-6xl font-bold tracking-tighter sm:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Clime Time Reviews
          </motion.h1>
          <motion.p
            className="max-w-[600px] text-lg text-gray-400 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            See reviews from your friends
          </motion.p>
          <div className="pt-6">
            <SignedIn>
              <Link href="/home">
                <Button>Home</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button>Get Started</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
