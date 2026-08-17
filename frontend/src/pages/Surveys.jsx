import { useEffect, useState } from "react";
import api from "../api/client";

const EMPTY = {
  title: "",
  location: "",
  latitude: "",
  longitude: "",
  survey_date: new Date().toISOString().slice(0, 10),
  status: "Pending",
  notes: "",
  species_count: 0,
};

export default function Surveys() {
  const [surveys, setSurveys] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);

  const load = () => api.get("/surveys").then((r) => setSurveys(r.data));
  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/surveys", {
      ...form,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      species_count: Number(form.species_count) || 0,
    });
    setForm(EMPTY);
    setOpen(false);
    load();
  };

  return (
    <div className="page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Field operations</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Surveys</h1>
          <p className="text-sm text-zinc-400">
            Counts you enter here score habitats. Camera-trap and audio IDs feed population charts.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="w-full rounded-full bg-forest-500 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-400 sm:w-auto">
          New survey
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Survey</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Species</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((s) => (
              <tr key={s.survey_id} className="border-t border-white/5 text-zinc-200">
                <td className="px-4 py-3">{s.title}</td>
                <td className="px-4 py-3 text-zinc-400">{s.location}</td>
                <td className="px-4 py-3 text-zinc-400">{s.survey_date}</td>
                <td className="px-4 py-3">{s.species_count}</td>
                <td className="px-4 py-3">{s.status}</td>
              </tr>
            ))}
            {surveys.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No field surveys yet. Create one to score a landscape.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={submit} className="glass-card w-full max-w-lg space-y-3 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Create survey</h2>
            {["title", "location", "latitude", "longitude"].map((key) => (
              <div key={key}>
                <input
                  required={key === "title" || key === "location"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={key}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm capitalize outline-none"
                />
                {key === "location" && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Use a park name such as Sundarbans, Gir, or Kaziranga so Habitat can match this site.
                  </p>
                )}
              </div>
            ))}
            <input
              type="date"
              value={form.survey_date}
              onChange={(e) => setForm({ ...form, survey_date: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            />
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Species recorded</label>
              <input
                type="number"
                min="0"
                value={form.species_count}
                onChange={(e) => setForm({ ...form, species_count: e.target.value })}
                placeholder="How many species did you count?"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Total species observed on this visit. Used for habitat and health scores — leave 0 if not counted yet.
              </p>
            </div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            >
              {["Pending", "In Progress", "Completed"].map((s) => (
                <option key={s} className="bg-[#101a14]">{s}</option>
              ))}
            </select>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-sm text-zinc-300">Cancel</button>
              <button className="rounded-full bg-forest-500 px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
