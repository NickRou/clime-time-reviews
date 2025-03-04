'use client'

import { useCallback, useState } from 'react'
import PostNotExpanded from './PostNotExpanded'
import { Tag, User } from '@/lib/types'
import PostExpanded from './PostExpanded'

interface PostProps {
  currentUser: User
  allTags: Tag[]
}

export default function Post({ currentUser, allTags }: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
  }, [])

  return (
    <div className="rounded-lg bg-card text-card-foreground w-full max-w-3xl border-0 shadow-none">
      {!isExpanded ? (
        <PostNotExpanded user={currentUser} handleExpand={handleExpand} />
      ) : (
        <PostExpanded handleCollapse={handleCollapse} allTags={allTags} />
      )}
    </div>
  )
}
