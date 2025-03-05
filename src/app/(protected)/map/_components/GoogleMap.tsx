'use client'

import { Post } from '@/lib/types'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import {
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps'
import { useCallback, useMemo, useState } from 'react'
import LocationCard from './LocationCard'
import PostsFilter from './PostsFilter'

interface GoogleMapProps {
  posts: Post[]
  userPosts: Post[]
  userId: string
}

export interface BoundsWithPadding extends google.maps.LatLngBoundsLiteral {
  padding?: number
}

const calculateBounds = (posts: Post[]): BoundsWithPadding | undefined => {
  if (posts.length === 0) return undefined

  return {
    east: Math.max(...posts.map((p) => p.loc_longitude)),
    west: Math.min(...posts.map((p) => p.loc_longitude)),
    north: Math.max(...posts.map((p) => p.loc_latitude)),
    south: Math.min(...posts.map((p) => p.loc_latitude)),
    padding: 20, // Add 20px padding around bounds
  }
}

export default function GoogleMap({
  posts,
  userPosts,
  userId,
}: GoogleMapProps) {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  const [activePosts, setActivePosts] = useState<Post[]>(posts)

  const postsMap = useMemo(() => {
    const map: { [key: string]: Post[] } = {}

    activePosts.forEach((post) => {
      const key = `${post.loc_latitude},${post.loc_longitude}`
      if (!map[key]) {
        map[key] = [post]
      } else {
        map[key].push(post)
      }
    })

    return map
  }, [activePosts]) // Include 'posts' to avoid exhaustive deps warning

  // Calculate bounds that contain all markers
  const defaultBounds = activePosts.length
    ? calculateBounds(activePosts)
    : undefined

  const [cameraProps, setCameraProps] = useState<MapCameraProps | null>(null)

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail)
  }, [])

  // Location card
  const [isCardVisible, setIsCardVisible] = useState(false)
  const [cardLocationInfo, setCardLocationInfo] = useState<Post[] | null>(null)

  const handleMarkerClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng
      if (!latLng) return
      const locationKey = `${latLng.lat()},${latLng.lng()}`
      const locationPosts = postsMap[locationKey]
      setIsCardVisible((isCardVisible) => !isCardVisible)
      setCardLocationInfo(locationPosts)
    },
    [postsMap]
  )

  const handleMapClick = useCallback(() => {
    if (isCardVisible) {
      setIsCardVisible(false)
    }
  }, [isCardVisible])

  const handleFilterChange = useCallback(
    (value: string) => {
      if (value === 'following') {
        setActivePosts(posts)
        return calculateBounds(posts)
      } else if (value === 'personal') {
        setActivePosts(userPosts)
        return calculateBounds(userPosts)
      }
      return undefined
    },
    [posts, userPosts]
  )

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <LocationCard
        posts={cardLocationInfo || []}
        userId={userId}
        isVisible={isCardVisible}
        setIsVisible={setIsCardVisible}
      />
      <PostsFilter className="z-10" onFilterChange={handleFilterChange} />
      <Map
        {...cameraProps}
        defaultBounds={defaultBounds}
        onCameraChanged={handleCameraChange}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        className="w-full h-full"
        mapId="reviews-map"
        gestureHandling={'greedy'} // Improves mobile handling
        onDrag={handleMapClick}
        onClick={handleMapClick}
      >
        {Object.entries(postsMap).map(([key, posts]) => (
          <Marker
            key={key}
            position={{
              lat: posts[0].loc_latitude,
              lng: posts[0].loc_longitude,
            }}
            onClick={handleMarkerClick}
          />
        ))}
      </Map>
    </APIProvider>
  )
}
