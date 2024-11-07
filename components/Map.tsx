"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { QueryResultRow } from "@vercel/postgres";

interface MapProps {
  reviews: QueryResultRow[];
}

export default function Map({ reviews }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([0, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
      }

      const map = mapRef.current;

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers for each review
      reviews.forEach((review) => {
        if (review.latitude && review.longitude) {
          L.marker([review.latitude, review.longitude])
            .addTo(map)
            .bindPopup(`<b>${review.restaurant_name}</b><br>${review.address}`);
        }
      });

      // Fit the map to the markers
      // if (reviews.length > 0) {
      //   const bounds = L.latLngBounds(
      //     reviews.map((r) => [r.latitude, r.longitude]),
      //   );
      //   map.fitBounds(bounds);
      // }
    }
  }, [reviews]);

  return <div id="map" className="h-full w-full" />;
}
