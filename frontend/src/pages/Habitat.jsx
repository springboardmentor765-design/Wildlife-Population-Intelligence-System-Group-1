import { useEffect, useState } from "react";
import api from "../api/client";

export default function Habitat() {
  const [sites, setSites] = useState([]);
  useEffect(() => {
    api.get("/habitat").then((r) => setSites(r.data));
  }, []);

  const monitored = sites.filter((s) => s.survey_count);

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Geospatial</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Habitat intelligence</h1>
        <p className="text-sm text-zinc-400">
          Scores come from your field surveys (species counts, status, and how recent the last visit was). Unsurveyed parks stay at 0.
        </p>
      </div>
      {monitored.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
          No field surveys yet. Add a survey with a park name such as Sundarbans or Gir to score that landscape.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {sites.map((s) => (
          <div key={s.name} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{s.name}</div>
                <div className="text-sm text-zinc-400">{s.habitat}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-forest-400">{Math.round(s.score * 100)}</div>
                <div className="text-xs text-zinc-500">{s.status === "unsurveyed" ? "no field data" : "suitability"}</div>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-forest-500" style={{ width: `${s.score * 100}%` }} />
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              {s.survey_count
                ? `${s.survey_count} surveys · ${s.species_records} species records${s.last_survey ? ` · last ${s.last_survey}` : ""}`
                : "Add a survey at this location to compute a score"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
