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

// misc
export function getLastPathComponent(path: string) {
  // Remove leading slash and split the path
  const pathParts = path.replace(/^\//, '').split('/')

  // Return the last component, removing any query parameters or additional path info
  return pathParts[pathParts.length - 1].split('?')[0]
}
