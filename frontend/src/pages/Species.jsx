import { useEffect, useState } from "react";
import api from "../api/client";

const IUCN = {
  LC: "Least Concern",
  NT: "Near Threatened",
  VU: "Vulnerable",
  EN: "Endangered",
  CR: "Critically Endangered",
};

export default function Species() {
  const [species, setSpecies] = useState([]);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    const params = {};
    if (q) params.q = q;
    if (group) params.group = group;
    api.get("/species", { params }).then((r) => setSpecies(r.data));
  }, [q, group]);

  return (
    <div className="page">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Taxonomy</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Species catalog</h1>
      </div>
      <div className="flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search common or scientific name"
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
        >
          <option value="" className="bg-[#101a14]">All groups</option>
          {["Mammal", "Bird", "Reptile"].map((g) => (
            <option key={g} value={g} className="bg-[#101a14]">{g}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {species.map((s) => (
          <div key={s.species_id} className="glass-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wide text-zinc-500">{s.species_group}</div>
            <div className="mt-1 text-lg font-semibold text-white">{s.common_name}</div>
            <div className="text-sm italic text-zinc-400">{s.scientific_name}</div>
            <div className="mt-3 text-xs text-forest-400">
              IUCN {s.iucn_status} · {IUCN[s.iucn_status] || "Not evaluated"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
