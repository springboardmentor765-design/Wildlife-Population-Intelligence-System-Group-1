import { useEffect, useState } from "react";
import api from "../api/client";

export default function Health() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/health-score").then((r) => setData(r.data));
  }, []);
  if (!data) return null;

  const sources = data.sources || {};
  const empty = data.status === "no-field-data";
  const rings = [
    {
      label: "Overall",
      value: data.overall,
      hint: empty ? "Waiting on field data" : "Mean of the three scores",
    },
    {
      label: "Biodiversity",
      value: data.biodiversity,
      hint: sources.species_detected
        ? `${sources.species_detected} species from image/audio IDs`
        : "Analyze images or audio to score this",
    },
    {
      label: "Habitat",
      value: data.habitat,
      hint: sources.surveys
        ? `${sources.surveyed_landscapes} surveyed landscapes`
        : "Add a field survey to score this",
    },
    {
      label: "Population stability",
      value: data.population_stability,
      hint: sources.animal_counts
        ? `${sources.animal_counts} animals over ${sources.observation_days} day${sources.observation_days === 1 ? "" : "s"}`
        : "No live counts yet",
    },
  ];

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Monitoring</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Wildlife health scoring</h1>
        <p className="text-sm capitalize text-zinc-400">
          System status: {data.status.replaceAll("-", " ")} · updated {data.updated}
        </p>
        <p className="text-sm text-zinc-500">
          Built from camera-trap/audio detections and surveys you enter — not the seeded species catalog.
        </p>
      </div>
      {empty && (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
          Scores stay at 0 until someone adds a field survey or records a camera-trap / audio count.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rings.map((r) => (
          <div key={r.label} className="glass-card rounded-2xl p-5 text-center">
            <div className="text-4xl font-semibold text-forest-400">{r.value}</div>
            <div className="mt-1 text-sm text-zinc-300">{r.label}</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-forest-500" style={{ width: `${r.value}%` }} />
            </div>
            <div className="mt-3 text-xs text-zinc-500">{r.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
