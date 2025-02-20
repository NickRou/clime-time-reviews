const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export async function usePlaceDetails(placeId: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}` +
        `&fields=name,formatted_address,geometry` +
        `&key=${GOOGLE_MAPS_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    const result = data.result

    return {
      loc_name: result.name || '',
      loc_address: result.formatted_address || '',
      loc_longitude: result.geometry?.location?.lng || 0,
      loc_latitude: result.geometry?.location?.lat || 0,
    }
  } catch (error) {
    console.error('Error fetching place details:', error)
    return {
      loc_name: '',
      loc_address: '',
      loc_longitude: 0,
      loc_latitude: 0,
    }
  }
}
