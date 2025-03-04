'use client'

import type React from 'react'
import { useRef, useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@/lib/types'

interface TagInputProps {
  allTags: Tag[]
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  className?: string
}

export default function TagInput({
  allTags,
  selectedTags,
  onTagsChange,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter tags that match the input value
  const filteredTags = allTags.filter(
    (tag) =>
      tag.tag_text.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((t) => t.tag_id === tag.tag_id)
  )

  const addTag = (tagText: string) => {
    if (!tagText.trim() || selectedTags.length >= 3) return

    // Check if tag already exists in allTags
    const existingTag = allTags.find(
      (tag) => tag.tag_text.toLowerCase() === tagText.toLowerCase()
    )

    if (existingTag) {
      if (!selectedTags.some((t) => t.tag_id === existingTag.tag_id)) {
        onTagsChange([...selectedTags, existingTag])
      }
    } else {
      // Create a new tag with a temporary ID
      // Not sure if this is the best way to to do this??
      const newTag: Tag = {
        tag_id: `temp-${Date.now()}`,
        tag_text: tagText.trim(),
      }
      onTagsChange([...selectedTags, newTag])
    }

    setInputValue('')
    setOpen(false)
  }

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.tag_id !== tagId))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  return (
    <div className={`space-y-2`}>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.tag_id}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 text-sm"
          >
            {tag.tag_text}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => removeTag(tag.tag_id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </Button>
          </Badge>
        ))}

        {selectedTags.length < 3 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => inputRef.current?.focus()}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search or create tag..."
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                />
                <CommandList className="max-h-[200px] overflow-auto">
                  <CommandEmpty className="py-2 px-1">
                    {inputValue && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => addTag(inputValue)}
                      >
                        Create &apos;{inputValue}&apos;
                      </Button>
                    )}
                  </CommandEmpty>
                  <CommandGroup heading="Existing Tags">
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag.tag_id}
                        value={tag.tag_text}
                        onSelect={() => {
                          addTag(tag.tag_text)
                        }}
                      >
                        <Check className="mr-2 h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
                        {tag.tag_text}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {selectedTags.length >= 3 && (
        <p className="text-xs text-muted-foreground">
          Maximum of 3 tags reached
        </p>
      )}
    </div>
  )
}
