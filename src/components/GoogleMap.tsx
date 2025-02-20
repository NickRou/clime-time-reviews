'use client'

import { PostWithUser } from '@/lib/types'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import {
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps'
import { useCallback, useState } from 'react'
import { GoogleMarker } from './GoogleMarker'

interface GoogleMapProps {
  posts: PostWithUser[]
}

export default function GoogleMap({ posts }: GoogleMapProps) {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

  // Calculate average lat/lng from all posts
  const initialCenter = posts.length
    ? {
        lat:
          posts.reduce((sum, post) => sum + post.loc_latitude, 0) /
          posts.length,
        lng:
          posts.reduce((sum, post) => sum + post.loc_longitude, 0) /
          posts.length,
      }
    : { lat: 40.7, lng: -74 } // Default fallback if no posts

  const INITIAL_CAMERA = {
    center: initialCenter,
    zoom: 3,
  }

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA)
  const handleCameraChange = useCallback(
    (ev: MapCameraChangedEvent) => setCameraProps(ev.detail),
    []
  )

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        {...cameraProps}
        onCameraChanged={handleCameraChange}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        className="w-full h-full"
        mapId="reviews-map"
        gestureHandling={'greedy'} // Improves mobile handling
      >
        {posts.map((post) => (
          <GoogleMarker
            key={post.post_id}
            position={{ lat: post.loc_latitude, lng: post.loc_longitude }}
            post={post}
          />
        ))}
      </Map>
    </APIProvider>
  )
}
