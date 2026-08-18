import { useEffect, useState } from "react";
import api from "../api/client";

const PRIORITY = {
  critical: "bg-red-500/15 text-red-300",
  high: "bg-orange-500/15 text-orange-300",
  medium: "bg-amber-500/15 text-amber-300",
  low: "bg-forest-500/15 text-forest-300",
};

export default function Conservation() {
  const [actions, setActions] = useState([]);
  useEffect(() => {
    api.get("/conservation").then((r) => setActions(r.data));
  }, []);

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Decision support</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Conservation recommendations</h1>
      </div>
      <div className="space-y-3">
        {actions.map((a) => (
          <div key={`${a.species}-${a.iucn_status}`} className="glass-card rounded-2xl p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${PRIORITY[a.priority]}`}>{a.priority}</span>
              <span className="text-xs text-zinc-500">IUCN {a.iucn_status}</span>
            </div>
            <div className="text-lg font-semibold text-white">{a.species}</div>
            <div className="text-sm italic text-zinc-400">{a.scientific_name}</div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{a.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
