'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'

const features = [
  {
    title: 'Google Maps Platform',
    description:
      'All your favorite google maps features. Autocomplete, place details, and more.',
    icon: '🌎',
  },
  {
    title: 'User Reviews',
    description: 'Write a review and see reviews from your friends.',
    icon: '📝',
  },
  {
    title: 'Minimal Design',
    description: 'Only what you need, none of the bloat of other apps.',
    icon: '✨',
  },
  {
    title: 'Fast Performance',
    description:
      'Quick load times so you can get to finding your next place to visit.',
    icon: '⚡',
  },
]

export default function FeatureCarousel() {
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  const handleDragEnd = () => {
    const currentX = x.get()
    if (currentX > 0) {
      controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      })
    } else if (currentX < -width) {
      controls.start({
        x: -width,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      })
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12 text-foreground">
          Why Clime Time Reviews?
        </h2>
        <motion.div ref={carousel} className="cursor-grab overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileTap={{ cursor: 'grabbing' }}
            animate={controls}
            style={{ x }}
            onDragEnd={handleDragEnd}
            className="flex"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] h-[400px] p-8 m-4 bg-background rounded-3xl shadow-lg flex flex-col justify-between hover-lift transition-all duration-300 ease-in-out border-2 border-gray-200 dark:border-gray-800 hover:border-primary/10"
              >
                <div>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
