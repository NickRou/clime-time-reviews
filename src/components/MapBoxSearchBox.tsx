'use client'

import { SearchBox } from '@mapbox/search-js-react'
import { SearchBoxRetrieveResponse } from '@mapbox/search-js-core'
import { useTheme } from 'next-themes'
import { useState } from 'react'

interface MapBoxSearchBoxProps {
  onLocationSelect: (location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }) => void
}

const MapBoxSearchBox = ({ onLocationSelect }: MapBoxSearchBoxProps) => {
  const lightTheme = {
    variables: {
      // Base styles
      fontFamily: 'inherit',
      unit: '14px',
      padding: '0.5em',
      borderRadius: '0.375rem',
      // Colors
      colorBackground: '#ffffff',
      colorBackgroundHover: '#f3f4f6',
      colorText: '#4b5563',
      colorBorder: '#e5e7eb',
      colorPrimary: '#3b82f6',
    },
  }

  const darkTheme = {
    variables: {
      // Base styles
      fontFamily: 'inherit',
      unit: '14px',
      padding: '0.5em',
      borderRadius: '0.375rem',
      // Colors
      colorBackground: '#1f2937',
      colorBackgroundHover: '#374151',
      colorText: '#ffffff',
      colorBorder: '#374151',
      colorPrimary: '#ffffff',
    },
  }

  const { theme } = useTheme()

  const mapboxTheme = theme === 'dark' ? darkTheme : lightTheme

  const [searchValue, setSearchValue] = useState('')

  const handleClear = () => {
    setSearchValue('')
    onLocationSelect({
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
    })
  }

  const handleRetrieve = (res: SearchBoxRetrieveResponse) => {
    const feature = res.features[0]
    const coordinates = feature.geometry.coordinates

    onLocationSelect({
      name: feature.properties.name,
      address: feature.properties.full_address,
      latitude: coordinates[1],
      longitude: coordinates[0],
    })
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is not set')
  }

  return (
    <div>
      {/* @ts-expect-error: Mapbox SearchBox component is not typed */}
      <SearchBox
        value={searchValue}
        onChange={(value: string) => setSearchValue(value)}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        options={{
          language: 'en',
          country: 'US',
        }}
        onRetrieve={handleRetrieve}
        onClear={handleClear}
        theme={mapboxTheme}
      />
    </div>
  )
}

export default MapBoxSearchBox
