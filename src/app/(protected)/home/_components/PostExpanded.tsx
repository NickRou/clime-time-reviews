'use client'

import { useCallback, useEffect, useState } from 'react'
import { GoogleAutoComplete } from './GoogleAutoComplete'
import { APIProvider } from '@vis.gl/react-google-maps'
import { Input } from '@/components/ui/input'
import { PriceRangeSelect } from './PriceRangeSelect'
import { StarRating } from './StarRating'
import { Textarea } from '@/components/ui/textarea'
import ImageCarousel from '../../_components/HorizontalScrollImages'
import { Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDropzone } from '@uploadthing/react'
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client'
import { useUploadThing } from '@/lib/uploadthing'
import { PostState, Tag } from '@/lib/types'
import { createPost } from '@/actions/posts'
import { createImageUrls } from '@/actions/images'
import TagsInput from '../../_components/TagsInput'
import { createPostTags, createTags } from '@/actions/tags'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

const initialPostState: PostState = {
  loc_place_id: '',
  loc_name: '',
  loc_address: '',
  loc_cost: 0,
  loc_review: 0,
  loc_content: '',
}

interface PostExpandedProps {
  handleCollapse: () => void
  allTags: Tag[]
}

export default function PostExpanded({
  handleCollapse,
  allTags,
}: PostExpandedProps) {
  // component state
  const [postState, setPostState] = useState(initialPostState)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [tempFileUrls, setTempFileUrls] = useState<string[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // upload thing
  const { startUpload, routeConfig } = useUploadThing('imageUploader')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  })

  // component functions
  useEffect(() => {
    const newUrls = imageFiles.map((file) => URL.createObjectURL(file))
    setTempFileUrls(newUrls)

    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  const onImagesDelete = useCallback(() => {
    setTempFileUrls([])
    setImageFiles([])
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    try {
      // create post
      const post_id = await createPost(postState)

      // create tags
      const existingTags = tags.filter((tag) => !tag.tag_id.startsWith('temp-'))
      const addedTags = tags.filter((tag) => tag.tag_id.startsWith('temp-'))
      const newTags: Tag[] = await createTags(addedTags)

      // create post tags
      await createPostTags(existingTags.concat(newTags), post_id)

      // upload images to upload thing
      if (imageFiles.length > 0) {
        const uploadedImages = await startUpload(imageFiles)

        // create image urls
        if (uploadedImages && uploadedImages.length > 0) {
          await createImageUrls(uploadedImages, post_id)
        }
      }
    } catch (error) {
      console.error('Error creating post: ', error)
    } finally {
      // cleanup component state
      setPostState(initialPostState)
      setTempFileUrls([])
      setImageFiles([])
      setIsSubmitting(false)
      handleCollapse() // collapses this expanded post
    }
  }, [handleCollapse, postState, startUpload, imageFiles, tags])

  const hasDefaultValues = () => {
    return (
      postState.loc_place_id === '' ||
      postState.loc_name === '' ||
      postState.loc_address === '' ||
      postState.loc_cost === 0 ||
      postState.loc_content === ''
    )
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          <div className="grid gap-4">
            <GoogleAutoComplete
              onPlaceSelect={(place) => {
                if (place) {
                  setPostState({
                    ...postState,
                    loc_name: place.name || '',
                    loc_address: place.formatted_address || '',
                    loc_place_id: place.place_id || '',
                  })
                }
              }}
            />
            <Input
              name="loc_name"
              value={postState.loc_name}
              placeholder="Location name"
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              readOnly
              disabled
            />
            <Input
              name="loc_address"
              value={postState.loc_address}
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
                value={postState.loc_cost}
                onChange={useCallback((value) => {
                  setPostState((prevState) => ({
                    ...prevState,
                    loc_cost: value,
                  }))
                }, [])}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Rating
              </label>
              <StarRating
                value={postState.loc_review}
                onChange={useCallback((value) => {
                  setPostState((prevState) => ({
                    ...prevState,
                    loc_review: value,
                  }))
                }, [])}
              />
            </div>
            <Textarea
              name="locContent"
              onChange={useCallback(
                (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setPostState((prevState) => ({
                    ...prevState,
                    loc_content: event.target.value,
                  }))
                },
                []
              )}
              placeholder="Write your review..."
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 min-h-[100px] whitespace-pre-wrap"
            />
            <TagsInput
              allTags={allTags}
              selectedTags={tags}
              onTagsChange={setTags}
            />
            {imageFiles.length > 0 ? (
              <div>
                <ImageCarousel fileUrls={tempFileUrls} />
                <button
                  className="flex pt-2 text-gray-500 gap-2"
                  onClick={onImagesDelete}
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
              className="px-6"
              onClick={handleSubmit}
              disabled={isSubmitting || hasDefaultValues()}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </APIProvider>
  )
}
