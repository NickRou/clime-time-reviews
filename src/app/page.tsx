'use client'

import Footer from '@/app/_components/Footer'
import { redirect } from 'next/navigation'
import LandingHero from './_components/LandingHero'
import LandingHeader from './_components/LandingHeader'
import FeatureCarousel from './_components/FeatureCarousel'
import { useAuth } from '@clerk/nextjs'

export default function LandingPage() {
  const { userId, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (userId) {
    redirect('/home')
  }

  return (
    <>
      <LandingHeader />
      <LandingHero />
      <FeatureCarousel />
      <Footer />
    </>
  )
}
