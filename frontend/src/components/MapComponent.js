import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function MapComponent({ onLocationSelect, selectedLocation }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; 

    mapRef.current = L.map('map', {
      center: [51.505, -0.09],
      zoom: 5,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    const defaultIcon = L.icon({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    markerRef.current = L.marker([51.505, -0.09], { icon: defaultIcon }).addTo(mapRef.current);

    function handleMapClick(e) {
      const { lat, lng } = e.latlng;
      markerRef.current.setLatLng(e.latlng);
      mapRef.current.setView([lat, lng], 8); 
      onLocationSelect(lat, lng);
    }

    mapRef.current.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (
      selectedLocation.lat != null &&
      selectedLocation.lon != null &&
      mapRef.current &&
      markerRef.current
    ) {
      const { lat, lon } = selectedLocation;
      markerRef.current.setLatLng([lat, lon]);
      mapRef.current.setView([lat, lon], 8);
    }
  }, [selectedLocation]);

  return (
    <div className="card mb-4 border-0" style={{ backgroundColor: '#2b2b2b' }}>
      <div className="card-header bg-dark text-light">
        <h4 className="mb-0">Pick a Location</h4>
      </div>

      <div className="card-body">
        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem' }}>
          Click anywhere on the map to drop a marker.
        </p>

        <div id="map" style={{ width: '100%', height: '400px' }}></div>

        <div className="mt-3" style={{ color: '#ccc' }}>
          <strong>Selected Latitude:</strong>{' '}
          {selectedLocation.lat ? selectedLocation.lat.toFixed(5) : '-'},
          <strong> Longitude:</strong>{' '}
          {selectedLocation.lon ? selectedLocation.lon.toFixed(5) : '-'}
        </div>
      </div>
    </div>
  );
}

export default MapComponent;