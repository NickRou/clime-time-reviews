'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { createPost } from '@/lib/actions'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'

export default function CreatePost() {
  const { user } = useUser()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        await createPost(formData)

        setIsExpanded(false)
        form.reset()
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    []
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
                  <Input
                    name="locName"
                    placeholder="Restaurant name"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                  <Input
                    name="locAddress"
                    placeholder="Restaurant address"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                  <Input
                    name="locReview"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Rating (1-10)"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                  <Textarea
                    name="locContent"
                    placeholder="Write your review..."
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 min-h-[100px]"
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
