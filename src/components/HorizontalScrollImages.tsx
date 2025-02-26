import * as React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import { AspectRatio } from './ui/aspect-ratio'

interface ImageCarouselProps {
  fileUrls: string[]
}

export default function ImageCarousel({ fileUrls }: ImageCarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {fileUrls.map((src, index) => (
          <CarouselItem key={index}>
            <AspectRatio ratio={4 / 3} className="bg-muted rounded-lg">
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                className="rounded-lg object-contain"
                loading="eager"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
    </Carousel>
  )
}
