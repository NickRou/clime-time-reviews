'use client'

import { useState } from 'react'
import { Check, ChevronDown, MapPinPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMap } from '@vis.gl/react-google-maps'
import { BoundsWithPadding } from './GoogleMap'

interface MapFilterProps {
  onFilterChange?: (value: string) => BoundsWithPadding | undefined
  className?: string
}

export default function MapFilter({
  onFilterChange,
  className = '',
}: MapFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>('following')
  const map = useMap()

  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
    if (onFilterChange) {
      const newBounds = onFilterChange(value)
      if (!newBounds) return

      console.log(newBounds)
      const { east, west, north, south, padding } = newBounds
      map?.fitBounds({ east, west, north, south }, padding)
      map?.panToBounds({ east, west, north, south }, padding)
      console.log('done setting bounds')
    }
  }

  const options = [
    { value: 'following', label: 'Following' },
    { value: 'personal', label: 'Personal' },
  ]

  const activeLabel = options.find(
    (option) => option.value === activeFilter
  )?.label

  return (
    <div className={`absolute inset-auto z-10 p-4 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full px-4 py-2 border shadow-sm"
          >
            <MapPinPlus />
            {activeLabel}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[160px] rounded-xl">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className="flex items-center justify-between cursor-pointer"
            >
              {option.label}
              {activeFilter === option.value && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
