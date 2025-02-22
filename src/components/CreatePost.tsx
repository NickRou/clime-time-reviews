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
import { APIProvider } from '@vis.gl/react-google-maps'
import { GoogleAutoComplete } from './GoogleAutoComplete'

export default function CreatePost() {
  const { user } = useUser()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewState, setReviewState] = useState({
    name: '',
    address: '',
    place_id: '',
    priceRange: 0,
    rating: 0,
  })

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      setIsSubmitting(true)

      try {
        const formData = new FormData(form)
        const content = form.locContent.value
        formData.delete('locContent')
        formData.append('locContent', content)
        formData.append('locCost', reviewState.priceRange.toString())
        formData.append('locReview', reviewState.rating.toString())
        formData.append('locPlaceId', reviewState.place_id)
        await createPost(formData)

        setIsExpanded(false)
        form.reset()
        setReviewState({
          name: '',
          address: '',
          place_id: '',
          priceRange: 0,
          rating: 0,
        })
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [reviewState]
  )

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set')
  }

  if (!user) return null

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
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
                    <GoogleAutoComplete
                      onPlaceSelect={(place) => {
                        if (place) {
                          setReviewState((prev) => ({
                            ...prev,
                            name: place.name || '',
                            address: place.formatted_address || '',
                            place_id: place.place_id || '',
                          }))
                        }
                      }}
                    />
                    <Input
                      name="locName"
                      value={reviewState.name}
                      placeholder="Location name"
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      readOnly
                      disabled
                    />
                    <Input
                      name="locAddress"
                      value={reviewState.address}
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
                        value={reviewState.priceRange}
                        onChange={(value) =>
                          setReviewState({ ...reviewState, priceRange: value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Rating
                      </label>
                      <StarRating
                        value={reviewState.rating}
                        onChange={(value) =>
                          setReviewState({ ...reviewState, rating: value })
                        }
                      />
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
    </APIProvider>
  )
}
