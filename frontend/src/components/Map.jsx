import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { MapStyle } from "@maptiler/sdk";

const Map = ({ center = [33.747305, -84.389774], zoom = 16, apiKey = "MqksnlTzgxHclo5tuDPt" }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // stops map from initializing more than once

    if (!mapContainer.current) return;

    mapInstance.current = L.map(mapContainer.current, {
      center: L.latLng(center[0], center[1]),
      zoom: zoom,
      zoomControl: true, // Enable zoom control
      scrollWheelZoom: false // Disable scroll zoom by default for better UX in dashboard
    });

    // Create a MapTiler Layer inside Leaflet
    new MaptilerLayer({
      apiKey: apiKey,
      style: MapStyle.BASIC, // Using the style from the tutorial
    }).addTo(mapInstance.current);

    // Cleanup function
    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };
  }, [center, zoom, apiKey]);

  // Update center if props change
  useEffect(() => {
    if (mapInstance.current) {
        mapInstance.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className="w-full h-full min-h-[250px] rounded-lg overflow-hidden border border-gray-200 relative z-0">
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />
    </div>
  );
};

export default Map;
