'use client'

import Map, { Marker } from 'react-map-gl/mapbox'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { PostWithUser } from '@/lib/types'
import { renderToString } from 'react-dom/server'
import MapBoxMapPopup from './MapBoxMapPopup'

interface MapBoxMapProps {
  posts: PostWithUser[]
}

export default function MapBoxMap({ posts }: MapBoxMapProps) {
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is not set')
  }

  // Calculate center point and bounds
  const bounds = posts.reduce(
    (acc, post) => {
      acc.minLng = Math.min(acc.minLng, post.loc_longitude)
      acc.maxLng = Math.max(acc.maxLng, post.loc_longitude)
      acc.minLat = Math.min(acc.minLat, post.loc_latitude)
      acc.maxLat = Math.max(acc.maxLat, post.loc_latitude)
      return acc
    },
    {
      minLng: Infinity,
      maxLng: -Infinity,
      minLat: Infinity,
      maxLat: -Infinity,
    }
  )

  const centerLng = (bounds.minLng + bounds.maxLng) / 2
  const centerLat = (bounds.minLat + bounds.maxLat) / 2

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: centerLng,
        latitude: centerLat,
        zoom: 12,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {posts.map((post) => (
        <Marker
          key={post.post_id}
          longitude={post.loc_longitude}
          latitude={post.loc_latitude}
          color="red"
          popup={new mapboxgl.Popup({
            maxWidth: '500px',
            closeButton: false,
          }).setHTML(
            `
              <div>
                ${renderToString(<MapBoxMapPopup post={post} />)}
              </div>
            `
          )}
        />
      ))}
    </Map>
  )
}
