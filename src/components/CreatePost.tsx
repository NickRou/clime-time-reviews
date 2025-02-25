'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useCallback, useEffect } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { createImageUrls, createPost } from '@/lib/actions'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { PriceRangeSelect } from './PriceRangeSelect'
import { StarRating } from './StarRating'
import { APIProvider } from '@vis.gl/react-google-maps'
import { GoogleAutoComplete } from './GoogleAutoComplete'
import { useDropzone } from '@uploadthing/react'
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client'

import { useUploadThing } from '@/utils/uploadthing'
import { Trash2, Upload } from 'lucide-react'
import HorizontalScrollImages from './HorizontalScrollImages'
import { ClientUploadedFileData } from 'uploadthing/types'

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
  const [files, setFiles] = useState<File[]>([])
  const [fileUrls, setFileUrls] = useState<string[]>([])

  useEffect(() => {
    const newUrls = files.map((file) => URL.createObjectURL(file))
    setFileUrls(newUrls)

    // Clean up URLs when component unmounts
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  const onFilesDelete = () => {
    setFileUrls([])
    setFiles([])
  }

  const { startUpload, routeConfig } = useUploadThing('imageUploader')

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      setIsSubmitting(true)

      try {
        // create post
        const formData = new FormData(form)
        const content = form.locContent.value
        formData.delete('locContent')
        formData.append('locContent', content)
        formData.append('locCost', reviewState.priceRange.toString())
        formData.append('locReview', reviewState.rating.toString())
        formData.append('locPlaceId', reviewState.place_id)
        const post_id = await createPost(formData)

        // upload files attached to the post
        const uploadedFiles:
          | ClientUploadedFileData<{
              uploadedBy: string
              ufsUrl: string
            }>[]
          | undefined = await startUpload(files)

        if (uploadedFiles) {
          await createImageUrls(uploadedFiles, post_id)
        }

        // cleanup form state
        setIsExpanded(false)
        form.reset()
        setReviewState({
          name: '',
          address: '',
          place_id: '',
          priceRange: 0,
          rating: 0,
        })

        // cleanup image files and urls
        setFiles([])
        fileUrls.forEach((url) => URL.revokeObjectURL(url))
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [reviewState, fileUrls, files, startUpload]
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  })

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
            <div className="flex-1 space-y-4">
              {!isExpanded ? (
                <div className="flex gap-4">
                  <Link href={`/profile/${user.username}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.username ?? ''}
                      />
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div
                    onClick={handleExpand}
                    className="w-full cursor-pointer p-3 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    Write a review!
                  </div>
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
                    {files.length > 0 ? (
                      <div>
                        <HorizontalScrollImages fileUrls={fileUrls} />
                        <button
                          className="flex pt-2 text-gray-500 gap-2"
                          onClick={onFilesDelete}
                        >
                          <Trash2 />
                          Clear Images
                        </button>
                      </div>
                    ) : (
                      <div
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg min-h-[100px] flex items-center justify-center flex-col text-gray-500 dark:text-gray-400 cursor-pointer"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <Upload />
                        <span>Add Images!</span>
                        <span className="text-sm">
                          Click here to choose or drag & drop
                        </span>
                        <span className="text-xs">
                          Max 4 images. Max size 4MB each.
                        </span>
                      </div>
                    )}
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
