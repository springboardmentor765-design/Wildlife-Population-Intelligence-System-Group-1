import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/client";

export default function Biodiversity() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/biodiversity").then((r) => setData(r.data));
  }, []);
  if (!data) return null;
  const groups = Object.entries(data.groups).map(([name, value]) => ({ name, value }));

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Intelligence</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Biodiversity intelligence</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Species richness" value={data.species_richness} />
        <Metric label="Shannon index" value={data.shannon_index} />
        <Metric label="Threatened taxa" value={data.threatened_count} />
      </div>
      <div className="glass-card rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Community composition</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groups}>
              <XAxis dataKey="name" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip contentStyle={{ background: "#0f1a14", border: "1px solid #1f2a22" }} />
              <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="text-sm text-zinc-400">{label}</div>
    </div>
  );
}
