import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api/client";

export default function MapViewer() {
  const [data, setData] = useState({ parks: [], surveys: [] });
  useEffect(() => {
    api.get("/gis/sites").then((r) => setData(r.data));
  }, []);

  return (
    <div className="page space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">GIS</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Map viewer</h1>
      </div>
      <div className="h-[min(70vh,560px)] overflow-hidden rounded-2xl border border-white/10">
        <MapContainer center={[22.5, 79]} zoom={5} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.parks.map((p) => (
            <CircleMarker key={p.name} center={[p.lat, p.lng]} radius={10} pathOptions={{ color: "#22c55e", fillOpacity: 0.7 }}>
              <Popup>
                <strong>{p.name}</strong>
                <br />
                {p.habitat}
                <br />
                {p.survey_count ? `Suitability ${Math.round(p.score * 100)} · ${p.survey_count} surveys` : "No field surveys yet"}
              </Popup>
            </CircleMarker>
          ))}
          {data.surveys.map((s) => (
            <CircleMarker key={s.survey_id} center={[s.lat, s.lng]} radius={7} pathOptions={{ color: "#38bdf8" }}>
              <Popup>
                {s.title}
                <br />
                {s.status}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
