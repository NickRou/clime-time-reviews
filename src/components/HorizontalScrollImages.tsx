import * as React from 'react'
import Image from 'next/image'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface HorizontalScrollImagesProps {
  fileUrls: string[]
}

export default function HorizontalScrollImages({
  fileUrls,
}: HorizontalScrollImagesProps) {
  return (
    <ScrollArea className="w-full rounded-md border">
      <div className="flex snap-x snap-mandatory overflow-x-auto">
        {fileUrls.map((fileUrl, index) => (
          <figure key={fileUrl} className="shrink-0 snap-center">
            <div className="overflow-hidden">
              <Image
                src={fileUrl || '/placeholder.svg'}
                alt={`Uploaded image ${index + 1}`}
                className="aspect-square h-[300px] w-[300px] object-cover"
                width={300}
                height={300}
              />
            </div>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
