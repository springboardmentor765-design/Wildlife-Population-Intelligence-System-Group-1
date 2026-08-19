import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function LeafletMap({ markers, mode = 'markers' }: { markers: any[], mode?: 'markers' | 'heatmap' }) {
  const defaultCenter: [number, number] = [-23.9884, 31.5547]; // Kruger National Park

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mode === 'markers' ? (
          markers.map((marker) => (
            <Marker 
              key={marker.id} 
              position={[marker.position[0], marker.position[1]]}
            >
              <Popup>
                <div style={{ color: '#000', padding: '0.5rem', minWidth: '150px' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{marker.title}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    {new Date(marker.timestamp).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          markers.map((marker) => (
            <CircleMarker 
              key={marker.id} 
              center={[marker.position[0], marker.position[1]]}
              radius={25}
              fillColor="#ef4444"
              color="transparent"
              fillOpacity={0.4}
            >
              <Popup>
                <div style={{ color: '#000' }}>{marker.title} (Heat Point)</div>
              </Popup>
            </CircleMarker>
          ))
        )}
      </MapContainer>
    </div>
  );
}
