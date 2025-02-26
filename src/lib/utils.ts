import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/ui
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// uploadthing
export function getImageKey(image_url: string) {
  return image_url.split('/f/')[1]
}
