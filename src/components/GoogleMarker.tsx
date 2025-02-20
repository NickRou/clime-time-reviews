import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'
import { useState, useCallback } from 'react'
import { PostWithUser } from '@/lib/types'
import GoogleInfoWindowContent from './GoogleInfoWindowContent'

export const GoogleMarker = ({
  position,
  posts,
}: {
  position: { lat: number; lng: number }
  posts: PostWithUser[]
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef()

  const [infoWindowShown, setInfoWindowShown] = useState(false)

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  )

  const handleClose = useCallback(() => setInfoWindowShown(false), [])

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}
          maxWidth={300}
          headerContent={
            <div className="pl-2 pb-2">
              <div className="font-semibold text-black">
                <div>{posts[0].loc_name}</div>
                <div className="text-xs font-normal text-gray-500">
                  {posts[0].loc_address}
                </div>
              </div>
            </div>
          }
        >
          <div className="max-h-[60vh] overflow-y-auto">
            {posts.map((post) => (
              <div key={post.post_id} className="border-t border-gray-500 pt-6">
                <GoogleInfoWindowContent post={post} />
              </div>
            ))}
          </div>
        </InfoWindow>
      )}
    </>
  )
}
