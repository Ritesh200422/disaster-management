'use client';

import { useEffect, useRef } from 'react';
import type { Map, Polygon, Marker } from 'leaflet';

export default function PredictionMap() {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker[]>([]);
  const polygonRef = useRef<Polygon[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (!mapRef.current) {
          const map = L.map('map').setView([12.5, 78.5], 6); // South India overview

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          mapRef.current = map;
          type FloodZone = {
            name: string;
            coords: [number, number]; // Latitude, Longitude
            polygon: [number, number][]; // Array of LatLng tuples
          };

          const floodZones: FloodZone[] = [
            {
              name: 'Kuttanad, Kerala',
              coords: [9.3793, 76.5741],
              polygon: [
                [9.400, 76.500],
                [9.450, 76.600],
                [9.420, 76.700],
                [9.370, 76.650],
                [9.350, 76.550]
              ]
            },
            {
              name: 'Chennai, Tamil Nadu',
              coords: [13.0827, 80.2707],
              polygon: [
                [13.12, 80.20],
                [13.10, 80.30],
                [13.05, 80.28],
                [13.06, 80.22]
              ]
            },
            {
              name: 'Hyderabad, Telangana',
              coords: [17.3850, 78.4867],
              polygon: [
                [17.40, 78.45],
                [17.42, 78.50],
                [17.36, 78.52],
                [17.34, 78.48]
              ]
            },
            {
              name: 'Bangalore Urban, Karnataka',
              coords: [12.9716, 77.5946],
              polygon: [
                [12.99, 77.56],
                [12.97, 77.62],
                [12.95, 77.60],
                [12.96, 77.55]
              ]
            },
            {
              name: 'Rajahmundry, Andhra Pradesh',
              coords: [17.0005, 81.8040],
              polygon: [
                [17.02, 81.78],
                [17.01, 81.83],
                [16.99, 81.82],
                [16.98, 81.78]
              ]
            }
          ];
          floodZones.forEach((zone) => {
            // Add marker for flood-prone location
            const marker = L.marker(zone.coords)
              .addTo(map)
              .bindPopup(`<b>${zone.name}</b><br/>Flood-prone area`);

            markerRef.current.push(marker);

            // Add polygon for flood risk zone
            const polygon = L.polygon(zone.polygon, {
              color: 'blue',
              fillColor: '#3388ff',
              fillOpacity: 0.4
            })
              .addTo(map)
              .bindPopup(`<b>${zone.name}</b><br/>Flood risk zone`);

            polygonRef.current.push(polygon);
          });

        }
      }).catch((error) => {
        console.error('Failed to load Leaflet:', error);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = [];
        polygonRef.current = [];
      }
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '500px',
        marginBottom: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}
    />
  );
}
