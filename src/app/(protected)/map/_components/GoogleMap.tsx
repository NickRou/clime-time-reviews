'use client'

import { Post } from '@/lib/types'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import {
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps'
import { useCallback, useMemo, useState } from 'react'
import LocationCard from './LocationCard'

interface GoogleMapProps {
  posts: Post[]
  userId: string
}

export default function GoogleMap({ posts, userId }: GoogleMapProps) {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

  const postsMap = useMemo(() => {
    const map: { [key: string]: Post[] } = {}

    posts.forEach((post) => {
      const key = `${post.loc_latitude},${post.loc_longitude}`
      if (!map[key]) {
        map[key] = [post]
      } else {
        map[key].push(post)
      }
    })

    return map
  }, [posts]) // Include 'posts' to avoid exhaustive deps warning

  // Calculate bounds that contain all markers
  const defaultBounds = posts.length
    ? {
        east: Math.max(...posts.map((p) => p.loc_longitude)),
        west: Math.min(...posts.map((p) => p.loc_longitude)),
        north: Math.max(...posts.map((p) => p.loc_latitude)),
        south: Math.min(...posts.map((p) => p.loc_latitude)),
        padding: 20, // Add 20px padding around bounds
      }
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

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <LocationCard
        posts={cardLocationInfo || []}
        userId={userId}
        isVisible={isCardVisible}
        setIsVisible={setIsCardVisible}
      />
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
