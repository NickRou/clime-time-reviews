'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Post } from '@/lib/types'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import UserPost from '../../_components/UserPost'
import { Separator } from '@/components/ui/separator'
import DisplayStarRating from '../../_components/DisplayStarRating'

interface LocationCardProps {
  posts: Post[]
  userId: string
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

export default function LocationCard({
  posts,
  userId,
  isVisible,
  setIsVisible,
}: LocationCardProps) {
  if (!isVisible || !posts.length) return null

  const locName = posts[0].loc_name
  const locAddress = posts[0].loc_address

  const locationAverageRating =
    posts.map((post) => post.loc_review).reduce((a, b) => a + b) / posts.length

  return (
    <div className="absolute inset-auto z-20 p-4 w-full md:max-w-[600px]">
      <Card className="relative overflow-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-lg font-bold pr-8">
            <div className="pl-2 pb-2">
              <div className="font-semibold">
                <div>{locName}</div>
                <div className="text-xs font-normal">{locAddress}</div>
                <div className="flex gap-1">
                  <DisplayStarRating rating={locationAverageRating} />
                  <span className="text-base font-light">
                    &#40;{posts.length}&#41;
                  </span>
                </div>
              </div>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 -mt-2 -mr-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[400px] md:max-h-[600px] overflow-auto">
            {posts.map((post, index) => (
              <div key={post.post_id} className="pt-2">
                <UserPost post={post} currentUserId={userId} />
                {index < posts.length && <Separator />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
