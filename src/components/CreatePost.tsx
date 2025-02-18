'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { createPost } from '@/lib/actions'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { PriceRangeSelect } from './PriceRangeSelect'
import { StarRating } from './StarRating'
import MapBoxSearchBox from './MapBoxSearchBox'

export default function CreatePost() {
  const { user } = useUser()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [priceRange, setPriceRange] = useState(0)
  const [rating, setRating] = useState(0)
  const [location, setLocation] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
  })

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleLocationSelect = useCallback(
    (locationData: {
      name: string
      address: string
      latitude: number
      longitude: number
    }) => {
      setLocation(locationData)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      setIsSubmitting(true)

      try {
        const formData = new FormData(form)
        const content = form.locContent.value
        formData.delete('locContent')
        formData.append('locName', location.name)
        formData.append('locAddress', location.address)
        formData.append('locContent', content)
        formData.append('locCost', priceRange.toString())
        formData.append('locReview', rating.toString())
        formData.append('locLatitude', location.latitude.toString())
        formData.append('locLongitude', location.longitude.toString())
        await createPost(formData)

        setIsExpanded(false)
        form.reset()
        setPriceRange(0)
        setRating(0)
        setLocation({ name: '', address: '', latitude: 0, longitude: 0 })
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [priceRange, rating, location]
  )

  if (!user) return null

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl} alt={user.username ?? ''} />
              <AvatarFallback>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 space-y-4">
            {!isExpanded ? (
              <div
                onClick={handleExpand}
                className="cursor-pointer p-3 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                Write a review!
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  <MapBoxSearchBox onLocationSelect={handleLocationSelect} />
                  <Input
                    name="locName"
                    value={location.name}
                    placeholder="Location name"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    readOnly
                    disabled
                  />
                  <Input
                    name="locAddress"
                    value={location.address}
                    placeholder="Location address"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    readOnly
                    disabled
                  />
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Price Range
                    </label>
                    <PriceRangeSelect
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Rating
                    </label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                  <Textarea
                    name="locContent"
                    placeholder="Write your review..."
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 min-h-[100px] whitespace-pre-wrap"
                    required
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
